import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSpotifyPlaylists } from "../api/useSpotifyPlaylists";
import { AnimatePresence, motion, Variants, easeIn } from "framer-motion";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const notifyAboutAddingToPlaylist = (playlistName) =>
  toast(`Added to ${playlistName}`);
// TODO position modal / popover based on position on the screen of open button (if its on the bottom, modal goes up, if on top - it goes down)
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

  const handleOpenPlaylistsDropdown = () => {
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
  // TODO fix CSS issue container type size on single track breaks aboslute positionoing on this component
  // TODO loading states & add success state
  // TODO create playlist feedback and add current track to newly created playlist
  // TODO when creating playlist add it to displayed list
  // TODO styling: animate dropdown, loading, nice list items, plus icon to add, playlist add icon on opening button

  return (
    <div className="playlists" ref={playlistsDropdown}>
      <motion.button
        onClick={() => handleDropdownButtonClick()}
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
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
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
              <input
                type="text"
                name="playlistName"
                placeholder="Create New Playlist"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
              />
              <motion.button
                type="submit"
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
