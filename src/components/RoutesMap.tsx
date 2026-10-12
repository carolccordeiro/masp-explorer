import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "@/context/Settings";
import { accentOn, inkOn, MUSEUMS, museumMeta } from "@/data/museums";
import { mapsUrl, NEARBY } from "@/data/nearby";
import type { MuseumId } from "@/data/types";

/** Base cartográfica do OpenStreetMap, em tons de cinza (claro ou escuro conforme o tema, via CSS). */
const TILES = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

/**
 * Mapa real com os museus da rede, o trajeto entre eles e os lugares por perto.
 * `highlight` destaca um lugar (ao passar o mouse na lista).
 */
export function RoutesMap({ links, highlight, className }: { links: [MuseumId, MuseumId][]; highlight?: string | null; className?: string }) {
  const { isDark } = useSettings();
  const navigate = useNavigate();
  const box = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const tiles = useRef<L.TileLayer | null>(null);
  const placeMarkers = useRef(new Map<string, L.Marker>());

  // cria o mapa uma vez
  useEffect(() => {
    if (!box.current || map.current) return;
    const m = L.map(box.current, { zoomControl: false, attributionControl: true, scrollWheelZoom: false });
    L.control.zoom({ position: "bottomright" }).addTo(m);
    m.attributionControl.setPrefix(false);
    map.current = m;

    const all = [...MUSEUMS.map((x) => x.coords), ...NEARBY.map((p) => p.coords)] as L.LatLngTuple[];
    m.fitBounds(L.latLngBounds(all), { padding: [36, 36] });

    // lugares por perto
    for (const p of NEARBY) {
      const mk = L.marker(p.coords, {
        icon: L.divIcon({ className: "kora-place", html: `<span></span>`, iconSize: [14, 14], iconAnchor: [7, 7] }),
        keyboard: true,
        title: p.name,
      })
        .bindTooltip(esc(p.name), { direction: "top", offset: [0, -8], className: "kora-tip" })
        .on("click", () => window.open(mapsUrl(p), "_blank", "noopener"))
        .addTo(m);
      placeMarkers.current.set(p.id, mk);
    }
    return () => {
      m.remove();
      map.current = null;
      placeMarkers.current.clear();
    };
  }, []);

  // base clara/escura
  useEffect(() => {
    const m = map.current;
    if (!m) return;
    tiles.current?.remove();
    tiles.current = L.tileLayer(TILES, { attribution: ATTRIBUTION, maxZoom: 19, className: isDark ? "kora-tiles-dark" : "kora-tiles" }).addTo(m);
    tiles.current.bringToBack();
  }, [isDark]);

  // museus e trajetos (cores mudam com o tema)
  useEffect(() => {
    const m = map.current;
    if (!m) return;
    const layer = L.layerGroup().addTo(m);
    for (const [a, b] of links) {
      L.polyline([museumMeta(a)!.coords, museumMeta(b)!.coords], {
        color: isDark ? "#F5F5F7" : "#1D1D1F",
        weight: 2.5,
        opacity: 0.55,
        dashArray: "6 8",
        lineCap: "round",
      }).addTo(layer);
    }
    for (const mu of MUSEUMS) {
      const bg = accentOn(mu, isDark)!;
      const fg = inkOn(mu, isDark);
      L.marker(mu.coords, {
        icon: L.divIcon({
          className: "kora-museum",
          html: `<span style="background:${bg};color:${fg};box-shadow:0 0 0 6px ${bg}33,0 6px 20px ${bg}66">${esc(mu.short)}</span>`,
          iconSize: [64, 30],
          iconAnchor: [32, 15],
        }),
        title: mu.name,
        zIndexOffset: 1000,
      })
        .on("click", () => navigate(`/${mu.id}`))
        .addTo(layer);
    }
    return () => void layer.remove();
  }, [links, isDark, navigate]);

  // destaque vindo da lista
  useEffect(() => {
    placeMarkers.current.forEach((mk, id) => {
      const el = mk.getElement();
      if (!el) return;
      el.classList.toggle("is-on", id === highlight);
      if (id === highlight) mk.openTooltip();
      else mk.closeTooltip();
    });
  }, [highlight]);

  return <div ref={box} className={className} role="region" aria-label="Mapa dos museus e lugares por perto" />;
}
