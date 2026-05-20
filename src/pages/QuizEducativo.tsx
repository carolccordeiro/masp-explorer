import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, X, RotateCcw, Landmark, Palette, Frame, Scissors, BookOpen, Coffee } from 'lucide-react';
import { MaspHeader } from '@/components/MaspHeader';
import { quizCategories, QuizCategory, QuizQuestion } from '@/data/quizzes';
import { exhibitions } from '@/data/exhibitions';
import { useVoice } from '@/hooks/useVoice';
import { CouponModal } from '@/components/CouponModal';
import { useLanguage } from '@/contexts/LanguageContext';

const iconMap: Record<string, React.ReactNode> = {
  landmark: <Landmark className="w-7 h-7" />,
  palette: <Palette className="w-7 h-7" />,
  frame: <Frame className="w-7 h-7" />,
  scissors: <Scissors className="w-7 h-7" />,
  'book-open': <BookOpen className="w-7 h-7" />,
};

// Map each quiz category to an exhibition image when possible, so the cards show
// the real artwork instead of a generic icon. The fallback keeps the lucide icon.
const categoryImageMap: Record<string, string | undefined> = {
  'expo-chola': exhibitions.find((e) => e.artist === 'La Chola Poblete')?.image,
  'expo-gamarra': exhibitions.find((e) => e.artist === 'Sandra Gamarra Heshiki')?.image,
  'expo-alarcon': exhibitions.find((e) => e.artist === 'Claudia Alarcón & Silät')?.image,
  acervo: exhibitions.find((e) => e.title === 'Acervo em Transformação')?.image,
  // 'masp' fica sem imagem específica, usa o ícone landmark
};

