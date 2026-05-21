import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Página 404 brutalista MASP.
 * Identidade visual coerente com o resto do totem: vermelho cavalete,
 * tipografia Inter peso 900, regua de 4px. Mostra a rota tentada e
 * oferece duas saídas: voltar pra rota anterior ou ir pro menu inicial.
 */
const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { lang } = useLanguage();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b-2 border-foreground">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            aria-label={lang === 'en' ? 'Back to menu' : 'Voltar ao menu'}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-[0.18em]">
              {lang === 'en' ? 'Back to menu' : 'Voltar ao menu'}
            </span>
          </button>
          <span className="text-primary font-black text-2xl tracking-tighter">MASP</span>
          <span className="text-[10px] font-black tracking-[0.3em] uppercase text-muted-foreground hidden sm:inline">
            {lang === 'en' ? 'Error 404' : 'Erro 404'}
          </span>
        </div>
      </header>

      <main className="flex-1 flex items-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto w-full"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-3">
            <span className="block w-12 h-[2px] bg-primary" />
            {lang === 'en' ? 'Page not found' : 'Página não encontrada'}
          </span>

          <h1 className="font-display text-[clamp(8rem,28vw,20rem)] text-foreground leading-[0.85] tnum mt-4">
            404
          </h1>

          <div className="brutalist-rule-red mt-6 w-24" />

          <h2 className="font-display text-3xl md:text-5xl text-foreground uppercase mt-8 leading-[1.05] max-w-2xl">
            {lang === 'en'
              ? 'This route does not exist on the totem.'
              : 'Esta rota não existe no totem.'}
          </h2>

          <p className="text-base text-muted-foreground mt-6 leading-relaxed max-w-xl">
            {lang === 'en' ? (
              <>
                You tried to access{' '}
                <code className="font-mono text-foreground bg-muted px-2 py-0.5 tabular-nums">
                  {location.pathname}
                </code>
                . Use the buttons below to go back or return to the main menu.
              </>
            ) : (
              <>
                Você tentou acessar{' '}
                <code className="font-mono text-foreground bg-muted px-2 py-0.5 tabular-nums">
                  {location.pathname}
                </code>
                . Use os botões abaixo para voltar ou ir ao menu principal.
              </>
            )}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-foreground text-background font-black text-xs uppercase tracking-[0.3em] hover:bg-primary transition-colors"
            >
              <Home className="w-4 h-4" />
              {lang === 'en' ? 'Go to menu' : 'Ir ao menu'}
            </button>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-foreground text-foreground font-black text-xs uppercase tracking-[0.3em] hover:bg-foreground hover:text-background transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {lang === 'en' ? 'Back to previous page' : 'Voltar à página anterior'}
            </button>
          </div>
        </motion.div>
      </main>

      <footer className="border-t border-border mx-6 py-4 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        <span>MASP · Av. Paulista, 1578</span>
        <span>{lang === 'en' ? 'Powered by KORA · Flexmedia' : 'Powered by KORA · Flexmedia'}</span>
      </footer>
    </div>
  );
};

export default NotFound;
