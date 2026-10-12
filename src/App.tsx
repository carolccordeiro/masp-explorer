import { lazy, Suspense, useEffect, type ReactNode } from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation, useParams } from "react-router-dom";
import { BottomNav, IdleOverlay, LibrasWidget } from "@/components/Shell";
import { Skeleton } from "@/components/ui";
import { applyAccent, MuseumProvider } from "@/context/Museum";
import { SettingsProvider } from "@/context/Settings";
import { isMuseumId } from "@/data/museums";
import { track } from "@/lib/analytics";

const Hub = lazy(() => import("@/pages/Hub"));
const MuseumHome = lazy(() => import("@/pages/MuseumHome"));
const Scanner = lazy(() => import("@/pages/Scanner"));
const Collection = lazy(() => import("@/pages/Collection"));
const ArtworkPage = lazy(() => import("@/pages/ArtworkPage"));
const Planner = lazy(() => import("@/pages/Planner"));
const Hunt = lazy(() => import("@/pages/Hunt"));
const Assistant = lazy(() => import("@/pages/Assistant"));
const MapPage = lazy(() => import("@/pages/MapPage"));
const Quiz = lazy(() => import("@/pages/Quiz"));
const Visit = lazy(() => import("@/pages/Visit"));
const Routes_ = lazy(() => import("@/pages/RoutesBetween"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Sensor = lazy(() => import("@/pages/Sensor"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const MyVisit = lazy(() => import("@/pages/MyVisit"));
const Builder = lazy(() => import("@/pages/Builder"));
const About = lazy(() => import("@/pages/About"));
const Rest = lazy(() => import("@/pages/Rest"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function PageFallback() {
  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 pt-20 md:px-8">
      <Skeleton className="h-10 w-1/2" />
      <Skeleton className="h-56 w-full rounded-3xl" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    </div>
  );
}

function PageView() {
  const loc = useLocation();
  useEffect(() => {
    scrollTo({ top: 0 });
    const museum = loc.pathname.split("/")[1];
    track({ museum: isMuseumId(museum) ? museum : "hub", type: "view", path: loc.pathname });
  }, [loc.pathname]);
  return null;
}

/** Layout de rede (fora de um museu): cor neutra. */
function NetworkLayout({ nav = true }: { nav?: boolean }) {
  useEffect(() => applyAccent(undefined), []);
  return (
    <>
      <Suspense fallback={<PageFallback />}>
        <Outlet />
      </Suspense>
      {nav && <BottomNav />}
      <IdleOverlay />
    </>
  );
}

/** Layout de um museu: aplica a identidade visual e carrega o acervo. */
function MuseumLayout({ children }: { children?: ReactNode }) {
  const { museum } = useParams();
  if (!isMuseumId(museum)) return <NotFound />;
  return (
    <MuseumProvider id={museum} fallback={<PageFallback />}>
      <Suspense fallback={<PageFallback />}>{children ?? <Outlet />}</Suspense>
      <BottomNav />
      <IdleOverlay />
    </MuseumProvider>
  );
}

function PhoneLayout() {
  const { museum } = useParams();
  if (!isMuseumId(museum)) return <NotFound />;
  return (
    <MuseumProvider id={museum} fallback={<PageFallback />}>
      <Suspense fallback={<PageFallback />}>
        <Outlet />
      </Suspense>
    </MuseumProvider>
  );
}

export default function App() {
  useEffect(() => {
    try {
      if (!sessionStorage.getItem("kora-started")) {
        sessionStorage.setItem("kora-started", "1");
        track({ museum: "hub", type: "session_start" });
      }
    } catch {
      /* ignora */
    }
  }, []);

  return (
    <SettingsProvider>
      <BrowserRouter>
        <PageView />
        <LibrasWidget />
        <Routes>
          <Route element={<NetworkLayout />}>
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/rotas" element={<Routes_ />} />
            <Route path="/privacidade" element={<Privacy />} />
            <Route path="/sensor" element={<Sensor />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/monte" element={<Builder />} />
          </Route>
          <Route element={<NetworkLayout nav={false} />}>
            <Route path="/painel" element={<Dashboard />} />
            <Route path="/admin" element={<Navigate to="/painel" replace />} />
            <Route path="/descanso" element={<Rest />} />
            <Route path="/" element={<Rest />} />
            <Route path="/museus" element={<Hub />} />
          </Route>
          <Route path="/:museum/roteiro" element={<PhoneLayout />}>
            <Route index element={<Hunt />} />
          </Route>
          <Route path="/:museum" element={<MuseumLayout />}>
            <Route index element={<MuseumHome />} />
            <Route path="scanner" element={<Scanner />} />
            <Route path="acervo" element={<Collection />} />
            <Route path="obra/:id" element={<ArtworkPage />} />
            <Route path="planejar" element={<Planner />} />
            <Route path="kora" element={<Assistant />} />
            <Route path="mapa" element={<MapPage />} />
            <Route path="quiz" element={<Quiz />} />
            <Route path="visite" element={<Visit />} />
            <Route path="visita" element={<MyVisit />} />
          </Route>
          <Route
            path="*"
            element={
              <Suspense fallback={<PageFallback />}>
                <NotFound />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </SettingsProvider>
  );
}
