import { AnimatePresence, motion } from "framer-motion";
import { Compass, HelpCircle, ScanLine, Sparkles, Smartphone } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { loadArtIndex, museumMeta, type ArtIndexItem } from "@/data/museums";
import type { Lang, MuseumId } from "@/data/types";
import { useSettings } from "@/context/Settings";
import { STRINGS, type StringKey } from "@/i18n/strings";
import { KoraIcon } from "./KoraMark";

/** Obras escolhidas para a vitrine da tela de descanso (as mais reconhecíveis de cada acervo). */
const SHOWCASE: string[] = [
  "renoir-rosa-e-azul",
  "tarsila-paisagem",
  "gautherot-jangadas",
  "van-gogh-escolar",
  "volpi-portais-bandeirinhas",
  "farkas-inauguracao-brasilia",
  "portinari-retirantes",
  "oiticica-metaesquema",
  "zingg-avenida-paulista",
  "monet-ponte-japonesa",
  "milhazes-love",
  "medeiros-maracana-1950",
];

const SLIDE_MS = 7000;
const LANGS: Lang[] = ["pt", "en", "es"];

const FEATURES: { icon: ReactNode; key: StringKey }[] = [
  { icon: <ScanLine size={20} />, key: "attract.f.scan" },
  { icon: <Sparkles size={20} />, key: "attract.f.ask" },
  { icon: <Compass size={20} />, key: "attract.f.plan" },
  { icon: <HelpCircle size={20} />, key: "attract.f.quiz" },
];

const say = (lang: Lang, key: StringKey) => STRINGS[lang][key] ?? STRINGS.pt[key] ?? key;

/**
 * Tela de descanso: vitrine de obras em tela cheia que convida o público a tocar.
 * Alterna os três idiomas e mostra um QR para continuar no celular.
 */
