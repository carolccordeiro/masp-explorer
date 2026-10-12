import { Link } from "react-router-dom";
import { KoraLogo } from "@/components/KoraMark";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="grid min-h-[100dvh] place-items-center px-6 text-center">
      <div>
        <KoraLogo size={72} className="mx-auto text-ink" />
        <p className="num mt-6 text-[88px] leading-none">404</p>
        <p className="mt-2 text-[18px] text-muted">Esta sala ainda não está no mapa.</p>
        <Link to="/museus" className="mt-6 inline-block">
          <Button variant="secondary">Voltar ao início</Button>
        </Link>
      </div>
    </div>
  );
}
