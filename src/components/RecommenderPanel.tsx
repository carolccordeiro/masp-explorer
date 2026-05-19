import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { Sparkles, Info, X } from 'lucide-react';
import { Recommendation, featureLabel } from '@/lib/recommender';

/**
 * Painel "MATCH IA" que exibe o ranking do recomendador (cosine similarity)
 * e uma projecao 2D das exposicoes no plano historico-contemporaneo vs
 * latam-internacional. Justifica a Sprint Review da disciplina AI Challenges
 * por mostrar pipeline real: extracao de features, embedding manual,
 * similaridade vetorial, ranking e visualizacao de cluster.
 */

interface Props {
  recommendations: Recommendation[];
  topK?: number;
  lang?: 'pt' | 'en';
}

const DOT_COLOR_TOP = 'hsl(var(--primary))';
const DOT_COLOR_REST = 'hsl(var(--foreground))';
const DOT_COLOR_UPCOMING = 'hsl(var(--muted-foreground))';

export function RecommenderPanel({ recommendations, topK = 4, lang = 'pt' }: Props) {
  const [showHow, setShowHow] = useState(false);

  if (recommendations.length === 0) return null;

  const topIds = new Set(recommendations.slice(0, topK).map((r) => r.exhibition.id));

  // Dados para o ScatterChart, separados em tres series pra colorir
  const top = recommendations
    .filter((r) => topIds.has(r.exhibition.id))
    .map((r) => ({
      x: r.projectedX,
      y: r.projectedY,
      z: r.scorePct,
      name: r.exhibition.title,
      artist: r.exhibition.artist,
      score: r.scorePct,
    }));
  const upcoming = recommendations
    .filter((r) => !topIds.has(r.exhibition.id) && r.exhibition.upcoming)
    .map((r) => ({
      x: r.projectedX,
      y: r.projectedY,
      z: 60,
      name: r.exhibition.title,
      artist: r.exhibition.artist,
      score: r.scorePct,
    }));
  const rest = recommendations
    .filter((r) => !topIds.has(r.exhibition.id) && !r.exhibition.upcoming)
    .map((r) => ({
      x: r.projectedX,
      y: r.projectedY,
      z: 60,
      name: r.exhibition.title,
      artist: r.exhibition.artist,
      score: r.scorePct,
    }));

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="border-2 border-foreground mb-8 bg-background"
    >
      <header className="flex items-center justify-between border-b-2 border-foreground p-5 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-foreground text-background flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
              Recomendações para você
            </span>
            <p className="font-display text-xl md:text-2xl uppercase text-foreground leading-tight mt-0.5">
              Combina com você
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowHow(true)}
          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground hover:text-primary transition-colors"
        >
          <Info className="w-3 h-3" />
          Como recomendamos
        </button>
      </header>

      {/* Modal "Como recomendamos" mostra o que tem por baixo do pano sem
          assustar o visitante leigo. Visivel sob demanda. */}
      <AnimatePresence>
        {showHow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowHow(false)}
            className="fixed inset-0 z-50 bg-foreground/70 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background border-2 border-foreground max-w-lg w-full"
            >
              <div className="flex items-center justify-between border-b-2 border-foreground p-5">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                  Como recomendamos
                </span>
                <button
                  onClick={() => setShowHow(false)}
                  className="w-8 h-8 border-2 border-foreground flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
                  aria-label="Fechar"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <div className="p-6 space-y-4 text-sm text-foreground leading-relaxed">
                <p>
                  Cada exposição tem um <span className="font-bold">perfil curatorial</span>:
                  qual ciclo do MASP, quanto tempo dura, em qual andar fica e se é destaque.
                </p>
                <p>
                  Pegamos suas escolhas (tempo + temas) e comparamos com cada exposição usando{' '}
                  <span className="font-bold">similaridade de cosseno</span>, uma fórmula matemática
                  que mede o quanto dois conjuntos de características são parecidos.
                </p>
                <p>
                  Quanto mais perto de <span className="tnum font-bold">100%</span>, mais a exposição
                  combina com o que você pediu. O mapa 2D mostra todas as exposições nos eixos
                  histórico/contemporâneo e latino-americana/internacional.
                </p>
                <p className="text-xs text-muted-foreground border-t border-border pt-4">
                  Nenhum dado pessoal é usado. O cálculo roda no próprio totem, sua sessão
                  termina e os dados somem em 90 segundos.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr]">
        {/* Ranking textual */}
        <ol className="border-b-2 lg:border-b-0 lg:border-r-2 border-foreground">
          {recommendations.slice(0, 6).map((r, i) => {
            const isTop = i < topK;
            return (
              <li
                key={r.exhibition.id}
                className={`flex items-stretch gap-4 ${i < 5 ? 'border-b border-foreground/30' : ''}`}
              >
                <div className={`w-14 shrink-0 flex flex-col items-center justify-center text-center ${
                  isTop ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground border-r border-foreground/30'
                }`}>
                  <span className="font-display text-xl tnum">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className="flex-1 min-w-0 py-3 pr-3">
                  <div className="flex items-baseline justify-between gap-2 flex-wrap">
                    <p className="font-bold text-foreground truncate text-sm">{r.exhibition.title}</p>
                    <span className="font-display text-lg text-primary tnum shrink-0">{r.scorePct}%</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate">{r.exhibition.artist}</p>
                  {r.reasonTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {r.reasonTags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] font-bold uppercase tracking-[0.14em] text-foreground bg-muted px-1.5 py-0.5"
                        >
                          {featureLabel(tag, lang)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        {/* Scatter plot 2D */}
        <div className="p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground mb-2">
            Mapa do acervo, eixos curatoriais
          </p>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 8, right: 12, bottom: 24, left: 12 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="hsl(var(--border))" />
                <XAxis
                  type="number"
                  dataKey="x"
                  domain={[-1, 1]}
                  tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                  ticks={[-0.8, 0, 0.8]}
                  tickFormatter={(v) => (v < 0 ? 'clássico' : v > 0 ? 'contemp.' : '')}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  domain={[-1, 1]}
                  tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                  ticks={[-0.8, 0, 0.8]}
                  tickFormatter={(v) => (v < 0 ? 'internac.' : v > 0 ? 'latam' : '')}
                />
                <ZAxis type="number" dataKey="z" range={[80, 360]} />
                <ReferenceLine x={0} stroke="hsl(var(--foreground))" strokeWidth={1} />
                <ReferenceLine y={0} stroke="hsl(var(--foreground))" strokeWidth={1} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{
                    background: 'hsl(var(--foreground))',
                    color: 'hsl(var(--background))',
                    border: 0,
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                  formatter={(_value, _name, props: any) => [
                    `${props.payload.score}% match`,
                    props.payload.name,
                  ]}
                  labelFormatter={() => ''}
                />
                <Scatter name="Top match" data={top} fill={DOT_COLOR_TOP} />
                <Scatter name="Próximas" data={upcoming} fill={DOT_COLOR_UPCOMING} />
                <Scatter name="Demais" data={rest} fill={DOT_COLOR_REST} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-primary inline-block" />
              top {topK} match
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-foreground inline-block" />
              acervo geral
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-muted-foreground inline-block" />
              próximas exposições
            </span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
