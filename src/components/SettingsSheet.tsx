import { Accessibility, Baby, LogOut, Contrast, Hand, Languages, Minus, MonitorSmartphone, Moon, Plus, Shield, Sun, SunMoon, Wind } from "lucide-react";
import { Link } from "react-router-dom";
import { useSettings } from "@/context/Settings";
import type { Lang } from "@/data/types";
import { Sheet } from "./Sheet";
import { Segmented, Switch } from "./ui";

function Row({ icon, title, desc, children }: { icon: React.ReactNode; title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 py-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-ink/[0.06] text-ink">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-semibold">{title}</p>
        {desc && <p className="text-[12.5px] leading-snug text-muted">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

export function SettingsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const s = useSettings();
  const { t } = s;
  return (
    <Sheet open={open} onClose={onClose} title={t("settings.title")}>
      <div className="divide-y hairline">
        <Row icon={<Languages size={18} />} title={t("settings.language")}>
          <Segmented<Lang>
            value={s.lang}
            onChange={(v) => s.set("lang", v)}
            options={[
              { value: "pt", label: "PT" },
              { value: "en", label: "EN" },
              { value: "es", label: "ES" },
            ]}
          />
        </Row>
        <Row icon={<SunMoon size={18} />} title={t("settings.appearance")}>
          <Segmented
            value={s.appearance}
            onChange={(v) => s.set("appearance", v)}
            options={[
              { value: "light", label: <Sun size={15} aria-label={t("settings.light")} /> },
              { value: "dark", label: <Moon size={15} aria-label={t("settings.dark")} /> },
              { value: "system", label: <MonitorSmartphone size={15} aria-label={t("settings.system")} /> },
            ]}
          />
        </Row>
        <Row icon={<Accessibility size={18} />} title={t("settings.text")}>
          <div className="flex items-center gap-1">
            <button
              aria-label="A-"
              onClick={() => s.set("fontScale", Math.max(0.9, +(s.fontScale - 0.1).toFixed(2)))}
              className="tap grid h-9 w-9 place-items-center rounded-full bg-ink/[0.06]"
            >
              <Minus size={15} />
            </button>
            <span className="num w-12 text-center text-[15px]">{Math.round(s.fontScale * 100)}%</span>
            <button
              aria-label="A+"
              onClick={() => s.set("fontScale", Math.min(1.35, +(s.fontScale + 0.1).toFixed(2)))}
              className="tap grid h-9 w-9 place-items-center rounded-full bg-ink/[0.06]"
            >
              <Plus size={15} />
            </button>
          </div>
        </Row>
        <Row icon={<Contrast size={18} />} title={t("settings.contrast")}>
          <Switch checked={s.highContrast} onChange={(v) => s.set("highContrast", v)} label={t("settings.contrast")} />
        </Row>
        <Row icon={<Wind size={18} />} title={t("settings.motion")}>
          <Switch checked={s.reduceMotion} onChange={(v) => s.set("reduceMotion", v)} label={t("settings.motion")} />
        </Row>
        <Row icon={<Baby size={18} />} title={t("settings.family")} desc={t("settings.family.desc")}>
          <Switch checked={s.family} onChange={(v) => s.set("family", v)} label={t("settings.family")} />
        </Row>
        <Row icon={<Hand size={18} />} title={t("settings.libras")} desc={t("settings.libras.desc")}>
          <Switch checked={s.libras} onChange={(v) => s.set("libras", v)} label={t("settings.libras")} />
        </Row>
        <Row icon={<MonitorSmartphone size={18} />} title={t("settings.totem")} desc={t("settings.totem.desc")}>
          <Switch
            checked={s.totem}
            onChange={(v) => {
              s.set("totem", v);
              if (v) document.documentElement.requestFullscreen?.().catch(() => undefined);
              else if (document.fullscreenElement) document.exitFullscreen().catch(() => undefined);
            }}
            label={t("settings.totem")}
          />
        </Row>
        <Link to="/privacidade" onClick={onClose} className="flex items-center gap-3 py-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink/[0.06]">
            <Shield size={18} />
          </span>
          <span className="text-[15px] font-semibold">{t("settings.privacy")}</span>
        </Link>
        <button
          onClick={() => {
            onClose();
            dispatchEvent(new Event("kora:attract"));
          }}
          className="flex w-full items-center gap-3 py-3 text-left"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent/10 text-accent">
            <LogOut size={18} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-semibold">{t("settings.end")}</span>
            <span className="block text-[12.5px] leading-snug text-muted">{t("settings.end.desc")}</span>
          </span>
        </button>
      </div>
    </Sheet>
  );
}
