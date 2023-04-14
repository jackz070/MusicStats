import React, {
  PropsWithChildren,
  createContext,
  useState,
  useContext,
  ReactFragment,
} from "react";
import { useSpotify } from "./api";
import SpotifyApi from "spotify-api";

const initialState = {
  recommendations: null,
  fetchingRecommendations: true,
  setRecommendations: () => {},
  fetchTrackRecommendations: () => Promise.resolve(),
};

interface SpotifyTrackRecommendationsContextType {
  recommendations: SpotifyApi.RecommendationTrackObject | null;
  fetchingRecommendations: boolean;
  setRecommendations: React.Dispatch<React.SetStateAction<null>>;
  fetchTrackRecommendations: (
    seedValue: string | string[],
    seedType: string
  ) => Promise<void>;
}

const SpotifyTrackRecommendationsContext =
  createContext<SpotifyTrackRecommendationsContextType>(initialState);
SpotifyTrackRecommendationsContext.displayName =
  "spotifyTrackRecommendationsContext";

export const SpotifyTrackRecommendationsContextProvider = ({
  children,
}: PropsWithChildren) => {
  const spotifyTrackRecommendations = useProvideTrackRecommendations();

  return (
    <SpotifyTrackRecommendationsContext.Provider
      value={spotifyTrackRecommendations}
    >
      {children}
    </SpotifyTrackRecommendationsContext.Provider>
  );
};

export const useSpotifyTrackRecommendations = () => {
  return useContext(SpotifyTrackRecommendationsContext);
};

const useProvideTrackRecommendations = () => {
  const [recommendations, setRecommendations] = useState(null);
  const [fetchingRecommendations, setFetchingRecommendations] = useState(false);

  const { callApiEndpoint, token, appendSavedStatusToTracks } = useSpotify();

  const fetchTrackRecommendations = async (
    seedValue: string | string[],
    seedType: string
  ) => {
    try {
      setFetchingRecommendations(true);
      const recommendations = await callApiEndpoint({
        path: `/recommendations?limit=20&seed_${seedType}=${seedValue}`,
        token,
      });

      const tempItems: { items: SpotifyApi.TrackObjectFull[] } = { items: [] };
      recommendations?.tracks?.forEach((item: SpotifyApi.TrackObjectFull) =>
        tempItems.items.push(item)
      );

      appendSavedStatusToTracks(tempItems);

      tempItems.items.forEach(
        (item, index) => (recommendations.tracks[index] = item)
      );

      setRecommendations(recommendations);
      setFetchingRecommendations(false);
    } catch (err) {
      console.error(err);
    }
  };

  return {
    fetchTrackRecommendations,
    recommendations,
    fetchingRecommendations,
    setRecommendations,
  };
};
