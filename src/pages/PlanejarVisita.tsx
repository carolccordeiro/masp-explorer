import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronRight, RotateCcw, Users, Palette } from 'lucide-react';
import { MaspHeader } from '@/components/MaspHeader';
import { VoiceButton } from '@/components/VoiceButton';
import { exhibitions, Exhibition } from '@/data/exhibitions';
import { useVoice } from '@/hooks/useVoice';
import { useLanguage } from '@/contexts/LanguageContext';

const timeOptions = [30, 60, 90, 120, 180];

const profileOptions = [
  { id: 'solo', label: 'Sozinho(a)', labelEn: 'Solo' },
  { id: 'casal', label: 'Casal', labelEn: 'Couple' },
  { id: 'familia', label: 'Família com crianças', labelEn: 'Family with children' },
  { id: 'grupo', label: 'Grupo / Turma', labelEn: 'Group / Class' },
];

const themeOptions = [
  { id: 'arte-moderna', label: 'Arte Moderna', labelEn: 'Modern Art' },
  { id: 'historia-brasil', label: 'História do Brasil', labelEn: 'Brazilian History' },
  { id: 'arte-contemporanea', label: 'Arte Contemporânea', labelEn: 'Contemporary Art' },
  { id: 'arte-europeia', label: 'Arte Europeia', labelEn: 'European Art' },
  { id: 'identidade-cultura', label: 'Identidade & Cultura', labelEn: 'Identity & Culture' },
  { id: 'arte-indigena', label: 'Arte Indígena', labelEn: 'Indigenous Art' },
];

const themeToCategoryMap: Record<string, string[]> = {
  'arte-moderna': ['Arte Moderna', 'Modernismo'],
  'historia-brasil': ['Arte Brasileira', 'História'],
  'arte-contemporanea': ['Arte Contemporânea', 'Contemporâneo'],
  'arte-europeia': ['Arte Europeia', 'Europeu'],
  'identidade-cultura': ['Identidade', 'Cultura', 'Pop Andino'],
  'arte-indigena': ['Arte Indígena', 'Indígena', 'Têxtil'],
};

type Step = 'time' | 'profile' | 'themes' | 'result';

