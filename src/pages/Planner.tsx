import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Baby, Clock, Headphones, Heart, Square, RotateCcw, Smartphone, Sparkles, Star, Trophy, User, Users, UsersRound } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useMemo, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArtImage } from "@/components/ArtImage";
import { Header } from "@/components/Shell";
import { Button, Chip, Page } from "@/components/ui";
import { useMuseum } from "@/context/Museum";
import { useSettings } from "@/context/Settings";
import type { Theme } from "@/data/types";
import type { StringKey } from "@/i18n/strings";
import { track } from "@/lib/analytics";
import { useFavorites } from "@/lib/favorites";
import { planRoute, type Profile, type Stop } from "@/lib/recommender";
import { useSpeech } from "@/lib/speech";
import { cn, tr } from "@/lib/utils";

const TIMES = [30, 60, 90, 120];

export default function Planner() {
  const m = useMuseum();
  const { t, lang, family, set } = useSettings();
  const { favs } = useFavorites();
  const { speak, stop, speaking } = useSpeech(lang);
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [minutes, setMinutes] = useState(60);
  const [profile, setProfile] = useState<Profile>(family ? "family" : "solo");
  const [themes, setThemes] = useState<Theme[]>([]);
  const [stops, setStops] = useState<Stop[] | null>(null);

  const available = useMemo(() => [...new Set(m.artworks.map((a) => a.theme))], [m]);
  const spaceOrder = useMemo(() => new Map(m.spaces.map((s, i) => [s.id, i])), [m]);

  const profiles: { id: Profile; icon: ReactNode; label: StringKey }[] = [
    { id: "solo", icon: <User />, label: "plan.solo" },
    { id: "couple", icon: <Users />, label: "plan.couple" },
    { id: "family", icon: <Baby />, label: "plan.family" },
    { id: "group", icon: <UsersRound />, label: "plan.group" },
  ];

  const generate = () => {
    const myFavs = favs.filter((f) => f.startsWith(`${m.id}:`)).map((f) => f.split(":")[1]);
    const r = planRoute(m.artworks, { minutes, profile, themes, favorites: myFavs }, spaceOrder);
    setStops(r);
    setStep(3);
    if (profile === "family") set("family", true);
    track({ museum: m.id, type: "plan", value: minutes });
  };

  const routeUrl = stops ? `${location.origin}/${m.id}/roteiro?obras=${stops.map((s) => s.art.id).join(",")}` : "";

  const reasonLabel: Record<Stop["reason"], ReactNode> = {
    theme: <><Sparkles size={12} /> {t("plan.why")}</>,
    favorite: <><Heart size={12} className="fill-current" /> {t("col.saved")}</>,
    kids: <><Baby size={12} /> {t("art.kids")}</>,
    highlight: <><Star size={12} /> {t("home.highlights")}</>,
    variety: <><Sparkles size={12} /> {t("plan.why")}</>,
  };

  return (
    <>
      <Header back={step > 0 && step < 3 ? undefined : `/${m.id}`} title={t("plan.title")} />
      <Page className="max-w-3xl">
        {step < 3 && (
          <div className="mb-6 flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className={cn("h-1.5 flex-1 rounded-full transition-colors", i <= step ? "bg-accent" : "bg-ink/10")} />
            ))}
          </div>
        )}
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.2 }}>
            {step === 0 && (
              <section>
                <h1 className="text-[30px] font-extrabold leading-tight">{t("plan.time")}</h1>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {TIMES.map((n) => (
                    <button
                      key={n}
                      onClick={() => {
                        setMinutes(n);
                        setStep(1);
                      }}
                      className={cn("tap card flex flex-col items-start gap-2 p-5 text-left", minutes === n && "ring-2 ring-accent")}
                    >
                      <Clock className="text-accent" />
                      <span className="num text-[44px] leading-none">{n}</span>
                      <span className="text-[13px] font-semibold text-muted">{t("common.minutes")}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}
            {step === 1 && (
              <section>
                <h1 className="text-[30px] font-extrabold leading-tight">{t("plan.who")}</h1>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {profiles.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setProfile(p.id);
                        setStep(2);
                      }}
                      className={cn("tap card flex min-h-[120px] flex-col justify-between p-5 text-left", profile === p.id && "ring-2 ring-accent")}
                    >
                      <span className="text-accent">{p.icon}</span>
                      <span className="text-[17px] font-bold">{t(p.label)}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}
            {step === 2 && (
              <section>
                <h1 className="text-[30px] font-extrabold leading-tight">{t("plan.themes")}</h1>
                <div className="mt-6 flex flex-wrap gap-2">
                  <Chip on={themes.length === 0} onClick={() => setThemes([])} className="px-4 py-2.5 text-[15px]">
                    {t("plan.any")}
                  </Chip>
                  {available.map((th) => (
                    <Chip
                      key={th}
                      on={themes.includes(th)}
                      onClick={() => setThemes((cur) => (cur.includes(th) ? cur.filter((x) => x !== th) : [...cur, th]))}
                      className="px-4 py-2.5 text-[15px]"
                    >
                      {t(`theme.${th}` as StringKey)}
                    </Chip>
                  ))}
                </div>
                <Button size="lg" className="mt-8 w-full" onClick={generate} icon={<Sparkles size={18} />}>
                  {t("plan.generate")}
                </Button>
              </section>
            )}
            {step === 3 && stops && (
              <section>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="eyebrow">
                      {minutes} {t("common.minutes")} · {stops.length} {t("plan.stops")}
                    </p>
                    <h1 className="mt-1 text-[32px] font-extrabold leading-tight">{t("plan.result")}</h1>
                  </div>
                  <Button variant="ghost" size="sm" icon={<RotateCcw size={15} />} onClick={() => { setStep(0); setStops(null); }}>
                    {t("common.restart")}
                  </Button>
                </div>

                <Button
                  className="mt-5"
                  icon={speaking ? <Square size={16} /> : <Headphones size={18} />}
                  onClick={() => {
                    if (speaking) return stop();
                    speak(
                      stops
                        .map((s, i) => {
                          const sp = m.spaces.find((x) => x.id === s.art.space);
                          return `${i + 1}. ${tr(s.art.title, lang)}, ${s.art.artist}${sp ? `. ${sp.name}` : ""}. ${family ? tr(s.art.kids, lang) : tr(s.art.description, lang)}`;
                        })
                        .join(" "),
                    );
                    track({ museum: m.id, type: "audio", path: "route" });
                  }}
                >
                  {speaking ? t("common.stop") : t("plan.listen")}
                </Button>

                <ol className="relative mt-6 space-y-3 before:absolute before:bottom-6 before:left-[27px] before:top-6 before:w-0.5 before:bg-accent/25">
                  {stops.map((s, i) => (
                    <li key={s.art.id}>
                      <Link to={`/${m.id}/obra/${s.art.id}`} className="tap relative flex items-center gap-3 rounded-3xl bg-surface p-2.5 pr-4 shadow-soft">
                        <span className="num z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-[15px] text-accent-ink shadow-glow">{i + 1}</span>
                        <ArtImage src={s.art.thumb} alt="" color={s.art.color} className="h-16 w-14 shrink-0 rounded-xl" />
                        <span className="min-w-0 flex-1">
                          <span className="line-clamp-1 text-[15px] font-bold">{tr(s.art.title, lang)}</span>
                          <span className="block truncate text-[13px] text-muted">
                            {s.art.artist} · {m.spaces.find((sp) => sp.id === s.art.space)?.name ?? m.short}
                          </span>
                          <span className="mt-1 inline-flex items-center gap-1 text-[11.5px] font-semibold text-accent">{reasonLabel[s.reason]}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>

                <div className="mt-8 grid gap-3 md:grid-cols-2">
                  <div className="card flex flex-col justify-between gap-4 p-5">
                    <div>
                      <p className="flex items-center gap-2 text-[17px] font-extrabold">
                        <Trophy className="text-warning" size={20} /> {t("plan.hunt")}
                      </p>
                      <p className="mt-1 text-[14px] text-muted">{t("plan.hunt.desc")}</p>
                    </div>
                    <Button onClick={() => navigate(`/${m.id}/roteiro?obras=${stops.map((s) => s.art.id).join(",")}`)} icon={<ArrowRight size={17} />}>
                      {t("common.start")}
                    </Button>
                  </div>
                  <div className="card flex items-center gap-4 p-5">
                    <div className="rounded-2xl bg-white p-2.5">
                      <QRCodeSVG value={routeUrl} size={112} level="M" onClick={() => track({ museum: m.id, type: "qr" })} />
                    </div>
                    <div>
                      <p className="flex items-center gap-2 text-[17px] font-extrabold">
                        <Smartphone size={18} /> {t("plan.phone")}
                      </p>
                      <p className="mt-1 text-[13.5px] text-muted">{t("plan.phone.desc")}</p>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </motion.div>
        </AnimatePresence>
      </Page>
    </>
  );
}
