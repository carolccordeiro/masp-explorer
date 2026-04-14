import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, HelpCircle, Info, Coffee, Sparkles, Map, Heart, Shield, Store } from 'lucide-react';
import { CouponModal } from '@/components/CouponModal';
import { VoiceButton } from '@/components/VoiceButton';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { MaspHeader } from '@/components/MaspHeader';
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
  const { t } = useLanguage();
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
    { title: t('menu.parceiros'), description: t('menu.parceiros.desc'), icon: Store, path: '/parceiros', color: 'bg-masp-black' },
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

      <div className="px-6 py-8 text-center">
        <h2 className="text-2xl font-black text-foreground mb-2">{t('index.bemvindo')}</h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          {t('index.intro').split('KORA').map((part, i, arr) =>
            i < arr.length - 1 ? (
              <span key={i}>{part}<span className="text-primary font-bold">KORA</span></span>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="px-6 flex-1 grid grid-cols-1 md:grid-cols-2 gap-3"
      >
        {menuItems.map((mi) => (
          <motion.button
            key={mi.path}
            variants={item}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(mi.path)}
            className="w-full flex items-center gap-4 p-4 bg-background border border-border hover:border-primary transition-colors text-left group"
          >
            <div className={`w-12 h-12 ${mi.color} flex items-center justify-center shrink-0`}>
              <mi.icon className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">{mi.title}</h3>
              <p className="text-xs text-muted-foreground">{mi.description}</p>
            </div>
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

      <CouponModal isOpen={couponOpen} onClose={() => setCouponOpen(false)} />
    </div>
  );
}
