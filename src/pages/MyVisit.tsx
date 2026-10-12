import { Award, Download, Heart, LogOut, ScanLine, Share2, Star, Trophy } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArtImage } from "@/components/ArtImage";
import { Header } from "@/components/Shell";
import { Button, Page } from "@/components/ui";
import { useMuseum } from "@/context/Museum";
import { useSettings } from "@/context/Settings";
import { brandColors } from "@/data/museums";
import type { Artwork, Museum } from "@/data/types";
import { track } from "@/lib/analytics";
import { useFavorites } from "@/lib/favorites";
import { cn, tr } from "@/lib/utils";
import { setRating, useVisit, type Badge } from "@/lib/visit";

const BADGES: { id: Badge; icon: JSX.Element; label: "badge.quiz" | "badge.hunt"; to: string }[] = [
  { id: "quiz", icon: <Award size={22} />, label: "badge.quiz", to: "quiz" },
  { id: "hunt", icon: <Trophy size={22} />, label: "badge.hunt", to: "roteiro" },
];

/** Card em imagem (1080 x 1350) para compartilhar a visita. */
async function drawCard(m: Museum, works: Artwork[], stats: { viewed: number; scanned: number; saved: number }, labels: Record<string, string>) {
  const W = 1080;
  const H = 1350;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d")!;
  const { bg, ink } = brandColors(m);
  g.fillStyle = bg;
  g.fillRect(0, 0, W, H);
  g.fillStyle = ink;
  g.font = "800 200px Aileron, Helvetica, Arial, sans-serif";
  g.fillText(m.short, 72, 260);
  g.font = "700 56px Aileron, Helvetica, Arial, sans-serif";
  g.fillText(labels.title, 80, 360);
  // obras
  const imgs = await Promise.all(
    works.slice(0, 4).map(
      (a) =>
        new Promise<HTMLImageElement | null>((res) => {
          const im = new Image();
          im.onload = () => res(im);
          im.onerror = () => res(null);
          im.src = a.thumb;
        }),
    ),
  );
  const size = 444;
  imgs.forEach((im, i) => {
    const x = 72 + (i % 2) * (size + 48);
    const y = 430 + Math.floor(i / 2) * (size + 48);
    g.save();
    g.beginPath();
    g.roundRect(x, y, size, size, 36);
    g.clip();
    g.fillStyle = "rgba(0,0,0,0.08)";
    g.fillRect(x, y, size, size);
    if (im) {
      const s = Math.max(size / im.width, size / im.height);
      g.drawImage(im, x + (size - im.width * s) / 2, y + (size - im.height * s) / 2, im.width * s, im.height * s);
    }
    g.restore();
  });
  g.fillStyle = ink;
  g.font = "800 64px Aileron, Helvetica, Arial, sans-serif";
  const line = `${stats.viewed} ${labels.viewed}   ${stats.scanned} ${labels.scanned}   ${stats.saved} ${labels.saved}`;
  g.fillText(line, 72, H - 120);
  g.font = "700 40px Aileron, Helvetica, Arial, sans-serif";
  g.globalAlpha = 0.7;
  g.fillText("kora", 72, H - 56);
  g.globalAlpha = 1;
  return c;
}

