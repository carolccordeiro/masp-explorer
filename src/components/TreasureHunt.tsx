import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Check, X, Trophy, MapPin, Smartphone, Coffee } from 'lucide-react';
import { Exhibition } from '@/data/exhibitions';

interface TreasureHuntProps {
  itinerary: Exhibition[];
  profileLabel: string;
  totalDuration: number;
  onClose: () => void;
}

/**
 * Caça ao Tesouro. Transforma o roteiro do visitante em um percurso gamificado:
 * a cada checkpoint, o visitante toca em "encontrei" quando chega na obra física no museu.
 * No final, mostra pontuação e um QR Code que o visitante pode escanear pra
 * levar o roteiro completo pro celular, junto de um cupom-prêmio.
 *
 * Sem dados pessoais transitam: o QR carrega apenas o id das exposições visitadas
 * codificado na URL, respeitando o consentimento LGPD do totem.
 */
export function TreasureHunt({ itinerary, profileLabel, totalDuration, onClose }: TreasureHuntProps) {
  const [foundIds, setFoundIds] = useState<Set<string>>(new Set());
  const [startedAt] = useState(() => Date.now());
  const [completed, setCompleted] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  // Atualiza o cronômetro a cada segundo
  useEffect(() => {
    if (completed) return;
    const tick = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 1000);
    return () => clearInterval(tick);
  }, [startedAt, completed]);

  // Quando todos checkpoints forem marcados, encerra a caça automaticamente
  useEffect(() => {
    if (foundIds.size > 0 && foundIds.size === itinerary.length && !completed) {
      setCompleted(true);
    }
  }, [foundIds, itinerary.length, completed]);

  const toggleFound = (id: string) => {
    setFoundIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const score = foundIds.size;
  const total = itinerary.length;
  const percent = total > 0 ? Math.round((score / total) * 100) : 0;

  // URL codificada com os ids do roteiro pra abrir no celular sem dados pessoais
  const shareUrl = useMemo(() => {
    const ids = itinerary.map((e) => e.id).join(',');
    const params = new URLSearchParams({ r: ids, t: String(totalDuration) });
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/roteiro?${params.toString()}`;
  }, [itinerary, totalDuration]);

  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');

  // Cupom só é liberado se o visitante achou ao menos 70% das obras
  const earnedCoupon = total > 0 && score / total >= 0.7;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-background overflow-y-auto"
    >
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Top rail brutalist */}
        <div className="flex items-center justify-between border-b-2 border-foreground pb-4 mb-8">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-primary">
              Caça ao Tesouro
            </span>
            <span className="block w-12 h-[2px] bg-primary" />
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-muted-foreground">
              KORA × MASP
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 border-2 border-foreground flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
            aria-label="Fechar caça ao tesouro"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!completed ? (
          <>
            <header className="mb-8">
              <h1 className="font-display text-5xl md:text-6xl text-foreground uppercase">
                Sua caça começou
              </h1>
              <div className="brutalist-rule-red mt-5 w-24" />
              <p className="text-muted-foreground text-base mt-5 max-w-xl leading-relaxed">
                Encontre cada obra no museu, toque em <span className="font-bold text-foreground">"Encontrei"</span>{' '}
                quando chegar perto da peça. Acerte 70% ou mais e libere o seu prêmio.
              </p>
            </header>

            {/* Cronômetro + progresso */}
            <div className="grid grid-cols-3 border-y-2 border-foreground mb-10">
              <div className="py-5 px-4 border-r-2 border-foreground">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
                  Tempo
                </span>
                <p className="font-display text-3xl text-foreground mt-1 tnum">
                  {mm}:{ss}
                </p>
              </div>
              <div className="py-5 px-4 border-r-2 border-foreground">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
                  Encontradas
                </span>
                <p className="font-display text-3xl text-foreground mt-1 tnum">
                  {String(score).padStart(2, '0')}/{String(total).padStart(2, '0')}
                </p>
              </div>
              <div className="py-5 px-4">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
                  Progresso
                </span>
                <p className="font-display text-3xl text-primary mt-1 tnum">
                  {percent}%
                </p>
              </div>
            </div>

            {/* Checkpoints */}
            <ol className="space-y-3">
              {itinerary.map((expo, i) => {
                const found = foundIds.has(expo.id);
                return (
                  <motion.li
                    key={expo.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex items-stretch gap-5 border-2 transition-colors ${
                      found ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                  >
                    <div className="w-16 md:w-20 shrink-0 bg-foreground text-background flex flex-col items-center justify-center">
                      <span className="font-display text-3xl md:text-4xl tnum">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 overflow-hidden bg-muted">
                      <img src={expo.image} alt={expo.title} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="flex-1 min-w-0 py-3 pr-4 flex flex-col justify-center">
                      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary flex items-center gap-1.5">
                        <MapPin className="w-3 h-3" />
                        {expo.floor}
                      </span>
                      <p className="font-display text-lg md:text-xl text-foreground leading-tight mt-1 truncate">
                        {expo.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{expo.artist}</p>
                    </div>
                    <button
                      onClick={() => toggleFound(expo.id)}
                      className={`w-28 md:w-36 shrink-0 border-l-2 transition-colors ${
                        found
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'border-border hover:bg-foreground hover:text-background hover:border-foreground'
                      }`}
                      aria-pressed={found}
                    >
                      <span className="flex flex-col items-center justify-center gap-1 px-2">
                        {found ? <Check className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                        <span className="text-[10px] font-black uppercase tracking-[0.18em]">
                          {found ? 'Achei' : 'Encontrei?'}
                        </span>
                      </span>
                    </button>
                  </motion.li>
                );
              })}
            </ol>

            {/* CTA encerrar antes */}
            <div className="mt-10 flex flex-col md:flex-row gap-3">
              <button
                onClick={() => setCompleted(true)}
                disabled={score === 0}
                className="flex-1 py-4 border-2 border-foreground text-foreground font-black text-xs uppercase tracking-[0.3em] hover:bg-foreground hover:text-background transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Encerrar caça
              </button>
            </div>
          </>
        ) : (
          // Tela final, score + QR
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <header className="mb-8">
              <span className="text-[10px] font-black tracking-[0.3em] uppercase text-primary flex items-center gap-3">
                <span className="block w-12 h-[2px] bg-primary" />
                Caça encerrada
              </span>
              <h1 className="font-display text-5xl md:text-6xl text-foreground uppercase mt-3">
                {earnedCoupon ? 'Parabéns!' : 'Quase lá!'}
              </h1>
              <div className="brutalist-rule-red mt-5 w-24" />
            </header>

            {/* Score gigante */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-2 border-foreground mb-10">
              <div className="py-10 px-8 border-r-0 md:border-r-2 border-foreground border-b-2 md:border-b-0">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
                  Sua pontuação
                </span>
                <p className="font-display text-[clamp(6rem,14vw,12rem)] text-primary leading-[0.85] tnum mt-3">
                  {score}
                  <span className="text-foreground text-[0.4em] align-top ml-2">/ {total}</span>
                </p>
                <p className="font-display text-2xl text-foreground mt-2 tnum">{percent}%</p>
              </div>
              <div className="py-10 px-8 flex flex-col justify-center">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
                  Resumo da visita
                </span>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between border-b border-border pb-2">
                    <dt className="text-muted-foreground">Duração total</dt>
                    <dd className="font-bold text-foreground tnum">{mm}:{ss}</dd>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <dt className="text-muted-foreground">Roteiro</dt>
                    <dd className="font-bold text-foreground">{totalDuration} min</dd>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <dt className="text-muted-foreground">Perfil</dt>
                    <dd className="font-bold text-foreground">{profileLabel}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Exposições visitadas</dt>
                    <dd className="font-bold text-foreground tnum">{score} de {total}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Cupom desbloqueado */}
            {earnedCoupon && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="border-2 border-primary bg-primary text-primary-foreground p-8 mb-10 flex flex-col md:flex-row items-center gap-6"
              >
                <Trophy className="w-12 h-12 shrink-0" />
                <div className="flex-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                    Prêmio liberado
                  </span>
                  <h3 className="font-display text-3xl mt-1 uppercase">15% no Café do MASP</h3>
                  <p className="text-sm opacity-90 mt-2">
                    Apresente o QR Code abaixo no caixa do café do museu para resgatar.
                  </p>
                </div>
              </motion.div>
            )}

            {/* QR pro celular */}
            <div className="border-2 border-foreground p-8 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                  <Smartphone className="w-3 h-3" />
                  Leve sua visita
                </span>
                <h3 className="font-display text-3xl md:text-4xl text-foreground uppercase mt-3">
                  Aponte a câmera do celular
                </h3>
                <p className="text-muted-foreground text-sm mt-3 leading-relaxed max-w-md">
                  Aponte a câmera para o código ao lado e abra o resumo da sua visita
                  no seu celular. Não coletamos dados pessoais, o código carrega apenas
                  o roteiro escolhido.
                </p>
                {earnedCoupon && (
                  <p className="text-xs text-primary font-bold uppercase tracking-[0.18em] mt-4 flex items-center gap-1.5">
                    <Coffee className="w-3 h-3" />
                    Cupom incluído no QR Code
                  </p>
                )}
              </div>
              <div className="bg-background p-4 border-2 border-foreground shrink-0 mx-auto">
                <QRCodeSVG
                  value={shareUrl}
                  size={180}
                  fgColor="hsl(var(--foreground))"
                  bgColor="hsl(var(--background))"
                  level="M"
                  marginSize={2}
                />
              </div>
            </div>

            <div className="mt-10 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-4 border-2 border-foreground text-foreground font-black text-xs uppercase tracking-[0.3em] hover:bg-foreground hover:text-background transition-colors"
              >
                Voltar ao menu
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
