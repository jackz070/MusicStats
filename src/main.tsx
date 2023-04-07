import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { SpotifyProvider } from "./api/api";
import "./main.scss";
import { SpotifyTopTracksContextProvider } from "./api/useSpotifyTopTracks";
import { SpotifyTrackRecommendationsContextProvider } from "./api/useTrackRecommendations";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SpotifyProvider>
      <SpotifyTopTracksContextProvider>
        <SpotifyTrackRecommendationsContextProvider>
          <App />
        </SpotifyTrackRecommendationsContextProvider>
      </SpotifyTopTracksContextProvider>
    </SpotifyProvider>
  </React.StrictMode>
);
