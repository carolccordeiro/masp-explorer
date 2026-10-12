import { useCallback, useEffect, useRef, useState } from "react";
import type { Lang } from "@/data/types";

const LOCALE: Record<Lang, string> = { pt: "pt-BR", en: "en-US", es: "es-ES" };

function pickVoice(lang: Lang): SpeechSynthesisVoice | undefined {
  const voices = speechSynthesis.getVoices();
  const loc = LOCALE[lang];
  const same = voices.filter((v) => v.lang.replace("_", "-").startsWith(loc.slice(0, 2)));
  return (
    same.find((v) => v.lang.replace("_", "-") === loc && /natural|neural|premium|enhanced|google/i.test(v.name)) ??
    same.find((v) => v.lang.replace("_", "-") === loc) ??
    same[0]
  );
}

/** Áudio-guia: lê um texto em voz alta (voz do próprio aparelho, sem custo). */
export function useSpeech(lang: Lang) {
  const [speaking, setSpeaking] = useState(false);
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    if (!supported) return;
    speechSynthesis.getVoices();
    return () => speechSynthesis.cancel();
  }, [supported]);

  const stop = useCallback(() => {
    if (!supported) return;
    speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  const speak = useCallback(
    (text: string) => {
      if (!supported) return;
      speechSynthesis.cancel();
      const clean = text.replace(/\*\*/g, "").replace(/[#_>`]/g, "");
      // Frases curtas evitam o corte que alguns navegadores fazem em textos longos
      const chunks = clean.match(/[^.!?]+[.!?]*/g) ?? [clean];
      const voice = pickVoice(lang);
      chunks.forEach((c, i) => {
        const u = new SpeechSynthesisUtterance(c.trim());
        u.lang = LOCALE[lang];
        if (voice) u.voice = voice;
        u.rate = 1;
        if (i === 0) u.onstart = () => setSpeaking(true);
        if (i === chunks.length - 1) u.onend = u.onerror = () => setSpeaking(false);
        speechSynthesis.speak(u);
      });
    },
    [lang, supported],
  );

  return { speak, stop, speaking, supported };
}

type Recognition = {
  lang: string;
  interimResults: boolean;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};

/** Reconhecimento de voz (quando o navegador oferece). */
export function useListen(lang: Lang, onText: (t: string) => void) {
  const [listening, setListening] = useState(false);
  const ref = useRef<Recognition | null>(null);
  const Ctor = typeof window !== "undefined"
    ? ((window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition }).SpeechRecognition ??
      (window as unknown as { webkitSpeechRecognition?: new () => Recognition }).webkitSpeechRecognition)
    : undefined;

  const start = useCallback(() => {
    if (!Ctor) return;
    const r = new Ctor();
    r.lang = LOCALE[lang];
    r.interimResults = false;
    r.onresult = (e) => {
      const t = e.results[0]?.[0]?.transcript;
      if (t) onText(t);
    };
    r.onend = r.onerror = () => setListening(false);
    ref.current = r;
    setListening(true);
    r.start();
  }, [Ctor, lang, onText]);

  const stop = useCallback(() => {
    ref.current?.stop();
    setListening(false);
  }, []);

  return { start, stop, listening, supported: Boolean(Ctor) };
}
