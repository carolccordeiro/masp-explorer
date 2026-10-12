import { useEffect, useState } from "react";
import { store } from "./utils";

/**
 * "Minha visita": o que o visitante viu, escaneou e conquistou, guardado só no aparelho.
 * É apagado ao encerrar a sessão (tela de descanso) e não vai para o servidor.
 */
export type Badge = "quiz" | "hunt";
export interface Visit {
  viewed: string[]; // ids de obras abertas
  scanned: string[]; // ids reconhecidas no scanner
  badges: Badge[];
  floor?: string; // espaço onde a pessoa disse que está
  rating?: number;
}
type All = Record<string, Visit>;

const KEY = "kora-visit";
const empty = (): Visit => ({ viewed: [], scanned: [], badges: [] });
const listeners = new Set<() => void>();

function read(): All {
  return store.get<All>(KEY, {});
}
function write(all: All) {
  store.set(KEY, all);
  listeners.forEach((l) => l());
}

export function updateVisit(museum: string, fn: (v: Visit) => Visit) {
  const all = read();
  all[museum] = fn(all[museum] ?? empty());
  write(all);
}

const addUnique = (list: string[], id: string) => (list.includes(id) ? list : [...list, id]);
export const markViewed = (museum: string, id: string) => updateVisit(museum, (v) => ({ ...v, viewed: addUnique(v.viewed, id) }));
export const markScanned = (museum: string, id: string) => updateVisit(museum, (v) => ({ ...v, scanned: addUnique(v.scanned, id), viewed: addUnique(v.viewed, id) }));
export const addBadge = (museum: string, b: Badge) => updateVisit(museum, (v) => ({ ...v, badges: v.badges.includes(b) ? v.badges : [...v.badges, b] }));
export const setFloor = (museum: string, floor: string | undefined) => updateVisit(museum, (v) => ({ ...v, floor }));
export const setRating = (museum: string, rating: number) => updateVisit(museum, (v) => ({ ...v, rating }));

export function clearVisit() {
  write({});
}

export function useVisit(museum: string): Visit {
  const [v, setV] = useState<Visit>(() => read()[museum] ?? empty());
  useEffect(() => {
    const l = () => setV(read()[museum] ?? empty());
    l();
    listeners.add(l);
    return () => void listeners.delete(l);
  }, [museum]);
  return v;
}
