import React, { useState, useEffect } from "react";
import { InfinitySpin } from "react-loader-spinner";
import Spotify_icon from "../../../public/Spotify_icon.png";
import { useSpotify } from "../../api";
import SpotifyApi from "spotify-api";
import { motion, AnimatePresence, easeIn } from "framer-motion";

const SingleTrack = ({
  item,
  fetchable = false,
}: {
  item: SpotifyApi.TrackObjectFull;
  fetchable?: boolean;
}) => {
  const { isFetching, checkIfSaved, changeSaved } = useSpotify();
  const [isSaved, setIsSaved] = useState(false);

  const handleSavedClick = (event) => {
    event.stopPropagation();
    isSaved ? changeSaved(item.id, "DELETE") : changeSaved(item.id, "PUT");
  };

  useEffect(() => {
    const getCurrentSaveState = async () => {
      const response = await checkIfSaved(item.id);
      setIsSaved(response[0]);
    };
    getCurrentSaveState();
  }, [item]);

  return (
    <motion.a
      initial={{ opacity: 0, y: 400 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ease: easeIn }}
      href={`http://open.spotify.com/track/${item.id}`}
      target="_blank"
      className="top-tracks_table-item"
    >
      {fetchable && isFetching ? (
        <div className="top-tracks_table-item_fetching">
          <InfinitySpin color="white" width="100" />
        </div>
      ) : (
        <>
          {" "}
          <img
            src={item.album.images[0].url}
            className="top-tracks_table-item_img"
          />
          <div className="top-tracks_table-item_data">
            <div>
              <div className="top-tracks_table-name">{item.name}</div>
              <div className="top-tracks_table-artist">
                {item.artists.map((artist, index) =>
                  item?.artists.length > 1 ? (
                    index === item?.artists?.length - 1 ? (
                      <span key={artist?.name}>{artist?.name}</span>
                    ) : (
                      <span key={artist?.name}>{artist?.name + ", "}</span>
                    )
                  ) : (
                    <span key={artist?.name}>{artist?.name}</span>
                  )
                )}
              </div>
            </div>
            <div className="top-tracks_table-item_spotify-icon-container">
              <button onClick={(event) => handleSavedClick(event)}>
                {isSaved ? "Saved" : "Not saved"}
              </button>
              <img
                src={Spotify_icon}
                className="top-tracks_table-item_spotify-icon"
              />
            </div>
          </div>
        </>
      )}
    </motion.a>
  );
};

export default SingleTrack;
