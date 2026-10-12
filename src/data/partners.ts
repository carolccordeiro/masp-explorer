import type { I18n, MuseumId } from "./types";

/**
 * Espaço de mídia para parceiros do entorno (fonte de receita do museu e da KORA).
 * Os parceiros abaixo são EXEMPLOS fictícios para demonstração: cada museu
 * cadastra os seus anunciantes reais.
 */
export interface Partner {
  id: string;
  museum: MuseumId;
  name: string;
  kind: I18n;
  headline: I18n;
  offer: I18n;
  coupon: string;
  distance: string;
  color: string;
}

export const PARTNERS: Partner[] = [
  {
    id: "cafe-do-bairro",
    museum: "masp",
    name: "Café do Bairro",
    kind: { pt: "Café", en: "Café", es: "Café" },
    headline: { pt: "Um café depois do vão livre", en: "A coffee after the open span", es: "Un café después del vano libre" },
    offer: { pt: "10% de desconto mostrando este cupom", en: "10% off when you show this coupon", es: "10% de descuento mostrando este cupón" },
    coupon: "KORA10",
    distance: "~300 m",
    color: "#7A4B2A",
  },
  {
    id: "livraria-arte",
    museum: "masp",
    name: "Livraria Arte & Cia",
    kind: { pt: "Livraria", en: "Bookshop", es: "Librería" },
    headline: { pt: "Leve a arte para casa", en: "Take art home with you", es: "Llévate el arte a casa" },
    offer: { pt: "15% em livros de arte e arquitetura", en: "15% off art and architecture books", es: "15% en libros de arte y arquitectura" },
    coupon: "KORALIVRO",
    distance: "~500 m",
    color: "#2F4A3A",
  },
  {
    id: "bistro-paulista",
    museum: "ims",
    name: "Bistrô Paulista",
    kind: { pt: "Restaurante", en: "Restaurant", es: "Restaurante" },
    headline: { pt: "Almoço a poucos passos do IMS", en: "Lunch a few steps from IMS", es: "Almuerzo a pocos pasos del IMS" },
    offer: { pt: "Sobremesa por conta da casa no almoço", en: "Free dessert with lunch", es: "Postre de cortesía en el almuerzo" },
    coupon: "KORADOCE",
    distance: "~200 m",
    color: "#3B3B3B",
  },
  {
    id: "foto-lab",
    museum: "ims",
    name: "Laboratório Foto Revela",
    kind: { pt: "Fotografia", en: "Photography", es: "Fotografía" },
    headline: { pt: "Revele suas fotos do passeio", en: "Print your photos from the visit", es: "Revela tus fotos del paseo" },
    offer: { pt: "20% na primeira revelação", en: "20% off your first print order", es: "20% en tu primer revelado" },
    coupon: "KORAFOTO",
    distance: "~600 m",
    color: "#111111",
  },
  {
    id: "casa-de-cha",
    museum: "mam",
    name: "Casa de Chá do Parque",
    kind: { pt: "Café", en: "Café", es: "Café" },
    headline: { pt: "Uma pausa no Ibirapuera", en: "A break in Ibirapuera", es: "Una pausa en el Ibirapuera" },
    offer: { pt: "Chá e bolo com 10% de desconto", en: "Tea and cake with 10% off", es: "Té y torta con 10% de descuento" },
    coupon: "KORACHA",
    distance: "~400 m",
    color: "#5B6B2F",
  },
  {
    id: "bike-parque",
    museum: "mam",
    name: "Bike no Parque",
    kind: { pt: "Passeio", en: "Ride", es: "Paseo" },
    headline: { pt: "Conheça o Ibirapuera de bicicleta", en: "See Ibirapuera by bike", es: "Recorre el Ibirapuera en bici" },
    offer: { pt: "1 hora grátis no aluguel de 2 horas", en: "1 free hour when you rent for 2", es: "1 hora gratis al alquilar 2" },
    coupon: "KORABIKE",
    distance: "~250 m",
    color: "#1F5C7A",
  },
];

export const partnersOf = (museum?: string) => PARTNERS.filter((p) => !museum || p.museum === museum);
