import { useState } from "react";
import { cn } from "@/lib/utils";

/** Imagem de obra com placeholder na cor média e fade-in (sem "pulo" de layout). */
export function ArtImage({
  src,
  alt,
  color = "#d9d9de",
  ratio,
  className,
  imgClassName,
  eager,
  fit = "cover",
}: {
  src: string;
  alt: string;
  color?: string;
  ratio?: number;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
  fit?: "cover" | "contain";
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  return (
    <div className={cn("relative overflow-hidden", className)} style={{ backgroundColor: color, aspectRatio: ratio ? String(ratio) : undefined }}>
      {!error && (
        <img
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={cn(
            "h-full w-full transition-opacity duration-300",
            fit === "cover" ? "object-cover" : "object-contain",
            loaded ? "opacity-100" : "opacity-0",
            imgClassName,
          )}
        />
      )}
    </div>
  );
}