export function Attract({ museum, onStart }: { museum?: MuseumId; onStart: () => void }) {
  const { lang } = useSettings();
  const [index, setIndex] = useState<ArtIndexItem[]>([]);
  const [i, setI] = useState(0);

  useEffect(() => {
    let alive = true;
    loadArtIndex().then((all) => {
      if (!alive) return;
      const byId = new Map(all.map((a) => [a.id, a]));
      let list = SHOWCASE.map((id) => byId.get(id)).filter((a): a is ArtIndexItem => !!a);
      if (museum) {
        const own = list.filter((a) => a.museum === museum);
        const rest = all.filter((a) => a.museum === museum && !own.includes(a));
        list = [...own, ...rest].slice(0, 8);
      }
      setIndex(list);
    });
    return () => {
      alive = false;
    };
  }, [museum]);

  useEffect(() => {
    if (!index.length) return;
    const id = setInterval(() => setI((x) => (x + 1) % index.length), SLIDE_MS);
    return () => clearInterval(id);
  }, [index.length]);

  // pré-carrega a próxima imagem para a troca não piscar
  useEffect(() => {
    const next = index[(i + 1) % Math.max(1, index.length)];
    if (next) new Image().src = full(next);
  }, [i, index]);

  const art = index[i];
  const meta = art ? museumMeta(art.museum) : undefined;
  const cycleLang = LANGS[(LANGS.indexOf(lang) + i) % LANGS.length];
  const feature = i % FEATURES.length;
  const qrUrl = useMemo(() => `${location.origin}/${museum ?? ""}`, [museum]);

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-label={say(lang, "attract.cta")}
      onClick={onStart}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onStart()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
      className="dark fixed inset-0 z-[80] cursor-pointer select-none overflow-hidden bg-black text-white"
    >
      {/* fundo desfocado da obra atual */}
      <AnimatePresence>
        {art && (
          <motion.img
            key={"bg" + art.id}
            src={full(art)}
            alt=""
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 h-full w-full scale-125 object-cover blur-3xl saturate-150"
          />
        )}
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

      {/* obra em destaque */}
      <div className="absolute inset-y-0 right-0 hidden w-[52%] items-center justify-center p-12 md:flex lg:p-16">
        <AnimatePresence mode="wait">
          {art && (
            <motion.img
              key={art.id}
              src={full(art)}
              alt={art.title}
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1.03, y: 0 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ opacity: { duration: 0.9 }, y: { duration: 0.9 }, scale: { duration: SLIDE_MS / 1000, ease: "linear" } }}
              className="max-h-[74vh] max-w-full rounded-3xl object-contain shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]"
            />
          )}
        </AnimatePresence>
      </div>

      {/* obra em tela cheia no celular */}
      <div className="absolute inset-0 md:hidden">
        <AnimatePresence>
          {art && (
            <motion.img
              key={"m" + art.id}
              src={full(art)}
              alt={art.title}
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: 0.55, scale: 1.08 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 1 }, scale: { duration: SLIDE_MS / 1000, ease: "linear" } }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
      </div>

      {/* conteúdo */}
      <div className="relative flex h-full flex-col justify-between p-6 md:w-[52%] md:p-12 lg:p-16">
        <div className="flex items-center gap-3">
          <KoraIcon size={40} className="text-white" />
          <span className="text-[24px] font-extrabold tracking-[-0.04em]">kora</span>
          {museum && meta && (
            <span className="ml-2 rounded-lg px-2 py-0.5 text-[15px] font-extrabold" style={{ backgroundColor: museumMeta(museum)?.accent }}>
              {museumMeta(museum)?.short}
            </span>
          )}
        </div>

        <div>
          <p className="eyebrow mb-4 text-white/60">{say(cycleLang, "attract.eyebrow")}</p>
          <div className="relative min-h-[2.1em] text-[52px] font-extrabold leading-[0.98] tracking-[-0.04em] sm:text-[72px] lg:text-[96px]">
            <AnimatePresence mode="wait">
              <motion.h1
                key={cycleLang}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
              >
                {say(cycleLang, "attract.title")}
                <span style={{ color: meta?.accent ?? "#fff" }}>.</span>
              </motion.h1>
            </AnimatePresence>
          </div>

          <ul className="mt-8 grid max-w-xl gap-2">
            {FEATURES.map((f, k) => (
              <motion.li
                key={f.key}
                animate={{ opacity: k === feature ? 1 : 0.45, x: k === feature ? 6 : 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-3 text-[17px] font-semibold md:text-[20px]"
              >
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl transition-colors duration-500"
                  style={{ backgroundColor: k === feature ? meta?.accent ?? "#fff" : "rgba(255,255,255,0.1)" }}
                >
                  {f.icon}
                </span>
                {say(cycleLang, f.key)}
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="flex items-end justify-between gap-6">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span className="relative grid h-14 w-14 place-items-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-white/25" />
                <span className="absolute inset-2 rounded-full bg-white/15" />
                <span className="relative h-4 w-4 rounded-full bg-white" />
              </span>
              <span className="text-[18px] font-bold md:text-[20px]">{say(cycleLang, "attract.cta")}</span>
            </div>
            <AnimatePresence mode="wait">
              {art && (
                <motion.p
                  key={art.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-5 flex items-center gap-2 truncate text-[13px] text-white/70"
                >
                  <span className="rounded-md px-1.5 py-0.5 text-[11px] font-extrabold text-white" style={{ backgroundColor: meta?.accent }}>
                    {meta?.short}
                  </span>
                  <span className="truncate">
                    <b className="font-semibold text-white">{art.title}</b> · {art.artist}
                    {art.year ? `, ${art.year}` : ""}
                  </span>
                </motion.p>
              )}
            </AnimatePresence>
            <div className="mt-3 flex gap-1.5">
              {index.map((a, k) => (
                <span key={a.id} className="h-1 w-6 overflow-hidden rounded-full bg-white/20">
                  {k === i && (
                    <motion.span
                      key={i}
                      className="block h-full bg-white"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: SLIDE_MS / 1000, ease: "linear" }}
                    />
                  )}
                  {k < i && <span className="block h-full w-full bg-white/60" />}
                </span>
              ))}
            </div>
          </div>

          <div className="hidden shrink-0 items-center gap-4 rounded-3xl bg-white p-3 pr-5 text-black shadow-lift sm:flex">
            <QRCodeSVG value={qrUrl} size={92} level="M" />
            <div className="max-w-[150px]">
              <Smartphone size={18} />
              <p className="mt-1 text-[14px] font-bold leading-tight">{say(cycleLang, "attract.qr")}</p>
              <p className="mt-0.5 text-[12px] text-black/55">{say(cycleLang, "attract.qr.desc")}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function full(a: ArtIndexItem) {
  return `/museums/${a.museum}/art/${a.id}.webp`;
}
