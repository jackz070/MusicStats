import React from "react";
import SingleTrack from "./SingleTrack";
import { TrackObjectFull } from "spotify-api";

interface TrackDataWithItems {
  items: TrackObjectFull[];
  tracks?: never;
  next?: string | null;
  previous?: string | null;
}
interface TrackDataWithTracks {
  items?: never;
  tracks: TrackObjectFull[];
  next?: string | null;
  previous?: string | null;
}
type TrackData = TrackDataWithItems | TrackDataWithTracks;
interface TrackListProps {
  trackData: TrackData;
  tracksAreFetchable: boolean;
  next?: () => void;
  prev?: () => void;
}

const TrackList = ({
  trackData,
  tracksAreFetchable,
  next,
  prev,
}: TrackListProps) => {
  if (trackData?.tracks) {
    trackData.items = trackData.tracks;
  }

  return (
    <div className="top-tracks_container">
      <div className="top-tracks_table">
        {trackData?.items?.map((item, index) => (
          <SingleTrack
            item={item}
            fetchable={tracksAreFetchable}
            key={index}
            saved={item.saved}
          />
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
