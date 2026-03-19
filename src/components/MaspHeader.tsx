import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

interface MaspHeaderProps {
  onEndSession?: () => void;
}

export function MaspHeader({ onEndSession }: MaspHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        {!isHome ? (
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Menu</span>
          </button>
        ) : onEndSession ? (
          <button onClick={onEndSession} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <LogOut className="w-4 h-4" />
            <span className="text-xs font-medium">Encerrar</span>
          </button>
        ) : (
          <div />
        )}
        <motion.button
          onClick={() => navigate('/')}
          whileTap={{ scale: 0.97 }}
          className="absolute left-1/2 -translate-x-1/2"
        >
          <span className="text-primary font-black text-3xl tracking-tighter">MASP</span>
        </motion.button>
        <div className="w-16" />
      </div>
    </header>
  );
}
