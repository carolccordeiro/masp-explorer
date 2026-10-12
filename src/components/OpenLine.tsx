import type { Lang, MuseumMeta } from "@/data/types";
import type { StringKey } from "@/i18n/strings";
import { hhmm, nextOpen, openStatus } from "@/lib/hours";

/** Texto curto de funcionamento: "Fecha às 18h" ou "Abre amanhã às 10h". */
export function openLine(m: Pick<MuseumMeta, "week" | "freeDays">, t: (k: StringKey) => string, lang: Lang): string {
  const st = openStatus(m);
  if (st.open && st.today) return `${t("home.closesAt")} ${hhmm(st.today[1])}`;
  const n = nextOpen(m);
  if (!n) return t("home.closedNow");
  if (n.inDays === 0) return `${t("home.opensToday")} ${hhmm(n.time)}`;
  if (n.inDays === 1) return `${t("home.opensTomorrow")} ${hhmm(n.time)}`;
  // nome do dia no idioma do visitante (01/01/2023 foi um domingo)
  const wd = new Intl.DateTimeFormat(lang === "pt" ? "pt-BR" : lang, { weekday: "long", timeZone: "UTC" }).format(new Date(Date.UTC(2023, 0, 1 + n.day)));
  return `${t("home.opensOn")} ${wd} ${t("home.at")} ${hhmm(n.time)}`;
}
