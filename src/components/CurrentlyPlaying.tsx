import React, { useEffect, useState } from "react";
import { useSpotify } from "../api/api";
import LoadingSpinner from "./LoadingSpinner";
import SpotifyApi from "spotify-api";
import { motion } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";

const CurrentlyPlaying = () => {
  let { currentlyPlaying, recentlyPlayed, isFetching } = useSpotify();
  const [trackData, setTrackData] =
    useState<SpotifyApi.TrackObjectFull | null>();
  // TODO : currently playing may be a podcast episode which currently breaks the component (second variant for podcast?)
  useEffect(() => {
    currentlyPlaying && currentlyPlaying?.currently_playing_type !== "episode"
      ? setTrackData(currentlyPlaying.item as SpotifyApi.TrackObjectFull)
      : setTrackData(recentlyPlayed?.items?.[0]?.track);
  }, [currentlyPlaying, recentlyPlayed]);
  console.log(currentlyPlaying?.currently_playing_type === "episode");

  return (
    <fieldset className="currently_playing-container">
      <legend className="currently_playing-header">
        {" "}
        {currentlyPlaying &&
        currentlyPlaying?.currently_playing_type !== "episode"
          ? "Currently Playing"
          : "Last Played"}
      </legend>

      {isFetching && <LoadingSpinner />}
      {trackData && !isFetching && (
        <motion.div
          className="currently_playing-info"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="currently_playing-image_container"
          >
            <LazyLoadImage
              src={trackData?.album?.images?.[1]?.url}
              className="currently_playing-image"
              effect="opacity"
              alt="album art"
            />
          </motion.div>
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
            <div className="currently_playing-info_album">
              <span className="currently_playing-aside">from</span>{" "}
              <a
                href={trackData?.album?.external_urls?.spotify}
                target="_blank"
              >
                {trackData?.album?.name}
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </fieldset>
  );
};

export default CurrentlyPlaying;
