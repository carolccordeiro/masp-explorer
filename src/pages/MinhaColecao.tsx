import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, ChevronDown, ChevronUp } from 'lucide-react';
import { MaspHeader } from '@/components/MaspHeader';
import { exhibitions, Artwork } from '@/data/exhibitions';
import { useCollection } from '@/hooks/useCollection';
import { useLanguage } from '@/contexts/LanguageContext';

export default function MinhaColecao() {
  const { saved, toggle, isSaved } = useCollection();
  const [expandedExpo, setExpandedExpo] = useState<string | null>(null);
  const [selectedArtwork, setSelectedArtwork] = useState<(Artwork & { expoTitle: string }) | null>(null);
  const [tab, setTab] = useState<'explorar' | 'salvos'>('explorar');
  const { t } = useLanguage();

  const allArtworks = exhibitions.flatMap((expo) =>
    (expo.artworks || []).map((art) => ({ ...art, expoTitle: expo.title }))
  );
  const savedArtworks = allArtworks.filter((a) => isSaved(a.id));

  const expoWithArtworks = exhibitions.filter((e) => e.artworks && e.artworks.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <MaspHeader />

      <div className="px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black text-foreground mb-2">{t('colecao.titulo')}</h1>
          <p className="text-muted-foreground text-sm mb-6">
            {t('colecao.subtitulo')}
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex border-b border-border mb-6">
          <button
            onClick={() => setTab('explorar')}
            className={`flex-1 py-3 text-sm font-bold text-center border-b-2 transition-colors ${
              tab === 'explorar' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'
            }`}
          >
            {t('colecao.explorar')}
          </button>
          <button
            onClick={() => setTab('salvos')}
            className={`flex-1 py-3 text-sm font-bold text-center border-b-2 transition-colors ${
              tab === 'salvos' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'
            }`}
          >
            {t('colecao.salvos')} ({saved.length})
          </button>
        </div>

        {tab === 'explorar' ? (
          <div className="space-y-4">
            {expoWithArtworks.map((expo) => (
              <div key={expo.id} className="border border-border">
                <button
                  onClick={() => setExpandedExpo(expandedExpo === expo.id ? null : expo.id)}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-muted/30 transition-colors"
                >
                  <img src={expo.image} alt={expo.title} className="w-14 h-14 object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-foreground truncate">{expo.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{expo.artist}</p>
                    <p className="text-xs text-primary">{expo.artworks!.length} {expo.artworks!.length === 1 ? 'obra' : 'obras'}</p>
                  </div>
                  {expandedExpo === expo.id ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedExpo === expo.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-2 gap-2 p-3 pt-0">
                        {expo.artworks!.map((art) => (
                          <div key={art.id} className="relative border border-border">
                            <button
                              onClick={() => setSelectedArtwork({ ...art, expoTitle: expo.title })}
                              className="w-full text-left"
                            >
                              <img src={art.image} alt={art.title} className="w-full aspect-square object-cover" />
                              <div className="p-2">
                                <p className="text-xs font-bold text-foreground truncate">{art.title}</p>
                                <p className="text-[10px] text-muted-foreground truncate">{art.artist}{art.year ? `, ${art.year}` : ''}</p>
                              </div>
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); toggle(art.id); }}
                              className="absolute top-2 right-2 w-8 h-8 bg-background/80 backdrop-blur-sm flex items-center justify-center"
                            >
                              <Heart
                                className={`w-4 h-4 transition-colors ${
                                  isSaved(art.id) ? 'fill-primary text-primary' : 'text-muted-foreground'
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        ) : (
          <>
            {savedArtworks.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                <div className="w-20 h-20 bg-muted mx-auto flex items-center justify-center mb-6">
                  <Heart className="w-10 h-10 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-black text-foreground mb-2">{t('colecao.nenhuma')}</h2>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  {t('colecao.explore')}
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {savedArtworks.map((art, i) => (
                  <motion.div
                    key={art.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="relative border border-border"
                  >
                    <button
                      onClick={() => setSelectedArtwork(art)}
                      className="w-full text-left"
                    >
                      <img src={art.image} alt={art.title} className="w-full aspect-square object-cover" />
                      <div className="p-2">
                        <p className="text-[10px] font-semibold uppercase text-primary tracking-wider truncate">{art.expoTitle}</p>
                        <p className="text-xs font-bold text-foreground truncate">{art.title}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{art.artist}</p>
                      </div>
                    </button>
                    <button
                      onClick={() => toggle(art.id)}
                      className="absolute top-2 right-2 w-8 h-8 bg-background/80 backdrop-blur-sm flex items-center justify-center"
                    >
                      <Heart className="w-4 h-4 fill-primary text-primary" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </>
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
                      onClick={() => toggle(selectedArtwork.id)}
                      className={`flex-1 py-3 border font-bold text-center flex items-center justify-center gap-2 ${
                        isSaved(selectedArtwork.id)
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border text-foreground'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isSaved(selectedArtwork.id) ? 'fill-primary-foreground' : ''}`} />
                      {isSaved(selectedArtwork.id) ? t('common.salvo') : t('common.salvar')}
                    </button>
                    <button
                      onClick={() => setSelectedArtwork(null)}
                      className="flex-1 py-3 border border-border text-foreground font-bold text-center"
                    >
                      {t('common.fechar')}
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
