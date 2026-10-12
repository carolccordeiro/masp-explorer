// Reconhecimento de obras 100% no navegador.
// Modelo: MobileCLIP S0 (Apple) em fp16 (23 MB), servido pelo próprio app. (A versão int8 perde a precisão.)
// As obras da rede já têm seus "vetores de imagem" pré-calculados (embeddings.json).
// No scanner, calculamos o vetor da foto e buscamos o mais parecido (similaridade de cosseno).

type Embeds = { dim: number; items: { id: string; museum: string; v: number[][] }[] };

let modelPromise: Promise<{ embed: (img: HTMLCanvasElement | string) => Promise<Float32Array> }> | null = null;
let embedsPromise: Promise<Embeds> | null = null;

type Packed = { dim: number; n: number; items: { id: string; museum: string; q: string }[] };

/** Vetores pré-calculados das obras (int8 em base64, 3 recortes por obra). */
export function loadEmbeddings(): Promise<Embeds> {
  if (!embedsPromise) {
    embedsPromise = fetch("/museums/embeddings.json")
      .then((r) => {
        if (!r.ok) throw new Error("embeddings");
        return r.json() as Promise<Packed>;
      })
      .then((p) => ({
        dim: p.dim,
        items: p.items.map((it) => {
          const bin = atob(it.q);
          const all = new Float32Array(bin.length);
          for (let i = 0; i < bin.length; i++) {
            const b = bin.charCodeAt(i);
            all[i] = (b > 127 ? b - 256 : b) / 127;
          }
          const v: number[][] = [];
          for (let k = 0; k < p.n; k++) v.push(Array.from(normalizeVec(all.subarray(k * p.dim, (k + 1) * p.dim))));
          return { id: it.id, museum: it.museum, v };
        }),
      }));
    embedsPromise.catch(() => {
      embedsPromise = null;
    });
  }
  return embedsPromise;
}

export function loadModel(onProgress?: (pct: number) => void) {
  if (!modelPromise) {
    modelPromise = (async () => {
      const tf = await import("@huggingface/transformers");
      tf.env.allowRemoteModels = false;
      tf.env.allowLocalModels = true;
      tf.env.localModelPath = "/models/";
      // O service worker do app já guarda o modelo offline; evita gravar 2 cópias no cache do navegador.
      tf.env.useBrowserCache = false;
      const progress = (p: { status: string; progress?: number }) => {
        if (p.status === "progress" && typeof p.progress === "number") onProgress?.(Math.round(p.progress));
      };
      const processor = await tf.AutoProcessor.from_pretrained("Xenova/mobileclip_s0", {});
      const model = await tf.CLIPVisionModelWithProjection.from_pretrained("Xenova/mobileclip_s0", {
        dtype: ((globalThis as { __KORA_DTYPE__?: string }).__KORA_DTYPE__ ?? "fp16") as never,
        device: "wasm",
        progress_callback: progress,
      } as never);
      const embed = async (img: HTMLCanvasElement | string) => {
        const raw = typeof img === "string" ? await tf.RawImage.read(img) : tf.RawImage.fromCanvas(img);
        const inputs = await processor(raw);
        const { image_embeds } = await model(inputs);
        const v = image_embeds.data as Float32Array;
        return normalizeVec(v);
      };
      return { embed };
    })();
    modelPromise.catch(() => {
      modelPromise = null;
    });
  }
  return modelPromise;
}

export function normalizeVec(v: ArrayLike<number>): Float32Array {
  let n = 0;
  for (let i = 0; i < v.length; i++) n += v[i] * v[i];
  n = Math.sqrt(n) || 1;
  const out = new Float32Array(v.length);
  for (let i = 0; i < v.length; i++) out[i] = v[i] / n;
  return out;
}

export function dot(a: ArrayLike<number>, b: ArrayLike<number>) {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

export interface Match {
  id: string;
  museum: string;
  score: number;
}

/** Busca as obras mais parecidas com um vetor. */
export function nearest(q: Float32Array, embeds: Embeds, k = 5, museum?: string): Match[] {
  const out: Match[] = [];
  for (const it of embeds.items) {
    if (museum && it.museum !== museum) continue;
    let best = -1;
    for (const v of it.v) best = Math.max(best, dot(q, v));
    out.push({ id: it.id, museum: it.museum, score: best });
  }
  return out.sort((a, b) => b.score - a.score).slice(0, k);
}

/** Obras parecidas (a partir do vetor de outra obra). */
export async function similarTo(id: string, k = 6): Promise<Match[]> {
  const e = await loadEmbeddings();
  const src = e.items.find((i) => i.id === id);
  if (!src) return [];
  const q = Float32Array.from(src.v[0]);
  return nearest(q, e, k + 1).filter((m) => m.id !== id).slice(0, k);
}

/**
 * Converte a similaridade bruta em uma confiança legível.
 * Calibrado com 136 fotos simuladas de celular (100% de acerto no top 1):
 * obras corretas ficam entre 0,87 e 0,97; imagens que não são obras ficam abaixo de 0,71.
 */
export function confidence(score: number) {
  return Math.max(0, Math.min(1, (score - 0.7) / 0.2));
}
