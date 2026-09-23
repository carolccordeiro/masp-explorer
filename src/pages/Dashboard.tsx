import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Lock, LogOut, Users } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArtImage } from "@/components/ArtImage";
import { KoraWordmark } from "@/components/KoraMark";
import { Button, Page, Segmented, StatusDot } from "@/components/ui";
import { useSettings } from "@/context/Settings";
import { loadArtIndex, MUSEUMS, museumMeta, type ArtIndexItem } from "@/data/museums";
import { backendReady, supabase } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type Ev = { id: number; created_at: string; museum: string; type: string; path: string | null; artwork_id: string | null; session_id: string; device: string | null; lang: string | null; value: number | null };

const PASS = "000";
const TYPE_LABEL: Record<string, string> = {
  view: "Navegação",
  artwork_view: "Obra aberta",
  scan: "Scanner",
  scan_match: "Obra reconhecida",
  scan_ai: "Scanner com IA",
  chat: "Pergunta à IA",
  plan: "Roteiro criado",
  hunt_found: "Caça concluída",
  quiz_done: "Quiz concluído",
  favorite: "Obra salva",
  audio: "Áudio-guia",
  qr: "QR Code",
  people: "Sensor",
  session_start: "Nova sessão",
};

function Gate({ onOk }: { onOk: () => void }) {
  const { t } = useSettings();
  const [v, setV] = useState("");
  const [err, setErr] = useState(false);
  return (
    <div className="grid min-h-[100dvh] place-items-center px-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (v === PASS) {
            try {
              sessionStorage.setItem("kora-admin", "1");
            } catch {
              /* ignora */
            }
            onOk();
          } else setErr(true);
        }}
        className="card w-full max-w-sm p-7 text-center"
      >
        <KoraWordmark className="justify-center" />
        <p className="mt-6 flex items-center justify-center gap-2 text-[20px] font-extrabold">
          <Lock size={18} /> {t("admin.title")}
        </p>
        <input
          autoFocus
          type="password"
          inputMode="numeric"
          value={v}
          onChange={(e) => {
            setV(e.target.value);
            setErr(false);
          }}
          placeholder={t("admin.password")}
          className={cn("num mt-5 h-14 w-full rounded-2xl border hairline bg-bg text-center text-[26px] tracking-[0.5em] outline-none focus:ring-2 focus:ring-accent/40", err && "ring-2 ring-danger")}
        />
        {err && <p className="mt-2 text-[13px] text-danger">{t("admin.wrong")}</p>}
        <Button className="mt-5 w-full" size="lg" variant="secondary">
          {t("admin.enter")}
        </Button>
        <Link to="/" className="mt-4 inline-flex items-center gap-1 text-[13px] text-muted">
          <ArrowLeft size={14} /> KORA
        </Link>
      </form>
    </div>
  );
}

