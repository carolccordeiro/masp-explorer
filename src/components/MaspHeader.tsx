import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, LogOut, Globe, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVoice } from '@/hooks/useVoice';

interface MaspHeaderProps {
  onEndSession?: () => void;
}

// Pull the user-facing text from the page, skipping the header/footer.
// Used by the "Ouvir esta tela" button to narrate the content.
function getReadableText(): string {
  const main = document.querySelector('main, [data-narratable], section');
  const root = (main as HTMLElement) || document.body;
  const clone = root.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('header, footer, nav, script, style, [aria-hidden="true"]').forEach((el) => el.remove());
  return (clone.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 800);
}

export function MaspHeader({ onEndSession }: MaspHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { lang, setLang, t } = useLanguage();
  const { speak, stopSpeaking, isSpeaking } = useVoice();

  const toggleLang = () => setLang(lang === 'pt' ? 'en' : 'pt');

  const handleNarrate = () => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }
    const text = getReadableText();
    if (text) speak(text);
  };

  // Stop narration on route change so the user doesn't carry audio across pages.
  useEffect(() => {
    return () => stopSpeaking();
  }, [location.pathname, stopSpeaking]);

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        {!isHome ? (
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">{t('header.menu')}</span>
          </button>
        ) : onEndSession ? (
          <button onClick={onEndSession} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <LogOut className="w-4 h-4" />
            <span className="text-xs font-medium">{t('header.encerrar')}</span>
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
        <div className="flex items-center gap-3">
          <button
            onClick={handleNarrate}
            className={`flex items-center gap-1.5 transition-colors ${
              isSpeaking ? 'text-primary' : 'text-muted-foreground hover:text-primary'
            }`}
            aria-label={isSpeaking ? t('header.parar') : t('header.ouvir')}
            aria-pressed={isSpeaking}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="text-xs font-bold uppercase">{isSpeaking ? t('header.parar') : t('header.ouvir')}</span>
          </button>
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">{lang === 'pt' ? 'EN' : 'PT'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
