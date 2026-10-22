import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

import "./styles/minima.css"; // the Jekyll "minima" theme, compiled to plain CSS
import "./styles/hljs-github.css";
import "./styles/hljs-ssms.css";
import "./styles/override.css";
import "./styles/share-links.css";

/* // Dark mode via DarkReader, production only (as in the Jekyll build). Loaded lazily so it
// doesn't weigh down the main bundle.
if (import.meta.env.PROD) {
  import('darkreader').then(({ auto, setFetchMethod }) => {
    setFetchMethod(window.fetch); // avoids CORS errors in Chrome
    auto({ brightness: 100, contrast: 90, sepia: 10 });
  });
} */

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
