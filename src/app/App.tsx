import { HashRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nProvider } from "../i18n";
import { TopBar } from "../features/shell/TopBar";
import { Footer } from "../features/shell/Footer";
import { PageTransition } from "../features/shell/PageTransition";
import { FloatingDock } from "../features/shell/FloatingDock";
import { ThemeVars } from "../features/shell/ThemeVars";
import Landing from "../pages/Landing";
import EventPage from "../pages/EventPage";
import InfoPage from "../pages/InfoPage";
import RsvpPage from "../pages/RsvpPage";
import AdminPage from "../pages/AdminPage";
import GalleryPage from "../pages/GalleryPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Self-heal transient backend failures (the "works after a few
      // refreshes" symptom): three retries with capped exponential backoff.
      retry: 3,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        {/* HashRouter: SPA routing that survives GitHub Pages (no 404 hacks) */}
        <HashRouter>
          <ThemeVars />
          <TopBar />
          <PageTransition>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/event" element={<EventPage />} />
              <Route path="/info" element={<InfoPage />} />
              <Route path="/rsvp" element={<RsvpPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<Landing />} />
            </Routes>
          </PageTransition>
          <Footer />
          <FloatingDock />
        </HashRouter>
      </I18nProvider>
    </QueryClientProvider>
  );
}
