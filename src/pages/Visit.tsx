import { Accessibility, Clock, Coffee, ExternalLink, Gift, MapPin, Ticket, TrainFront } from "lucide-react";
import type { ReactNode } from "react";
import { Header } from "@/components/Shell";
import { Page, StatusDot } from "@/components/ui";
import { useMuseum } from "@/context/Museum";
import { useSettings } from "@/context/Settings";
import { openStatus } from "@/lib/hours";
import { tr } from "@/lib/utils";
import { exhibitionState } from "./MuseumHome";

function Block({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <section className="card p-5">
      <h2 className="mb-3 flex items-center gap-2 text-[17px] font-extrabold">
        <span className="text-accent">{icon}</span> {title}
      </h2>
      {children}
    </section>
  );
}

export default function Visit() {
  const m = useMuseum();
  const { t, lang } = useSettings();
  const st = openStatus(m);
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(m.address)}`;

  return (
    <>
      <Header />
      <Page>
        <p className="eyebrow">{m.short}</p>
        <h1 className="mt-1 text-[34px] font-extrabold tracking-tight md:text-[44px]">{t("info.title")}</h1>
        <p className="mt-2 flex items-center gap-2 text-[15px] font-semibold">
          <StatusDot color={st.open ? "success" : "danger"} /> {st.open ? t("home.openNow") : t("home.closedNow")}
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Block icon={<Clock size={19} />} title={t("info.hours")}>
            <ul className="divide-y hairline">
              {m.hours.map((h, i) => (
                <li key={i} className="flex items-start justify-between gap-3 py-2.5">
                  <span className="font-semibold">{tr(h.days, lang)}</span>
                  <span className="text-right">
                    <span className="num text-[17px]">{h.time}</span>
                    {h.note && <span className="block text-[12.5px] text-muted">{tr(h.note, lang)}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </Block>

          <Block icon={<Ticket size={19} />} title={t("info.tickets")}>
            <ul className="divide-y hairline">
              {m.tickets.map((tk, i) => (
                <li key={i} className="flex items-center justify-between gap-3 py-2.5">
                  <span className="font-semibold">{tr(tk.label, lang)}</span>
                  <span className="num text-[20px]">{tk.price}</span>
                </li>
              ))}
            </ul>
          </Block>

          <Block icon={<Gift size={19} />} title={t("info.free")}>
            <ul className="space-y-2 text-[15px]">
              {m.free.map((f, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" /> {tr(f, lang)}
                </li>
              ))}
            </ul>
          </Block>

          <Block icon={<Accessibility size={19} />} title={t("info.access")}>
            <ul className="space-y-2 text-[15px]">
              {m.accessibility.map((f, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" /> {tr(f, lang)}
                </li>
              ))}
            </ul>
          </Block>

          <Block icon={<MapPin size={19} />} title={t("info.address")}>
            <p className="text-[15px] font-semibold">{m.address}</p>
            <p className="mt-2 flex gap-2 text-[14px] text-muted">
              <TrainFront size={17} className="shrink-0" /> {m.metro}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href={maps} target="_blank" rel="noreferrer" className="chip">
                <MapPin size={14} /> {t("routes.open")}
              </a>
              <a href={m.site} target="_blank" rel="noreferrer" className="chip">
                <ExternalLink size={14} /> {t("info.site")}
              </a>
            </div>
          </Block>

          <Block icon={<Coffee size={19} />} title={t("info.services")}>
            <ul className="space-y-2 text-[15px]">
              {m.services.map((f, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" /> {tr(f, lang)}
                </li>
              ))}
            </ul>
          </Block>
        </div>

        <section className="mt-12">
          <h2 className="text-[26px] font-extrabold">{t("home.exhibitions")}</h2>
          <div className="mt-4 divide-y hairline rounded-3xl border hairline bg-surface">
            {m.exhibitions
              .filter((e) => exhibitionState(e) !== "past")
              .map((e) => (
                <a key={e.id} href={e.url} target="_blank" rel="noreferrer" className="block p-5 hover:bg-ink/[0.02]">
                  <p className="flex items-center gap-2 text-[12px] font-semibold">
                    <StatusDot color={exhibitionState(e) === "now" ? "success" : "warning"} />
                    <span className={exhibitionState(e) === "now" ? "text-success" : "text-warning"}>
                      {exhibitionState(e) === "now" ? t("home.exhibitions") : t("home.soon")}
                    </span>
                    <span className="text-muted">{e.dates}</span>
                  </p>
                  <p className="mt-1.5 text-[18px] font-extrabold">{e.title}</p>
                  {e.location && <p className="text-[13px] text-muted">{e.location}</p>}
                  <p className="body-copy mt-2 text-[14.5px]">{tr(e.description, lang)}</p>
                </a>
              ))}
          </div>
        </section>

        <section className="mt-12 grid gap-8 md:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="text-[26px] font-extrabold">{t("info.about")}</h2>
            <p className="body-copy mt-3 text-[16px]">{tr(m.about, lang)}</p>
          </div>
          <div>
            <h2 className="text-[26px] font-extrabold">{t("info.history")}</h2>
            <ol className="mt-4 space-y-0">
              {m.timeline.map((ev, i) => (
                <li key={i} className="relative flex gap-4 pb-6 last:pb-0">
                  <span className="num w-14 shrink-0 text-right text-[20px] text-accent">{ev.year}</span>
                  <span className="relative border-l-2 border-accent/25 pl-4 text-[15px] leading-relaxed">
                    <span className="absolute -left-[7px] top-2 h-3 w-3 rounded-full bg-accent" />
                    {tr(ev.text, lang)}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <p className="mt-10 text-[12.5px] text-muted">{t("info.disclaimer")}</p>
      </Page>
    </>
  );
}
