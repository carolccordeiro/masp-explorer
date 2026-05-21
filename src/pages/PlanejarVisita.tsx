import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronRight, RotateCcw, Users, Palette, Smartphone, ArrowLeft } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { MaspHeader } from '@/components/MaspHeader';
import { VoiceButton } from '@/components/VoiceButton';
import { RecommenderPanel } from '@/components/RecommenderPanel';
import { exhibitions, Exhibition } from '@/data/exhibitions';
import { useVoice } from '@/hooks/useVoice';
import { useLanguage } from '@/contexts/LanguageContext';
import { recommend, Recommendation } from '@/lib/recommender';

const timeOptions = [30, 60, 90, 120, 180];

const profileOptions = [
  { id: 'solo', label: 'Sozinho(a)', labelEn: 'Solo' },
  { id: 'casal', label: 'Casal', labelEn: 'Couple' },
  { id: 'familia', label: 'Família com crianças', labelEn: 'Family with children' },
  { id: 'grupo', label: 'Grupo / Turma', labelEn: 'Group / Class' },
];

// Categorias seguem a proposta curatorial anual do MASP 2026, com seis ciclos
// tematicos publicados no guia do ano. Foi atualizado a partir do feedback
// dos visitantes da Sprint 3, que pediram correspondencia com o linguajar
// oficial do museu.
const themeOptions = [
  { id: 'arte-classica', label: 'Arte Clássica', labelEn: 'Classical Art' },
  { id: 'arte-moderna', label: 'Arte Moderna', labelEn: 'Modern Art' },
  { id: 'arte-contemporanea', label: 'Arte Contemporânea', labelEn: 'Contemporary Art' },
  { id: 'historia-brasil', label: 'História do Brasil', labelEn: 'Brazilian History' },
  { id: 'historia-geral', label: 'História Geral', labelEn: 'General History' },
  { id: 'historias-latam', label: 'Histórias Latino-Americanas', labelEn: 'Latin American Stories' },
];

const themeToCategoryMap: Record<string, string[]> = {
  'arte-classica': ['Acervo Permanente', 'Acervo', 'Pintura', 'Clássica', 'Renascimento'],
  'arte-moderna': ['Arte Moderna', 'Modernismo', 'Pintura'],
  'arte-contemporanea': ['Arte Contemporânea', 'Contemporâneo', 'Instalação', 'Videoarte'],
  'historia-brasil': ['Arte Brasileira', 'História', 'Brasil', 'Modernismo'],
  'historia-geral': ['Acervo Permanente', 'Acervo', 'Retrospectiva'],
  'historias-latam': ['Latino-Americana', 'Têxtil', 'Pop Andino', 'Instalação', 'Retrospectiva'],
};

type Step = 'time' | 'profile' | 'themes' | 'result';

export default function PlanejarVisita() {
  const [step, setStep] = useState<Step>('time');
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [suggested, setSuggested] = useState<Exhibition[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selectedExpo, setSelectedExpo] = useState<Exhibition | null>(null);
  const { speak } = useVoice();
  const { lang, t } = useLanguage();

  const handleSelectTime = (minutes: number) => {
    setSelectedTime(minutes);
    setStep('profile');
  };

  const handleSelectProfile = (profileId: string) => {
    setSelectedProfile(profileId);
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

    // Roda o recomendador IA em paralelo: similaridade de cosseno entre
    // o vetor de preferencia (temas + duracao) e o vetor de features de cada
    // exposicao. Resultado alimenta o RecommenderPanel.
    const recs = recommend(exhibitions, {
      selectedThemes,
      minutes,
    });
    setRecommendations(recs);

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
          <span className="editorial-eyebrow"><span className="editorial-rule" />MASP · KORA</span>
          <h1 className="text-3xl font-black text-foreground mt-2 leading-tight">{t('planejar.titulo')}</h1>
          <p className="text-primary text-xs font-semibold uppercase tracking-widest mt-2 mb-6">
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
                    <span className="text-lg font-bold">
                      {time >= 60
                        ? time % 60 === 0
                          ? `${time / 60}h`
                          : `${Math.floor(time / 60)}:${String(time % 60).padStart(2, '0')}h`
                        : `${time}min`}
                    </span>
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
                className="mt-4 flex items-center gap-2 px-4 py-3 border-2 border-foreground text-foreground font-black text-xs uppercase tracking-[0.18em] hover:bg-foreground hover:text-background transition-colors mx-auto"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
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
                className="mt-2 flex items-center gap-2 px-4 py-3 border-2 border-foreground text-foreground font-black text-xs uppercase tracking-[0.18em] hover:bg-foreground hover:text-background transition-colors mx-auto"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
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
                  <span className="font-bold">
                    {suggested.length} {lang === 'en'
                      ? (suggested.length === 1 ? 'exhibition' : 'exhibitions')
                      : (suggested.length === 1 ? 'exposição' : 'exposições')}
                  </span> ·{' '}
                  {lang === 'en' ? 'approx.' : 'aprox.'} <span className="font-bold">{totalDuration} {lang === 'en' ? 'minutes' : 'minutos'}</span> ·{' '}
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

              {/* Painel "MATCH IA": ranking e visualizacao 2D do recomendador */}
              <RecommenderPanel
                recommendations={recommendations}
                topK={Math.min(4, suggested.length)}
                lang={lang}
              />

              {/* QR Code "Leve sua visita" pro celular do visitante.
                  Substitui o antigo CTA de caca ao tesouro (removido porque
                  o totem e fixo). O visitante escaneia, sai com o roteiro
                  no celular pra percorrer o museu. Sem dados pessoais. */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mb-8 border-2 border-foreground bg-background grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 p-6 md:p-8 items-center"
              >
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                    <Smartphone className="w-3 h-3" />
                    {lang === 'en' ? 'Take it with you' : 'Leve sua visita'}
                  </span>
                  <h3 className="font-display text-2xl md:text-3xl text-foreground uppercase mt-2 leading-tight">
                    {lang === 'en'
                      ? 'Open the itinerary on your phone'
                      : 'Abra o roteiro no seu celular'}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed max-w-md">
                    {lang === 'en'
                      ? 'Point your phone camera at the QR code to open this itinerary on the go. No login, no email, no personal data.'
                      : 'Aponte a câmera do celular para o código ao lado e leve este roteiro no seu bolso ao percorrer o museu. Sem login, sem e-mail, sem dado pessoal.'}
                  </p>
                </div>
                <div className="bg-background border-2 border-foreground p-3 shrink-0 mx-auto">
                  <QRCodeSVG
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/roteiro?r=${suggested.map(e => e.id).join(',')}&t=${totalDuration}`}
                    size={160}
                    fgColor="hsl(var(--foreground))"
                    bgColor="hsl(var(--background))"
                    level="M"
                    marginSize={2}
                  />
                </div>
              </motion.div>

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
