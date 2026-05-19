import { useState, useCallback } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { IdleOverlay } from "@/components/IdleOverlay";
import { useIdleTimer } from "@/hooks/useIdleTimer";
import { LanguageProvider } from "@/contexts/LanguageContext";
import "./totem.css";

import Index from "./pages/Index.tsx";
import PlanejarVisita from "./pages/PlanejarVisita.tsx";
import QuizEducativo from "./pages/QuizEducativo.tsx";
import Informacoes from "./pages/Informacoes.tsx";
import AssistenteIA from "./pages/AssistenteIA.tsx";
import MapaInterativo from "./pages/MapaInterativo.tsx";
import MinhaColecao from "./pages/MinhaColecao.tsx";
import DadosDeUso from "./pages/DadosDeUso.tsx";
import Roteiro from "./pages/Roteiro.tsx";

import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const IDLE_TIMEOUT_MS = 90_000;

function TotemShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isIdle, setIsIdle] = useState(false);

  // /roteiro is opened from a visitor's phone after scanning the QR code,
  // it must not inherit the kiosk idle timer or session wipe behavior.
  const isPhoneRoute = location.pathname.startsWith("/roteiro");

  const handleIdle = useCallback(() => {
    setIsIdle(true);
    sessionStorage.clear();
  }, []);

  const handleWakeUp = useCallback(() => {
    setIsIdle(false);
    navigate("/");
  }, [navigate]);

  useIdleTimer(handleIdle, IDLE_TIMEOUT_MS, !isIdle && !isPhoneRoute);

  return (
    <>
      <AnimatePresence>
        {isIdle && !isPhoneRoute && (
          <IdleOverlay visible={isIdle} onTouch={handleWakeUp} />
        )}
      </AnimatePresence>

      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/planejar" element={<PlanejarVisita />} />
        <Route path="/quiz" element={<QuizEducativo />} />
        <Route path="/informacoes" element={<Informacoes />} />
        <Route path="/assistente" element={<AssistenteIA />} />
        <Route path="/mapa" element={<MapaInterativo />} />
        <Route path="/colecao" element={<MinhaColecao />} />
        <Route path="/dados" element={<DadosDeUso />} />
        <Route path="/roteiro" element={<Roteiro />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <TotemShell />
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
