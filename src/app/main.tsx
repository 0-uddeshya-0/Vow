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
