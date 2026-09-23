import { AnimatePresence, motion } from "framer-motion";
import { Check, Gift, RotateCcw, X } from "lucide-react";
import { useMemo, useState } from "react";
import { ArtImage } from "@/components/ArtImage";
import { Header } from "@/components/Shell";
import { Button, Page } from "@/components/ui";
import { useMuseum } from "@/context/Museum";
import { useSettings } from "@/context/Settings";
import type { Artwork, I18n, Museum } from "@/data/types";
import { track } from "@/lib/analytics";
import { cn, shuffle, tr } from "@/lib/utils";

type Q = { question: I18n; options: I18n[]; correct: number; explanation: I18n; art?: Artwork };

function buildQuiz(m: Museum, seed: number): Q[] {
  const facts = shuffle(m.quiz, seed).slice(0, 3);
  // Perguntas visuais geradas a partir do acervo: "De quem é esta obra?"
  const artists = [...new Set(m.artworks.map((a) => a.artist))];
  const visual = shuffle(m.artworks, seed + 7)
    .slice(0, 2)
    .map((art): Q => {
      const wrong = shuffle(artists.filter((x) => x !== art.artist), seed + art.id.length).slice(0, 3);
      const opts = shuffle([art.artist, ...wrong], seed + 3);
      return {
        art,
        question: { pt: "De quem é esta obra?", en: "Who made this work?", es: "¿De quién es esta obra?" },
        options: opts.map((o) => ({ pt: o })),
        correct: opts.indexOf(art.artist),
        explanation: {
          pt: `${art.title.pt}, de ${art.artist}${art.year ? ` (${art.year})` : ""}. ${art.description.pt}`,
          en: `${tr(art.title, "en")}, by ${art.artist}${art.year ? ` (${art.year})` : ""}. ${tr(art.description, "en")}`,
          es: `${tr(art.title, "es")}, de ${art.artist}${art.year ? ` (${art.year})` : ""}. ${tr(art.description, "es")}`,
        },
      };
    });
  return shuffle([...facts, ...visual], seed + 11);
}

export default function Quiz() {
  const m = useMuseum();
  const { t, lang } = useSettings();
  const [seed, setSeed] = useState(() => Date.now() % 100000);
  const questions = useMemo(() => buildQuiz(m, seed), [m, seed]);
  const [i, setI] = useState(-1);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const done = i >= questions.length;
  const q = questions[i];

  const pick = (k: number) => {
    if (picked != null) return;
    setPicked(k);
    if (k === q.correct) setScore((s) => s + 1);
  };
  const next = () => {
    setPicked(null);
    const n = i + 1;
    setI(n);
    if (n >= questions.length) track({ museum: m.id, type: "quiz_done", value: score });
  };
  const restart = () => {
    setSeed((s) => s + 1);
    setI(0);
    setScore(0);
    setPicked(null);
  };
  const code = `KORA-${m.short}-${(seed * 7).toString(36).toUpperCase().slice(-4)}`;

  return (
    <>
      <Header title={t("quiz.title")} />
      <Page className="max-w-2xl">
        {i === -1 && (
          <div className="pt-6 text-center">
            <p className="num text-[96px] leading-none text-accent">?</p>
            <h1 className="mt-4 text-[30px] font-extrabold">{t("quiz.title")} {m.short}</h1>
            <p className="mt-2 text-muted">{t("quiz.intro")}</p>
            <p className="mt-1 flex items-center justify-center gap-1.5 text-[14px] font-semibold text-accent">
              <Gift size={16} /> {t("quiz.prize")}
            </p>
            <Button size="lg" className="mt-8" onClick={() => setI(0)}>
              {t("common.start")}
            </Button>
          </div>
        )}

        {q && !done && (
          <AnimatePresence mode="wait">
            <motion.div key={i} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}>
              <div className="mb-5 flex gap-1.5">
                {questions.map((_, k) => (
                  <span key={k} className={cn("h-1.5 flex-1 rounded-full", k < i ? "bg-accent" : k === i ? "bg-accent/50" : "bg-ink/10")} />
                ))}
              </div>
              {q.art && <ArtImage src={q.art.thumb} alt="" color={q.art.color} fit="contain" className="mb-5 h-56 w-full rounded-3xl bg-ink/[0.04] md:h-72" />}
              <h2 className="text-[24px] font-extrabold leading-snug">{tr(q.question, lang)}</h2>
              <div className="mt-5 grid gap-2.5">
                {q.options.map((o, k) => {
                  const state = picked == null ? "idle" : k === q.correct ? "right" : k === picked ? "wrong" : "dim";
                  return (
                    <button
                      key={k}
                      onClick={() => pick(k)}
                      className={cn(
                        "tap flex min-h-[56px] items-center justify-between gap-3 rounded-2xl border hairline bg-surface px-5 py-3 text-left text-[16px] font-semibold shadow-soft transition-colors",
                        state === "right" && "border-transparent bg-success text-white",
                        state === "wrong" && "border-transparent bg-danger text-white",
                        state === "dim" && "opacity-50",
                      )}
                    >
                      {tr(o, lang)}
                      {state === "right" && <Check />}
                      {state === "wrong" && <X />}
                    </button>
                  );
                })}
              </div>
              {picked != null && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <p className="body-copy mt-5 rounded-2xl bg-ink/[0.04] p-4 text-[15px]">{tr(q.explanation, lang)}</p>
                  <Button size="lg" className="mt-4 w-full" onClick={next}>
                    {i === questions.length - 1 ? t("quiz.result") : t("quiz.next")}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {done && (
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="pt-6 text-center">
            <p className="num text-[96px] leading-none">
              {score}
              <span className="text-muted">/{questions.length}</span>
            </p>
            <p className="mt-1 font-semibold text-muted">{t("quiz.score")}</p>
            {score >= questions.length - 1 ? (
              <div className="mt-6 rounded-3xl bg-accent p-6 text-accent-ink shadow-lift">
                <Gift className="mx-auto" size={36} />
                <p className="mt-2 text-[22px] font-extrabold">{t("quiz.win")}</p>
                <p className="opacity-90">{t("quiz.prize")}</p>
                <p className="num mt-4 rounded-2xl bg-white/20 py-3 text-[26px] tracking-widest">{code}</p>
                <p className="mt-2 text-[12px] opacity-80">{t("quiz.code")}</p>
              </div>
            ) : (
              <p className="mt-6 text-[18px] font-semibold">{t("quiz.almost")}</p>
            )}
            <Button variant="ghost" size="lg" className="mt-6" icon={<RotateCcw size={17} />} onClick={restart}>
              {t("quiz.again")}
            </Button>
          </motion.div>
        )}
      </Page>
    </>
  );
}