export default function PlanejarVisita() {
  const [step, setStep] = useState<Step>('time');
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [suggested, setSuggested] = useState<Exhibition[]>([]);
  const [selectedExpo, setSelectedExpo] = useState<Exhibition | null>(null);
  const { speak } = useVoice();
  const { lang, t } = useLanguage();

  const handleSelectTime = (minutes: number) => {
    setSelectedTime(minutes);
    speak(`Ótimo! Você tem ${minutes >= 60 ? `${minutes / 60} hora${minutes > 60 ? 's' : ''}` : `${minutes} minutos`}. Agora me diga: quem está visitando com você?`);
    setStep('profile');
  };

  const handleSelectProfile = (profileId: string) => {
    setSelectedProfile(profileId);
    const profile = profileOptions.find(p => p.id === profileId);
    speak(`Perfeito! ${profile?.label}. Agora selecione os temas que mais interessam a vocês.`);
    setStep('themes');
  };

  const toggleTheme = (themeId: string) => {
    setSelectedThemes(prev =>
      prev.includes(themeId) ? prev.filter(t => t !== themeId) : [...prev, themeId]
    );
  };

  const generateRoute = () => {
    if (!selectedTime) return;

    const minutes = selectedTime;
    const preferredCategories = selectedThemes.flatMap(t => themeToCategoryMap[t] || []);

    const main = exhibitions.find((e) => e.isMainExhibition);
    let others = exhibitions.filter((e) => !e.isMainExhibition);

    if (preferredCategories.length > 0) {
      others = others.sort((a, b) => {
        const aMatch = preferredCategories.some(cat =>
          a.category?.toLowerCase().includes(cat.toLowerCase()) ||
          a.title?.toLowerCase().includes(cat.toLowerCase())
        );
        const bMatch = preferredCategories.some(cat =>
          b.category?.toLowerCase().includes(cat.toLowerCase()) ||
          b.title?.toLowerCase().includes(cat.toLowerCase())
        );
        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;
        return Math.random() - 0.5;
      });
    } else {
      others = others.sort(() => Math.random() - 0.5);
    }

    let total = 0;
    const result: Exhibition[] = [];

    if (main && main.duration <= minutes) {
      result.push(main);
      total += main.duration;
    }

    for (const expo of others) {
      if (total + expo.duration <= minutes) {
        result.push(expo);
        total += expo.duration;
      }
    }

    result.sort((a, b) => a.floor.localeCompare(b.floor));
    setSuggested(result);

    const totalTime = result.reduce((sum, e) => sum + e.duration, 0);
    const profileLabel = profileOptions.find(p => p.id === selectedProfile)?.label || 'vocês';

    speak(
      `Excelente! Preparamos um roteiro de ${totalTime} minutos para ${profileLabel}. ` +
      `Sugerimos ${result.length} ${result.length === 1 ? 'exposição' : 'exposições'}. ` +
      (result[0] ? `Começaremos por ${result[0].artist} — ${result[0].title}.` : '')
    );

    setStep('result');
  };

  const handleReset = () => {
    setStep('time');
    setSelectedTime(null);
    setSelectedProfile(null);
    setSelectedThemes([]);
    setSuggested([]);
  };

  const handleVoice = (text: string) => {
    if (step === 'time') {
      const match = text.match(/(\d+)/);
      if (match) {
        const mins = parseInt(match[1]);
        if (mins >= 20) handleSelectTime(mins);
      }
    }
  };

  const totalDuration = useMemo(() => suggested.reduce((s, e) => s + e.duration, 0), [suggested]);

  const stepLabels: Record<Step, string> = {
    time: t('planejar.step1'),
    profile: t('planejar.step2'),
    themes: t('planejar.step3'),
    result: t('planejar.step4'),
  };

  return (
    <div className="min-h-screen bg-background">
      <MaspHeader />

      <div className="px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black text-foreground mb-1">{t('planejar.titulo')}</h1>
          <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-6">
            {stepLabels[step]}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 'time' && (
            <motion.div
              key="step-time"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-4"
            >
              <p className="text-sm text-muted-foreground mb-4">
                {t('planejar.tempo')}
              </p>
              <div className="grid grid-cols-3 gap-3">
                {timeOptions.map((time) => (
                  <motion.button
                    key={time}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelectTime(time)}
                    className="p-4 border border-border bg-background text-foreground hover:border-primary hover:text-primary transition-colors text-center"
                  >
                    <Clock className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-lg font-bold">{time >= 60 ? `${time / 60}h` : `${time}min`}</span>
                  </motion.button>
                ))}
              </div>
              <div className="flex justify-center pt-2">
                <VoiceButton onTranscript={handleVoice} />
              </div>
              <p className="text-center text-xs text-muted-foreground">
                {lang === 'en' ? 'Or say the time in minutes' : 'Ou diga o tempo em minutos'}
              </p>
            </motion.div>
          )}

          {step === 'profile' && (
            <motion.div
              key="step-profile"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-4"
            >
              <p className="text-sm text-muted-foreground mb-4">
                {t('planejar.perfil')}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {profileOptions.map((p) => (
                  <motion.button
                    key={p.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelectProfile(p.id)}
                    className="p-5 border border-border bg-background text-foreground hover:border-primary hover:text-primary transition-colors text-center"
                  >
                    <Users className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                    <span className="text-sm font-bold">{lang === 'en' ? p.labelEn : p.label}</span>
                  </motion.button>
                ))}
              </div>
              <button
                onClick={() => setStep('time')}
                className="text-xs text-muted-foreground underline mt-2 block mx-auto"
              >
                {t('common.voltar')}
              </button>
            </motion.div>
          )}

          {step === 'themes' && (
            <motion.div
              key="step-themes"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-4"
            >
              <p className="text-sm text-muted-foreground mb-4">
                {t('planejar.temas')}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {themeOptions.map((theme) => {
                  const selected = selectedThemes.includes(theme.id);
                  return (
                    <motion.button
                      key={theme.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleTheme(theme.id)}
                      className={`p-4 border text-sm font-bold text-center transition-colors ${
                        selected
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background text-foreground hover:border-primary'
                      }`}
                    >
                      <Palette className="w-4 h-4 mx-auto mb-1" />
                      {lang === 'en' ? theme.labelEn : theme.label}
                    </motion.button>
                  );
                })}
              </div>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={generateRoute}
                className="w-full py-4 bg-primary text-primary-foreground font-black text-base mt-4 hover:bg-primary/90 transition-colors"
              >
                {t('planejar.gerar')} →
              </motion.button>
              <button
                onClick={() => setStep('profile')}
                className="text-xs text-muted-foreground underline block mx-auto"
              >
                {t('common.voltar')}
              </button>
            </motion.div>
          )}

          {step === 'result' && suggested.length > 0 && (
            <motion.div
              key="step-result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="bg-primary/10 border border-primary p-4 mb-2">
                <p className="text-xs font-semibold uppercase text-primary tracking-wider mb-1">
                  {t('planejar.step4')}
                </p>
                <p className="text-foreground text-sm">
                  <span className="font-bold">{suggested.length} {suggested.length === 1 ? 'exposição' : 'exposições'}</span> ·{' '}
                  aprox. <span className="font-bold">{totalDuration} minutos</span> ·{' '}
                  {lang === 'en'
                    ? profileOptions.find(p => p.id === selectedProfile)?.labelEn
                    : profileOptions.find(p => p.id === selectedProfile)?.label}
                </p>
                {selectedThemes.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {lang === 'en' ? 'Topics' : 'Temas'}: {selectedThemes.map(t => {
                      const opt = themeOptions.find(o => o.id === t);
                      return lang === 'en' ? opt?.labelEn : opt?.label;
                    }).join(', ')}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-black text-foreground">{t('planejar.roteiro')}</h2>
                <button onClick={handleReset} className="flex items-center gap-1 text-primary text-xs font-semibold">
                  <RotateCcw className="w-4 h-4" /> {t('planejar.recomecar')}
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
                    <img src={expo.image} alt={expo.title} className="w-16 h-16 object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-foreground truncate group-hover:text-primary transition-colors">
                          {expo.artist}: {expo.title}
                        </p>
                        {expo.isMainExhibition && (
                          <span className="shrink-0 text-[10px] font-bold uppercase bg-primary text-primary-foreground px-1.5 py-0.5">
                            {t('planejar.principal')}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{expo.floor} | aprox. {expo.duration} min</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
                    <span>{selectedExpo.floor}</span>
                    <span>Aprox. {selectedExpo.duration} min</span>
                  </div>
                  <p className="text-foreground leading-relaxed">{selectedExpo.description}</p>
                  <button
                    onClick={() => setSelectedExpo(null)}
                    className="mt-6 w-full py-3 bg-primary text-primary-foreground font-bold text-center"
                  >
                    {t('common.fechar')}
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
