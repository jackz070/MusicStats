import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { SpotifyProvider } from "./api/api";
import "./main.scss";
import { SpotifyTopTracksContextProvider } from "./api/useSpotifyTopTracks";
import { SpotifyTrackRecommendationsContextProvider } from "./api/useTrackRecommendations";
import { AudioPlayersContextProvider } from "./hooks/useAudioPlayers";
import { SpotifyPlaylistsContextProvider } from "./api/useSpotifyPlaylists";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SpotifyProvider>
      <SpotifyTopTracksContextProvider>
        <SpotifyTrackRecommendationsContextProvider>
          <AudioPlayersContextProvider>
            <SpotifyPlaylistsContextProvider>
              <App />
            </SpotifyPlaylistsContextProvider>
          </AudioPlayersContextProvider>
        </SpotifyTrackRecommendationsContextProvider>
      </SpotifyTopTracksContextProvider>
    </SpotifyProvider>
  </React.StrictMode>
);
