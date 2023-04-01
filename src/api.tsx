import {
  ReactFragment,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import * as SpotifyApi from "spotify-api";

const baseURL = import.meta.env.VITE_baseURL;
const clientId = import.meta.env.VITE_clientId;
const redirectUri = import.meta.env.VITE_redirectUri;
const scopes = import.meta.env.VITE_scopes;

const SPOTIFY = {
  ACCESS_TOKEN: "SPOTIFY_ACCESS_TOKEN",
  EXP_TIMESTAMP: "SPOTIFY_TOKEN_EXPIRE_TIMESTAMP",
  TOKEN_TYPE: "SPOTIFY_TOKEN_TYPE",
};

export const generateState = (length: number) => {
  let text = "";

  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};
interface GenreData {
  text: string;
  value: number;
}
export interface SpotifyContextType {
  user: SpotifyApi.CurrentUsersProfileResponse | null;
  login: () => void;
  logout: () => void;
  isLoading: boolean;
  readonly hasLoggedIn: boolean;
  storeTokenAtRedirect: () => void;
  fetchUserInfo: () => void;
  topArtists: SpotifyApi.UsersTopArtistsResponse | undefined;
  topTracks: SpotifyApi.UsersTopTracksResponse | undefined;
  currentlyPlaying: SpotifyApi.CurrentlyPlayingResponse | null;
  changeTimeRange: (value: string) => void;
  fetchPrevTracks: () => void;
  fetchNextTracks: () => void;
  fetchNextArtists: () => void;
  fetchPrevArtists: () => void;
  timeRange: string;
  isFetching: boolean;
  genreData: GenreData[] | null;
  recentlyPlayed: SpotifyApi.UsersRecentlyPlayedTracksResponse | null;
}
// TODO: build initial state
const spotifyContext = createContext<SpotifyContextType>({});
spotifyContext.displayName = "SpotifyContext";

export const SpotifyProvider = ({ children }: { children: ReactFragment }) => {
  const spotify = useProvideSpotify();

  return (
    <spotifyContext.Provider value={spotify}>
      {children}
    </spotifyContext.Provider>
  );
};

export const useSpotify = () => {
  return useContext(spotifyContext);
};

const useProvideSpotify = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] =
    useState<SpotifyApi.CurrentUsersProfileResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [tokenExpiry, setTokenExpiry] = useState<number | null>(null);
  const [topArtists, setTopArtists] = useState<
    SpotifyApi.UsersTopArtistsResponse | undefined
  >(undefined);
  const [topTracks, setTopTracks] = useState<
    SpotifyApi.UsersTopTracksResponse | undefined
  >(undefined);
  const [timeRange, setTimeRange] = useState("medium_term");
  const [isFetching, setIsFetching] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] =
    useState<SpotifyApi.CurrentlyPlayingResponse | null>(null);
  const [genreData, setGenreData] = useState<GenreData[] | null>(null);
  const [recentlyPlayed, setRecentlyPlayed] =
    useState<SpotifyApi.UsersRecentlyPlayedTracksResponse | null>(null);
  const [recommendations, setRecommendations] = useState(null);
  const [fetchingRecommendations, setFetchingRecommendations] = useState(false);

  const callApiEndpoint = async ({
    path,
    method = "GET",
  }: {
    path: string;
    method?: string;
    token: string | null | undefined;
  }) => {
    if (hasTokenExpired()) {
      invalidateToken();
      throw new Error("Token has expired");
    }

    return await (
      await fetch(`${baseURL}${path}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method,
      })
    ).json();
  };

  const fetchUserInfo = async () => {
    return await callApiEndpoint({ path: "/me", token });
  };

  const login = () => {
    window.location.replace(
      `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}&response_type=token&state=${generateState(
        16
      )}&show_dialog=true`
    );
  };

  const storeTokenAtRedirect = () => {
    const searchParams = new URLSearchParams(window.location.hash.substring(1));

    try {
      if (window.location.href.includes("error")) {
        throw new Error();
      }

      const accessToken = searchParams.get("access_token");
      const expiresIn = parseInt(searchParams.get("expires_in") || "", 10);
      const tokenType = searchParams.get("token_type");

      const expTimestamp = Math.floor(Date.now() / 1000 + expiresIn);

      if (accessToken && tokenType) {
        window.localStorage.setItem(SPOTIFY.ACCESS_TOKEN, accessToken);
        window.localStorage.setItem(
          SPOTIFY.EXP_TIMESTAMP,
          expTimestamp.toString()
        );
        window.localStorage.setItem(SPOTIFY.TOKEN_TYPE, tokenType);
      }
      setToken(accessToken);
      setTokenExpiry(expTimestamp);
    } catch (err) {
      console.error(err);

      throw new Error(`Could not store token information in local storage.`);
    }
  };

  const invalidateToken = () => {
    try {
      Object.values(SPOTIFY).forEach((key) => {
        window.localStorage.removeItem(key);
      });
    } catch (err) {
      console.error(err);
    }

    setUser(null);
    setToken(null);
    setTokenExpiry(null);
  };

  const logout = () => {
    invalidateToken();
    window.location.assign("/");
  };

  const hasTokenExpired = () => {
    try {
      const accessToken =
        token || window.localStorage.getItem(SPOTIFY.ACCESS_TOKEN);
      const expTimestamp =
        tokenExpiry ||
        parseInt(window.localStorage.getItem(SPOTIFY.EXP_TIMESTAMP) || "", 10);

      if (!accessToken || !expTimestamp || isNaN(expTimestamp)) {
        return false;
      }

      return Date.now() / 1000 > expTimestamp;
    } catch (err) {
      console.error(err);

      return true;
    }
  };

  const hasLoggedIn = () => {
    return !!token && !!user && !hasTokenExpired();
  };

  const loadCurrentUser = async () => {
    try {
      const user = await fetchUserInfo();

      setUser(user);
    } catch (err) {
      console.error(err);
    }
  };

  const changeTimeRange = (value: string) => {
    if (
      value === "short_term" ||
      value === "medium_term" ||
      value === "long_term"
    ) {
      setTimeRange(value);
    } else {
      null;
    }
  };

  const fetchCurrentlyPlaying = async () => {
    const callPath = `/me/player/currently-playing`;
    return await callApiEndpoint({
      path: `${callPath}`,
      token,
    });
  };

  const loadCurrentlyPlaying = async () => {
    try {
      const currentlyPlayingData = await fetchCurrentlyPlaying();
      setCurrentlyPlaying(currentlyPlayingData);
    } catch (err) {
      setCurrentlyPlaying(null);
    }
  };

  const loadRecentlyPlayed = async () => {
    try {
      const recentlyPlayedData = await fetchRecentlyPlayed();
      setRecentlyPlayed(recentlyPlayedData);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRecentlyPlayed = async () => {
    const callPath = `/me/player/recently-played?limit=50`;
    return await callApiEndpoint({
      path: `${callPath}`,
      token,
    });
  };

  const fetchTopTracks = async (pathProp?: string) => {
    const callPath = pathProp
      ? `/me/top/tracks?${pathProp?.split("?")[1] || ""}`
      : `/me/top/tracks?limit=20&offset=0`;
    return await callApiEndpoint({
      path: `${callPath}&time_range=${timeRange}`,
      token,
    });
  };

  const fetchTopArtists = async (pathProp?: string) => {
    const callPath = pathProp
      ? `/me/top/artists?${pathProp?.split("?")[1] || ""}`
      : `/me/top/artists?limit=20&offset=0`;
    return await callApiEndpoint({
      path: `${callPath}&time_range=${timeRange}`,
      token,
    });
  };

  const loadAllData = async () => {
    setIsFetching(true);
    try {
      loadCurrentlyPlaying();

      // const tracksData = await fetchTopTracks();
      // setTopTracks(tracksData);

      const artistsData = await fetchTopArtists();
      setTopArtists(artistsData);
      setTimeout(() => {
        loadRecentlyPlayed();
        getGenreData();
      }, 1000);
      setIsFetching(false);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNextTracks = async () => {
    setIsFetching(true);
    try {
      if (!topTracks?.next) {
        return;
      }
      const tracksData = await fetchTopTracks(topTracks.next);
      setTopTracks(tracksData);
      setIsFetching(false);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPrevTracks = async () => {
    setIsFetching(true);
    try {
      if (!topTracks?.previous) {
        return;
      }
      const tracksData = await fetchTopTracks(topTracks.previous);
      setTopTracks(tracksData);
      setIsFetching(false);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNextArtists = async () => {
    setIsFetching(true);
    try {
      if (!topArtists?.next) {
        return;
      }
      const artistsData = await fetchTopArtists(topArtists.next);
      setIsFetching(false);
      setTopArtists(artistsData);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPrevArtists = async () => {
    setIsFetching(true);
    try {
      if (!topArtists?.previous) {
        return;
      }
      const artistsData = await fetchTopArtists(topArtists.previous);
      setIsFetching(false);
      setTopArtists(artistsData);
    } catch (err) {
      console.error(err);
    }
  };

  const getGenreData = async () => {
    const allTopArtists: SpotifyApi.UsersTopArtistsResponse =
      await callApiEndpoint({
        path: `/me/top/artists?limit=50&offset=0&time_range=${timeRange}`,
        token,
      });

    const genres: string[] = [];
    const fillGenres = () =>
      allTopArtists?.items?.forEach((artist) =>
        artist?.genres?.forEach((genre) => genres.push(genre))
      );
    fillGenres();
    const tally: GenreData[] = [];
    const tallyGenres = () => {
      genres.forEach((genre) => {
        const found = tally.findIndex((item) => item.text === genre);
        found === -1
          ? tally.push({ text: genre, value: 1 })
          : (tally[found].value = tally[found].value + 1);
      });
      setGenreData(tally.sort((a, b) => b.value - a.value).slice(0, 25));
    };
    tallyGenres();
  };

  const fetchTrackRecommendations = async (seedValue, seedType) => {
    try {
      setFetchingRecommendations(true);
      const recommendations = await callApiEndpoint({
        path: `/recommendations?limit=20&seed_${seedType}=${seedValue}`,
        token,
      });
      setRecommendations(recommendations);
      setFetchingRecommendations(false);
    } catch (err) {
      console.error(err);
    }
  };

  const checkIfSaved = async (id) => {
    try {
      const callPath = `/me/tracks/contains?ids=${id}`;
      return await callApiEndpoint({
        path: `${callPath}`,
        token,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const changeSaved = async (id, method) => {
    try {
      // if response status is 200 confirm success
      const callPath = `/me/tracks?ids=${id}`;
      return await callApiEndpoint({
        path: `${callPath}`,
        method,
        token,
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    try {
      const accessToken = window.localStorage.getItem(SPOTIFY.ACCESS_TOKEN);
      const expTimestamp = parseInt(
        window.localStorage.getItem(SPOTIFY.EXP_TIMESTAMP) || "",
        10
      );

      if (accessToken && expTimestamp && Number.isInteger(expTimestamp)) {
        setToken(accessToken);
        setTokenExpiry(expTimestamp);
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);

      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token && tokenExpiry) {
      if (!user) {
        loadCurrentUser();
      } else {
        setIsLoading(false);
        loadAllData();
      }
    }
  }, [token, tokenExpiry, user]);

  useEffect(() => {
    if (token && tokenExpiry && user) {
      loadAllData();
    }
  }, [timeRange]);

  return {
    callApiEndpoint,
    user,
    token,
    login,
    logout,
    isLoading,
    get hasLoggedIn() {
      return hasLoggedIn();
    },
    storeTokenAtRedirect,
    fetchUserInfo,
    topArtists,
    topTracks,
    currentlyPlaying,
    changeTimeRange,
    fetchPrevTracks,
    fetchNextTracks,
    fetchNextArtists,
    fetchPrevArtists,
    timeRange,
    isFetching,
    genreData,
    recentlyPlayed,
    fetchTrackRecommendations,
    recommendations,
    fetchingRecommendations,
    setRecommendations,
    checkIfSaved,
    changeSaved,
  };
};
