import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, HelpCircle, Info, Coffee, Sparkles } from 'lucide-react';
import { CouponModal } from '@/components/CouponModal';
import { VoiceButton } from '@/components/VoiceButton';
import { WelcomeScreen } from '@/components/WelcomeScreen';

const menuItems = [
  {
    title: 'Planejar Visita',
    description: 'Monte seu roteiro ideal',
    icon: Calendar,
    path: '/planejar',
    color: 'bg-primary',
  },
  {
    title: 'Assistente IA',
    description: 'Pergunte sobre o MASP',
    icon: Sparkles,
    path: '/assistente',
    color: 'bg-primary',
  },
  {
    title: 'Quiz Educativo',
    description: 'Teste seus conhecimentos',
    icon: HelpCircle,
    path: '/quiz',
    color: 'bg-masp-black',
  },
  {
    title: 'Informações',
    description: 'Saiba tudo sobre o MASP',
    icon: Info,
    path: '/informacoes',
    color: 'bg-masp-black',
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Index() {
  const navigate = useNavigate();
  const [couponOpen, setCouponOpen] = useState(false);
  const [started, setStarted] = useState(false);

  const handleVoice = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('planejar') || lower.includes('visita') || lower.includes('roteiro')) {
      navigate('/planejar');
    } else if (lower.includes('quiz') || lower.includes('jogo') || lower.includes('pergunta')) {
      navigate('/quiz');
    } else if (lower.includes('informaç') || lower.includes('sobre') || lower.includes('horário')) {
      navigate('/informacoes');
    } else if (lower.includes('café') || lower.includes('cupom') || lower.includes('desconto')) {
      setCouponOpen(true);
    } else if (lower.includes('assistente') || lower.includes('ia') || lower.includes('chat') || lower.includes('pergun')) {
      navigate('/assistente');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Welcome Screen */}
      <AnimatePresence>
        {!started && <WelcomeScreen onStart={() => setStarted(true)} />}
      </AnimatePresence>

      {/* Hero */}
      <div className="bg-primary px-6 pt-12 pb-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-black text-primary-foreground tracking-tighter mb-2"
        >
          MASP
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-primary-foreground/80 text-sm font-medium tracking-wide uppercase"
        >
          Museu de Arte de São Paulo
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-primary-foreground/60 text-xs mt-1"
        >
          Totem Interativo
        </motion.p>
      </div>

      {/* Welcome */}
      <div className="px-6 py-8 text-center">
        <h2 className="text-2xl font-black text-foreground mb-2">Bem-vindo ao MASP!</h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Explore as exposições, planeje sua visita, converse com nossa IA ou teste seus conhecimentos sobre arte.
        </p>
      </div>

      {/* Menu */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="px-6 flex-1 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {menuItems.map((mi) => (
          <motion.button
            key={mi.path}
            variants={item}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(mi.path)}
            className="w-full flex items-center gap-5 p-5 bg-background border border-border hover:border-primary transition-colors text-left group"
          >
            <div className={`w-14 h-14 ${mi.color} flex items-center justify-center shrink-0`}>
              <mi.icon className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{mi.title}</h3>
              <p className="text-sm text-muted-foreground">{mi.description}</p>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Bottom section */}
      <div className="px-6 py-8 space-y-4">
        {/* Coupon CTA */}
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
            <p className="text-sm font-bold text-primary">15% OFF no Café do MASP</p>
            <p className="text-xs text-muted-foreground">Toque para ganhar seu cupom</p>
          </div>
        </motion.button>

        {/* Voice */}
        <div className="flex justify-center pt-2">
          <VoiceButton onTranscript={handleVoice} />
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Diga "Planejar visita", "Quiz", "Assistente" ou "Informações"
        </p>
      </div>

      <CouponModal isOpen={couponOpen} onClose={() => setCouponOpen(false)} />
    </div>
  );
}
