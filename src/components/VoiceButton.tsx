import { Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoice } from '@/hooks/useVoice';
import { useLanguage } from '@/contexts/LanguageContext';

interface VoiceButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export function VoiceButton({ onTranscript, className = '' }: VoiceButtonProps) {
  const { isListening, transcript, startListening, stopListening } = useVoice();
  const { t } = useLanguage();

  const handleToggle = () => {
    if (isListening) {
      stopListening();
      if (transcript) onTranscript(transcript);
    } else {
      startListening();
    }
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <motion.button
        onClick={handleToggle}
        whileTap={{ scale: 0.9 }}
        className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
          isListening ? 'bg-primary' : 'bg-masp-black'
        }`}
      >
        <AnimatePresence mode="wait">
          {isListening ? (
            <motion.div key="on" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <MicOff className="w-6 h-6 text-primary-foreground" />
            </motion.div>
          ) : (
            <motion.div key="off" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <Mic className="w-6 h-6 text-primary-foreground" />
            </motion.div>
          )}
        </AnimatePresence>
        {isListening && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        )}
      </motion.button>
      <span className="text-xs text-muted-foreground">
        {isListening ? t('common.ouvindo') : t('common.falar')}
      </span>
    </div>
  );
}
