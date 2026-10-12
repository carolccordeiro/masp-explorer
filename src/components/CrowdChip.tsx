import { Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useSettings } from "@/context/Settings";
import { backendReady, supabase } from "@/lib/analytics";

/**
 * "Movimento agora": última leitura do sensor de público (anônimo) dos últimos 30 minutos.
 * Sem sensor ligado, não mostra nada.
 */
export function CrowdChip({ museum }: { museum: string }) {
  const { t } = useSettings();
  const [n, setN] = useState<number | null>(null);

  useEffect(() => {
    if (!backendReady) return;
    let alive = true;
    (async () => {
      try {
        const sb = await supabase();
        const since = new Date(Date.now() - 30 * 60_000).toISOString();
        const { data } = await sb
          .from("events")
          .select("value,created_at")
          .eq("museum", museum)
          .eq("type", "people")
          .gte("created_at", since)
          .order("created_at", { ascending: false })
          .limit(1);
        if (alive && data?.[0]?.value != null) setN(Number(data[0].value));
      } catch {
        /* sem dado, sem chip */
      }
    })();
    return () => {
      alive = false;
    };
  }, [museum]);

  if (n == null) return null;
  const level = n < 8 ? "crowd.calm" : n < 20 ? "crowd.mid" : "crowd.busy";
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-black/20 px-3 py-1.5 text-[12.5px] font-semibold">
      <Users size={13} /> {t(level)}
    </span>
  );
}
