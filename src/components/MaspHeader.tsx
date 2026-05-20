import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, LogOut, Globe, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVoice } from '@/hooks/useVoice';
import { A11yMenu } from '@/components/A11yMenu';

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

// Lina Bo Bardi quotes revealed when the visitor taps the MASP logo 5 times.
// Small easter egg in the brutalist spirit of the museum.
const LINA_QUOTES = [
  'A arquitetura nasce da vida do povo.',
  'O dever do artista é a vida.',
  'Eu acho que a coisa mais importante é a vida.',
  'Não existe arquitetura sem o homem.',
  'A simplicidade não é o resultado de um vazio, é o resultado de uma renúncia.',
];

export function MaspHeader({ onEndSession }: MaspHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { lang, setLang, t } = useLanguage();
  const { speak, stopSpeaking, isSpeaking } = useVoice();
  const [linaQuote, setLinaQuote] = useState<string | null>(null);
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggleLang = () => setLang(lang === 'pt' ? 'en' : 'pt');

  // Easter egg: 5 toques rápidos no logo MASP revelam um quote da Lina.
  const handleLogoTap = () => {
    tapCount.current += 1;
    if (tapTimer.current) clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => { tapCount.current = 0; }, 1200);

    if (tapCount.current >= 5) {
      tapCount.current = 0;
      const quote = LINA_QUOTES[Math.floor(Math.random() * LINA_QUOTES.length)];
      setLinaQuote(quote);
      setTimeout(() => setLinaQuote(null), 6000);
    } else {
      navigate('/');
    }
  };

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
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 gap-2">
        {!isHome ? (
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors shrink-0"
            title={t('header.menu')}
            aria-label={t('header.menu')}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium hidden lg:inline">{t('header.menu')}</span>
          </button>
        ) : onEndSession ? (
          <button
            onClick={onEndSession}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors shrink-0"
            title={t('header.encerrar')}
            aria-label={t('header.encerrar')}
          >
            <LogOut className="w-4 h-4" />
            <span className="text-xs font-medium hidden lg:inline">{t('header.encerrar')}</span>
          </button>
        ) : (
          <div />
        )}
        <motion.button
          onClick={handleLogoTap}
          whileTap={{ scale: 0.97 }}
          className="absolute left-1/2 -translate-x-1/2"
          aria-label="MASP"
        >
          <span className="text-primary font-black text-2xl sm:text-3xl tracking-tighter">MASP</span>
        </motion.button>
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <button
            onClick={handleNarrate}
            className={`flex items-center gap-1.5 transition-colors ${
              isSpeaking ? 'text-primary' : 'text-muted-foreground hover:text-primary'
            }`}
            aria-label={isSpeaking ? t('header.parar') : t('header.ouvir')}
            aria-pressed={isSpeaking}
            title={isSpeaking ? t('header.parar') : t('header.ouvir')}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="text-xs font-bold uppercase hidden lg:inline">{isSpeaking ? t('header.parar') : t('header.ouvir')}</span>
          </button>
          <A11yMenu />
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
            title={lang === 'pt' ? 'English' : 'Português'}
            aria-label={lang === 'pt' ? 'English' : 'Português'}
          >
            <Globe className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">{lang === 'pt' ? 'EN' : 'PT'}</span>
          </button>
        </div>
      </div>

      {/* Lina Bo Bardi easter egg overlay */}
      <AnimatePresence>
        {linaQuote && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full left-0 right-0 bg-foreground text-background overflow-hidden"
          >
            <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
              <span className="text-[10px] font-black tracking-[0.3em] uppercase text-primary shrink-0">
                Lina Bo Bardi
              </span>
              <span className="block w-8 h-[2px] bg-primary shrink-0" />
              <p className="font-display text-base md:text-lg leading-tight italic">
                "{linaQuote}"
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
