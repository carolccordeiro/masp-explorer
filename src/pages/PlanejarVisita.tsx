import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronRight, RotateCcw } from 'lucide-react';
import { MaspHeader } from '@/components/MaspHeader';
import { VoiceButton } from '@/components/VoiceButton';
import { exhibitions, Exhibition } from '@/data/exhibitions';
import { useVoice } from '@/hooks/useVoice';

const timeOptions = [30, 60, 90, 120, 180];

export default function PlanejarVisita() {
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [suggested, setSuggested] = useState<Exhibition[]>([]);
  const [selectedExpo, setSelectedExpo] = useState<Exhibition | null>(null);
  const { speak } = useVoice();

  const suggestExhibitions = (minutes: number) => {
    setSelectedTime(minutes);
    const shuffled = [...exhibitions].sort(() => Math.random() - 0.5);
    let total = 0;
    const result: Exhibition[] = [];
    for (const expo of shuffled) {
      if (total + expo.duration <= minutes) {
        result.push(expo);
        total += expo.duration;
      }
    }
    // Sort by floor for a logical path
    result.sort((a, b) => a.floor.localeCompare(b.floor));
    setSuggested(result);

    const totalTime = result.reduce((sum, e) => sum + e.duration, 0);
    speak(`Para ${minutes} minutos, sugerimos ${result.length} exposições com duração total de ${totalTime} minutos.`);
  };

  const handleVoice = (text: string) => {
    const match = text.match(/(\d+)/);
    if (match) {
      const mins = parseInt(match[1]);
      if (mins >= 20) suggestExhibitions(mins);
    }
  };

  const totalDuration = useMemo(() => suggested.reduce((s, e) => s + e.duration, 0), [suggested]);

  return (
    <div className="min-h-screen bg-background">
      <MaspHeader />

      <div className="px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black text-foreground mb-2">Planejar Visita</h1>
          <p className="text-muted-foreground text-sm mb-8">
            Quanto tempo você tem disponível? Sugerimos um roteiro personalizado!
          </p>
        </motion.div>

        {/* Time selector */}
        <div className="space-y-3 mb-6">
          <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Tempo disponível</p>
          <div className="grid grid-cols-3 gap-3">
            {timeOptions.map((t) => (
              <motion.button
                key={t}
                whileTap={{ scale: 0.95 }}
                onClick={() => suggestExhibitions(t)}
                className={`p-4 border text-center transition-colors ${
                  selectedTime === t
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-foreground hover:border-primary'
                }`}
              >
                <Clock className="w-5 h-5 mx-auto mb-1" />
                <span className="text-lg font-bold">{t >= 60 ? `${t / 60}h` : `${t}min`}</span>
              </motion.button>
            ))}
          </div>
          <div className="flex justify-center">
            <VoiceButton onTranscript={handleVoice} />
          </div>
          <p className="text-center text-xs text-muted-foreground">Ou diga o tempo em minutos</p>
        </div>

        {/* Suggested exhibitions */}
        <AnimatePresence mode="wait">
          {suggested.length > 0 && (
            <motion.div
              key={selectedTime}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-foreground">Seu Roteiro</h2>
                  <p className="text-sm text-muted-foreground">
                    {suggested.length} exposições · ~{totalDuration} minutos
                  </p>
                </div>
                <button onClick={() => suggestExhibitions(selectedTime!)} className="text-primary">
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {suggested.map((expo, i) => (
                  <motion.button
                    key={expo.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setSelectedExpo(expo)}
                    className="w-full flex items-center gap-4 p-4 border border-border hover:border-primary transition-colors text-left group"
                  >
                    <div className="w-8 h-8 bg-primary flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-primary-foreground">{i + 1}</span>
                    </div>
                    <img
                      src={expo.image}
                      alt={expo.title}
                      className="w-16 h-16 object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground truncate group-hover:text-primary transition-colors">
                        {expo.artist}: {expo.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{expo.floor} · ~{expo.duration} min</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Exhibition detail modal */}
        <AnimatePresence>
          {selectedExpo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-foreground/50 flex items-end"
              onClick={() => setSelectedExpo(null)}
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-background w-full max-h-[80vh] overflow-y-auto"
              >
                <img src={selectedExpo.image} alt={selectedExpo.title} className="w-full h-56 object-cover" />
                <div className="p-6">
                  <span className="text-xs font-semibold uppercase text-primary tracking-wider">{selectedExpo.category}</span>
                  <h3 className="text-2xl font-black text-foreground mt-1">{selectedExpo.artist}</h3>
                  <h4 className="text-lg font-bold text-muted-foreground mb-4">{selectedExpo.title}</h4>
                  <div className="flex gap-4 mb-4 text-sm text-muted-foreground">
                    <span>📍 {selectedExpo.floor}</span>
                    <span>⏱ ~{selectedExpo.duration} min</span>
                  </div>
                  <p className="text-foreground leading-relaxed">{selectedExpo.description}</p>
                  <button
                    onClick={() => setSelectedExpo(null)}
                    className="mt-6 w-full py-3 bg-primary text-primary-foreground font-bold text-center"
                  >
                    Fechar
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
