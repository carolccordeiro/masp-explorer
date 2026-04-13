import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, X, RotateCcw, Landmark, Palette, Frame, Scissors, BookOpen, Coffee } from 'lucide-react';
import { MaspHeader } from '@/components/MaspHeader';
import { quizCategories, QuizCategory, QuizQuestion } from '@/data/quizzes';
import { useVoice } from '@/hooks/useVoice';
import { CouponModal } from '@/components/CouponModal';

const iconMap: Record<string, React.ReactNode> = {
  landmark: <Landmark className="w-7 h-7" />,
  palette: <Palette className="w-7 h-7" />,
  frame: <Frame className="w-7 h-7" />,
  scissors: <Scissors className="w-7 h-7" />,
  'book-open': <BookOpen className="w-7 h-7" />,
};

export default function QuizEducativo() {
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);
  const { speak } = useVoice();

  const startQuiz = (cat: QuizCategory) => {
    setSelectedCategory(cat);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setFinished(false);
    speak(`Quiz: ${cat.title}. ${cat.questions[0].question}`);
  };

  const currentQuestion: QuizQuestion | null = selectedCategory
    ? selectedCategory.questions[currentIndex]
    : null;

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    const correct = index === currentQuestion!.correctIndex;
    if (correct) setScore((s) => s + 1);
    speak(correct ? 'Correto!' : `Incorreto. ${currentQuestion!.explanation}`);
  };

  const nextQuestion = () => {
    if (currentIndex + 1 >= selectedCategory!.questions.length) {
      setFinished(true);
      speak(`Fim do quiz! Você acertou ${score} de ${selectedCategory!.questions.length}.`);
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

      <div className="px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black text-foreground mb-2">Quiz Educativo</h1>
          <p className="text-muted-foreground text-sm mb-8">
            {selectedCategory ? selectedCategory.title : 'Escolha uma categoria para começar'}
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
              {quizCategories.map((cat, i) => (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => startQuiz(cat)}
                  className="w-full flex items-center gap-4 p-5 border border-border hover:border-primary transition-colors text-left group"
                >
                  <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    {iconMap[cat.iconName]}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{cat.title}</h3>
                    <p className="text-xs text-muted-foreground">{cat.description} | {cat.questions.length} perguntas</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </motion.button>
              ))}
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
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-muted">
                  <div
                    className="h-1 bg-primary transition-all"
                    style={{ width: `${((currentIndex + 1) / selectedCategory.questions.length) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  {currentIndex + 1}/{selectedCategory.questions.length}
                </span>
              </div>

              <h2 className="text-xl font-bold text-foreground leading-snug">{currentQuestion.question}</h2>

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
                    {currentIndex + 1 < selectedCategory.questions.length ? 'Próxima pergunta' : 'Ver resultado'}
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
              className="text-center py-8"
            >
              <div className="w-24 h-24 bg-primary mx-auto flex items-center justify-center mb-6">
                <span className="text-4xl font-black text-primary-foreground">
                  {score}/{selectedCategory.questions.length}
                </span>
              </div>
              <h2 className="text-2xl font-black text-foreground mb-2">
                {score === selectedCategory.questions.length
                  ? 'Excelente!'
                  : score >= selectedCategory.questions.length / 2
                  ? 'Muito bem!'
                  : 'Continue aprendendo!'}
              </h2>
              <p className="text-muted-foreground mb-8">
                Você acertou {score} de {selectedCategory.questions.length} perguntas
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => startQuiz(selectedCategory)}
                  className="w-full flex items-center justify-center gap-2 py-4 border border-primary text-primary font-bold"
                >
                  <RotateCcw className="w-4 h-4" /> Jogar novamente
                </button>
                <button
                  onClick={reset}
                  className="w-full py-4 bg-primary text-primary-foreground font-bold"
                >
                  Escolher outro quiz
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
