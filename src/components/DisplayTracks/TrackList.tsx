import React from "react";
import SingleTrack from "./SingleTrack";
import { TrackObjectFull } from "spotify-api";

const TrackList = ({
  trackData,
  tracksAreFetchable,
  next,
  prev,
}: {
  trackData: {
    items: TrackObjectFull[];
    next?: string | null;
    previous?: string | null;
  };
  tracksAreFetchable: boolean;
  next?: () => void;
  prev?: () => void;
}) => {
  
  if (trackData?.tracks) {
    trackData.items = trackData.tracks;
  }

  return (
    <div className="top-tracks_container">
      <div className="top-tracks_table">
        {trackData?.items?.map((item, index) => (
          <SingleTrack item={item} fetchable={tracksAreFetchable} key={index} />
        ))}
      </div>
      <div className="next-button_container">
        {trackData?.previous && prev && (
          <button onClick={() => prev()} className="next-button">
            prev
          </button>
        )}
        {trackData?.next && next && (
          <button onClick={() => next()} className="next-button">
            next
          </button>
        )}
      </div>
    </div>
  );
};

export default TrackList;
