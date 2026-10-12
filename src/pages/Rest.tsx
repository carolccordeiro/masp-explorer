import { useNavigate, useSearchParams } from "react-router-dom";
import { Attract } from "@/components/Attract";
import { isMuseumId } from "@/data/museums";
import { resetSession } from "@/lib/analytics";

/** Tela de descanso aberta direto pelo link /descanso (ou /descanso?museu=masp). */
export default function Rest() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const m = params.get("museu");
  const museum = isMuseumId(m ?? undefined) ? (m as "masp" | "ims" | "mam") : undefined;
  return (
    <Attract
      museum={museum}
      onStart={() => {
        resetSession(museum);
        navigate("/museus");
      }}
    />
  );
}
