import { motion } from 'framer-motion';
import { Hand } from 'lucide-react';

interface IdleOverlayProps {
  visible: boolean;
  onTouch: () => void;
}

/**
 * IdleOverlay
 * Exibido quando o totem fica inativo por muito tempo.
 * Instrui o visitante a tocar na tela para iniciar uma nova sessão.
 */
export function IdleOverlay({ visible, onTouch }: IdleOverlayProps) {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="idle-overlay"
      onClick={onTouch}
      onTouchStart={onTouch}
    >
      {/* Logo / nome do museu */}
      <motion.div
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="text-center"
      >
        <p className="text-primary text-5xl font-black tracking-widest mb-1">MASP</p>
        <p className="text-white/40 text-sm tracking-widest uppercase">
          Museu de Arte de São Paulo
        </p>
      </motion.div>

      {/* Ícone de toque */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        className="flex flex-col items-center gap-3 mt-8"
      >
        <Hand className="w-16 h-16 text-white/60" />
        <p className="text-white/60 text-lg font-semibold tracking-wide">
          Toque para começar
        </p>
      </motion.div>

      {/* Endereço */}
      <p className="absolute bottom-8 text-white/20 text-xs tracking-widest">
        Av. Paulista, 1578 · São Paulo
      </p>
    </motion.div>
  );
}
