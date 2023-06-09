import React, { useState } from "react";
import { useSpotify } from "../api/api";
import { ReactSVG } from "react-svg";
import { motion, Variants } from "framer-motion";
import SpotifyLogo from "../assets/Spotify_Logo_CMYK_White.png";

const itemVariants: Variants = {
  open: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
  closed: { opacity: 0, y: 20, transition: { duration: 0.2 } },
};

export const Navbar = () => {
  const [showSettings, setShowSettings] = useState(false);
  const { user, logout } = useSpotify();
  return (
    <nav className={`navbar ${user && "navbar-background"}`}>
      <a className="navbar_logo" href="#">
        <h1>MusicStats</h1>
        <div className="navbar_logo-bottom">
          <span>for</span> <img src={SpotifyLogo} />
        </div>
      </a>

      {user && (
        <motion.div
          className="user-info_data"
          onClick={() => setShowSettings(!showSettings)}
          whileTap={{ scale: 0.96 }}
          initial={false}
          animate={showSettings ? "open" : "closed"}
        >
          <img
            src={user?.images?.[0]?.url || "../assets/user-3296.png"}
            className="user-info_data-image"
          />

          <motion.div className="user-info_data-settings_button">
            <motion.div
              variants={{
                open: { rotate: 180 },
                closed: { rotate: 0 },
              }}
              transition={{ duration: 0.3 }}
              style={{ originY: 0.52 }}
            >
              <svg width="15" height="15" viewBox="0 0 20 20" fill="white">
                <path d="M0 7 L 20 7 L 10 16" />
              </svg>
            </motion.div>
          </motion.div>

          <motion.ul
            className="user-info_menu"
            variants={{
              open: {
                clipPath: "inset(0% 0% 0% 0% )",
                transition: {
                  type: "spring",
                  bounce: 0,
                  duration: 0.4,
                  delayChildren: 0.2,
                  staggerChildren: 0.05,
                },
              },
              closed: {
                clipPath: "inset(10% 50% 90% 50% )",
                transition: {
                  type: "spring",
                  bounce: 0,
                  duration: 0.3,
                },
              },
            }}
            style={{ pointerEvents: showSettings ? "auto" : "none" }}
          >
            <motion.li variants={itemVariants} className="user-info_menu-item">
              <a href="#top_tracks">Top Tracks</a>
            </motion.li>
            <motion.li variants={itemVariants} className="user-info_menu-item">
              <a href="#top_artists">Top Artists</a>
            </motion.li>
            <motion.li variants={itemVariants} className="user-info_menu-item">
              <a href="#top_genres">Top Genres</a>
            </motion.li>
            <motion.li variants={itemVariants} className="user-info_menu-item">
              <a href="#recently_played">Recently Played</a>
            </motion.li>
            <motion.li variants={itemVariants}>
              <a
                onClick={logout}
                className="user-info_data-settings_logout-button"
              >
                Logout
              </a>
            </motion.li>
          </motion.ul>
        </motion.div>
      )}
    </nav>
  );
};
