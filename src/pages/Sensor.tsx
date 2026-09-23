import { motion } from "framer-motion";
import { Loader2, Power, ShieldCheck, Users } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Header } from "@/components/Shell";
import { Button, Page, Segmented, StatusDot } from "@/components/ui";
import { useSettings } from "@/context/Settings";
import { MUSEUMS } from "@/data/museums";
import { track } from "@/lib/analytics";

type Detector = (img: unknown, opts: { threshold: number }) => Promise<{ label: string; score: number; box: { xmin: number; ymin: number; xmax: number; ymax: number } }[]>;

/**
 * Sensor de fluxo: conta pessoas na frente do totem usando detecção de objetos (YOLOS tiny)
 * no próprio aparelho. Não guarda nem envia imagens, só o número de pessoas a cada 10 s.
 */
export default function Sensor() {
  const { t } = useSettings();
  const video = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const detector = useRef<Detector | null>(null);
  const [museum, setMuseum] = useState("masp");
  const [on, setOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [peak, setPeak] = useState(0);
  const [boxes, setBoxes] = useState<{ x: number; y: number; w: number; h: number }[]>([]);
  const lastSent = useRef(0);

  const stop = useCallback(() => {
    stream.current?.getTracks().forEach((tr) => tr.stop());
    stream.current = null;
    setOn(false);
    setBoxes([]);
  }, []);

  useEffect(() => stop, [stop]);

  const start = async () => {
    setLoading(true);
    try {
      if (!detector.current) {
        const tf = await import("@huggingface/transformers");
        tf.env.allowRemoteModels = false;
        tf.env.useBrowserCache = false;
        tf.env.localModelPath = "/models/";
        detector.current = (await tf.pipeline("object-detection", "Xenova/yolos-tiny", { dtype: "q8" } as never)) as unknown as Detector;
      }
      stream.current = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: 640, height: 480 }, audio: false });
      if (video.current) {
        video.current.srcObject = stream.current;
        await video.current.play();
      }
      setOn(true);
    } catch {
      stop();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!on) return;
    let alive = true;
    const loop = async () => {
      while (alive && video.current && canvas.current && detector.current) {
        const v = video.current;
        const c = canvas.current;
        c.width = 320;
        c.height = Math.round((320 * v.videoHeight) / (v.videoWidth || 1)) || 240;
        c.getContext("2d")!.drawImage(v, 0, 0, c.width, c.height);
        const res = await detector.current(c.toDataURL("image/jpeg", 0.7), { threshold: 0.8 });
        const people = res.filter((r) => r.label === "person");
        if (!alive) break;
        setCount(people.length);
        setPeak((p) => Math.max(p, people.length));
        setBoxes(people.map((p) => ({ x: p.box.xmin / c.width, y: p.box.ymin / c.height, w: (p.box.xmax - p.box.xmin) / c.width, h: (p.box.ymax - p.box.ymin) / c.height })));
        if (Date.now() - lastSent.current > 10_000) {
          lastSent.current = Date.now();
          track({ museum, type: "people", value: people.length });
        }
        await new Promise((r) => setTimeout(r, 900));
      }
    };
    loop();
    return () => {
      alive = false;
    };
  }, [on, museum]);

  return (
    <>
      <Header back="/" title={t("sensor.title")} />
      <Page className="max-w-3xl">
        <h1 className="text-[34px] font-extrabold tracking-tight">{t("sensor.title")}</h1>
        <p className="mt-2 max-w-xl text-[15px] text-muted">{t("sensor.desc")}</p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Segmented value={museum} onChange={setMuseum} options={MUSEUMS.map((m) => ({ value: m.id, label: m.short }))} />
          {on ? (
            <Button variant="ghost" onClick={stop} icon={<Power size={16} />}>
              {t("sensor.stop")}
            </Button>
          ) : (
            <Button onClick={start} disabled={loading} icon={loading ? <Loader2 className="animate-spin" size={16} /> : <Power size={16} />}>
              {t("sensor.start")}
            </Button>
          )}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-[1.4fr_1fr]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-neutral-900">
            <video ref={video} playsInline muted className="h-full w-full scale-x-[-1] object-cover opacity-80 blur-[6px]" />
            <canvas ref={canvas} className="hidden" />
            {boxes.map((b, i) => (
              <motion.span
                key={i}
                layout
                className="absolute rounded-2xl border-2 border-accent shadow-glow"
                style={{ left: `${(1 - b.x - b.w) * 100}%`, top: `${b.y * 100}%`, width: `${b.w * 100}%`, height: `${b.h * 100}%` }}
              />
            ))}
            {!on && (
              <div className="absolute inset-0 grid place-items-center text-white/60">
                <Users size={48} />
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
            <div className="card p-5">
              <p className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-muted">
                {on && <StatusDot />} {t("sensor.now")}
              </p>
              <p className="num mt-2 text-[72px] leading-none">{count}</p>
            </div>
            <div className="card p-5">
              <p className="text-[12px] font-bold uppercase tracking-wider text-muted">{t("sensor.peak")}</p>
              <p className="num mt-2 text-[72px] leading-none text-muted">{peak}</p>
            </div>
          </div>
        </div>
        <p className="mt-5 flex items-center gap-2 text-[13px] text-muted">
          <ShieldCheck size={15} /> A imagem aparece desfocada e nunca sai do aparelho.
        </p>
      </Page>
    </>
  );
}
