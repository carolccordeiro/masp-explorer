import type { MuseumMeta } from "@/data/types";

/** Hora atual em São Paulo, independente do fuso do aparelho. */
export function spNow(d = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const wd = parts.find((p) => p.type === "weekday")?.value ?? "Sun";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(wd);
  const hh = Number(parts.find((p) => p.type === "hour")?.value ?? 0) % 24;
  const mm = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return { day, minutes: hh * 60 + mm };
}

const toMin = (s: string) => {
  const [h, m] = s.split(":").map(Number);
  return h * 60 + (m || 0);
};

export function openStatus(m: Pick<MuseumMeta, "week" | "freeDays">, d = new Date()) {
  const { day, minutes } = spNow(d);
  const today = m.week[day];
  const open = !!today && minutes >= toMin(today[0]) && minutes < toMin(today[1]);
  const free = m.freeDays.find((f) => f.day === day);
  const freeNow = !!free && (!free.from || minutes >= toMin(free.from));
  return { open, today, freeToday: !!free, freeNow, freeFrom: free?.from };
}
