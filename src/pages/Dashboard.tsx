import { AnimatePresence, motion } from "framer-motion";
import {
  Accessibility,
  ArrowLeft,
  Clock,
  Download,
  FlaskConical,
  Globe2,
  Lightbulb,
  MessageSquareText,
  MousePointerClick,
  Radio,
  ScanLine,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArtImage } from "@/components/ArtImage";
import { KoraWordmark } from "@/components/KoraMark";
import { Button, Page, Segmented, StatusDot } from "@/components/ui";
import { useSettings } from "@/context/Settings";
import { accentOn, loadArtIndex, MUSEUMS, museumMeta, type ArtIndexItem } from "@/data/museums";
import { PARTNERS } from "@/data/partners";
import type { Theme } from "@/data/types";
import type { StringKey } from "@/i18n/strings";
import { backendReady, supabase } from "@/lib/analytics";
import { analyze, compareMuseums, generateDemo, type Ev, type Insights } from "@/lib/insights";
import { cn } from "@/lib/utils";

const PASS = "000";
const TYPE_LABEL: Record<string, string> = {
  view: "Navegação",
  artwork_view: "Obra aberta",
  scan: "Tentativa de scanner",
  scan_match: "Obra reconhecida no scanner",
  ad_view: "Anúncio exibido",
  ad_click: "Cupom de parceiro gerado",
  scan_ai: "Scanner com IA",
  chat: "Pergunta à IA",
  plan: "Roteiro criado",
  hunt_found: "Caça ao tesouro concluída",
  quiz_done: "Quiz concluído",
  favorite: "Obra salva",
  audio: "Audioguia",
  qr: "Roteiro levado no celular",
  people: "Sensor de público",
  session_start: "Novo visitante",
  pref: "Preferência ajustada",
};
const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const DAYS_FULL = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];
const LANG_LABEL: Record<string, string> = { pt: "Português", en: "Inglês", es: "Espanhol" };
const DEVICE_LABEL: Record<string, string> = { mobile: "Celular", totem: "Totem", desktop: "Computador" };
const ACCESS_LABEL: Record<string, string> = {
  family: "Modo família",
  fontScale: "Letra maior",
  highContrast: "Alto contraste",
  libras: "Libras (VLibras)",
  reduceMotion: "Menos animação",
};
const FUNNEL_LABEL: Record<string, string> = {
  enter: "Entraram no app",
  artwork: "Abriram ao menos uma obra",
  feature: "Usaram scanner, IA, áudio, roteiro ou jogos",
  favorite: "Salvaram uma obra favorita",
};

type Period = "today" | "7d" | "30d";
type Source = "live" | "demo";

/* ---------------- peças visuais ---------------- */

