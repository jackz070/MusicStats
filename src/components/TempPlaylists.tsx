import React, { useState, useEffect } from "react";
import { useSpotifyPlaylists } from "../api/useSpotifyPlaylists";
import { useSpotify } from "../api/api";

const TempPlaylists = (track) => {
  const [showPlaylistsDropdown, setShowPlaylistsDropdown] = useState(false);
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const {
    userPlaylists,
    loadUserPlaylists,
    fetchPrevPlaylists,
    fetchNextPlaylists,
    addTrackToPlaylist,
    createNewPlaylist,
  } = useSpotifyPlaylists();

  const handleOpenPlaylistsDropdown = () => {
    loadUserPlaylists();
    setShowPlaylistsDropdown(!showPlaylistsDropdown);
  };

  const handleClosePlaylistsDropdown = () => {
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
    await createNewPlaylist(newPlaylistName);
    setNewPlaylistName("");
    setIsCreatingPlaylist(false);
    loadUserPlaylists();
  };
  // TODO fix CSS issue container type size on single track breaks aboslute positionoing on this component
  // TODO loading states & add success state
  // TODO create playlist feedback and add current track to newly created playlist
  // TODO styling: animate dropdown, loading, nice list items, plus icon to add, playlist add icon on opening button
  return (
    <div className="playlists">
      <button
        onClick={() => handleDropdownButtonClick()}
        className="playlists_open-button"
      >
        Open playlists
      </button>
      {showPlaylistsDropdown && (
        <div className="playlists_container">
          <button onClick={() => handleClosePlaylistsDropdown()}>CLOSE</button>
          <button onClick={() => setIsCreatingPlaylist(true)}>
            CREATE NEW PLAYLIST
          </button>
          {isCreatingPlaylist && (
            <form onSubmit={(e) => handleCreateNewPlaylist(e)}>
              <input
                type="text"
                name="playlistName"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
              />
              <button type="submit">CONFIRM</button>
            </form>
          )}
          <ul className="playlists_dropdown-list">
            {userPlaylists &&
              userPlaylists?.items?.map((playlist) => (
                <li>
                  {playlist.name}{" "}
                  <button
                    onClick={() => {
                      addTrackToPlaylist(playlist.id, track?.track?.uri);
                    }}
                  >
                    Add Track
                  </button>
                </li>
              ))}
          </ul>
          {userPlaylists?.previous && (
            <button onClick={() => fetchPrevPlaylists()}>PREV </button>
          )}
          {userPlaylists?.next && (
            <button onClick={() => fetchNextPlaylists()}>NEXT </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TempPlaylists;
