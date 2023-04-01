import React, { createContext, useState, useContext, useEffect } from "react";
import { useSpotify } from "../api";
import SpotifyApi from "spotify-api";

const spotifyTopTracksContext = createContext({});
spotifyTopTracksContext.displayName = "spotifyTopTracksContext";

export const SpotifyTopTracksContextProvider = ({ children }) => {
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

  const { callApiEndpoint, timeRange, token, user } = useSpotify();

  const fetchTopTracks = async (pathProp?: string) => {
    const callPath = pathProp
      ? `/me/top/tracks?${pathProp?.split("?")[1] || ""}`
      : `/me/top/tracks?limit=20&offset=0`;
    return await callApiEndpoint({
      path: `${callPath}&time_range=${timeRange}`,
      token,
    });
  };

  const loadSpotifyTopTracks = async () => {
    setTopTracksAreFetching(true);
    try {
      const tracksData = await fetchTopTracks();
      setTopTracks(tracksData);
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
      setTopTracks(tracksData);
      setTopTracksAreFetching(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setTopTracksAreFetching(true);
    if (token) {
      loadSpotifyTopTracks();
      setTopTracksAreFetching(false);
    }
  }, [timeRange, user]);

  return { topTracks, topTracksAreFetching, fetchPrevTracks, fetchNextTracks };
};
