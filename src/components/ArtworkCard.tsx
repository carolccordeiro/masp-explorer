import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useSettings } from "@/context/Settings";
import type { Artwork } from "@/data/types";
import { useFavorites } from "@/lib/favorites";
import { cn, tr } from "@/lib/utils";
import { ArtImage } from "./ArtImage";

export function ArtworkCard({ art, className, size = "md" }: { art: Artwork; className?: string; size?: "sm" | "md" }) {
  const { lang, t } = useSettings();
  const { has, toggle } = useFavorites();
  const key = `${art.museum}:${art.id}`;
  const saved = has(key);
  return (
    <div className={cn("group relative", className)}>
      <Link to={`/${art.museum}/obra/${art.id}`} className="tap block">
        <ArtImage
          src={art.thumb}
          alt={tr(art.title, lang)}
          color={art.color}
          className={cn("rounded-2xl shadow-soft", size === "sm" ? "aspect-[4/5]" : "aspect-[4/5]")}
          imgClassName="transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="mt-2.5 px-0.5">
          <p className={cn("line-clamp-2 font-bold leading-snug", size === "sm" ? "text-[13px]" : "text-[15px]")}>{tr(art.title, lang)}</p>
          <p className="mt-0.5 truncate text-[13px] text-muted">
            {art.artist}
            {art.year ? ` · ${art.year}` : ""}
          </p>
        </div>
      </Link>
      <button
        onClick={() => toggle(key)}
        aria-label={saved ? t("common.saved") : t("common.save")}
        aria-pressed={saved}
        className="tap glass absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full shadow-soft"
      >
        <Heart size={17} className={cn("transition-colors", saved ? "fill-accent text-accent" : "text-ink")} />
      </button>
    </div>
  );
}
