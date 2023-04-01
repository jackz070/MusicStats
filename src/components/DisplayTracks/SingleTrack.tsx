import React, { useState, useEffect } from "react";
import { InfinitySpin } from "react-loader-spinner";
import Spotify_icon from "../../../public/Spotify_icon.png";
import { useSpotify } from "../../api";
import SpotifyApi from "spotify-api";
import { motion, AnimatePresence, easeIn } from "framer-motion";
import { useSpotifyTopTracks } from "../../api/useSpotifyTopTracks";

const SingleTrack = ({
  item,
  fetchable = false,
}: {
  item: SpotifyApi.TrackObjectFull;
  fetchable?: boolean;
}) => {
  const { checkIfSaved, changeSaved } = useSpotify();
  const { topTracksAreFetching } = useSpotifyTopTracks();
  const [isSaved, setIsSaved] = useState(false);

  const deleteSaved = () => {
    changeSaved(item.id, "DELETE");
    setIsSaved(false);
  };

  const addSaved = () => {
    changeSaved(item.id, "PUT");
    setIsSaved(true);
  };

  const handleSavedClick = (event) => {
    event.stopPropagation();
    isSaved ? deleteSaved() : addSaved();
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
      {fetchable && topTracksAreFetching ? (
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
                {isSaved ? (
                  "Saved"
                ) : (
                  <div className="saved_button">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      viewBox="0 0 150 150"
                      fill=""
                      className="saved_icon"
                    >
                      <path
                        d="M125.784 35.0369C113.039 22.2916 92.9859 21.3682 79.1227 32.8994C79.1062 32.9135 77.318 34.3807 75 34.3807C72.6234 34.3807 70.9266 32.9416 70.8609 32.8853C57.0141 21.3682 36.9609 22.2916 24.2156 35.0369C17.6695 41.583 14.0625 50.2877 14.0625 59.5478C14.0625 68.808 17.6695 77.5127 24.0914 83.9228L64.3078 131.006C66.9844 134.14 70.882 135.938 75 135.938C79.1203 135.938 83.0156 134.14 85.6922 131.009L125.782 84.0611C139.301 70.5447 139.301 48.5533 125.784 35.0369ZM122.346 80.8807L82.1297 127.964C80.3461 130.05 77.7469 131.25 75 131.25C72.2531 131.25 69.6562 130.053 67.8703 127.964L27.532 80.7447C21.8695 75.0822 18.75 67.5541 18.75 59.5478C18.75 51.5392 21.8695 44.0135 27.5297 38.351C33.3961 32.4822 41.0555 29.5127 48.7336 29.5127C55.4742 29.5127 62.2289 31.8025 67.7977 36.4338C68.0977 36.7033 70.8586 39.0682 75 39.0682C79.0266 39.0682 81.8578 36.7314 82.1367 36.49C94.1109 26.5291 111.45 27.3307 122.47 38.351C134.159 50.0393 134.159 69.0564 122.346 80.8807Z"
                        fill="white"
                      />
                    </svg>
                    <div>LIKE</div>
                  </div>
                )}
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
