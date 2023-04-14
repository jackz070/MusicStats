import React, { useState, useEffect } from "react";
import { InfinitySpin } from "react-loader-spinner";
import Spotify_icon from "../../assets/Spotify_icon.png";
import { useSpotify } from "../../api/api";
import SpotifyApi from "spotify-api";
import { motion, AnimatePresence, easeIn } from "framer-motion";
import { useSpotifyTopTracks } from "../../api/useSpotifyTopTracks";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import LikeButton from "./LikeButton";
import PreviewPlayer from "./PreviewPlayer";
import Playlists from "../Playlists";
import { TrackObjectFullExtendedWithSaved } from "../../api/api";

const SingleTrack = ({
  item,
  saved,
  fetchable = false,
  widthSmall = false,
}: {
  item: TrackObjectFullExtendedWithSaved;
  saved: boolean;
  fetchable?: boolean;
  widthSmall?: boolean;
}) => {
  const { topTracksAreFetching } = useSpotifyTopTracks();

  return (
    <motion.div
      initial={{ opacity: 0, y: 400 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ease: easeIn }}
      className="top-tracks_table-item"
    >
      <AnimatePresence>
        {fetchable && topTracksAreFetching ? (
          <motion.div
            className="top-tracks_table-item_fetching"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <InfinitySpin color="white" width="100" />
          </motion.div>
        ) : (
          <>
            {" "}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              style={{ height: "60px", width: "60px" }}
            >
              <LazyLoadImage
                src={item.album.images[0].url}
                className="top-tracks_table-item_img"
                width="60px"
                height="60px"
                effect="opacity"
                alt="album art"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="top-tracks_table-item_data"
              transition={{ duration: 0.6 }}
            >
              <div>
                <a
                  href={item?.external_urls?.spotify}
                  target="_blank"
                  className={`top-tracks_table-name ${
                    widthSmall && "top-tracks_table-name_small"
                  }`}
                >
                  {item.name}
                </a>
                <div
                  className={`top-tracks_table-artist ${
                    widthSmall && "top-tracks_table-artist_small"
                  }`}
                >
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
                <Playlists track={item} />
                <LikeButton itemId={item.id} saved={saved} />{" "}
                {item.preview_url && (
                  <PreviewPlayer preview_url={item.preview_url} />
                )}
                {/* <a href={`http://open.spotify.com/track/${item.id}`}>
                <img
                  src={Spotify_icon}
                  className="top-tracks_table-item_spotify-icon"
                />
              </a> */}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SingleTrack;
