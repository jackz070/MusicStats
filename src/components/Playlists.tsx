import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSpotifyPlaylists } from "../api/useSpotifyPlaylists";
import { AnimatePresence, motion, Variants } from "framer-motion";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const notifyAboutAddingToPlaylist = (playlistName) =>
  toast(`Added to ${playlistName}`);

const notifyAboutPlaylistCreation = (playlistName) =>
  toast(`${playlistName} created`);
const notifyAboutError = (error) => toast(`Error:${error}`);
const itemVariants: Variants = {
  open: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
  closed: { opacity: 0, y: 20, transition: { duration: 0.2 } },
};

const TempPlaylists = (track) => {
  const [showPlaylistsDropdown, setShowPlaylistsDropdown] = useState(false);
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [submitButtonContent, setSubmitButtonContent] = useState("+");
  const [positionY, setPositionY] = useState(0);
  const [positionX, setPositionX] = useState(0);

  const {
    userPlaylists,
    loadUserPlaylists,
    fetchPrevPlaylists,
    fetchNextPlaylists,
    addTrackToPlaylist,
    createNewPlaylist,
    fetchingPlaylists,
    dropdownIsOpen,
    setDropdownIsOpen,
  } = useSpotifyPlaylists();

  const playlistsDropdown = useRef();
  const playlistsDropdownButton = useRef();

  const handleOpenPlaylistsDropdown = (e) => {
    console.log(e);

    if (!dropdownIsOpen) {
      console.log("open");
      loadUserPlaylists();
      setShowPlaylistsDropdown(!showPlaylistsDropdown);
    }
  };

  const handleClosePlaylistsDropdown = () => {
    console.log("close");
    setShowPlaylistsDropdown(false);
    if (!newPlaylistName) {
      setIsCreatingPlaylist(false);
    }
    setPositionY(0);
    setPositionX(0);
  };

  const handleDropdownButtonClick = () => {
    showPlaylistsDropdown
      ? handleClosePlaylistsDropdown()
      : handleOpenPlaylistsDropdown();
  };

  const handleCreateNewPlaylist = async (e) => {
    e.preventDefault();
    if (newPlaylistName) {
      setSubmitButtonContent("✓");
      await createNewPlaylist(newPlaylistName);
      notifyAboutPlaylistCreation(newPlaylistName);
      setNewPlaylistName("");
      setIsCreatingPlaylist(false);
      setTimeout(() => {
        setSubmitButtonContent("+");
        loadUserPlaylists();
      }, 300);
    }
  };
  const handleClickOutside = useCallback((event) => {
    if (
      playlistsDropdown?.current &&
      !playlistsDropdown?.current?.contains(event.target)
    ) {
      handleClosePlaylistsDropdown();
    }
  }, []);

  const handleAddToPlaylist = (playlistId, playlistName, trackUri) => {
    try {
      addTrackToPlaylist(playlistId, trackUri);
      notifyAboutAddingToPlaylist(playlistName);
      handleClosePlaylistsDropdown();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (showPlaylistsDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPlaylistsDropdown]);

  const handleDropdownPositioning = (e) => {
    console.log(e.clientY, window.innerHeight);
    if (window.innerWidth > 500) {
      setPositionY(0.4 * -e.clientY);
      setPositionX(-250);
    } else {
      setPositionY(140);
    }
  };
  return (
    <div className="playlists" ref={playlistsDropdown}>
      <motion.button
        onClick={(e) => {
          handleDropdownPositioning(e);
          handleDropdownButtonClick();
        }}
        className="playlists_open-button"
        style={showPlaylistsDropdown && { fill: "white" }}
        whileTap={{ scale: 0.96 }}
        whileHover={{ scale: 1.03 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 24 24"
          id="playlist-add"
        >
          <path fill="none" d="M0 0h24v24H0V0z"></path>
          <path d="M2 14h8v2H2zm0-4h12v2H2zm0-4h12v2H2zm16 4h-2v4h-4v2h4v4h2v-4h4v-2h-4z"></path>
        </svg>
      </motion.button>
      <AnimatePresence>
        {showPlaylistsDropdown && (
          <motion.div
            className="playlists_container"
            initial={{ opacity: 0, x: positionX, y: 0 }}
            animate={{ opacity: 1, x: positionX, y: positionY }}
            exit={{ opacity: 0, y: positionY + 100 }}
            transition={{}}
          >
            <div className="playlists_container-header">
              <h3>Add to playlist</h3>
              <button onClick={() => handleClosePlaylistsDropdown()}>
                {" "}
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            {/* {isCreatingPlaylist ? ( */}
            <form
              onSubmit={(e) => handleCreateNewPlaylist(e)}
              className="playlist_create-form"
            >
              <motion.input
                type="text"
                name="playlistName"
                placeholder="Create New Playlist"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                initial={{ width: "0%" }}
                animate={{ width: "90%" }}
                transition={{ duration: 0.2, origin: 1 }}
              />
              <motion.button
                type="submit"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                whileTap={{ scale: 1 }}
                whileHover={{ scale: 1.5 }}
              >
                {submitButtonContent}
              </motion.button>
            </form>
            {/* ) : (
              <motion.button
                onClick={() => setIsCreatingPlaylist(true)}
                className="playlist_create-button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                + CREATE NEW PLAYLIST
              </motion.button>
            )} */}
            {fetchingPlaylists && <LoadingSpinner />}

            <motion.ul
              className="playlists_dropdown-list"
              animate={showPlaylistsDropdown ? "open" : "close"}
              variants={{
                open: {
                  clipPath: "inset(0% 0% 0% 0% round 10px)",
                  transition: {
                    type: "spring",
                    bounce: 0,
                    duration: 0.7,
                    delayChildren: 0.3,
                    staggerChildren: 0.05,
                  },
                },
                closed: {
                  clipPath: "inset(10% 50% 90% 50% round 10px)",
                  transition: {
                    type: "spring",
                    bounce: 0,
                    duration: 0.3,
                  },
                },
              }}
            >
              <AnimatePresence>
                {userPlaylists &&
                  userPlaylists?.items?.map((playlist) => (
                    <motion.li
                      key={playlist.id}
                      // variants={itemVariants}
                      initial={{ y: 50 }}
                      animate={{ y: 0 }}
                      layout
                      onClick={() =>
                        handleAddToPlaylist(
                          playlist.id,
                          playlist?.name,
                          track?.track?.uri
                        )
                      }
                    >
                      {playlist.name}
                    </motion.li>
                  ))}
              </AnimatePresence>{" "}
              {(userPlaylists?.previous || userPlaylists?.next) && (
                <div className="playlists_dropdown-list_buttons">
                  {userPlaylists?.previous && (
                    <button onClick={() => fetchPrevPlaylists()}>{"<"}</button>
                  )}
                  {userPlaylists?.next && (
                    <button onClick={() => fetchNextPlaylists()}>{">"}</button>
                  )}
                </div>
              )}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TempPlaylists;
