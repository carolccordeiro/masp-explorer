import type { Artwork, Museum, MuseumId, MuseumMeta } from "./types";

/** Metadados leves dos museus da rede (a tela inicial não precisa baixar os acervos). */
export const MUSEUMS: MuseumMeta[] = [
  {
    id: "masp",
    name: "Museu de Arte de São Paulo Assis Chateaubriand",
    short: "MASP",
    city: "Av. Paulista, 1578",
    tagline: {
      pt: "Arte de todos os tempos, suspensa sobre a Paulista",
      en: "Art from every era, suspended over Paulista Avenue",
      es: "Arte de todos los tiempos, suspendido sobre la Paulista",
    },
    accent: "#E30613",
    accentInk: "#FFFFFF",
    cover: "/museums/masp/cover.webp",
    address: "Avenida Paulista, 1578, Bela Vista, São Paulo, SP",
    coords: [-23.5614, -46.6559],
    week: [["10:00", "18:00"], null, ["10:00", "20:00"], ["10:00", "18:00"], ["10:00", "18:00"], ["10:00", "21:00"], ["10:00", "18:00"]],
    freeDays: [{ day: 2 }, { day: 5, from: "18:00" }],
  },
  {
    id: "ims",
    name: "Instituto Moreira Salles · IMS Paulista",
    short: "IMS",
    city: "Av. Paulista, 2424",
    tagline: {
      pt: "O Brasil em fotografias, do século XIX ao agora",
      en: "Brazil in photographs, from the 19th century to now",
      es: "Brasil en fotografías, del siglo XIX al presente",
    },
    // identidade do IMS: preto e branco
    accent: "#111111",
    accentInk: "#FFFFFF",
    accentDark: "#F2F2F2",
    accentDarkInk: "#000000",
    cover: "/museums/ims/cover.webp",
    address: "Avenida Paulista, 2424, Consolação, São Paulo, SP",
    coords: [-23.5557, -46.6622],
    week: [["10:00", "20:00"], null, ["10:00", "20:00"], ["10:00", "20:00"], ["10:00", "20:00"], ["10:00", "20:00"], ["10:00", "20:00"]],
    freeDays: [0, 2, 3, 4, 5, 6].map((day) => ({ day })),
  },
  {
    id: "mam",
    name: "Museu de Arte Moderna de São Paulo",
    short: "MAM",
    city: "Parque Ibirapuera",
    tagline: {
      pt: "Arte moderna e contemporânea brasileira sob a marquise",
      en: "Brazilian modern and contemporary art under the marquee",
      es: "Arte moderno y contemporáneo brasileño bajo la marquesina",
    },
    accent: "#E0251B",
    accentInk: "#FFFFFF",
    cover: "/museums/mam/cover.webp",
    address: "Av. Pedro Álvares Cabral, s/nº, Parque Ibirapuera, Portão 3, São Paulo, SP",
    coords: [-23.5874, -46.6556],
    week: [["10:00", "18:00"], null, ["10:00", "18:00"], ["10:00", "18:00"], ["10:00", "18:00"], ["10:00", "18:00"], ["10:00", "18:00"]],
    freeDays: [{ day: 0 }],
  },
];

export const museumMeta = (id: string) => MUSEUMS.find((m) => m.id === id);

/** Cor do museu que aparece bem no fundo atual (claro ou escuro). */
export const accentOn = (m: Pick<MuseumMeta, "accent" | "accentDark"> | undefined, dark: boolean) => (m ? (dark && m.accentDark ? m.accentDark : m.accent) : undefined);
export const inkOn = (m: Pick<MuseumMeta, "accentInk" | "accentDarkInk" | "accentDark"> | undefined, dark: boolean) => (m ? (dark && m.accentDark ? (m.accentDarkInk ?? "#000") : m.accentInk) : "#fff");
export const isMuseumId = (id: string | undefined): id is MuseumId => !!id && MUSEUMS.some((m) => m.id === id);

const loaders: Record<MuseumId, () => Promise<{ default: unknown }>> = {
  masp: () => import("./generated/masp.json"),
  ims: () => import("./generated/ims.json"),
  mam: () => import("./generated/mam.json"),
};

const cache = new Map<MuseumId, Promise<Museum>>();
export function loadMuseum(id: MuseumId): Promise<Museum> {
  if (!cache.has(id)) cache.set(id, loaders[id]().then((m) => ({ ...museumMeta(id)!, ...(m.default as object) }) as Museum));
  return cache.get(id)!;
}

/** Índice leve de todas as obras da rede (scanner e "obras parecidas"). */
export type ArtIndexItem = Pick<Artwork, "id" | "museum" | "artist" | "year" | "thumb" | "color" | "theme"> & { title: string };
let indexPromise: Promise<ArtIndexItem[]> | null = null;
export function loadArtIndex(): Promise<ArtIndexItem[]> {
  if (!indexPromise) indexPromise = import("./generated/index.json").then((m) => m.default as ArtIndexItem[]);
  return indexPromise;
}