export default function QuizEducativo() {
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);
  const { speak } = useVoice();
  const { t } = useLanguage();

  const startQuiz = (cat: QuizCategory) => {
    setSelectedCategory(cat);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setFinished(false);
  };

  const currentQuestion: QuizQuestion | null = selectedCategory
    ? selectedCategory.questions[currentIndex]
    : null;

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    const correct = index === currentQuestion!.correctIndex;
    if (correct) setScore((s) => s + 1);
  };

  const nextQuestion = () => {
    if (currentIndex + 1 >= selectedCategory!.questions.length) {
      setFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
    }
  };

  const reset = () => {
    setSelectedCategory(null);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setFinished(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <MaspHeader />

      <div className="px-6 py-10 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <span className="editorial-eyebrow">
            <span className="editorial-rule-long" />
            {t('quiz.titulo').toUpperCase()}
          </span>
          <h1 className="font-display text-5xl md:text-6xl text-foreground mt-3 leading-[0.95]">
            {selectedCategory ? (
              <>
                <span className="font-bold">{selectedCategory.title}</span>
              </>
            ) : (
              t('quiz.titulo')
            )}
          </h1>
          <p className="text-muted-foreground text-base mt-4 mb-10 max-w-md leading-relaxed">
            {selectedCategory ? selectedCategory.description : t('quiz.escolha')}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Category selection */}
          {!selectedCategory && (
            <motion.div
              key="categories"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {quizCategories.map((cat, i) => {
                const img = categoryImageMap[cat.id];
                return (
                  <motion.button
                    key={cat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => startQuiz(cat)}
                    className="w-full flex items-center gap-4 p-3 border border-border hover:border-primary transition-colors text-left group overflow-hidden"
                  >
                    {img ? (
                      <div className="w-20 h-20 shrink-0 overflow-hidden">
                        <img
                          src={img}
                          alt={cat.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        {iconMap[cat.iconName]}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {cat.questions.length} {t('quiz.perguntas')}
                      </span>
                      <h3 className="font-bold text-foreground group-hover:text-primary transition-colors mt-0.5">{cat.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-1">{cat.description}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </motion.button>
                );
              })}
            </motion.div>
          )}

          {/* Quiz in progress */}
          {selectedCategory && !finished && currentQuestion && (
            <motion.div
              key={`q-${currentIndex}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground tabular-nums">
                  {String(currentIndex + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 h-px bg-muted relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentIndex + 1) / selectedCategory.questions.length) * 100}%` }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-y-0 left-0 bg-primary"
                    style={{ height: '2px', top: '-0.5px' }}
                  />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground tabular-nums">
                  / {String(selectedCategory.questions.length).padStart(2, '0')}
                </span>
              </div>

              <h2 className="font-display text-3xl md:text-4xl text-foreground leading-[1.05]">
                {currentQuestion.question}
              </h2>

              <div className="space-y-3">
                {currentQuestion.options.map((opt, i) => {
                  const isSelected = selectedAnswer === i;
                  const isCorrect = i === currentQuestion.correctIndex;
                  const showResult = selectedAnswer !== null;

                  let borderClass = 'border-border';
                  let bgClass = 'bg-background';
                  if (showResult && isCorrect) {
                    borderClass = 'border-green-500';
                    bgClass = 'bg-green-50';
                  } else if (showResult && isSelected && !isCorrect) {
                    borderClass = 'border-destructive';
                    bgClass = 'bg-red-50';
                  }

                  return (
                    <motion.button
                      key={i}
                      whileTap={!showResult ? { scale: 0.98 } : {}}
                      onClick={() => handleAnswer(i)}
                      disabled={showResult}
                      className={`w-full flex items-center gap-3 p-4 border ${borderClass} ${bgClass} text-left transition-colors`}
                    >
                      <span className="w-8 h-8 border border-border flex items-center justify-center text-sm font-bold text-muted-foreground shrink-0">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="flex-1 text-foreground font-medium">{opt}</span>
                      {showResult && isCorrect && <Check className="w-5 h-5 text-green-600" />}
                      {showResult && isSelected && !isCorrect && <X className="w-5 h-5 text-destructive" />}
                    </motion.button>
                  );
                })}
              </div>

              {selectedAnswer !== null && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="p-4 bg-masp-light border-l-4 border-primary">
                    <p className="text-sm text-foreground">{currentQuestion.explanation}</p>
                  </div>
                  <button
                    onClick={nextQuestion}
                    className="w-full py-4 bg-primary text-primary-foreground font-bold"
                  >
                    {currentIndex + 1 < selectedCategory.questions.length ? t('quiz.proxima') : t('quiz.resultado')}
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Results */}
          {finished && selectedCategory && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-center py-12"
            >
              <span className="editorial-eyebrow">
                <span className="editorial-rule" />
                Fim do quiz
              </span>
              <div className="my-8 flex flex-col items-center">
                <span className="font-display text-[clamp(8rem,18vw,12rem)] text-primary leading-[0.8] tabular-nums">
                  {score}
                </span>
                <span className="font-bold text-xl text-muted-foreground mt-2">
                  de {selectedCategory.questions.length} perguntas
                </span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl text-foreground mb-3">
                {score === selectedCategory.questions.length
                  ? t('quiz.excelente')
                  : score >= selectedCategory.questions.length / 2
                  ? t('quiz.muitobem')
                  : t('quiz.continue')}
              </h2>
              <p className="text-muted-foreground mb-10 max-w-sm mx-auto">
                {t('quiz.acertou')} {score} {t('quiz.de')} {selectedCategory.questions.length} {t('quiz.perguntas')}
              </p>

              {score >= Math.ceil(selectedCategory.questions.length * 0.8) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-6 p-5 border-2 border-dashed border-primary bg-primary/5"
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Coffee className="w-5 h-5 text-primary" />
                    <span className="font-black text-foreground">{t('quiz.parabens')}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {t('quiz.desconto')}
                  </p>
                  <button
                    onClick={() => setShowCoupon(true)}
                    className="w-full py-3 bg-primary text-primary-foreground font-bold"
                  >
                    {t('quiz.resgatar')}
                  </button>
                </motion.div>
              )}

              <div className="space-y-3">
                <button
                  onClick={() => startQuiz(selectedCategory)}
                  className="w-full flex items-center justify-center gap-2 py-4 border border-primary text-primary font-bold"
                >
                  <RotateCcw className="w-4 h-4" /> {t('quiz.novamente')}
                </button>
                <button
                  onClick={reset}
                  className="w-full py-4 bg-primary text-primary-foreground font-bold"
                >
                  {t('quiz.outro')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <CouponModal isOpen={showCoupon} onClose={() => setShowCoupon(false)} />
    </div>
  );
}
