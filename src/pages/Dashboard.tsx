import React, { useState } from "react";
import { useSpotify } from "../api";
import { redirect } from "react-router-dom";
import TopArtists from "../components/TopArtists";
import TopTracks from "../components/TopTracks";
import GenreCloud from "../components/GenreCloud";
import CurrentlyPlaying from "../components/CurrentlyPlaying";
import FloatingBar from "../components/FloatingBar";

const Dashboard = () => {
  const [showSettings, setShowSettings] = useState(false);
  const {
    user,
    logout,
    hasLoggedIn,
    topArtists,
    topTracks,
    changeTimeRange,
    timeRange,
  } = useSpotify();

  return (
    <div id="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-header-text">Hello, {user?.display_name}</div>
        <div className="dashboard-header_info">
          <img src={user?.images[0].url} className="dashboard-header-image" />
          <div className="dashboard-header-settings">
            <button onClick={() => setShowSettings(!showSettings)}>⚙️</button>
            {showSettings && (
              <a onClick={logout} className="dashboard-logout_button">
                Logout
              </a>
            )}
          </div>
        </div>
      </div>
      <CurrentlyPlaying />
      <TopArtists />
      <TopTracks />
      <GenreCloud />
      <FloatingBar />
    </div>
  );
};

export default Dashboard;
