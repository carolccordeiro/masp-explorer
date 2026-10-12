import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Mic, RotateCcw, Sparkles, Volume2, Zap } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import { Link, useSearchParams } from "react-router-dom";
import { KoraIcon } from "@/components/KoraMark";
import { Header } from "@/components/Shell";
import { Chip, IconButton } from "@/components/ui";
import { useMuseum } from "@/context/Museum";
import { useSettings } from "@/context/Settings";
import { chatStream, instantAnswer, localAnswer, topicOf, type ChatMsg } from "@/lib/ai";
import { track } from "@/lib/analytics";
import { useListen, useSpeech } from "@/lib/speech";
import { cn, normalize, tr } from "@/lib/utils";

type UiMsg = ChatMsg & { instant?: boolean; error?: boolean };

export default function Assistant() {
  const m = useMuseum();
  const { t, lang, family } = useSettings();
  const [params, setParams] = useSearchParams();
  const storeKey = `kora-chat-${m.id}`;
  const [msgs, setMsgs] = useState<UiMsg[]>(() => {
    try {
      return JSON.parse(sessionStorage.getItem(storeKey) || "[]");
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const { speak, stop, speaking, supported: ttsOk } = useSpeech(lang);

  useEffect(() => {
    try {
      sessionStorage.setItem(storeKey, JSON.stringify(msgs.slice(-30)));
    } catch {
      /* ignora */
    }
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs, storeKey]);

  // títulos das obras para virar link dentro da resposta
  const titleMap = useMemo(() => {
    const map = new Map<string, string>();
    m.artworks.forEach((a) => {
      [a.title.pt, a.title.en, a.title.es].filter(Boolean).forEach((ti) => map.set(normalize(ti!), a.id));
    });
    return map;
  }, [m]);

  const send = useCallback(
    async (text: string) => {
      const q = text.trim();
      if (!q || streaming) return;
      setInput("");
      stop();
      const history: UiMsg[] = [...msgs, { role: "user", content: q }];
      track({ museum: m.id, type: "chat", path: topicOf(q, m) });

      const quick = instantAnswer(q, m, lang);
      if (quick) {
        setMsgs([...history, { role: "assistant", content: quick, instant: true }]);
        return;
      }

      setMsgs([...history, { role: "assistant", content: "" }]);
      setStreaming(true);
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      // sem nenhuma palavra em 15 s, cai para a resposta do acervo; resposta inteira no máximo em 45 s
      const timeout = setTimeout(() => ctrl.abort(), 45_000);
      const slow = setTimeout(() => {
        if (!acc.trim()) ctrl.abort();
      }, 15_000);
      let acc = "";
      try {
        for await (const chunk of chatStream({
          museum: m,
          lang,
          family,
          signal: ctrl.signal,
          messages: history.filter((x) => !x.error).map(({ role, content }) => ({ role, content })),
        })) {
          acc += chunk;
          setMsgs((cur) => [...cur.slice(0, -1), { role: "assistant", content: acc }]);
        }
        if (!acc.trim()) throw new Error("vazio");
      } catch {
        // Se a IA falhar sem ter respondido nada, responde com o próprio acervo (plano B)
        if (!acc.trim()) setMsgs((cur) => [...cur.slice(0, -1), { role: "assistant", content: `${t("chat.slow")}\n\n${localAnswer(q, m, lang).split("\n\n").slice(1).join("\n\n")}`, instant: true }]);
      } finally {
        clearTimeout(timeout);
        clearTimeout(slow);
        setStreaming(false);
      }
    },
    [msgs, streaming, m, lang, family, t, stop],
  );

  // Pergunta vinda de uma obra (?obra=id)
  useEffect(() => {
    const id = params.get("obra");
    if (!id) return;
    const art = m.artworks.find((a) => a.id === id);
    setParams({}, { replace: true });
    if (art) {
      const q = {
        pt: `Me conte mais sobre a obra "${art.title.pt}", de ${art.artist}. O que devo observar nela?`,
        en: `Tell me more about "${tr(art.title, "en")}" by ${art.artist}. What should I look for?`,
        es: `Cuéntame más sobre "${tr(art.title, "es")}" de ${art.artist}. ¿Qué debo observar?`,
      }[lang];
      send(q);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { start, listening, supported: sttOk } = useListen(lang, (txt) => send(txt));

  const Strong = ({ children }: { children?: ReactNode }) => {
    const text = String(Array.isArray(children) ? children.join("") : children ?? "");
    const id = titleMap.get(normalize(text));
    return id ? (
      <Link to={`/${m.id}/obra/${id}`} className="font-bold text-accent underline decoration-accent/30 underline-offset-2">
        {text}
      </Link>
    ) : (
      <strong>{children}</strong>
    );
  };

  const suggestions = [t("chat.suggest1"), t("chat.suggest2"), t("chat.suggest3"), t("chat.suggest4")];
  const last = [...msgs].reverse().find((x) => x.role === "assistant" && x.content);

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Header
        title={
          <span className="flex items-center gap-2">
            <Sparkles size={17} className="text-accent" /> {t("chat.title")}
          </span>
        }
        right={
          <>
            {ttsOk && last && (
              <IconButton label={t("common.listen")} active={speaking} onClick={() => (speaking ? stop() : speak(last.content))}>
                <Volume2 size={18} />
              </IconButton>
            )}
            {msgs.length > 0 && (
              <IconButton label={t("chat.clear")} onClick={() => { abortRef.current?.abort(); setMsgs([]); }}>
                <RotateCcw size={17} />
              </IconButton>
            )}
          </>
        }
      />

      <div className="mx-auto w-full max-w-3xl flex-1 px-4 pb-44 pt-2 md:px-8">
        {msgs.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="pt-8 text-center">
            <KoraIcon size={64} className="mx-auto text-ink" />
            <p className="mx-auto mt-5 max-w-md text-[22px] font-extrabold leading-snug">{t("chat.welcome")}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {suggestions.map((s) => (
                <Chip key={s} onClick={() => send(s)} className="px-4 py-2.5 text-[14px]">
                  {s}
                </Chip>
              ))}
            </div>
          </motion.div>
        )}

        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {msgs.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start gap-2.5")}>
                {msg.role === "assistant" && <KoraIcon size={28} className="mt-1 shrink-0 text-ink" />}
                <div
                  className={cn(
                    "max-w-[85%] rounded-3xl px-4 py-3 text-[15.5px] leading-relaxed",
                    msg.role === "user" ? "rounded-br-lg bg-accent text-accent-ink" : "rounded-bl-lg bg-surface shadow-soft",
                    msg.error && "text-danger",
                  )}
                >
                  {msg.instant && (
                    <p className="mb-1 flex items-center gap-1 text-[12.5px] font-semibold text-accent">
                      <Zap size={12} /> {t("chat.instant")}
                    </p>
                  )}
                  {msg.content ? (
                    <div className="prose-kora font-body">
                      <ReactMarkdown components={{ strong: Strong, p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>, ul: ({ children }) => <ul className="mb-2 list-disc space-y-1 pl-5">{children}</ul>, ol: ({ children }) => <ol className="mb-2 list-decimal space-y-1 pl-5">{children}</ol> }}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <span className="flex items-center gap-1.5 py-1 text-muted">
                      {[0, 1, 2].map((d) => (
                        <motion.span key={d} className="h-2 w-2 rounded-full bg-muted" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: d * 0.15 }} />
                      ))}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={endRef} />
        </div>
      </div>

      <div className="safe-bottom fixed inset-x-0 bottom-[64px] z-30 px-4 md:bottom-24">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="glass mx-auto flex max-w-3xl items-center gap-2 rounded-full border hairline p-1.5 pl-5 shadow-lift"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={listening ? t("chat.listening") : t("chat.placeholder")}
            className="h-11 min-w-0 flex-1 bg-transparent text-[16px] outline-none placeholder:text-muted"
            aria-label={t("chat.placeholder")}
          />
          {sttOk && (
            <IconButton type="button" label={t("chat.voice")} active={listening} onClick={start}>
              <Mic size={18} />
            </IconButton>
          )}
          <button
            type="submit"
            disabled={!input.trim() || streaming}
            aria-label="Enviar"
            className="tap grid h-11 w-11 place-items-center rounded-full bg-accent text-accent-ink disabled:opacity-30"
          >
            <ArrowUp size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
