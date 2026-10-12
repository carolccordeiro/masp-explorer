// Teste de precisão do scanner: simula fotos de celular (recorte, rotação, luz, parede ao redor, desfoque)
import index from "../src/data/generated/index.json";
import { loadEmbeddings, loadModel, nearest } from "../src/lib/clip";
const s = document.getElementById("s")!;
const load = (src: string) => new Promise<HTMLImageElement>((r, j) => { const i = new Image(); i.onload = () => r(i); i.onerror = j; i.src = src; });
function rnd(a: number, b: number) { return a + Math.random() * (b - a); }
function photo(img: HTMLImageElement) {
  // "parede" + obra ocupando 60-90% do quadro, com rotação e iluminação diferentes, recorte quadrado central (igual ao scanner)
  const c = document.createElement("canvas"); c.width = c.height = 448; const x = c.getContext("2d")!;
  x.fillStyle = `hsl(${rnd(20, 50)},${rnd(5, 20)}%,${rnd(70, 92)}%)`; x.fillRect(0, 0, 448, 448);
  const fill = rnd(0.7, 1.15); const sc = (448 * fill) / Math.max(img.width, img.height);
  x.save(); x.translate(224 + rnd(-25, 25), 224 + rnd(-25, 25)); x.rotate(rnd(-0.1, 0.1));
  x.filter = `brightness(${rnd(0.75, 1.2)}) contrast(${rnd(0.85, 1.15)}) saturate(${rnd(0.8, 1.2)}) blur(${rnd(0, 1.2)}px)`;
  x.drawImage(img, (-img.width * sc) / 2, (-img.height * sc) / 2, img.width * sc, img.height * sc); x.restore();
  // reflexo
  const g = x.createLinearGradient(0, 0, 448, 448); g.addColorStop(0, "rgba(255,255,255,0)"); g.addColorStop(rnd(0.3, 0.7), `rgba(255,255,255,${rnd(0, 0.25)})`); g.addColorStop(1, "rgba(255,255,255,0)");
  x.fillStyle = g; x.fillRect(0, 0, 448, 448);
  return c;
}
(async () => {
  const { embed } = await loadModel(); const E = await loadEmbeddings();
  const res: { id: string; ok: boolean; top: number; second: number; best: string }[] = [];
  const all = index as { id: string; thumb: string }[];
  for (let k = 0; k < all.length; k++) {
    const it = all[k];
    const img = await load(it.thumb.replace("/thumb/", "/art/"));
    const q = await embed(photo(img));
    const nn = nearest(q, E, 2);
    res.push({ id: it.id, ok: nn[0].id === it.id, top: nn[0].score, second: nn[1].score, best: nn[0].id });
    s.textContent = `${k + 1}/${all.length}`;
  }
  // "Negativos": imagens que não são obras (ruído, cena qualquer)
  const neg: number[] = [];
  for (let k = 0; k < 20; k++) {
    const c = document.createElement("canvas"); c.width = c.height = 448; const x = c.getContext("2d")!;
    x.fillStyle = `hsl(${rnd(0, 360)},20%,${rnd(30, 80)}%)`; x.fillRect(0, 0, 448, 448);
    for (let i = 0; i < 8; i++) { x.fillStyle = `hsl(${rnd(0, 360)},${rnd(0, 40)}%,${rnd(20, 90)}%)`; x.fillRect(rnd(0, 400), rnd(0, 400), rnd(20, 200), rnd(20, 200)); }
    neg.push(nearest(await embed(c), E, 1)[0].score);
  }
  (window as any).__R__ = { res, neg }; s.textContent = "pronto";
})().catch((e) => { s.textContent = "erro " + e; });
