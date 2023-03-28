import React, { useEffect, useState } from "react";
import { useSpotify } from "../api";
import LoadingSpinner from "./LoadingSpinner";
import SpotifyApi from "spotify-api";

const CurrentlyPlaying = () => {
  let { currentlyPlaying, recentlyPlayed, isFetching } = useSpotify();
  const [trackData, setTrackData] = useState<
    SpotifyApi.TrackObjectFull | SpotifyApi.EpisodeObjectFull | null
  >();

  useEffect(() => {
    currentlyPlaying
      ? setTrackData(currentlyPlaying.item)
      : setTrackData(recentlyPlayed?.items?.[0]?.track);
  }, [currentlyPlaying, recentlyPlayed]);

  return (
    <fieldset className="currently_playing-container">
      <legend className="currently_playing-header">
        {" "}
        {currentlyPlaying ? "Currently Playing" : "Last Played"}
      </legend>

      {isFetching && <LoadingSpinner />}
      {trackData && !isFetching && (
        <div className="currently_playing-info">
          <img src={trackData?.album?.images?.[1]?.url} height="50px" />
          <div>
            <div className="currently_playing-info_name">{trackData?.name}</div>{" "}
            <span className="currently_playing-aside">by</span>{" "}
            <span className="currently_playing-info_artist">
              {trackData?.artists?.map((artist, index) =>
                trackData?.artists.length > 1 ? (
                  index === trackData?.artists.length - 1 ? (
                    <span key={artist?.name}>{artist?.name}</span>
                  ) : (
                    <span key={artist?.name}>{artist?.name + ", "}</span>
                  )
                ) : (
                  <span key={artist?.name}>{artist?.name}</span>
                )
              )}
            </span>
            <div className="currently_playing-info_album">
              <span className="currently_playing-aside">from</span>{" "}
              {trackData?.album?.name}
            </div>
          </div>
        </div>
      )}
    </fieldset>
  );
};

export default CurrentlyPlaying;
