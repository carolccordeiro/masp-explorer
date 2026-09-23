// Ferramenta de build: calcula os vetores de imagem de todas as obras com o MESMO modelo e o MESMO
// código que o scanner usa no navegador. Rodada pelo script scripts/build-embeddings.mjs.
import index from "../src/data/generated/index.json";
import { loadModel } from "../src/lib/clip";

const status = document.getElementById("s")!;

function loadImg(src: string) {
  return new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = src;
  });
}

function canvasOf(img: HTMLImageElement, mode: "pad" | "crop" | "zoom") {
  const c = document.createElement("canvas");
  c.width = c.height = 448;
  const ctx = c.getContext("2d")!;
  if (mode === "pad") {
    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, 448, 448);
    const s = 448 / Math.max(img.width, img.height);
    ctx.drawImage(img, (448 - img.width * s) / 2, (448 - img.height * s) / 2, img.width * s, img.height * s);
  } else {
    const f = mode === "zoom" ? 0.75 : 1;
    const side = Math.min(img.width, img.height) * f;
    ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, 448, 448);
  }
  return c;
}

(async () => {
  const { embed } = await loadModel();
  const items: { id: string; museum: string; v: number[][] }[] = [];
  let n = 0;
  for (const it of index as { id: string; museum: string; thumb: string }[]) {
    const img = await loadImg(it.thumb.replace("/thumb/", "/art/"));
    const vs: number[][] = [];
    for (const mode of ["pad", "crop", "zoom"] as const) {
      const v = await embed(canvasOf(img, mode));
      vs.push(Array.from(v, (x) => Math.round(x * 10000) / 10000));
    }
    items.push({ id: it.id, museum: it.museum, v: vs });
    status.textContent = `${++n}/${index.length}`;
  }
  (window as unknown as { __EMBEDS__: unknown }).__EMBEDS__ = { dim: items[0].v[0].length, items };
  status.textContent = "pronto";
})().catch((e) => {
  status.textContent = "erro: " + e;
  (window as unknown as { __EMBEDS_ERR__: string }).__EMBEDS_ERR__ = String(e);
});
