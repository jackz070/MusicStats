import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSpotifyPlaylists } from "../api/useSpotifyPlaylists";
import { AnimatePresence, motion, Variants } from "framer-motion";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import SpotifyApi from "spotify-api";

const notifyAboutAddingToPlaylist = (playlistName: string) =>
  toast(`Added to ${playlistName}`);

const notifyAboutPlaylistCreation = (playlistName: string) =>
  toast(`${playlistName} created`);

const Playlists = ({ track }: { track: SpotifyApi.TrackObjectFull }) => {
  const [showPlaylistsDropdown, setShowPlaylistsDropdown] = useState(false);
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [submitButtonContent, setSubmitButtonContent] = useState("+");
  const [positionY, setPositionY] = useState(0);
  const [positionX, setPositionX] = useState(0);
  console.log(track);

  const {
    userPlaylists,
    loadUserPlaylists,
    fetchPrevPlaylists,
    fetchNextPlaylists,
    addTrackToPlaylist,
    createNewPlaylist,
    fetchingPlaylists,
    dropdownIsOpen,
  } = useSpotifyPlaylists();

  const playlistsDropdown = useRef<Node>(null);

  const handleOpenPlaylistsDropdown = () => {
    if (!dropdownIsOpen) {
      loadUserPlaylists();
      setShowPlaylistsDropdown(!showPlaylistsDropdown);
    }
  };

  const handleClosePlaylistsDropdown = () => {
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

  const handleCreateNewPlaylist = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
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
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      playlistsDropdown?.current &&
      !playlistsDropdown?.current?.contains(event.target as Node)
    ) {
      handleClosePlaylistsDropdown();
    }
  }, []);

  const handleAddToPlaylist = (
    playlistId: string,
    playlistName: string,
    trackUri: string
  ) => {
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

  const handleDropdownPositioning = (e: React.MouseEvent<HTMLElement>) => {
    if (window.innerWidth > 500) {
      setPositionY(
        e.clientY -
          0.5 * (window.innerHeight - (window.innerHeight - e.clientY))
      );
      setPositionX(-250);
    } else {
      setPositionY(70);
    }
  };

  return (
    <div
      className="playlists"
      ref={playlistsDropdown as React.RefObject<HTMLDivElement>}
    >
      <motion.button
        onClick={(e: React.MouseEvent<HTMLElement>) => {
          handleDropdownPositioning(e);
          handleDropdownButtonClick();
        }}
        className="playlists_open-button"
        style={(showPlaylistsDropdown && { fill: "white" }) || {}}
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
            style={{ x: positionX, top: positionY, overflow: "hidden" }}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
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
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      onClick={() =>
                        handleAddToPlaylist(
                          playlist.id,
                          playlist?.name,
                          track?.uri
                        )
                      }
                    >
                      {playlist.name}
                    </motion.li>
                  ))}
              </AnimatePresence>
              {(userPlaylists?.previous || userPlaylists?.next) && (
                <div className="playlists_dropdown-list_buttons">
                  {userPlaylists?.previous && (
                    <button onClick={() => fetchPrevPlaylists()}>
                      <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                  )}
                  {userPlaylists?.next && (
                    <button onClick={() => fetchNextPlaylists()}>
                      <FontAwesomeIcon icon={faArrowRight} />
                    </button>
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

export default Playlists;
