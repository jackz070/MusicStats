import React, {
  PropsWithChildren,
  createContext,
  useState,
  useContext,
  useEffect,
  ReactFragment,
} from "react";
import { useSpotify } from "./api";
import SpotifyApi from "spotify-api";
import { TrackObjectFullExtendedWithSaved } from "./api";

const initialState = {
  topTracks: undefined,
  topTracksAreFetching: true,
  fetchPrevTracks: () => Promise.resolve(),
  fetchNextTracks: () => Promise.resolve(),
};

interface SpotifyTopTracksContextType {
  topTracks: SpotifyApi.UsersTopTracksResponse | undefined;
  topTracksAreFetching: boolean;
  fetchPrevTracks: () => void;
  fetchNextTracks: () => void;
}

const spotifyTopTracksContext =
  createContext<SpotifyTopTracksContextType>(initialState);
spotifyTopTracksContext.displayName = "spotifyTopTracksContext";

export const SpotifyTopTracksContextProvider = ({
  children,
}: PropsWithChildren) => {
  const spotifyTopTracks = useProvideSpotifyTopTracks();

  return (
    <spotifyTopTracksContext.Provider value={spotifyTopTracks}>
      {children}
    </spotifyTopTracksContext.Provider>
  );
};

export const useSpotifyTopTracks = () => {
  return useContext(spotifyTopTracksContext);
};

const useProvideSpotifyTopTracks = () => {
  const [topTracksAreFetching, setTopTracksAreFetching] = useState(true);
  const [topTracks, setTopTracks] = useState<
    SpotifyApi.UsersTopTracksResponse | undefined
  >(undefined);

  const { callApiEndpoint, timeRange, token, user, checkIfSaved } =
    useSpotify();

  const fetchTopTracks = async (pathProp?: string) => {
    const callPath = pathProp
      ? `/me/top/tracks?${pathProp?.split("?")[1] || ""}`
      : `/me/top/tracks?limit=20&offset=0`;
    return await callApiEndpoint({
      path: `${callPath}&time_range=${timeRange}`,
      token,
    });
  };

  const appendSavedStatusToTracks = async (tracksData: {
    items: TrackObjectFullExtendedWithSaved[];
  }) => {
    const trackIds: string[] = [];
    tracksData.items.forEach((track) => trackIds.push(track.id));
    const savedData = await checkIfSaved(trackIds);

    tracksData.items.forEach((item, index) => (item.saved = savedData[index]));
  };

  const loadSpotifyTopTracks = async () => {
    setTopTracksAreFetching(true);
    try {
      const tracksData = await fetchTopTracks();
      await appendSavedStatusToTracks(tracksData);
      setTopTracks(tracksData);

      setTopTracksAreFetching(false);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNextTracks = async () => {
    setTopTracksAreFetching(true);
    try {
      if (!topTracks?.next) {
        return;
      }
      const tracksData = await fetchTopTracks(topTracks.next);
      await appendSavedStatusToTracks(tracksData);
      setTopTracks(tracksData);
      setTopTracksAreFetching(false);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPrevTracks = async () => {
    setTopTracksAreFetching(true);
    try {
      if (!topTracks?.previous) {
        return;
      }
      const tracksData = await fetchTopTracks(topTracks.previous);
      await appendSavedStatusToTracks(tracksData);
      setTopTracks(tracksData);
      setTopTracksAreFetching(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      loadSpotifyTopTracks();
    }
  }, [timeRange, user]);

  return { topTracks, topTracksAreFetching, fetchPrevTracks, fetchNextTracks };
};
