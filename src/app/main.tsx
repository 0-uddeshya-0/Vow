import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Self-hosted fonts (GDPR — no CDN requests from guests' phones).
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/500-italic.css";
import "@fontsource/pinyon-script/index.css";
import "@fontsource-variable/jost/index.css";

import "../styles/app.css";

import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Production only — a SW in dev would serve stale modules and confuse HMR.
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`);
  });
}

// Show push notifications that arrive while the app is open (no-op unless push
// is configured + the browser supports it).
void import("./push-init");