export default function MyVisit() {
  const m = useMuseum();
  const { t, lang } = useSettings();
  const v = useVisit(m.id);
  const { favs } = useFavorites();
  const [busy, setBusy] = useState(false);
  const saved = favs.filter((k) => k.startsWith(`${m.id}:`)).length;
  const works = v.viewed.map((id) => m.artworks.find((a) => a.id === id)).filter(Boolean) as Artwork[];
  const stats = { viewed: works.length, scanned: v.scanned.length, saved };
  const labels = { title: t("visit.title"), viewed: t("visit.viewed"), scanned: t("visit.scanned"), saved: t("visit.saved") };

  const share = async () => {
    setBusy(true);
    try {
      const canvas = await drawCard(m, works, stats, labels);
      const blob: Blob | null = await new Promise((r) => canvas.toBlob(r, "image/png"));
      const text = `${m.short}: ${stats.viewed} ${labels.viewed}. ${location.origin}/${m.id}`;
      const file = blob ? new File([blob], `minha-visita-${m.id}.png`, { type: "image/png" }) : null;
      if (file && navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file], text });
      else if (blob) {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `minha-visita-${m.id}.png`;
        a.click();
        URL.revokeObjectURL(a.href);
      }
      track({ museum: m.id, type: "qr", path: "share_visit" });
    } catch {
      /* cancelado */
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Header />
      <Page className="max-w-3xl">
        <h1 className="text-[34px] font-extrabold tracking-tight">{t("visit.title")}</h1>
        <p className="mt-1 text-[15px] text-muted">{t("visit.subtitle")}</p>

        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { icon: <Heart size={16} />, n: stats.viewed, label: t("visit.viewed") },
            { icon: <ScanLine size={16} />, n: stats.scanned, label: t("visit.scanned") },
            { icon: <Heart size={16} className="fill-current" />, n: stats.saved, label: t("visit.saved") },
          ].map((s) => (
            <div key={s.label} className="rounded-3xl bg-ink/[0.04] p-4">
              <p className="num text-[40px] leading-none">{s.n}</p>
              <p className="mt-1 text-[13px] font-semibold text-muted">{s.label}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-10 text-[20px] font-extrabold">{t("visit.badges")}</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {BADGES.map((b) => {
            const has = v.badges.includes(b.id);
            return (
              <Link
                key={b.id}
                to={`/${m.id}/${b.to}`}
                className={cn("tap flex items-center gap-3 rounded-3xl p-4", has ? "bg-accent text-accent-ink" : "border border-dashed hairline text-muted")}
              >
                <span className={cn("grid h-11 w-11 place-items-center rounded-full", has ? "bg-white/20" : "bg-ink/[0.05]")}>{b.icon}</span>
                <span className="text-[14.5px] font-bold leading-tight">{t(b.label)}</span>
              </Link>
            );
          })}
        </div>

        <h2 className="mt-10 text-[20px] font-extrabold">{t("visit.works")}</h2>
        {works.length ? (
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {works.map((a) => (
              <Link key={a.id} to={`/${m.id}/obra/${a.id}`} className="tap">
                <ArtImage src={a.thumb} alt={tr(a.title, lang)} color={a.color} className="aspect-square rounded-2xl" />
                <p className="mt-1 line-clamp-1 text-[12.5px] font-semibold">{tr(a.title, lang)}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-3 rounded-2xl bg-ink/[0.04] p-4 text-[14px] text-muted">{t("visit.empty")}</p>
        )}

        <div className="mt-10 rounded-3xl border hairline p-5 text-center">
          <p className="text-[17px] font-bold">{t("visit.rate")}</p>
          <div className="mt-3 flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                aria-label={`${n}`}
                onClick={() => {
                  if (v.rating) return;
                  setRating(m.id, n);
                  track({ museum: m.id, type: "rating", value: n });
                }}
                className={cn("tap grid h-12 w-12 place-items-center rounded-full", v.rating && n <= v.rating ? "text-accent" : "text-muted hover:text-ink")}
              >
                <Star size={30} className={v.rating && n <= v.rating ? "fill-current" : ""} />
              </button>
            ))}
          </div>
          {v.rating ? <p className="mt-2 text-[13.5px] text-muted">{t("visit.thanks")}</p> : null}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button size="lg" icon={"share" in navigator ? <Share2 size={18} /> : <Download size={18} />} onClick={share} disabled={busy || !works.length}>
            {t("visit.share")}
          </Button>
          <Button size="lg" variant="ghost" icon={<LogOut size={18} />} onClick={() => dispatchEvent(new Event("kora:attract"))}>
            {t("visit.end")}
          </Button>
        </div>
      </Page>
    </>
  );
}
