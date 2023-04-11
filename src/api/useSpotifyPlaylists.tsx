import React, {
  createContext,
  useState,
  useContext,
  ReactFragment,
  useEffect,
} from "react";
import { useSpotify } from "./api";
import SpotifyApi from "spotify-api";

interface SpotifyPlaylistsContextType {
  userPlaylists: SpotifyApi.ListOfCurrentUsersPlaylistsResponse | null;
  loadUserPlaylists: () => Promise<void>;
  fetchPrevPlaylists: () => Promise<void>;
  fetchNextPlaylists: () => Promise<void>;
  addTrackToPlaylist: (playlistId: any, trackUri: any) => Promise<any>;
  createNewPlaylist: (playlistName: string) => Promise<any>;
  fetchingPlaylists: boolean;
  dropdownIsOpen: boolean;
  setDropdownIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SpotifyPlaylistsContext = createContext<SpotifyPlaylistsContextType>({});
SpotifyPlaylistsContext.displayName = "spotifyPlaylistsContext";

export const SpotifyPlaylistsContextProvider = ({
  children,
}: {
  children: ReactFragment;
}) => {
  const spotifyPlaylists = useProvideSpotifyPlaylists();

  return (
    <SpotifyPlaylistsContext.Provider value={spotifyPlaylists}>
      {children}
    </SpotifyPlaylistsContext.Provider>
  );
};

export const useSpotifyPlaylists = () => {
  return useContext(SpotifyPlaylistsContext);
};

const useProvideSpotifyPlaylists = () => {
  const [userPlaylists, setUserPlaylists] =
    useState<SpotifyApi.ListOfCurrentUsersPlaylistsResponse | null>(null);
  const [fetchingPlaylists, setFetchingPlaylists] = useState(false);
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);

  const { callApiEndpoint, callApiEndpointWithBody, token, user } =
    useSpotify();

  const fetchUserPlaylists = async (pathProp?: string) => {
    const callPath = pathProp
      ? `/me/playlists?${pathProp?.split("?")[1] || ""}`
      : `/me/playlists`;

    return await callApiEndpoint({
      path: callPath,
      token,
    });
  };

  const loadUserPlaylists = async () => {
    setUserPlaylists(null);
    try {
      setFetchingPlaylists(true);
      const playlists = await fetchUserPlaylists();

      setUserPlaylists(playlists);
      setFetchingPlaylists(false);
      console.log(userPlaylists);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNextPlaylists = async () => {
    setFetchingPlaylists(true);
    try {
      if (!userPlaylists?.next) {
        return;
      }
      const playlists = await fetchUserPlaylists(userPlaylists.next);

      setUserPlaylists(playlists);
      setFetchingPlaylists(false);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPrevPlaylists = async () => {
    setFetchingPlaylists(true);
    try {
      if (!userPlaylists?.previous) {
        return;
      }
      const playlists = await fetchUserPlaylists(userPlaylists.previous);

      setUserPlaylists(playlists);
      setFetchingPlaylists(false);
    } catch (err) {
      console.error(err);
    }
  };

  const addTrackToPlaylist = async (playlistId: string, trackUri: string) => {
    if (playlistId && trackUri) {
      return await callApiEndpoint({
        path: `/playlists/${playlistId}/tracks?uris=${trackUri}`,
        method: "POST",
        token,
      });
    }
  };

  const createNewPlaylist = async (playlistName: string) => {
    if (playlistName) {
      return await callApiEndpointWithBody({
        path: `/users/${user?.id}/playlists`,
        method: "POST",
        token,
        body: JSON.stringify({
          name: `${playlistName}`,
          public: false,
          description: "Created with MusicStats for Spotify",
        }),
      });
    }
  };

  return {
    userPlaylists,
    loadUserPlaylists,
    fetchPrevPlaylists,
    fetchNextPlaylists,
    addTrackToPlaylist,
    createNewPlaylist,
    fetchingPlaylists,
    dropdownIsOpen,
    setDropdownIsOpen,
  };
};
