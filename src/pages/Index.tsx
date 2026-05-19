import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, HelpCircle, Info, Coffee, Sparkles, Map, Heart, Shield, ChevronRight, Clock, Camera } from 'lucide-react';
import { CouponModal } from '@/components/CouponModal';
import { VoiceButton } from '@/components/VoiceButton';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { MaspHeader } from '@/components/MaspHeader';
import { AdBanner } from '@/components/AdBanner';
import { EditorialHighlights } from '@/components/EditorialHighlights';
import { StatsStrip } from '@/components/StatsStrip';
import { useLanguage } from '@/contexts/LanguageContext';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Index() {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const [couponOpen, setCouponOpen] = useState(false);
  const [started, setStarted] = useState(() => {
    return sessionStorage.getItem('masp-started') === 'true';
  });

  const menuItems = [
    { title: t('menu.planejar'), description: t('menu.planejar.desc'), icon: Calendar, path: '/planejar', color: 'bg-primary' },
    { title: t('menu.assistente'), description: t('menu.assistente.desc'), icon: Sparkles, path: '/assistente', color: 'bg-primary' },
    { title: t('menu.mapa'), description: t('menu.mapa.desc'), icon: Map, path: '/mapa', color: 'bg-primary' },
    { title: t('menu.colecao'), description: t('menu.colecao.desc'), icon: Heart, path: '/colecao', color: 'bg-primary' },
    { title: t('menu.quiz'), description: t('menu.quiz.desc'), icon: HelpCircle, path: '/quiz', color: 'bg-masp-black' },
    { title: lang === 'en' ? 'Selfie at MASP' : 'Selfie no MASP', description: lang === 'en' ? 'Take your photo with the brutalist frame' : 'Sua foto com o quadro brutalista', icon: Camera, path: '/selfie', color: 'bg-masp-black' },
    { title: lang === 'en' ? '79 years of MASP' : '79 anos de MASP', description: lang === 'en' ? '1947 to 2026 timeline' : 'Linha do tempo 1947 a 2026', icon: Clock, path: '/sobre-masp', color: 'bg-masp-black' },
    { title: t('menu.info'), description: t('menu.info.desc'), icon: Info, path: '/informacoes', color: 'bg-masp-black' },
    { title: t('menu.dados'), description: t('menu.dados.desc'), icon: Shield, path: '/dados', color: 'bg-masp-black' },
  ];

  const handleStart = () => {
    setStarted(true);
    sessionStorage.setItem('masp-started', 'true');
  };

  const handleVoice = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('planejar') || lower.includes('visita') || lower.includes('roteiro') || lower.includes('plan')) {
      navigate('/planejar');
    } else if (lower.includes('quiz') || lower.includes('jogo') || lower.includes('pergunta') || lower.includes('game')) {
      navigate('/quiz');
    } else if (lower.includes('informaç') || lower.includes('sobre') || lower.includes('horário') || lower.includes('information')) {
      navigate('/informacoes');
    } else if (lower.includes('café') || lower.includes('cupom') || lower.includes('desconto') || lower.includes('coupon')) {
      setCouponOpen(true);
    } else if (lower.includes('assistente') || lower.includes('ia') || lower.includes('chat') || lower.includes('pergun') || lower.includes('assistant')) {
      navigate('/assistente');
    } else if (lower.includes('mapa') || lower.includes('andar') || lower.includes('prédio') || lower.includes('map') || lower.includes('floor')) {
      navigate('/mapa');
    } else if (lower.includes('coleção') || lower.includes('favorit') || lower.includes('salv') || lower.includes('collection')) {
      navigate('/colecao');
    } else if (lower.includes('dado') || lower.includes('privacidade') || lower.includes('lgpd') || lower.includes('data') || lower.includes('privacy')) {
      navigate('/dados');
    } else if (lower.includes('parceiro') || lower.includes('restaurante') || lower.includes('livraria') || lower.includes('partner')) {
      navigate('/parceiros');
    }
  };

  const handleEndSession = () => {
    setStarted(false);
    sessionStorage.removeItem('masp-started');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AnimatePresence>
        {!started && <WelcomeScreen onStart={handleStart} />}
      </AnimatePresence>

      <MaspHeader onEndSession={handleEndSession} />

      <section className="px-6 pt-10 pb-6">
        <span className="editorial-eyebrow">
          <span className="editorial-rule-long" />
          {t('index.bemvindo').toUpperCase()}
        </span>
        <h1 className="font-display text-5xl md:text-7xl text-foreground mt-4 max-w-2xl uppercase">
          {lang === 'en' ? <>Discover MASP,<br />your way.</> : <>Descubra o MASP,<br />do seu jeito.</>}
        </h1>
        <div className="brutalist-rule-red mt-6 w-24" />
        <p className="text-muted-foreground text-sm md:text-base mt-5 max-w-md leading-relaxed">
          {t('index.intro').split('KORA').map((part, i, arr) =>
            i < arr.length - 1 ? (
              <span key={i}>{part}<span className="font-black text-primary">KORA</span></span>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </p>
      </section>

      <StatsStrip />

      <EditorialHighlights />

      <AdBanner />

      <section className="px-6 pt-4 pb-2">
        <span className="editorial-eyebrow">
          <span className="editorial-rule-long" />
          {lang === 'en' ? 'Explore' : 'Explore'}
        </span>
        <h2 className="font-display text-2xl md:text-3xl text-foreground mt-2 mb-5 uppercase">
          {lang === 'en' ? 'What would you like to do?' : 'O que você quer fazer?'}
        </h2>
      </section>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="px-6 flex-1 grid grid-cols-1 md:grid-cols-2 gap-3"
      >
        {menuItems.map((mi, idx) => (
          <motion.button
            key={mi.path}
            variants={item}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(mi.path)}
            className="hover-lift relative w-full flex items-center gap-5 p-5 bg-background border border-border hover:border-primary text-left group overflow-hidden"
          >
            <span className="absolute top-3 right-3 text-[10px] font-mono text-muted-foreground/40 tabular-nums">
              {String(idx + 1).padStart(2, '0')}
            </span>
            <div className={`w-14 h-14 ${mi.color} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}>
              <mi.icon className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-tight">{mi.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{mi.description}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-0.5 shrink-0" />
          </motion.button>
        ))}
      </motion.div>

      <div className="px-6 py-6 space-y-4">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setCouponOpen(true)}
          className="w-full flex items-center gap-4 p-4 border-2 border-dashed border-primary bg-primary/5 text-left"
        >
          <Coffee className="w-6 h-6 text-primary shrink-0" />
          <div>
            <p className="text-sm font-bold text-primary">{t('menu.cupom')}</p>
            <p className="text-xs text-muted-foreground">{t('menu.cupom.desc')}</p>
          </div>
        </motion.button>

        <div className="flex justify-center pt-2">
          <VoiceButton onTranscript={handleVoice} />
        </div>
        <p className="text-center text-xs text-muted-foreground">
          {t('index.voz')}
        </p>
      </div>

      <footer className="hairline-top mx-6 mt-4 py-4 flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
        <span>MASP · Av. Paulista, 1578</span>
        <div className="flex items-center gap-4">
          {/* Link discreto pro console Flexmedia. Em producao seria autenticado. */}
          <button
            onClick={() => navigate('/admin')}
            className="hover:text-primary transition-colors"
            aria-label="Console Flexmedia, operador"
          >
            Console Flexmedia
          </button>
          <span className="text-muted-foreground/40">·</span>
          <span>Powered by KORA · Flexmedia</span>
        </div>
      </footer>

      <CouponModal isOpen={couponOpen} onClose={() => setCouponOpen(false)} />
    </div>
  );
}
