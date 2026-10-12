import { useCallback, useEffect, useState } from "react";
import { store } from "./utils";

const KEY = "kora-favorites";
const listeners = new Set<(v: string[]) => void>();
let current: string[] = store.get<string[]>(KEY, []);

function setAll(v: string[]) {
  current = v;
  store.set(KEY, v);
  listeners.forEach((l) => l(v));
}

/** Favoritos compartilhados por toda a rede (chave "museu:obra"). */
export function useFavorites() {
  const [favs, setFavs] = useState(current);
  useEffect(() => {
    listeners.add(setFavs);
    return () => void listeners.delete(setFavs);
  }, []);
  const toggle = useCallback((key: string) => {
    setAll(current.includes(key) ? current.filter((k) => k !== key) : [...current, key]);
  }, []);
  const has = useCallback((key: string) => favs.includes(key), [favs]);
  return { favs, toggle, has, clear: () => setAll([]) };
}
