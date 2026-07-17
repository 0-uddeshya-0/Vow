import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Self-hosted fonts (GDPR — no font CDN requests from German guests' phones).
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/500-italic.css";
import "@fontsource/pinyon-script/index.css";
import "@fontsource-variable/jost/index.css";

import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/layout.css";

import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
