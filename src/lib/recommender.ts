import { Exhibition, FEATURE_DIMENSIONS } from '@/data/exhibitions';

/**
 * Sistema de recomendacao de exposicoes baseado em similaridade de cosseno
 * entre o vetor de preferencia do visitante e o vetor de features de cada
 * exposicao.
 *
 * Cada exposicao tem um vetor `features` com 13 dimensoes mapeadas em
 * FEATURE_DIMENSIONS (categoria curatorial, duracao discretizada, andar,
 * principal). O input do visitante eh tempo + temas selecionados, que
 * convertemos no mesmo espaco vetorial e calculamos similaridade.
 *
 * Output: lista ordenada de exposicoes com um score normalizado (0 a 1) e
 * coordenadas 2D projetadas via PCA simples (dois eixos pre-definidos) pra
 * permitir visualizacao tipo scatter no UI.
 */

export interface RecommendInput {
  // Mapeamento dos themeIds do PlanejarVisita pras dimensoes curatoriais.
  // Ex: ['arte-contemporanea', 'historias-latam']
  selectedThemes: string[];
  // Minutos disponiveis para a visita.
  minutes: number;
}

export interface Recommendation {
  exhibition: Exhibition;
  score: number;        // 0 a 1, similaridade de cosseno com a preferencia
  scorePct: number;     // score arredondado pra %
  reasonTags: string[]; // top features que casaram entre exposicao e preferencia
  projectedX: number;   // coordenada X no scatter 2D
  projectedY: number;   // coordenada Y no scatter 2D
}

// Mapa de tema do UI pro indice no FEATURE_DIMENSIONS
const THEME_TO_FEATURE: Record<string, number> = {
  'arte-classica': 0,
  'arte-moderna': 1,
  'arte-contemporanea': 2,
  'historia-brasil': 3,
  'historia-geral': 4,
  'historias-latam': 5,
};

// Indices das dimensoes de duracao no vetor
const DURATION_INDEX = {
  short: 6,
  medium: 7,
  long: 8,
};

function buildPreferenceVector(input: RecommendInput): number[] {
  const v = new Array(FEATURE_DIMENSIONS.length).fill(0);

  // Ativa cada tema escolhido com peso 1.0
  for (const t of input.selectedThemes) {
    const idx = THEME_TO_FEATURE[t];
    if (idx !== undefined) v[idx] = 1;
  }

  // Ativa o slot de duracao adequado, com transbordo suave nos slots vizinhos
  if (input.minutes <= 30) {
    v[DURATION_INDEX.short] = 1;
    v[DURATION_INDEX.medium] = 0.3;
  } else if (input.minutes <= 90) {
    v[DURATION_INDEX.short] = 0.3;
    v[DURATION_INDEX.medium] = 1;
    v[DURATION_INDEX.long] = 0.3;
  } else {
    v[DURATION_INDEX.medium] = 0.3;
    v[DURATION_INDEX.long] = 1;
  }

  return v;
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  return denom === 0 ? 0 : dot / denom;
}

function topMatchingFeatures(prefV: number[], expoV: number[], k = 3): string[] {
  const contributions = prefV.map((p, i) => ({
    name: FEATURE_DIMENSIONS[i],
    contrib: p * expoV[i],
  }));
  return contributions
    .filter((c) => c.contrib > 0.15)
    .sort((a, b) => b.contrib - a.contrib)
    .slice(0, k)
    .map((c) => c.name);
}

/**
 * Projeta o vetor de 13 dimensoes em 2D via dois eixos pre-definidos:
 *  X = historico vs contemporaneo (classica + moderna + historia_geral menos
 *      contemporanea + historia_brasil)
 *  Y = latam vs internacional (historias_latam + historia_brasil menos
 *      historia_geral + classica)
 *
 * E uma reducao linear (LDA-like) que escolhi pra dar interpretabilidade,
 * em vez de PCA estatistica. O resultado fica entre -1 e 1 em cada eixo.
 */
function project2D(v: number[]): { x: number; y: number } {
  const historico = (v[0] + v[1] + v[4]) / 3;
  const contemporaneo = (v[2] + v[3]) / 2;
  const latam = (v[5] + v[3]) / 2;
  const internacional = (v[4] + v[0]) / 2;

  return {
    x: contemporaneo - historico, // contemporaneo positivo, classico negativo
    y: latam - internacional,     // latam positivo, internacional negativo
  };
}

export function recommend(
  exhibitions: Exhibition[],
  input: RecommendInput,
): Recommendation[] {
  const prefV = buildPreferenceVector(input);

  return exhibitions
    .filter((e) => Array.isArray(e.features) && e.features.length === FEATURE_DIMENSIONS.length)
    .map((exhibition) => {
      const expoV = exhibition.features!;
      const score = cosineSimilarity(prefV, expoV);
      const { x, y } = project2D(expoV);
      return {
        exhibition,
        score,
        scorePct: Math.round(Math.max(0, Math.min(1, score)) * 100),
        reasonTags: topMatchingFeatures(prefV, expoV),
        projectedX: x,
        projectedY: y,
      };
    })
    .sort((a, b) => b.score - a.score);
}

// Helpers de UI
export function featureLabel(featureId: string, lang: 'pt' | 'en' = 'pt'): string {
  const pt: Record<string, string> = {
    arte_classica: 'Arte Clássica',
    arte_moderna: 'Arte Moderna',
    arte_contemporanea: 'Arte Contemporânea',
    historia_brasil: 'História do Brasil',
    historia_geral: 'História Geral',
    historias_latam: 'Histórias Latino-Americanas',
    duracao_curta: 'Visita curta',
    duracao_media: 'Visita média',
    duracao_longa: 'Visita longa',
    andar_subsolo: 'Subsolo',
    andar_terreo: 'Térreo',
    andar_andar: 'Andar superior',
    principal: 'Exposição principal',
  };
  const en: Record<string, string> = {
    arte_classica: 'Classical Art',
    arte_moderna: 'Modern Art',
    arte_contemporanea: 'Contemporary Art',
    historia_brasil: 'Brazilian History',
    historia_geral: 'General History',
    historias_latam: 'Latin American Stories',
    duracao_curta: 'Short visit',
    duracao_media: 'Medium visit',
    duracao_longa: 'Long visit',
    andar_subsolo: 'Lower floor',
    andar_terreo: 'Ground floor',
    andar_andar: 'Upper floor',
    principal: 'Featured',
  };
  return (lang === 'en' ? en : pt)[featureId] ?? featureId;
}
