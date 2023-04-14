import React from "react";
import SingleTrack from "./SingleTrack";
import { TrackObjectFull } from "spotify-api";
import SpotifyApi from "spotify-api";
import { TrackObjectFullExtendedWithSaved } from "musicstats/src/api/api";

interface TrackDataWithItems {
  items: TrackObjectFullExtendedWithSaved[];
  tracks?: never;
  next?: string | null;
  previous?: string | null;
}
interface TrackDataWithTracks {
  items?: never;
  tracks: TrackObjectFullExtendedWithSaved[];
  next?: string | null;
  previous?: string | null;
}
type TrackData = TrackDataWithItems | TrackDataWithTracks;

interface TrackListProps {
  trackData: TrackData;
  tracksAreFetchable: boolean;
  next?: () => void;
  prev?: () => void;
  widthSmall?: boolean;
}

const TrackList = ({
  trackData,
  tracksAreFetchable,
  next,
  prev,
  widthSmall = false,
}: TrackListProps) => {
  if (trackData?.tracks) {
    //@ts-ignore
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
            widthSmall={widthSmall}
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
