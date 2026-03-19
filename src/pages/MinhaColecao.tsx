import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Trash2 } from 'lucide-react';
import { MaspHeader } from '@/components/MaspHeader';
import { exhibitions, Artwork } from '@/data/exhibitions';

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

export default function MinhaColecao() {
  const { saved, toggle, clear } = useCollection();
  const [selectedArtwork, setSelectedArtwork] = useState<(Artwork & { expoTitle: string }) | null>(null);

  const allArtworks = exhibitions.flatMap((expo) =>
    (expo.artworks || []).map((art) => ({ ...art, expoTitle: expo.title }))
  );

  const savedArtworks = allArtworks.filter((a) => saved.includes(a.id));

  // Group by exhibition
  const grouped = savedArtworks.reduce<Record<string, (Artwork & { expoTitle: string })[]>>((acc, art) => {
    if (!acc[art.expoTitle]) acc[art.expoTitle] = [];
    acc[art.expoTitle].push(art);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background">
      <MaspHeader />

      <div className="px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-black text-foreground">Minha Coleção</h1>
            {saved.length > 0 && (
              <button onClick={clear} className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1">
                <Trash2 className="w-3.5 h-3.5" /> Limpar
              </button>
            )}
          </div>
          <p className="text-muted-foreground text-sm mb-8">
            {saved.length > 0
              ? `${saved.length} ${saved.length === 1 ? 'obra salva' : 'obras salvas'}`
              : 'Salve suas obras favoritas durante a visita'}
          </p>
        </motion.div>

        {saved.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <div className="w-20 h-20 bg-muted mx-auto flex items-center justify-center mb-6">
              <Heart className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-black text-foreground mb-2">Nenhuma obra salva</h2>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Explore as exposições e toque no coração para salvar suas obras favoritas.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([expoTitle, arts]) => (
              <div key={expoTitle}>
                <p className="text-xs font-semibold uppercase text-primary tracking-wider mb-3">{expoTitle}</p>
                <div className="grid grid-cols-2 gap-3">
                  {arts.map((art, i) => (
                    <motion.button
                      key={art.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => setSelectedArtwork(art)}
                      className="border border-border hover:border-primary transition-colors text-left"
                    >
                      <img src={art.image} alt={art.title} className="w-full aspect-square object-cover" />
                      <div className="p-2">
                        <p className="text-xs font-bold text-foreground truncate">{art.title}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{art.artist}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detail modal */}
        <AnimatePresence>
          {selectedArtwork && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-foreground/50 flex items-end"
              onClick={() => setSelectedArtwork(null)}
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-background w-full max-h-[80vh] overflow-y-auto"
              >
                <img src={selectedArtwork.image} alt={selectedArtwork.title} className="w-full h-56 object-cover" />
                <div className="p-6">
                  <span className="text-xs font-semibold uppercase text-primary tracking-wider">{selectedArtwork.expoTitle}</span>
                  <h3 className="text-2xl font-black text-foreground mt-1">{selectedArtwork.title}</h3>
                  <p className="text-muted-foreground mb-1">{selectedArtwork.artist}{selectedArtwork.year ? `, ${selectedArtwork.year}` : ''}</p>
                  <p className="text-foreground leading-relaxed mt-4">{selectedArtwork.description}</p>
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => { toggle(selectedArtwork.id); setSelectedArtwork(null); }}
                      className="flex-1 py-3 border border-destructive text-destructive font-bold text-center flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" /> Remover
                    </button>
                    <button
                      onClick={() => setSelectedArtwork(null)}
                      className="flex-1 py-3 bg-primary text-primary-foreground font-bold text-center"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