function ago(iso: string) {
  const s = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)} min`;
  return `${Math.floor(s / 3600)} h`;
}

const fmt = (n: number) => n.toLocaleString("pt-BR");
const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0);

function Kpi({ icon, label, value, unit, hint, pulse }: { icon: ReactNode; label: string; value: ReactNode; unit?: string; hint?: string; pulse?: boolean }) {
  return (
    <div className="card p-5">
      <p className="flex items-center gap-2 text-[12px] font-semibold text-muted">
        {pulse ? <StatusDot /> : icon} {label}
      </p>
      <p className="mt-3 flex items-baseline gap-1.5">
        <motion.span key={String(value)} initial={{ opacity: 0.4, y: 4 }} animate={{ opacity: 1, y: 0 }} className="num text-[40px] leading-none md:text-[48px]">
          {value}
        </motion.span>
        {unit && <span className="text-[15px] font-bold text-muted">{unit}</span>}
      </p>
      {hint && <p className="mt-1.5 text-[12.5px] leading-snug text-muted">{hint}</p>}
    </div>
  );
}

function Card({ title, desc, children, className, right }: { title: string; desc?: string; children: ReactNode; className?: string; right?: ReactNode }) {
  return (
    <section className={cn("card p-5 md:p-6", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[16px] font-extrabold">{title}</h2>
          {desc && <p className="mt-0.5 text-[12.5px] text-muted">{desc}</p>}
        </div>
        {right}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

/** Barra horizontal com rótulo e valor em texto (a cor nunca carrega o significado sozinha). */
function BarRow({ label, value, max, total, color }: { label: string; value: number; max: number; total?: number; color?: string }) {
  return (
    <div title={`${label}: ${fmt(value)}${total ? ` (${pct(value, total)}%)` : ""}`}>
      <div className="flex items-baseline justify-between gap-3 text-[13.5px]">
        <span className="min-w-0 truncate font-semibold">{label}</span>
        <span className="num shrink-0">
          {fmt(value)}
          {total != null && <span className="ml-1.5 text-[12px] font-semibold text-muted">{pct(value, total)}%</span>}
        </span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-ink/[0.06]">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color ?? "rgb(var(--ink))" }}
          initial={{ width: 0 }}
          animate={{ width: `${max ? Math.max(2, (value / max) * 100) : 0}%` }}
          transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        />
      </div>
    </div>
  );
}

function Empty() {
  return <p className="py-8 text-center text-[13px] text-muted">Sem dados no período</p>;
}

/** Mapa de calor: dia da semana x hora de chegada dos visitantes. */
function Heatmap({ data }: { data: Insights }) {
  const [hover, setHover] = useState<{ d: number; h: number; v: number } | null>(null);
  const hours = Array.from({ length: 13 }, (_, i) => i + 9); // 9h às 21h
  const max = Math.max(1, ...data.heat.flatMap((row) => hours.map((h) => row[h])));
  return (
    <div>
      <div className="no-scrollbar overflow-x-auto">
        <div className="grid min-w-[520px] gap-[3px]" style={{ gridTemplateColumns: `40px repeat(${hours.length}, minmax(0,1fr))` }}>
          <span />
          {hours.map((h) => (
            <span key={h} className="pb-1 text-center text-[12.5px] font-semibold text-muted">
              {h}h
            </span>
          ))}
          {WEEK_ORDER.map((d) => (
            <div key={d} className="contents">
              <span className="flex items-center text-[12px] font-bold text-muted">{DAYS[d]}</span>
              {hours.map((h) => {
                const v = data.heat[d][h];
                const on = hover?.d === d && hover?.h === h;
                return (
                  <button
                    key={h}
                    type="button"
                    onMouseEnter={() => setHover({ d, h, v })}
                    onFocus={() => setHover({ d, h, v })}
                    onMouseLeave={() => setHover(null)}
                    aria-label={`${DAYS_FULL[d]}, ${h}h: ${v} visitantes`}
                    className={cn("aspect-[1.6] rounded-[6px] transition-transform duration-150", on && "scale-110 ring-2 ring-ink")}
                    style={{ backgroundColor: v ? `rgb(var(--ink) / ${0.07 + (v / max) * 0.88})` : "rgb(var(--ink) / 0.03)" }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[12px] text-muted">
        <span className="h-5">
          {hover ? (
            <>
              <b className="text-ink">
                {DAYS_FULL[hover.d]}, {hover.h}h às {hover.h + 1}h
              </b>
              : {fmt(hover.v)} visitantes chegaram
            </>
          ) : (
            "Passe o mouse sobre um horário"
          )}
        </span>
        <span className="flex items-center gap-1.5">
          menos
          {[0.1, 0.3, 0.55, 0.8, 0.95].map((o) => (
            <span key={o} className="h-3 w-3 rounded-[3px]" style={{ backgroundColor: `rgb(var(--ink) / ${o})` }} />
          ))}
          mais
        </span>
      </div>
    </div>
  );
}

function buildInsights(d: Insights, t: (k: StringKey) => string): { icon: ReactNode; text: ReactNode }[] {
  if (!d.visitors) return [];
  const out: { icon: ReactNode; text: ReactNode }[] = [];
  if (d.peak.v) {
    out.push({
      icon: <Clock size={18} />,
      text: (
        <>
          O maior movimento é <b>{DAYS_FULL[d.peak.day]} por volta das {d.peak.hour}h</b>. Bom horário para reforçar a equipe educativa.
        </>
      ),
    });
  }
  const foreign = d.langs.filter(([l]) => l !== "pt").reduce((a, [, v]) => a + v, 0);
  if (foreign) {
    out.push({
      icon: <Globe2 size={18} />,
      text: (
        <>
          <b>{pct(foreign, d.visitors)}% dos visitantes</b> usaram o app em inglês ou espanhol. Sem a KORA, eles ficariam só com a etiqueta em português.
        </>
      ),
    });
  }
  if (d.themes[0]) {
    out.push({
      icon: <Lightbulb size={18} />,
      text: (
        <>
          O tema que mais desperta interesse é <b>{t(`theme.${d.themes[0][0]}` as StringKey)}</b>, com {pct(d.themes[0][1], d.themes.reduce((a, [, x]) => a + x, 0))}% das obras procuradas.
        </>
      ),
    });
  }
  const access = d.access.reduce((a, x) => a + x.v, 0);
  if (access) {
    out.push({
      icon: <Accessibility size={18} />,
      text: (
        <>
          <b>{fmt(access)} visitas</b> usaram recursos de acessibilidade ou o modo família.
        </>
      ),
    });
  } else if (d.scanRate != null) {
    out.push({
      icon: <ScanLine size={18} />,
      text: (
        <>
          O scanner reconheceu <b>{d.scanRate}% das obras</b> apontadas pelo público.
        </>
      ),
    });
  }
  return out.slice(0, 4);
}

function toCsv(events: Ev[]) {
  const cols: (keyof Ev)[] = ["created_at", "museum", "type", "artwork_id", "path", "device", "lang", "value", "session_id"];
  const esc = (v: unknown) => (v == null ? "" : `"${String(v).replace(/"/g, '""')}"`);
  return [cols.join(","), ...events.map((e) => cols.map((c) => esc(e[c])).join(","))].join("\n");
}

