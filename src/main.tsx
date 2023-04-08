import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { SpotifyProvider } from "./api/api";
import "./main.scss";
import { SpotifyTopTracksContextProvider } from "./api/useSpotifyTopTracks";
import { SpotifyTrackRecommendationsContextProvider } from "./api/useTrackRecommendations";
import { AudioPlayersContextProvider } from "./hooks/useAudioPlayers";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SpotifyProvider>
      <SpotifyTopTracksContextProvider>
        <SpotifyTrackRecommendationsContextProvider>
          <AudioPlayersContextProvider>
            <App />
          </AudioPlayersContextProvider>
        </SpotifyTrackRecommendationsContextProvider>
      </SpotifyTopTracksContextProvider>
    </SpotifyProvider>
  </React.StrictMode>
);
