export type Lang = "pt" | "en" | "es";
export type MuseumId = "masp" | "ims" | "mam";
export type Theme = "classica" | "moderna" | "contemporanea" | "brasil" | "fotografia" | "mundo";

/** Texto em três idiomas. PT é sempre obrigatório. */
export type I18n = { pt: string; en?: string; es?: string };

export interface Artwork {
  id: string;
  museum: MuseumId;
  title: I18n;
  artist: string;
  artistLife?: string;
  year?: string;
  medium?: I18n;
  dimensions?: string;
  movement?: I18n;
  tags: string[];
  theme: Theme;
  description: I18n;
  history: I18n;
  kids: I18n;
  image: string; // caminho em /museums/<id>/art/<id>.webp
  thumb: string; // versão pequena
  ratio: number; // largura / altura
  color: string; // cor média, para placeholder
  credit: string;
  source?: string;
  space?: string; // id do espaço no mapa
}

export interface Exhibition {
  id: string;
  title: string;
  artist?: string;
  dates: string;
  start?: string; // ISO (AAAA-MM-DD)
  end?: string; // ISO; vazio = longa duração
  location?: string;
  space?: string;
  description: I18n;
  image?: string;
  url?: string;
}

export interface Space {
  id: string;
  name: string;
  level: number; // ordem vertical no mapa esquemático (0 = térreo)
  badge?: string; // rótulo curto no mapa (ex.: "5º", "T", "J")
  description: I18n;
}

export interface QuizQuestion {
  question: I18n;
  options: I18n[];
  correct: number;
  explanation: I18n;
}

export interface Museum {
  id: MuseumId;
  name: string;
  short: string;
  city: string;
  tagline: I18n;
  about: I18n;
  accent: string; // hex
  accentInk: string; // cor do texto sobre o acento
  cover: string; // imagem de capa
  address: string;
  coords: [number, number];
  metro: string;
  phone?: string;
  site: string;
  hours: { days: I18n; time: string; note?: I18n }[];
  tickets: { label: I18n; price: string }[];
  free: I18n[];
  accessibility: I18n[];
  services: I18n[];
  timeline: { year: string; text: I18n }[];
  exhibitions: Exhibition[];
  spaces: Space[];
  quiz: QuizQuestion[];
  stats: { value: string; label: I18n }[];
  /** Horário por dia da semana (0 = domingo). null = fechado. */
  week: ([string, string] | null)[];
  /** Dias com entrada gratuita para todos (0 = domingo), com hora de início opcional. */
  freeDays: { day: number; from?: string }[];
  artworks: Artwork[];
}

/** Metadados leves, usados na tela inicial antes de carregar o acervo. */
export type MuseumMeta = Pick<Museum, "id" | "name" | "short" | "city" | "tagline" | "accent" | "accentInk" | "cover" | "address" | "coords" | "week" | "freeDays">;
