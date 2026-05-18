import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, ChevronDown, ChevronUp } from 'lucide-react';
import { MaspHeader } from '@/components/MaspHeader';
import { exhibitions, Artwork } from '@/data/exhibitions';
import { useCollection } from '@/hooks/useCollection';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

export default function MinhaColecao() {
  const { saved, toggle: rawToggle, isSaved } = useCollection();

  // Wrap toggle so the visitor always gets visual feedback when they save or remove an artwork.
  const toggle = (id: string) => {
    const wasSaved = isSaved(id);
    rawToggle(id);
    toast(wasSaved ? 'Removido dos favoritos' : 'Salvo em Minha Coleção');
  };
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

      <div className="px-6 py-10 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <span className="editorial-eyebrow"><span className="editorial-rule-long" />{t('colecao.titulo').toUpperCase()}</span>
          <h1 className="font-display text-5xl md:text-7xl text-foreground mt-3 uppercase">{t('colecao.titulo')}</h1>
          <div className="brutalist-rule-red mt-5 w-24" />
          <p className="text-muted-foreground text-base mt-5 mb-8 max-w-xl leading-relaxed">
            {t('colecao.subtitulo')}
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex border-b border-border mb-8">
          <button
            onClick={() => setTab('explorar')}
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-[0.2em] text-center border-b-2 transition-colors ${
              tab === 'explorar' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('colecao.explorar')}
          </button>
          <button
            onClick={() => setTab('salvos')}
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-[0.2em] text-center border-b-2 transition-colors ${
              tab === 'salvos' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('colecao.salvos')} <span className="text-muted-foreground/60 tabular-nums">({saved.length})</span>
          </button>
        </div>

        {tab === 'explorar' ? (
          <div className="space-y-3">
            {expoWithArtworks.map((expo) => (
              <div key={expo.id} className={`border ${expandedExpo === expo.id ? 'border-primary' : 'border-border'} transition-colors`}>
                <button
                  onClick={() => setExpandedExpo(expandedExpo === expo.id ? null : expo.id)}
                  className="w-full flex items-stretch gap-5 text-left hover:bg-muted/20 transition-colors group/expo"
                >
                  <div className="w-28 h-28 md:w-32 md:h-32 shrink-0 overflow-hidden bg-muted">
                    <img
                      src={expo.image}
                      alt={expo.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/expo:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0 py-3 pr-4 flex flex-col justify-center">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                      {expo.floor} {expo.dates ? `· ${expo.dates}` : ''}
                    </p>
                    <p className="font-display text-xl md:text-2xl text-foreground leading-tight mt-1 truncate group-hover/expo:text-primary transition-colors">
                      {expo.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{expo.artist}</p>
                    <p className="text-[10px] text-muted-foreground mt-1 tabular-nums">
                      {expo.artworks!.length} {expo.artworks!.length === 1 ? 'obra' : 'obras'} na coleção
                    </p>
                  </div>
                  <div className="pr-4 flex items-center">
                    {expandedExpo === expo.id ? (
                      <ChevronUp className="w-5 h-5 text-primary shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0 group-hover/expo:text-primary transition-colors" />
                    )}
                  </div>
                </button>
                <AnimatePresence>
                  {expandedExpo === expo.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4 pt-0">
                        {expo.artworks!.map((art) => (
                          <div key={art.id} className="relative border border-border bg-background group/card overflow-hidden">
                            <button
                              onClick={() => setSelectedArtwork({ ...art, expoTitle: expo.title })}
                              className="w-full text-left"
                            >
                              <div className="aspect-square overflow-hidden">
                                <img
                                  src={art.image}
                                  alt={art.title}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                                  loading="lazy"
                                />
                              </div>
                              <div className="p-3">
                                <p className="text-sm font-bold text-foreground truncate group-hover/card:text-primary transition-colors">{art.title}</p>
                                <p className="text-[11px] text-muted-foreground truncate">{art.artist}{art.year ? `, ${art.year}` : ''}</p>
                              </div>
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); toggle(art.id); }}
                              className="absolute top-2 right-2 w-9 h-9 bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                              aria-label={isSaved(art.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {savedArtworks.map((art, i) => (
                  <motion.div
                    key={art.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="relative border border-border bg-background group/card overflow-hidden"
                  >
                    <button
                      onClick={() => setSelectedArtwork(art)}
                      className="w-full text-left"
                    >
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={art.image}
                          alt={art.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-3">
                        <p className="text-[10px] font-semibold uppercase text-primary tracking-wider truncate">{art.expoTitle}</p>
                        <p className="text-sm font-bold text-foreground truncate mt-0.5">{art.title}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{art.artist}</p>
                      </div>
                    </button>
                    <button
                      onClick={() => toggle(art.id)}
                      className="absolute top-2 right-2 w-9 h-9 bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                      aria-label="Remover dos favoritos"
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
              className="fixed inset-0 z-50 bg-foreground/70 backdrop-blur-sm flex items-end md:items-center md:justify-center md:p-6"
              onClick={() => setSelectedArtwork(null)}
            >
              <motion.div
                initial={{ y: '100%', opacity: 0.6 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 28, stiffness: 260 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-background w-full md:max-w-3xl md:max-h-[88vh] max-h-[88vh] overflow-y-auto md:border md:border-border"
              >
                <div className="relative">
                  <img
                    src={selectedArtwork.image}
                    alt={selectedArtwork.title}
                    className="w-full h-72 md:h-96 object-cover"
                  />
                  <button
                    onClick={() => setSelectedArtwork(null)}
                    className="absolute top-4 right-4 w-10 h-10 bg-background/90 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background"
                    aria-label={t('common.fechar')}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-7 md:p-10">
                  <span className="editorial-eyebrow text-[10px]">
                    <span className="editorial-rule" />
                    {selectedArtwork.expoTitle}
                  </span>
                  <h3 className="font-display text-4xl md:text-5xl text-foreground mt-3 leading-[0.98]">
                    {selectedArtwork.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-3 font-bold">
                    {selectedArtwork.artist}{selectedArtwork.year ? `, ${selectedArtwork.year}` : ''}
                  </p>
                  <div className="w-12 h-px bg-primary mt-5 mb-5" />
                  <p className="text-foreground leading-relaxed text-base max-w-prose">
                    {selectedArtwork.description}
                  </p>
                  <div className="flex gap-3 mt-8">
                    <button
                      onClick={() => toggle(selectedArtwork.id)}
                      className={`flex-1 py-4 border font-bold text-xs uppercase tracking-[0.18em] flex items-center justify-center gap-2 transition-colors ${
                        isSaved(selectedArtwork.id)
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-foreground text-foreground hover:bg-foreground hover:text-background'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isSaved(selectedArtwork.id) ? 'fill-primary-foreground' : ''}`} />
                      {isSaved(selectedArtwork.id) ? t('common.salvo') : t('common.salvar')}
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
