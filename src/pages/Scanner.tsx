import { AnimatePresence, motion } from "framer-motion";
import { Camera, ImageUp, Loader2, RefreshCw, ScanLine, ShieldCheck, Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArtImage } from "@/components/ArtImage";
import { Header } from "@/components/Shell";
import { Button } from "@/components/ui";
import { useMaybeMuseum } from "@/context/Museum";
import { useSettings } from "@/context/Settings";
import { loadArtIndex, museumMeta, type ArtIndexItem } from "@/data/museums";
import { identifyArtwork, type IdentifyResult } from "@/lib/ai";
import { track } from "@/lib/analytics";
import { markScanned } from "@/lib/visit";
import { confidence, loadEmbeddings, loadModel, nearest, type Match } from "@/lib/clip";
import { cn } from "@/lib/utils";

type Result =
  | { kind: "match"; best: Match & { art: ArtIndexItem }; others: (Match & { art: ArtIndexItem })[]; frame: string }
  | { kind: "none"; others: (Match & { art: ArtIndexItem })[]; frame: string };

const SURE = 0.6; // confiança (similaridade ~0,82) para mostrar como "encontrada"
const MAYBE = 0.25; // abaixo disso (~0,75), oferece a IA

export default function Scanner() {
  const museum = useMaybeMuseum();
  const { t, lang } = useSettings();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const busy = useRef(false);
  const streak = useRef<{ id: string; n: number }>({ id: "", n: 0 });
  const fileRef = useRef<HTMLInputElement>(null);

  const [camError, setCamError] = useState(false);
  const [modelPct, setModelPct] = useState(0);
  const [ready, setReady] = useState(false);
  const [modelError, setModelError] = useState(false);
  const [auto, setAuto] = useState(true);
  const [live, setLive] = useState<{ art: ArtIndexItem; score: number } | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [ai, setAi] = useState<{ loading: boolean; data?: IdentifyResult; error?: boolean }>({ loading: false });
  const [index, setIndex] = useState<Map<string, ArtIndexItem>>(new Map());

  // Câmera
  const startCamera = useCallback(async () => {
    setCamError(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 1280 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => undefined);
      }
    } catch {
      setCamError(true);
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => streamRef.current?.getTracks().forEach((tr) => tr.stop());
  }, [startCamera]);

  // Modelo + vetores das obras
  useEffect(() => {
    let alive = true;
    Promise.all([loadModel((p) => alive && setModelPct(p)), loadEmbeddings(), loadArtIndex()])
      .then(([, , idx]) => {
        if (!alive) return;
        setIndex(new Map(idx.map((i) => [i.id, i])));
        setReady(true);
      })
      .catch((e) => {
        console.error("[kora] scanner indisponível:", e);
        if (alive) setModelError(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  const grabFrame = (): HTMLCanvasElement | null => {
    const v = videoRef.current;
    if (!v || !v.videoWidth) return null;
    // recorta o quadrado central (o mesmo da moldura na tela)
    const s = Math.min(v.videoWidth, v.videoHeight) * 0.9;
    const c = document.createElement("canvas");
    c.width = c.height = 448;
    c.getContext("2d")!.drawImage(v, (v.videoWidth - s) / 2, (v.videoHeight - s) / 2, s, s, 0, 0, 448, 448);
    return c;
  };

  const analyze = useCallback(
    async (canvas: HTMLCanvasElement, manual: boolean) => {
      if (busy.current) return;
      busy.current = true;
      if (manual) setAnalyzing(true);
      try {
        const [{ embed }, embeds, idx] = await Promise.all([loadModel(), loadEmbeddings(), loadArtIndex()]);
        const byId = index.size ? index : new Map(idx.map((i) => [i.id, i]));
        const q = await embed(canvas);
        // prioriza o museu atual, mas procura na rede toda
        const all = nearest(q, embeds, 6).map((mm) => ({ ...mm, art: byId.get(mm.id)! })).filter((x) => x.art);
        if (museum) all.sort((a, b) => b.score + (b.museum === museum.id ? 0.015 : 0) - (a.score + (a.museum === museum.id ? 0.015 : 0)));
        const best = all[0];
        const conf = best ? confidence(best.score) : 0;

        if (!manual) {
          // modo automático: precisa de 2 leituras seguidas da mesma obra com boa confiança
          if (best && conf >= SURE) {
            streak.current = streak.current.id === best.id ? { id: best.id, n: streak.current.n + 1 } : { id: best.id, n: 1 };
            setLive({ art: best.art, score: conf });
            if (streak.current.n >= 2) {
              setResult({ kind: "match", best, others: all.slice(1, 4), frame: canvas.toDataURL("image/jpeg", 0.8) });
              track({ museum: best.museum, type: "scan_match", artwork_id: best.id, value: Math.round(conf * 100) });
              markScanned(best.museum, best.id);
              navigator.vibrate?.(30);
            }
          } else {
            streak.current = { id: "", n: 0 };
            setLive(null);
          }
          return;
        }

        track({ museum: museum?.id ?? "hub", type: "scan", value: Math.round(conf * 100) });
        const frame = canvas.toDataURL("image/jpeg", 0.8);
        if (best && conf >= SURE) {
          setResult({ kind: "match", best, others: all.slice(1, 4), frame });
          track({ museum: best.museum, type: "scan_match", artwork_id: best.id, value: Math.round(conf * 100) });
              markScanned(best.museum, best.id);
        } else setResult({ kind: "none", others: conf >= MAYBE ? all.slice(0, 3) : [], frame });
      } finally {
        busy.current = false;
        setAnalyzing(false);
      }
    },
    [index, museum],
  );

  // Leitura contínua
  useEffect(() => {
    if (!ready || !auto || result || camError) return;
    const id = setInterval(() => {
      const c = grabFrame();
      if (c) analyze(c, false);
    }, 700);
    return () => clearInterval(id);
  }, [ready, auto, result, camError, analyze]);

  const capture = () => {
    const c = grabFrame();
    if (c) analyze(c, true);
  };

  const onFile = (f?: File) => {
    if (!f) return;
    setAnalyzing(true);
    const img = new Image();
    img.onload = () => {
      const s = Math.min(img.width, img.height);
      const c = document.createElement("canvas");
      c.width = c.height = 448;
      // envia a imagem inteira em fundo neutro (sem cortar a obra)
      const ctx = c.getContext("2d")!;
      ctx.fillStyle = "#808080";
      ctx.fillRect(0, 0, 448, 448);
      const scale = 448 / Math.max(img.width, img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.drawImage(img, (448 - w) / 2, (448 - h) / 2, w, h);
      void s;
      analyze(c, true);
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(f);
  };

  const askAi = async () => {
    if (!result) return;
    setAi({ loading: true });
    track({ museum: museum?.id ?? "hub", type: "scan_ai" });
    try {
      const idx = await loadArtIndex();
      const cands = idx
        .filter((i) => !museum || i.museum === museum.id)
        .map((i) => `${i.id} | ${i.title} | ${i.artist}`)
        .join("\n");
      const data = await identifyArtwork(result.frame, lang, cands);
      setAi({ loading: false, data });
    } catch {
      setAi({ loading: false, error: true });
    }
  };

  const reset = () => {
    setResult(null);
    setAi({ loading: false });
    setLive(null);
    streak.current = { id: "", n: 0 };
  };

  const matchLink = (a: ArtIndexItem) => `/${a.museum}/obra/${a.id}`;
  const aiMatch = ai.data?.match_id ? index.get(ai.data.match_id) : undefined;

  return (
    <div className="min-h-[100dvh] bg-black text-white">
      <div className="dark">
        <Header back={museum ? `/${museum.id}` : "/museus"} title={t("scan.title")} />
      </div>
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 pb-40">
        <div className="relative mt-2 aspect-square w-full overflow-hidden rounded-4xl bg-neutral-900">
          {!camError ? (
            <video ref={videoRef} playsInline muted className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full place-items-center p-8 text-center text-white/70">
              <div>
                <Camera className="mx-auto mb-3" size={36} />
                <p>{t("scan.noCamera")}</p>
                <Button variant="ghost" className="mt-4 bg-white/10 text-white" onClick={startCamera} icon={<RefreshCw size={16} />}>
                  {t("common.retry")}
                </Button>
              </div>
            </div>
          )}

          {/* moldura */}
          <div className="pointer-events-none absolute inset-[5%]">
            {["left-0 top-0 border-l-4 border-t-4 rounded-tl-3xl", "right-0 top-0 border-r-4 border-t-4 rounded-tr-3xl", "left-0 bottom-0 border-l-4 border-b-4 rounded-bl-3xl", "right-0 bottom-0 border-r-4 border-b-4 rounded-br-3xl"].map((c) => (
              <span key={c} className={cn("absolute h-12 w-12 border-white/90", c, live && "border-accent")} />
            ))}
            {ready && !result && !camError && <span className="absolute inset-x-4 h-0.5 animate-scan rounded-full bg-accent shadow-glow" />}
          </div>

          {(analyzing || (!ready && !modelError)) && (
            <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/80 to-transparent p-5 text-[14px]">
              <Loader2 className="animate-spin" size={18} />
              <span>
                {analyzing ? t("scan.analyzing") : modelPct > 0 && modelPct < 100 ? `${t("scan.downloading")} · ${modelPct}%` : t("scan.loadingModel")}
              </span>
            </div>
          )}
          {modelError && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-5 text-[14px] text-white/80">
              {t("common.offline")}
            </div>
          )}

          <AnimatePresence>
            {live && !result && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-2xl p-2.5 text-ink">
                <ArtImage src={live.art.thumb} alt="" color={live.art.color} className="h-12 w-12 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-bold">{live.art.title}</p>
                  <p className="truncate text-[12px] text-muted">{live.art.artist}</p>
                </div>
                <span className="num pr-2 text-[18px] text-accent">{Math.round(live.score * 100)}%</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-4 text-center text-[14px] text-white/70">{t("scan.hint")}</p>

        <div className="mt-6 flex w-full items-center justify-between">
          <button onClick={() => fileRef.current?.click()} className="tap grid h-14 w-14 place-items-center rounded-full bg-white/10" aria-label={t("scan.upload")}>
            <ImageUp size={22} />
          </button>
          <button
            onClick={capture}
            disabled={!ready || analyzing || camError}
            aria-label={t("scan.capture")}
            className="tap grid h-20 w-20 place-items-center rounded-full border-4 border-white/90 disabled:opacity-40"
          >
            <span className="grid h-[62px] w-[62px] place-items-center rounded-full bg-accent">
              {analyzing ? <Loader2 className="animate-spin" /> : <ScanLine size={26} />}
            </span>
          </button>
          <button
            onClick={() => setAuto((a) => !a)}
            className="tap flex h-14 w-14 flex-col items-center justify-center gap-0.5 rounded-full bg-white/10 text-[11px] font-bold"
            aria-label="Reconhecimento automático"
            aria-pressed={auto}
            title="Reconhecimento automático"
          >
            <span className={cn("h-2 w-2 rounded-full", auto ? "bg-success" : "bg-white/40")} />
            Auto
          </button>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />

        <p className="mt-8 flex items-center gap-2 text-[12.5px] text-white/50">
          <ShieldCheck size={14} /> {t("scan.privacy")}
        </p>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            className="safe-bottom fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] overflow-y-auto rounded-t-4xl bg-surface p-5 text-ink shadow-lift md:left-1/2 md:max-w-lg md:-translate-x-1/2"
          >
            {result.kind === "match" ? (
              <>
                <p className="eyebrow flex items-center gap-2 text-success">
                  <Sparkles size={14} /> {t("scan.found")} · {Math.round(confidence(result.best.score) * 100)}% {t("scan.match")}
                </p>
                <Link to={matchLink(result.best.art)} className="tap mt-3 flex gap-4">
                  <ArtImage src={result.best.art.thumb} alt="" color={result.best.art.color} className="h-32 w-28 shrink-0 rounded-2xl" />
                  <div className="min-w-0">
                    <p className="text-[21px] font-extrabold leading-tight">{result.best.art.title}</p>
                    <p className="mt-1 text-muted">
                      {result.best.art.artist}
                      {result.best.art.year ? ` · ${result.best.art.year}` : ""}
                    </p>
                    <span className="mt-2 inline-block rounded-md px-2 py-0.5 text-[12px] font-extrabold text-white" style={{ backgroundColor: museumMeta(result.best.art.museum)?.accent }}>
                      {museumMeta(result.best.art.museum)?.short}
                    </span>
                    {museum && result.best.art.museum !== museum.id && <p className="mt-1 text-[12px] text-muted">{t("scan.otherMuseum")}</p>}
                  </div>
                </Link>
                <div className="mt-5 flex gap-2">
                  <Link to={matchLink(result.best.art)} className="flex-1">
                    <Button className="w-full">{t("hub.enter")}</Button>
                  </Link>
                  <Button variant="ghost" onClick={reset}>
                    {t("scan.again")}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-[20px] font-extrabold">{t("scan.notFound")}</p>
                <Link to={museum ? `/${museum.id}/acervo` : "/museus"} className="mt-1 inline-block text-[14px] font-semibold text-accent">
                  {t("scan.searchName")}
                </Link>
                {result.others.length > 0 && (
                  <>
                    <p className="mb-2 mt-3 text-[13px] font-semibold text-muted">{t("scan.maybe")}</p>
                    <div className="grid grid-cols-3 gap-2">
                      {result.others.map((o) => (
                        <Link key={o.id} to={matchLink(o.art)} className="tap">
                          <ArtImage src={o.art.thumb} alt="" color={o.art.color} className="aspect-square rounded-xl" />
                          <p className="mt-1 line-clamp-2 text-[12px] font-semibold leading-tight">{o.art.title}</p>
                        </Link>
                      ))}
                    </div>
                  </>
                )}
                <div className="mt-4 rounded-2xl bg-ink/[0.04] p-4">
                  {!ai.data && !ai.loading && (
                    <Button onClick={askAi} icon={<Sparkles size={17} />} className="w-full">
                      {t("scan.askAi")}
                    </Button>
                  )}
                  {ai.loading && (
                    <p className="flex items-center gap-2 text-[14px] text-muted">
                      <Loader2 className="animate-spin" size={16} /> {t("scan.analyzing")}
                    </p>
                  )}
                  {ai.error && <p className="text-[14px] text-danger">{t("chat.error")}</p>}
                  {ai.data && (
                    <div>
                      <p className="eyebrow">{t("scan.aiResult")}</p>
                      {ai.data.found ? (
                        <p className="mt-1 text-[18px] font-extrabold leading-snug">
                          {ai.data.title} {ai.data.artist && <span className="font-semibold text-muted">· {ai.data.artist}</span>} {ai.data.year && <span className="font-semibold text-muted">· {ai.data.year}</span>}
                        </p>
                      ) : null}
                      {ai.data.summary && <p className="body-copy mt-2">{ai.data.summary}</p>}
                      {aiMatch && (
                        <Link to={matchLink(aiMatch)} className="mt-3 block">
                          <Button className="w-full">{t("hub.enter")}: {aiMatch.title}</Button>
                        </Link>
                      )}
                    </div>
                  )}
                </div>
                <Button variant="ghost" onClick={reset} className="mt-3 w-full">
                  {t("scan.again")}
                </Button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
