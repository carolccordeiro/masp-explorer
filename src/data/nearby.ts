import type { I18n } from "./types";

export type PlaceKind = "museu" | "galeria" | "centro";

/** Museus, galerias e centros culturais perto da rede KORA (coordenadas e endereços do Google Maps, out/2026). */
export interface NearbyPlace {
  id: string;
  name: string;
  kind: PlaceKind;
  address: string;
  coords: [number, number];
  desc: I18n;
}

export const NEARBY: NearbyPlace[] = [
  {
    id: "fiesp",
    name: "Centro Cultural FIESP",
    kind: "centro",
    address: "Av. Paulista, 1313",
    coords: [-23.5635, -46.6544],
    desc: {
      pt: "Exposições, teatro e biblioteca a uma quadra do MASP, em frente ao metrô Trianon-Masp.",
      en: "Exhibitions, theater and a library one block from MASP, by Trianon-Masp station.",
      es: "Exposiciones, teatro y biblioteca a una cuadra del MASP, frente al metro Trianon-Masp.",
    },
  },
  {
    id: "luisa-strina",
    name: "Galeria Luisa Strina",
    kind: "galeria",
    address: "R. Padre João Manuel, 755",
    coords: [-23.5643, -46.6642],
    desc: {
      pt: "Fundada em 1974, é uma das galerias que mais projetaram a arte brasileira no exterior.",
      en: "Founded in 1974, one of the galleries that did most to take Brazilian art abroad.",
      es: "Fundada en 1974, una de las galerías que más proyectaron el arte brasileño en el exterior.",
    },
  },
  {
    id: "vermelho",
    name: "Galeria Vermelho",
    kind: "galeria",
    address: "R. Minas Gerais, 350",
    coords: [-23.5548, -46.6649],
    desc: {
      pt: "Arte contemporânea a poucos minutos do IMS Paulista, com arquivo aberto de artistas.",
      en: "Contemporary art a few minutes from IMS Paulista, with an open artist archive.",
      es: "Arte contemporáneo a pocos minutos del IMS Paulista, con archivo abierto de artistas.",
    },
  },
  {
    id: "japan-house",
    name: "Japan House São Paulo",
    kind: "centro",
    address: "Av. Paulista, 52",
    coords: [-23.5705, -46.6446],
    desc: {
      pt: "Cultura japonesa contemporânea em um prédio com fachada de madeira de Kengo Kuma.",
      en: "Contemporary Japanese culture in a building with a wooden facade by Kengo Kuma.",
      es: "Cultura japonesa contemporánea en un edificio con fachada de madera de Kengo Kuma.",
    },
  },
  {
    id: "itau-cultural",
    name: "Itaú Cultural",
    kind: "museu",
    address: "Av. Paulista, 149",
    coords: [-23.5704, -46.6459],
    desc: {
      pt: "Exposições de arte e acervo sobre a história do Brasil, com entrada gratuita.",
      en: "Art exhibitions and a collection on Brazilian history, with free admission.",
      es: "Exposiciones de arte y colección sobre la historia de Brasil, con entrada gratuita.",
    },
  },
  {
    id: "casa-das-rosas",
    name: "Casa das Rosas",
    kind: "museu",
    address: "Av. Paulista, 37",
    coords: [-23.5711, -46.6452],
    desc: {
      pt: "Casarão dos anos 1930 com jardim de rosas, hoje dedicado à poesia e à literatura.",
      en: "A 1930s mansion with a rose garden, now devoted to poetry and literature.",
      es: "Casona de los años 1930 con jardín de rosas, hoy dedicada a la poesía y la literatura.",
    },
  },
  {
    id: "sesc-paulista",
    name: "Sesc Avenida Paulista",
    kind: "centro",
    address: "Av. Paulista, 119",
    coords: [-23.5705, -46.6456],
    desc: {
      pt: "Exposições e um mirante no alto do prédio com vista para a avenida.",
      en: "Exhibitions and a rooftop lookout over the avenue.",
      es: "Exposiciones y un mirador en lo alto del edificio con vista a la avenida.",
    },
  },
  {
    id: "mis",
    name: "Museu da Imagem e do Som (MIS)",
    kind: "museu",
    address: "Av. Europa, 158",
    coords: [-23.5729, -46.6761],
    desc: {
      pt: "Cinema, música, fotografia e cultura visual em exposições interativas.",
      en: "Film, music, photography and visual culture in interactive exhibitions.",
      es: "Cine, música, fotografía y cultura visual en exposiciones interactivas.",
    },
  },
  {
    id: "mube",
    name: "MuBE · Museu Brasileiro da Escultura e Ecologia",
    kind: "museu",
    address: "R. Alemanha, 221",
    coords: [-23.5732, -46.6769],
    desc: {
      pt: "Projeto de Paulo Mendes da Rocha dedicado à escultura, com uma grande praça aberta.",
      en: "Paulo Mendes da Rocha's building devoted to sculpture, with a large open plaza.",
      es: "Obra de Paulo Mendes da Rocha dedicada a la escultura, con una gran plaza abierta.",
    },
  },
  {
    id: "nara-roesler",
    name: "Galeria Nara Roesler",
    kind: "galeria",
    address: "Av. Europa, 655",
    coords: [-23.5765, -46.679],
    desc: {
      pt: "Galeria de arte contemporânea com artistas brasileiros e internacionais.",
      en: "Contemporary art gallery with Brazilian and international artists.",
      es: "Galería de arte contemporáneo con artistas brasileños e internacionales.",
    },
  },
  {
    id: "afro-brasil",
    name: "Museu Afro Brasil Emanoel Araujo",
    kind: "museu",
    address: "Av. Pedro Álvares Cabral, s/n (Parque Ibirapuera, portão 10)",
    coords: [-23.5838, -46.6591],
    desc: {
      pt: "No Ibirapuera, perto do MAM: história, religiosidade e arte afro-brasileira.",
      en: "In Ibirapuera Park, near MAM: Afro-Brazilian history, religion and art.",
      es: "En el Ibirapuera, cerca del MAM: historia, religiosidad y arte afrobrasileño.",
    },
  },
  {
    id: "bienal",
    name: "Pavilhão da Bienal",
    kind: "centro",
    address: "Av. Pedro Álvares Cabral, s/n (Parque Ibirapuera)",
    coords: [-23.588, -46.6538],
    desc: {
      pt: "O prédio de Niemeyer que recebe a Bienal de São Paulo, ao lado do MAM.",
      en: "Niemeyer's building that hosts the São Paulo Biennial, next to MAM.",
      es: "El edificio de Niemeyer que recibe la Bienal de São Paulo, junto al MAM.",
    },
  },
  {
    id: "mac-usp",
    name: "MAC USP",
    kind: "museu",
    address: "Av. Pedro Álvares Cabral, 1301",
    coords: [-23.589, -46.651],
    desc: {
      pt: "Arte moderna e contemporânea, com terraço panorâmico de frente para o Ibirapuera.",
      en: "Modern and contemporary art, with a rooftop terrace facing Ibirapuera.",
      es: "Arte moderno y contemporáneo, con terraza panorámica frente al Ibirapuera.",
    },
  },
];

export const KIND_LABEL: Record<PlaceKind, I18n> = {
  museu: { pt: "Museu", en: "Museum", es: "Museo" },
  galeria: { pt: "Galeria", en: "Gallery", es: "Galería" },
  centro: { pt: "Centro cultural", en: "Cultural center", es: "Centro cultural" },
};

export const mapsUrl = (p: NearbyPlace) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${p.name}, ${p.address}, São Paulo`)}`;
