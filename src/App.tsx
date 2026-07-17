import { useEffect, useState } from "react";
import { I18nProvider } from "./i18n";
import { loadRuntimeContent } from "./lib/runtimeContent";
import type { RuntimeContent } from "./config/wedding";
import { TopBar } from "./components/TopBar";
import { Hero } from "./components/Hero";
import { Divider } from "./components/Divider";
import { Timeline } from "./components/Timeline";
import { Stay } from "./components/Stay";
import { Travel } from "./components/Travel";
import { Asks } from "./components/Asks";
import { Faq } from "./components/Faq";
import { Rsvp } from "./components/Rsvp";
import { Photos } from "./components/Photos";
import { Footer } from "./components/Footer";
import { Gate } from "./components/Gate";

const emptyRuntime: RuntimeContent = { bookingCode: null, emergencyPhone: null, menu: null };

function initialToken(): string | null {
  // Personal link: ?g=TOKEN — store and clean the URL.
  const url = new URL(window.location.href);
  const fromLink = url.searchParams.get("g");
  if (fromLink) {
    try {
      localStorage.setItem("vow.guest", fromLink);
    } catch {
      /* ok */
    }
    url.searchParams.delete("g");
    history.replaceState(null, "", url.toString());
    return fromLink;
  }
  try {
    return localStorage.getItem("vow.guest");
  } catch {
    return null;
  }
}

export default function App() {
  const [token, setToken] = useState<string | null>(initialToken);
  const [runtime, setRuntime] = useState<RuntimeContent>(emptyRuntime);

  useEffect(() => {
    void loadRuntimeContent().then(setRuntime);
  }, []);

  const unlock = (tok: string) => {
    try {
      localStorage.setItem("vow.guest", tok);
    } catch {
      /* ok */
    }
    setToken(tok);
  };

  return (
    <I18nProvider>
      <TopBar />
      <main>
        <Hero />
        {token ? (
          <>
            <Divider />
            <Timeline />
            <Divider />
            <Stay runtime={runtime} />
            <Travel />
            <Divider />
            <Asks runtime={runtime} />
            <Faq />
            <Divider />
            <Rsvp />
            <Photos />
          </>
        ) : (
          <Gate onUnlock={unlock} />
        )}
      </main>
      <Footer />
    </I18nProvider>
  );
}
