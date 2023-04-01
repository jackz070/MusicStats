import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { SpotifyProvider } from "./api";
import "./main.scss";
import { SpotifyTopTracksContextProvider } from "./api/useSpotifyTopTracks";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SpotifyProvider>
      <SpotifyTopTracksContextProvider>
        <App />
      </SpotifyTopTracksContextProvider>
    </SpotifyProvider>
  </React.StrictMode>
);
