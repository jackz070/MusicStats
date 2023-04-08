import React, { useState, useEffect } from "react";
import { InfinitySpin } from "react-loader-spinner";
import Spotify_icon from "../../../public/Spotify_icon.png";
import { useSpotify } from "../../api/api";
import SpotifyApi from "spotify-api";
import { motion, AnimatePresence, easeIn } from "framer-motion";
import { useSpotifyTopTracks } from "../../api/useSpotifyTopTracks";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import LikeButton from "./LikeButton";
import PreviewPlayer from "./PreviewPlayer";

const SingleTrack = ({
  item,
  saved,
  fetchable = false,
  widthSmall = false,
}: {
  item: SpotifyApi.TrackObjectFull;
  saved: boolean;
  fetchable?: boolean;
}) => {
  const { topTracksAreFetching } = useSpotifyTopTracks();
  const { isFetching } = useSpotify();

  return (
    <motion.div
      initial={{ opacity: 0, y: 400 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ease: easeIn }}
      className="top-tracks_table-item"
    >
      {fetchable && (topTracksAreFetching || isFetching) ? (
        <div className="top-tracks_table-item_fetching">
          <InfinitySpin color="white" width="100" />
        </div>
      ) : (
        <>
          {" "}
          <LazyLoadImage
            src={item.album.images[0].url}
            className="top-tracks_table-item_img"
            width="60px"
            height="60px"
            effect="opacity"
            alt="album art"
          />
          <div className="top-tracks_table-item_data">
            <div>
              <a
                href={item?.external_urls?.spotify}
                target="_blank"
                className="top-tracks_table-name"
              >
                {item.name}
              </a>
              <div className="top-tracks_table-artist">
                {item.artists.map((artist, index) =>
                  item?.artists.length > 1 ? (
                    index === item?.artists?.length - 1 ? (
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
              </div>
            </div>
            <div className="top-tracks_table-item_spotify-icon-container">
              <LikeButton itemId={item.id} saved={saved} />{" "}
              {item.preview_url && (
                <PreviewPlayer preview_url={item.preview_url} />
              )}
              <a href={`http://open.spotify.com/track/${item.id}`}>
                <img
                  src={Spotify_icon}
                  className="top-tracks_table-item_spotify-icon"
                />
              </a>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default SingleTrack;