/* ---------------- página ---------------- */

export default function Dashboard() {
  const { t, isDark } = useSettings();
  const ok = true; // painel aberto (sem senha) para demonstração
  const [events, setEvents] = useState<Ev[]>([]);
  const [museum, setMuseum] = useState<string>("all");
  const [period, setPeriod] = useState<Period>("7d");
  const [source, setSource] = useState<Source>(backendReady ? "live" : "demo");
  const [status, setStatus] = useState<"loading" | "live" | "offline">("loading");
  const [indexList, setIndexList] = useState<ArtIndexItem[]>([]);
  const fresh = useRef<Set<number>>(new Set());

  useEffect(() => {
    loadArtIndex().then(setIndexList);
  }, []);
  const index = useMemo(() => new Map(indexList.map((x) => [x.id, x])), [indexList]);
  const demo = useMemo(() => (indexList.length ? generateDemo(indexList, MUSEUMS, Date.now(), PARTNERS) : []), [indexList]);

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
        const since = new Date(Date.now() - 30 * 864e5).toISOString();
        const { data, error } = await sb.from("events").select("*").gte("created_at", since).order("created_at", { ascending: false }).limit(20000);
        if (error) throw error;
        if (!alive) return;
        setEvents((data ?? []) as Ev[]);
        setStatus("live");
        const ch = sb
          .channel("kora-events")
          .on("postgres_changes", { event: "INSERT", schema: "public", table: "events" }, (payload) => {
            const e = payload.new as Ev;
            fresh.current.add(e.id);
            setEvents((cur) => [e, ...cur].slice(0, 25000));
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

  const base = source === "demo" ? demo : events;

  const inPeriod = useMemo(() => {
    const now = Date.now();
    const sp0 = new Date(now - 3 * 3600e3);
    const todayStart = Date.UTC(sp0.getUTCFullYear(), sp0.getUTCMonth(), sp0.getUTCDate()) + 3 * 3600e3;
    const start = period === "today" ? todayStart : now - (period === "7d" ? 7 : 30) * 864e5;
    return base.filter((e) => new Date(e.created_at).getTime() >= start);
  }, [base, period]);

  // filtra por museu pela sessão inteira (o visitante entra pela rede e depois escolhe o museu)
  const filtered = useMemo(() => {
    if (museum === "all") return inPeriod;
    const all = analyze(inPeriod, index);
    const ids = new Set(all.sessions.filter((s) => s.museum === museum).map((s) => s.id));
    return inPeriod.filter((e) => ids.has(e.session_id) || (e.type === "people" && e.museum === museum));
  }, [inPeriod, museum, index]);

  const d = useMemo(() => analyze(filtered, index), [filtered, index]);
  const network = useMemo(() => (museum === "all" ? compareMuseums(inPeriod, index, MUSEUMS) : []), [inPeriod, index, museum]);
  const lastPeople = (id: string) => base.find((e) => e.type === "people" && e.museum === id);
  const peopleEvents = museum === "all" ? MUSEUMS.map((m) => lastPeople(m.id)).filter((e): e is Ev => !!e) : [lastPeople(museum)].filter((e): e is Ev => !!e);
  const peopleNow = peopleEvents.length ? peopleEvents.reduce((a, e) => a + (e.value ?? 0), 0) : null;
  const insights = buildInsights(d, t);

  const grid = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const tick = { fill: isDark ? "#98989D" : "#6E6E73", fontSize: 12 };
  const accent = museum === "all" ? (isDark ? "#F5F5F7" : "#1D1D1F") : (accentOn(museumMeta(museum), isDark) ?? "#1D1D1F");
  const featMax = d.features[0]?.[1] ?? 1;

  const download = () => {
    const blob = new Blob([toCsv(filtered)], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `kora-metricas-${museum}-${period}${source === "demo" ? "-simulacao" : ""}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <>
      <header className="glass sticky top-0 z-40 border-b hairline">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 md:px-8">
          <Link to="/museus">
            <KoraWordmark size="sm" />
          </Link>
          <span className="hidden text-[15px] font-bold text-muted sm:inline">/ {t("admin.title")}</span>
          <span className="ml-auto flex items-center gap-2 rounded-full bg-ink/[0.05] px-3 py-1.5 text-[12.5px] font-bold">
            {source === "demo" ? (
              <>
                <FlaskConical size={14} /> Simulação
              </>
            ) : status === "live" ? (
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
          <Link to="/museus" className="tap grid h-10 w-10 place-items-center rounded-full bg-ink/[0.06]" aria-label="Voltar">
            <ArrowLeft size={17} />
          </Link>
        </div>
      </header>

      <Page className="max-w-7xl pb-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Inteligência de público</p>
            <h1 className="mt-1 text-[32px] font-extrabold leading-tight tracking-tight md:text-[40px]">{museum === "all" ? "Rede KORA" : museumMeta(museum)?.name}</h1>
          </div>
          <Button variant="outline" size="sm" icon={<Download size={15} />} onClick={download}>
            Exportar CSV
          </Button>
        </div>

        {/* filtros em uma linha */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Segmented value={museum} onChange={setMuseum} options={[{ value: "all", label: t("admin.all") }, ...MUSEUMS.map((m) => ({ value: m.id, label: m.short }))]} />
          <Segmented
            value={period}
            onChange={setPeriod}
            options={[
              { value: "today", label: t("common.today") },
              { value: "7d", label: "7 dias" },
              { value: "30d", label: "30 dias" },
            ]}
          />
          <div className="md:ml-auto">
            <Segmented
              value={source}
              onChange={setSource}
              options={[
                { value: "live", label: "Dados reais" },
                { value: "demo", label: "Simulação" },
              ]}
            />
          </div>
        </div>

        {source === "demo" && (
          <p className="mt-4 flex items-start gap-2 rounded-2xl bg-warning/15 p-3 text-[13.5px] font-semibold">
            <FlaskConical size={17} className="mt-0.5 shrink-0" />
            Simulação de 30 dias de uso para demonstrar o painel. Nenhum destes números é real. Troque para “Dados reais” para ver o que o público fez de fato.
          </p>
        )}
        {source === "live" && status === "offline" && <p className="mt-4 rounded-2xl bg-warning/15 p-3 text-[13.5px] font-semibold">{t("admin.demo")}</p>}
        {source === "live" && status === "live" && d.visitors < 10 && (
          <p className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl bg-ink/[0.05] p-3 text-[13.5px]">
            Ainda há poucos visitantes reais neste período.
            <button onClick={() => setSource("demo")} className="font-bold underline underline-offset-2">
              Ver a simulação
            </button>
          </p>
        )}

        {/* leitura rápida */}
        {insights.length > 0 && (
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {insights.map((x, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="flex gap-3 rounded-3xl bg-ink/[0.04] p-4">
                <span className="mt-0.5 shrink-0 opacity-70">{x.icon}</span>
                <p className="text-[13.5px] leading-snug [&_b]:font-extrabold">{x.text}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* números principais */}
        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          <Kpi icon={<Users size={14} />} label="Visitantes" value={fmt(d.visitors)} hint="sessões no app" pulse={source === "live" && status === "live"} />
          <Kpi icon={<Clock size={14} />} label="Tempo de visita" value={d.avgMinutes || "–"} unit={d.avgMinutes ? "min" : undefined} hint="mediana por visitante" />
          <Kpi icon={<MousePointerClick size={14} />} label="Interações" value={d.perVisitor ? d.perVisitor.toFixed(1).replace(".", ",") : "–"} hint="por visitante" />
          <Kpi icon={<ScanLine size={14} />} label="Scanner" value={d.scanRate ?? "–"} unit={d.scanRate != null ? "%" : undefined} hint={`${fmt(d.matches)} obras reconhecidas`} />
          <Kpi
            icon={<MessageSquareText size={14} />}
            label="Perguntas à IA"
            value={fmt(d.chats)}
            hint={d.visitors ? `${pct(d.sessions.filter((s) => s.types.has("chat")).length, d.visitors)}% dos visitantes perguntaram` : undefined}
          />
          <Kpi icon={<Radio size={14} />} label="Pessoas agora" value={peopleNow ?? "–"} hint={peopleEvents[0] ? `sensor, ${ago(peopleEvents[0].created_at)} atrás` : "sensor desligado"} />
        </div>

        {/* quando */}
        <div className="mt-3 grid gap-3 lg:grid-cols-5">
          <Card
            className="lg:col-span-3"
            title="Quando o público vem"
            desc="Chegada dos visitantes por dia da semana e hora (horário de Brasília)"
            right={
              d.peak.v ? (
                <span className="shrink-0 rounded-full bg-ink/[0.06] px-3 py-1 text-[12px] font-bold">
                  Pico: {DAYS[d.peak.day]} {d.peak.hour}h
                </span>
              ) : null
            }
          >
            {d.visitors ? <Heatmap data={d} /> : <Empty />}
          </Card>
          <Card className="lg:col-span-2" title="Visitantes por dia" desc="Tendência no período">
            {d.daily.length ? (
              <div className="h-[230px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={d.daily.map((x) => ({ ...x, label: x.date.slice(8, 10) + "/" + x.date.slice(5, 7) }))} margin={{ left: -12, right: 6, top: 6 }}>
                    <defs>
                      <linearGradient id="kfill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor={accent} stopOpacity={0.25} />
                        <stop offset="100%" stopColor={accent} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke={grid} />
                    <XAxis dataKey="label" tick={tick} axisLine={false} tickLine={false} minTickGap={18} />
                    <YAxis tick={tick} axisLine={false} tickLine={false} allowDecimals={false} width={40} />
                    <Tooltip
                      cursor={{ stroke: grid, strokeWidth: 1 }}
                      contentStyle={{ borderRadius: 14, border: "none", background: isDark ? "#1C1C1E" : "#fff", boxShadow: "0 8px 30px rgba(0,0,0,.12)" }}
                      formatter={(v) => [fmt(Number(v)), "Visitantes"]}
                    />
                    <Area type="monotone" dataKey="v" stroke={accent} strokeWidth={2} fill="url(#kfill)" activeDot={{ r: 5, strokeWidth: 2, stroke: isDark ? "#000" : "#fff" }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <Empty />
            )}
            {d.visitors > 0 && (
              <div className="mt-3 grid grid-cols-7 gap-1 text-center">
                {WEEK_ORDER.map((day) => (
                  <div key={day} className="rounded-xl bg-ink/[0.04] py-1.5">
                    <p className="text-[10.5px] font-bold text-muted">{DAYS[day]}</p>
                    <p className="num text-[14px]">{fmt(d.byDay[day])}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* como usa */}
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <Card title="Jornada do visitante" desc="Quantos avançam em cada etapa da experiência">
            {d.visitors ? (
              <div className="space-y-3.5">
                {d.funnel.map((f, i) => (
                  <BarRow key={f.key} label={`${i + 1}. ${FUNNEL_LABEL[f.key]}`} value={f.v} max={d.visitors} total={d.visitors} color={accent} />
                ))}
              </div>
            ) : (
              <Empty />
            )}
          </Card>
          <Card title={t("admin.features")} desc="O que o público mais usa no app">
            {d.features.length ? (
              <div className="space-y-3">
                {d.features.slice(0, 7).map(([k, v]) => (
                  <BarRow key={k} label={TYPE_LABEL[k] ?? k} value={v} max={featMax} />
                ))}
              </div>
            ) : (
              <Empty />
            )}
          </Card>
        </div>

        {/* do que gosta */}
        <div className="mt-3 grid gap-3 lg:grid-cols-3">
          <Card title="Obras mais procuradas" desc="Abertas, escaneadas, ouvidas ou salvas">
            <ol className="space-y-2.5">
              {d.works.slice(0, 6).map(([id, n], i) => {
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
                    <span className="num text-[18px]">{fmt(n)}</span>
                  </li>
                );
              })}
            </ol>
            {!d.works.length && <Empty />}
          </Card>
          <Card title="Temas preferidos" desc="Interesse do público por tipo de acervo">
            {d.themes.length ? (
              <div className="space-y-3">
                {d.themes.map(([th, v]) => (
                  <BarRow key={th} label={t(`theme.${th as Theme}` as StringKey)} value={v} max={d.themes[0][1]} total={d.themes.reduce((a, [, x]) => a + x, 0)} color={accent} />
                ))}
              </div>
            ) : (
              <Empty />
            )}
          </Card>
          <Card title="Artistas mais procurados">
            {d.artists.length ? (
              <div className="space-y-3">
                {d.artists.map(([name, v]) => (
                  <BarRow key={name} label={name} value={v} max={d.artists[0][1]} />
                ))}
              </div>
            ) : (
              <Empty />
            )}
          </Card>
        </div>

        {/* quem é */}
        <div className="mt-3 grid gap-3 lg:grid-cols-3">
          <Card title="Idiomas" desc="Língua escolhida pelo visitante">
            {d.langs.length ? (
              <div className="space-y-3">
                {d.langs.map(([l, v]) => (
                  <BarRow key={l} label={LANG_LABEL[l] ?? l} value={v} max={d.langs[0][1]} total={d.visitors} />
                ))}
              </div>
            ) : (
              <Empty />
            )}
          </Card>
          <Card title={t("admin.devices")} desc="Por onde o público acessa">
            {d.devices.length ? (
              <div className="space-y-3">
                {d.devices.map(([k, v]) => (
                  <BarRow key={k} label={DEVICE_LABEL[k] ?? k} value={v} max={d.devices[0][1]} total={d.visitors} />
                ))}
              </div>
            ) : (
              <Empty />
            )}
          </Card>
          <Card title="Acessibilidade e famílias" desc="Visitantes que ativaram cada recurso">
            {d.visitors ? (
              <div className="space-y-3">
                {d.access.map((x) => (
                  <BarRow key={x.key} label={ACCESS_LABEL[x.key]} value={x.v} max={Math.max(1, ...d.access.map((y) => y.v))} total={d.visitors} />
                ))}
                {d.quizAvg != null && (
                  <p className="pt-1 text-[12.5px] text-muted">
                    Média de acertos no quiz: <b className="text-ink">{d.quizAvg.toFixed(1).replace(".", ",")} de 5</b>
                  </p>
                )}
              </div>
            ) : (
              <Empty />
            )}
          </Card>
        </div>

        {/* mídia e parceiros */}
        <Card className="mt-3" title="Mídia e parceiros" desc="Receita extra para o museu: anúncios de parceiros do entorno com cupom de desconto">
          {d.ads.length ? (
            <>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Impressões", v: fmt(d.ads.reduce((a, x) => a + x.views, 0)) },
                  { label: "Cupons gerados", v: fmt(d.ads.reduce((a, x) => a + x.clicks, 0)) },
                  {
                    label: "Taxa de clique",
                    v: `${((d.ads.reduce((a, x) => a + x.clicks, 0) / Math.max(1, d.ads.reduce((a, x) => a + x.views, 0))) * 100).toFixed(1).replace(".", ",")}%`,
                  },
                ].map((k) => (
                  <div key={k.label} className="rounded-2xl bg-ink/[0.04] p-4">
                    <p className="text-[12.5px] font-semibold text-muted">{k.label}</p>
                    <p className="num mt-1 text-[28px] leading-none md:text-[34px]">{k.v}</p>
                  </div>
                ))}
              </div>
              <div className="no-scrollbar -mx-1 mt-4 overflow-x-auto">
                <table className="w-full min-w-[520px] text-left text-[13.5px]">
                  <thead>
                    <tr className="text-[11.5px] text-muted">
                      <th className="px-2 pb-2 font-bold">Parceiro</th>
                      <th className="px-2 pb-2 font-bold">Museu</th>
                      <th className="px-2 pb-2 text-right font-bold">Impressões</th>
                      <th className="px-2 pb-2 text-right font-bold">Cupons</th>
                      <th className="px-2 pb-2 text-right font-bold">Taxa de clique</th>
                    </tr>
                  </thead>
                  <tbody>
                    {d.ads.map((a) => {
                      const p = PARTNERS.find((x) => x.id === a.id);
                      return (
                        <tr key={a.id} className="border-t hairline">
                          <td className="px-2 py-2.5 font-bold">{p?.name ?? a.id}</td>
                          <td className="px-2 py-2.5">{museumMeta(p?.museum ?? "")?.short ?? "–"}</td>
                          <td className="num px-2 py-2.5 text-right">{fmt(a.views)}</td>
                          <td className="num px-2 py-2.5 text-right">{fmt(a.clicks)}</td>
                          <td className="num px-2 py-2.5 text-right">{a.ctr.toFixed(1).replace(".", ",")}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-[12px] text-muted">Parceiros de exemplo. Cada museu cadastra os seus anunciantes e recebe este relatório para renovar e precificar os contratos.</p>
            </>
          ) : (
            <Empty />
          )}
        </Card>

        {/* comparativo da rede */}
        {museum === "all" && network.some((n) => n.visitors) && (
          <Card className="mt-3" title="Comparativo da rede" desc="Cada museu lado a lado no mesmo período">
            <div className="no-scrollbar -mx-1 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-[13.5px]">
                <thead>
                  <tr className="text-[11.5px] text-muted">
                    <th className="px-2 pb-2 font-bold">Museu</th>
                    <th className="px-2 pb-2 text-right font-bold">Visitantes</th>
                    <th className="px-2 pb-2 text-right font-bold">Tempo médio</th>
                    <th className="px-2 pb-2 text-right font-bold">Interações</th>
                    <th className="px-2 pb-2 font-bold">Pico</th>
                    <th className="px-2 pb-2 font-bold">Obra mais procurada</th>
                  </tr>
                </thead>
                <tbody>
                  {network.map((n) => {
                    const w = n.works[0] ? index.get(n.works[0][0]) : undefined;
                    return (
                      <tr key={n.museum.id} className="border-t hairline">
                        <td className="px-2 py-3">
                          <span className="flex items-center gap-2 font-bold">
                            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: n.museum.accent }} />
                            {n.museum.short}
                          </span>
                        </td>
                        <td className="num px-2 py-3 text-right text-[16px]">{fmt(n.visitors)}</td>
                        <td className="num px-2 py-3 text-right">{n.avgMinutes ? `${n.avgMinutes} min` : "–"}</td>
                        <td className="num px-2 py-3 text-right">{n.perVisitor ? n.perVisitor.toFixed(1).replace(".", ",") : "–"}</td>
                        <td className="px-2 py-3">{n.peak.v ? `${DAYS[n.peak.day]} ${n.peak.hour}h` : "–"}</td>
                        <td className="max-w-[240px] truncate px-2 py-3">{w ? `${w.title}, ${w.artist}` : "–"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* ao vivo */}
        <Card className="mt-3" title={t("admin.feed")} desc={source === "demo" ? "Últimos eventos da simulação" : "Atualiza sozinho a cada ação do público"}>
          <ul className="grid gap-x-6 md:grid-cols-2">
            <AnimatePresence initial={false}>
              {filtered
                .filter((e) => !["view", "people", "ad_view", "pref"].includes(e.type))
                .slice(0, 10)
                .map((e) => {
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
                      <span className="w-10 shrink-0 rounded-md py-0.5 text-center text-[10.5px] font-extrabold text-white" style={{ backgroundColor: m?.accent ?? "#666" }}>
                        {m?.short ?? "KORA"}
                      </span>
                      <span className="min-w-0 flex-1 truncate">
                        <b>{TYPE_LABEL[e.type] ?? e.type}</b>
                        {art && <span className="text-muted"> · {art.title}</span>}
                        {e.lang && e.lang !== "pt" && <span className="ml-1 text-[11px] font-bold uppercase text-muted">{e.lang}</span>}
                      </span>
                      <span className="shrink-0 text-[11.5px] text-muted">{ago(e.created_at)}</span>
                    </motion.li>
                  );
                })}
            </AnimatePresence>
          </ul>
          {!filtered.length && <p className="py-6 text-center text-muted">Aguardando atividade…</p>}
        </Card>

        <p className="mt-6 text-[12.5px] leading-relaxed text-muted">
          Métricas 100% anônimas: sem nome, e-mail, imagem ou localização. Cada visita recebe um identificador aleatório, apagado ao fechar o navegador. A contagem de pessoas usa IA no próprio aparelho e não grava imagens.
        </p>
      </Page>
    </>
  );
}
