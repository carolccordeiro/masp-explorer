import { useState, useCallback } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
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
import Parceiros from "./pages/Parceiros.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const IDLE_TIMEOUT_MS = 90_000;

function TotemShell() {
  const navigate = useNavigate();
  const [isIdle, setIsIdle] = useState(false);

  const handleIdle = useCallback(() => {
    setIsIdle(true);
    sessionStorage.clear();
  }, []);

  const handleWakeUp = useCallback(() => {
    setIsIdle(false);
    navigate("/");
  }, [navigate]);

  useIdleTimer(handleIdle, IDLE_TIMEOUT_MS, !isIdle);

  return (
    <>
      <AnimatePresence>
        {isIdle && (
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
        <Route path="/parceiros" element={<Parceiros />} />
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
        <BrowserRouter>
          <TotemShell />
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
