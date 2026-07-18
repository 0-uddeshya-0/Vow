import { HashRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nProvider } from "../i18n";
import { TopBar } from "../features/shell/TopBar";
import { Footer } from "../features/shell/Footer";
import { PageTransition } from "../features/shell/PageTransition";
import Landing from "../pages/Landing";
import EventPage from "../pages/EventPage";
import RsvpPage from "../pages/RsvpPage";
import AdminPage from "../pages/AdminPage";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        {/* HashRouter: SPA routing that survives GitHub Pages (no 404 hacks) */}
        <HashRouter>
          <TopBar />
          <PageTransition>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/event" element={<EventPage />} />
              <Route path="/rsvp" element={<RsvpPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<Landing />} />
            </Routes>
          </PageTransition>
          <Footer />
        </HashRouter>
      </I18nProvider>
    </QueryClientProvider>
  );
}
