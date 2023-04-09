import React, {
  createContext,
  useState,
  useContext,
  ReactFragment,
  useEffect,
} from "react";
import { useSpotify } from "./api";
import SpotifyApi from "spotify-api";

// interface SpotifyPlaylistsContextType {
//   recommendations: SpotifyApi.RecommendationTrackObject | null;
//   fetchingRecommendations: boolean;
//   setRecommendations: React.Dispatch<React.SetStateAction<null>>;
//   fetchTrackRecommendations: (
//     seedValue: string[],
//     seedType: string
//   ) => Promise<void>;
// }

const SpotifyPlaylistsContext = createContext({});
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
  const [userPlaylists, setUserPlaylists] = useState(null);
  const [fetchingPlaylists, setFetchingPlaylists] = useState(false);

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

  const addTrackToPlaylist = async (playlistId, trackUri) => {
    await callApiEndpoint({
      path: `/playlists/${playlistId}/tracks?uris=${trackUri}`,
      method: "POST",
      token,
    });
  };

  const createNewPlaylist = async (playlistName: string) => {
    return await callApiEndpointWithBody({
      path: `/users/${user.id}/playlists`,
      method: "POST",
      token,
      body: JSON.stringify({
        name: `${playlistName}`,
        public: false,
        description: "Created with MusicStats for Spotify",
      }),
    });
  };

  return {
    userPlaylists,
    loadUserPlaylists,
    fetchPrevPlaylists,
    fetchNextPlaylists,
    addTrackToPlaylist,
    createNewPlaylist,
  };
};
