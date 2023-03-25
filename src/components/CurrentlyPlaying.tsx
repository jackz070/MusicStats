import React from "react";
import { useSpotify } from "../api";

const CurrentlyPlaying = () => {
  const { currentlyPlaying } = useSpotify();
  return (
    <div className="currently_playing-container">
      <div className="currently_playing-header">CurrentlyPlaying</div>
      {currentlyPlaying && (
        <div className="currently_playing-info">
          <img
            src={currentlyPlaying?.item?.album?.images?.[1]?.url}
            height="50px"
          />
          <div>
            <div className="currently_playing-info_name">
              {currentlyPlaying?.item?.name}
            </div>{" "}
            by{" "}
            <span className="currently_playing-info_artist">
              {currentlyPlaying?.item?.artists?.map((artist, index) =>
                currentlyPlaying?.item?.artists.length > 1 ? (
                  index === currentlyPlaying?.item?.artists.length - 1 ? (
                    <span>{artist?.name}</span>
                  ) : (
                    <span>{artist?.name + ", "}</span>
                  )
                ) : (
                  <span>{artist?.name}</span>
                )
              )}
            </span>
            <div className="currently_playing-info_album">
              from {currentlyPlaying?.item?.album?.name}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentlyPlaying;
