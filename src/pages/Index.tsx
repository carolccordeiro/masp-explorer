import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, HelpCircle, Info, Coffee, Sparkles, Map, Heart, Shield } from 'lucide-react';
import { CouponModal } from '@/components/CouponModal';
import { VoiceButton } from '@/components/VoiceButton';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { MaspHeader } from '@/components/MaspHeader';

const menuItems = [
  {
    title: 'Planejar Visita',
    description: 'Roteiro personalizado em segundos',
    icon: Calendar,
    path: '/planejar',
    color: 'bg-primary',
  },
  {
    title: 'Assistente IA',
    description: 'Converse com nossa IA sobre arte',
    icon: Sparkles,
    path: '/assistente',
    color: 'bg-primary',
  },
  {
    title: 'Mapa Interativo',
    description: 'Explore cada andar',
    icon: Map,
    path: '/mapa',
    color: 'bg-primary',
  },
  {
    title: 'Minha Coleção',
    description: 'Salve obras e exposições favoritas',
    icon: Heart,
    path: '/colecao',
    color: 'bg-primary',
  },
  {
    title: 'Quiz Educativo',
    description: 'Quiz e caça ao tesouro nas exposições',
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
  {
    title: 'Dados de Uso',
    description: 'Transparência dos seus dados',
    icon: Shield,
    path: '/dados',
    color: 'bg-masp-black',
  },
];

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
  const [couponOpen, setCouponOpen] = useState(false);
  const [started, setStarted] = useState(() => {
    return sessionStorage.getItem('masp-started') === 'true';
  });

  const handleStart = () => {
    setStarted(true);
    sessionStorage.setItem('masp-started', 'true');
  };

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
    } else if (lower.includes('mapa') || lower.includes('andar') || lower.includes('prédio')) {
      navigate('/mapa');
    } else if (lower.includes('coleção') || lower.includes('favorit') || lower.includes('salv')) {
      navigate('/colecao');
    } else if (lower.includes('dado') || lower.includes('privacidade') || lower.includes('lgpd')) {
      navigate('/dados');
    }
  };

  const handleEndSession = () => {
    setStarted(false);
    sessionStorage.removeItem('masp-started');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Welcome Screen */}
      <AnimatePresence>
        {!started && <WelcomeScreen onStart={handleStart} />}
      </AnimatePresence>

      {/* Header with end session */}
      <MaspHeader onEndSession={handleEndSession} />

      {/* Welcome */}
      <div className="px-6 py-8 text-center">
        <h2 className="text-2xl font-black text-foreground mb-2">Bem-vindo ao MASP!</h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Sou o <span className="text-primary font-bold">KORA</span>, seu guia interativo. Diga quanto tempo você tem e eu crio um roteiro personalizado só para você.
        </p>
      </div>

      {/* Menu */}
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

      {/* Bottom section */}
      <div className="px-6 py-6 space-y-4">
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
          Diga "Planejar visita", "Quiz", "Mapa", "Assistente" ou "Informações"
        </p>
      </div>

      <CouponModal isOpen={couponOpen} onClose={() => setCouponOpen(false)} />
    </div>
  );
}
