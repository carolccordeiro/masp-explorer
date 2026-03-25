import { useState, useEffect } from 'react';

const STORAGE_KEY = 'masp-my-collection';

export function useCollection() {
  const [saved, setSaved] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  }, [saved]);

  const toggle = (artworkId: string) => {
    setSaved((prev) =>
      prev.includes(artworkId) ? prev.filter((id) => id !== artworkId) : [...prev, artworkId]
    );
  };

  const isSaved = (artworkId: string) => saved.includes(artworkId);
  const clear = () => setSaved([]);

  return { saved, toggle, isSaved, clear };
}
