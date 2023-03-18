import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { SpotifyProvider } from "./api";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SpotifyProvider>
      <App />
    </SpotifyProvider>
  </React.StrictMode>
);
