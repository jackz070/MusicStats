import React, { useEffect, useState } from "react";
import { useSpotify } from "../api/api";
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
            <a
              href={trackData?.external_urls?.spotify}
              target="_blank"
              className="currently_playing-info_name"
            >
              {trackData?.name}
            </a>{" "}
            <span className="currently_playing-aside">by</span>{" "}
            <span className="currently_playing-info_artist">
              {trackData?.artists?.map((artist, index) =>
                trackData?.artists.length > 1 ? (
                  index === trackData?.artists.length - 1 ? (
                    <a
                      href={artist?.external_urls?.spotify}
                      target="_blank"
                      key={artist?.name}
                    >
                      {artist?.name}
                    </a>
                  ) : (
                    <a
                      href={artist?.external_urls?.spotify}
                      target="_blank"
                      key={artist?.name}
                    >
                      {artist?.name + ", "}
                    </a>
                  )
                ) : (
                  <a
                    href={artist?.external_urls?.spotify}
                    target="_blank"
                    key={artist?.name}
                  >
                    {artist?.name}
                  </a>
                )
              )}
            </span>
            <a className="currently_playing-info_album">
              <span
                href={trackData?.album?.external_urls?.spotify}
                target="_blank"
                className="currently_playing-aside"
              >
                from
              </span>{" "}
              {trackData?.album?.name}
            </a>
          </div>
        </div>
      )}
    </fieldset>
  );
};

export default CurrentlyPlaying;
