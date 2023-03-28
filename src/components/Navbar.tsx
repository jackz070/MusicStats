import React, { useState } from "react";
import { useSpotify } from "../api";
import { ReactSVG } from "react-svg";

export const Navbar = () => {
  const [showSettings, setShowSettings] = useState(false);
  const { user, logout } = useSpotify();
  return (
    <nav className={`navbar ${user && "navbar-background"}`}>
      <div>
        <h1>MusicStats</h1>
      </div>

      {user && (
        <div className="user-info_data">
          <img src={user?.images?.[0].url} className="user-info_data-image" />
          <div className="user-info_data-settings">
            <button onClick={() => setShowSettings(!showSettings)}>
              <ReactSVG src="../../public/gearIcon.svg" />
            </button>
            {showSettings && (
              <a
                onClick={logout}
                className="user-info_data-settings_logout-button"
              >
                Logout
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