function ago(iso: string) {
  const s = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)} min`;
  return `${Math.floor(s / 3600)} h`;
}

function Kpi({ label, value, hint, pulse }: { label: string; value: number | string; hint?: string; pulse?: boolean }) {
  return (
    <div className="card p-5">
      <p className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-muted">
        {pulse && <StatusDot />} {label}
      </p>
      <motion.p key={String(value)} initial={{ opacity: 0.4, y: 4 }} animate={{ opacity: 1, y: 0 }} className="num mt-2 text-[44px] leading-none md:text-[56px]">
        {value}
      </motion.p>
      {hint && <p className="mt-1 text-[12.5px] text-muted">{hint}</p>}
    </div>
  );
}

export default function Dashboard() {
  const { t, isDark } = useSettings();
  const [ok, setOk] = useState(() => {
    try {
      return sessionStorage.getItem("kora-admin") === "1";
    } catch {
      return false;
    }
  });
  const [events, setEvents] = useState<Ev[]>([]);
  const [museum, setMuseum] = useState<string>("all");
  const [period, setPeriod] = useState<"today" | "7d">("today");
  const [status, setStatus] = useState<"loading" | "live" | "offline">("loading");
  const [index, setIndex] = useState<Map<string, ArtIndexItem>>(new Map());
  const fresh = useRef<Set<number>>(new Set());

  useEffect(() => {
    loadArtIndex().then((i) => setIndex(new Map(i.map((x) => [x.id, x]))));
  }, []);

  useEffect(() => {
    if (!ok) return;
    if (!backendReady) {
      setStatus("offline");
      return;
    }
    let alive = true;
    let unsub: (() => void) | undefined;
    (async () => {
      try {
        const sb = await supabase();
        const since = new Date(Date.now() - 7 * 864e5).toISOString();
        const { data, error } = await sb.from("events").select("*").gte("created_at", since).order("created_at", { ascending: false }).limit(5000);
        if (error) throw error;
        if (!alive) return;
        setEvents((data ?? []) as Ev[]);
        setStatus("live");
        const ch = sb
          .channel("kora-events")
          .on("postgres_changes", { event: "INSERT", schema: "public", table: "events" }, (payload) => {
            const e = payload.new as Ev;
            fresh.current.add(e.id);
            setEvents((cur) => [e, ...cur].slice(0, 6000));
          })
          .subscribe();
        unsub = () => void sb.removeChannel(ch);
      } catch {
        if (alive) setStatus("offline");
      }
    })();
    return () => {
      alive = false;
      unsub?.();
    };
  }, [ok]);

  const filtered = useMemo(() => {
    const start = period === "today" ? new Date(new Date().toDateString()).getTime() : Date.now() - 7 * 864e5;
    return events.filter((e) => (museum === "all" || e.museum === museum) && new Date(e.created_at).getTime() >= start);
  }, [events, museum, period]);

  const stats = useMemo(() => {
    const sessions = new Set(filtered.map((e) => e.session_id)).size;
    const count = (...types: string[]) => filtered.filter((e) => types.includes(e.type)).length;
    const byType = Object.entries(
      filtered.filter((e) => e.type !== "view" && e.type !== "people" && e.type !== "session_start").reduce<Record<string, number>>((acc, e) => ((acc[e.type] = (acc[e.type] ?? 0) + 1), acc), {}),
    )
      .map(([k, v]) => ({ name: TYPE_LABEL[k] ?? k, value: v }))
      .sort((a, b) => b.value - a.value);
    const works = Object.entries(
      filtered.filter((e) => e.artwork_id && (e.type === "artwork_view" || e.type === "scan_match")).reduce<Record<string, number>>((acc, e) => ((acc[e.artwork_id!] = (acc[e.artwork_id!] ?? 0) + 1), acc), {}),
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
    const hours = Array.from({ length: 24 }, (_, h) => ({ h: `${h}h`, v: 0 }));
    filtered.forEach((e) => hours[new Date(e.created_at).getHours()].v++);
    const firstH = hours.findIndex((x) => x.v > 0);
    const hoursTrim = firstH < 0 ? hours.slice(9, 21) : hours.slice(Math.min(firstH, 9), 24);
    const devices = ["totem", "mobile", "desktop"].map((d) => ({ name: d, value: filtered.filter((e) => e.device === d && e.type === "session_start").length }));
    const people = events.find((e) => e.type === "people" && (museum === "all" || e.museum === museum));
    const perMuseum = MUSEUMS.map((m) => ({ name: m.short, value: filtered.filter((e) => e.museum === m.id).length, color: m.accent }));
    return { sessions, interactions: filtered.filter((e) => e.type !== "view").length, scans: count("scan_match"), chats: count("chat"), byType, works, hours: hoursTrim, devices, people, perMuseum };
  }, [filtered, events, museum]);

  if (!ok) return <Gate onOk={() => setOk(true)} />;

  const grid = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const tick = { fill: isDark ? "#98989D" : "#6E6E73", fontSize: 12 };

  return (
    <>
      <header className="glass sticky top-0 z-40 border-b hairline">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 md:px-8">
          <Link to="/">
            <KoraWordmark size="sm" />
          </Link>
          <span className="text-[15px] font-bold text-muted">/ {t("admin.title")}</span>
          <span className="ml-auto flex items-center gap-2 rounded-full bg-ink/[0.05] px-3 py-1.5 text-[12.5px] font-bold">
            {status === "live" ? (
              <>
                <StatusDot /> {t("admin.live")}
              </>
            ) : status === "offline" ? (
              <>
                <StatusDot color="danger" /> offline
              </>
            ) : (
              "…"
            )}
          </span>
          <button
            onClick={() => {
              try {
                sessionStorage.removeItem("kora-admin");
              } catch {
                /* ignora */
              }
              setOk(false);
            }}
            className="tap grid h-10 w-10 place-items-center rounded-full bg-ink/[0.06]"
            aria-label="Sair"
          >
            <LogOut size={17} />
          </button>
        </div>
      </header>
      <Page className="max-w-7xl pb-16">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Segmented
            value={museum}
            onChange={setMuseum}
            options={[{ value: "all", label: t("admin.all") }, ...MUSEUMS.map((m) => ({ value: m.id, label: m.short }))]}
          />
          <Segmented
            value={period}
            onChange={setPeriod}
            options={[
              { value: "today", label: t("common.today") },
              { value: "7d", label: "7 dias" },
            ]}
          />
        </div>

        {status === "offline" && <p className="mt-4 rounded-2xl bg-warning/15 p-3 text-[14px] font-semibold">{t("admin.demo")}</p>}

        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-5">
          <Kpi label={t("admin.sessions")} value={stats.sessions} pulse={status === "live"} />
          <Kpi label={t("admin.interactions")} value={stats.interactions} />
          <Kpi label={t("admin.scans")} value={stats.scans} />
          <Kpi label={t("admin.chats")} value={stats.chats} />
          <Kpi label={t("admin.people")} value={stats.people?.value ?? "–"} hint={stats.people ? `${ago(stats.people.created_at)} atrás` : "Sensor desligado"} />
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-3">
          <section className="card p-5 lg:col-span-2">
            <h2 className="text-[16px] font-extrabold">{t("admin.interactions")} por hora</h2>
            <div className="mt-4 h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.hours}>
                  <CartesianGrid vertical={false} stroke={grid} />
                  <XAxis dataKey="h" tick={tick} axisLine={false} tickLine={false} />
                  <YAxis tick={tick} axisLine={false} tickLine={false} width={32} allowDecimals={false} />
                  <Tooltip cursor={{ fill: grid }} contentStyle={{ borderRadius: 14, border: "none" }} />
                  <Bar dataKey="v" name="Eventos" radius={[8, 8, 0, 0]} fill="rgb(var(--ink))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="card flex flex-col p-5">
            <h2 className="text-[16px] font-extrabold">{t("admin.feed")}</h2>
            <ul className="mt-3 flex-1 space-y-1 overflow-hidden">
              <AnimatePresence initial={false}>
                {filtered.filter((e) => e.type !== "view").slice(0, 9).map((e) => {
                  const m = museumMeta(e.museum);
                  const art = e.artwork_id ? index.get(e.artwork_id) : undefined;
                  return (
                    <motion.li
                      key={e.id}
                      layout
                      initial={{ opacity: 0, x: -12, backgroundColor: "rgba(52,199,89,0.18)" }}
                      animate={{ opacity: 1, x: 0, backgroundColor: "rgba(0,0,0,0)" }}
                      transition={{ duration: 0.6 }}
                      className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 text-[13px]"
                    >
                      <span className="w-9 shrink-0 rounded-md py-0.5 text-center text-[10.5px] font-extrabold text-white" style={{ backgroundColor: m?.accent ?? "#666" }}>
                        {m?.short ?? "KORA"}
                      </span>
                      <span className="min-w-0 flex-1 truncate">
                        <b>{TYPE_LABEL[e.type] ?? e.type}</b>
                        {art && <span className="text-muted"> · {art.title}</span>}
                      </span>
                      <span className="shrink-0 text-[11.5px] text-muted">{ago(e.created_at)}</span>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
              {!filtered.length && <li className="py-6 text-center text-muted">Aguardando atividade…</li>}
            </ul>
          </section>
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-3">
          <section className="card p-5">
            <h2 className="text-[16px] font-extrabold">{t("admin.topWorks")}</h2>
            <ol className="mt-3 space-y-2.5">
              {stats.works.map(([id, n], i) => {
                const a = index.get(id);
                if (!a) return null;
                return (
                  <li key={id} className="flex items-center gap-3">
                    <span className="num w-5 text-muted">{i + 1}</span>
                    <ArtImage src={a.thumb} alt="" color={a.color} className="h-11 w-11 shrink-0 rounded-lg" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-bold">{a.title}</span>
                      <span className="block truncate text-[12px] text-muted">
                        {museumMeta(a.museum)?.short} · {a.artist}
                      </span>
                    </span>
                    <span className="num text-[18px]">{n}</span>
                  </li>
                );
              })}
              {!stats.works.length && <li className="py-6 text-center text-muted">–</li>}
            </ol>
          </section>

          <section className="card p-5">
            <h2 className="text-[16px] font-extrabold">{t("admin.features")}</h2>
            <div className="mt-3 space-y-2.5">
              {stats.byType.slice(0, 8).map((x) => {
                const max = stats.byType[0]?.value || 1;
                return (
                  <div key={x.name}>
                    <div className="flex justify-between text-[13px]">
                      <span className="font-semibold">{x.name}</span>
                      <span className="num">{x.value}</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-ink/[0.06]">
                      <motion.div className="h-full rounded-full bg-accent" initial={{ width: 0 }} animate={{ width: `${(x.value / max) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
              {!stats.byType.length && <p className="py-6 text-center text-muted">–</p>}
            </div>
          </section>

          <section className="card p-5">
            <h2 className="text-[16px] font-extrabold">Uso por museu</h2>
            <div className="mt-2 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.perMuseum} layout="vertical" margin={{ left: 0 }}>
                  <XAxis type="number" hide allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={tick} axisLine={false} tickLine={false} width={44} />
                  <Tooltip cursor={{ fill: grid }} contentStyle={{ borderRadius: 14, border: "none" }} />
                  <Bar dataKey="value" name="Eventos" radius={[0, 8, 8, 0]}>
                    {stats.perMuseum.map((d) => (
                      <Cell key={d.name} fill={d.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <h3 className="mt-3 flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-muted">
              <Users size={14} /> {t("admin.devices")}
            </h3>
            <div className="mt-2 grid grid-cols-3 gap-2 text-center">
              {stats.devices.map((d) => (
                <div key={d.name} className="rounded-2xl bg-ink/[0.04] py-2">
                  <p className="num text-[22px]">{d.value}</p>
                  <p className="text-[11px] font-semibold capitalize text-muted">{d.name}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <p className="mt-6 text-[12.5px] text-muted">Métricas 100% anônimas: sem nome, e-mail, imagem ou localização. Identificador aleatório por sessão, apagado ao fechar o navegador.</p>
      </Page>
    </>
  );
}
