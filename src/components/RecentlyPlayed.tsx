import React, { useEffect, useState } from "react";
import { useSpotify } from "../api";
import { InfinitySpin } from "react-loader-spinner";
import Spotify_icon from "../../public/Spotify_icon.png";
import SpotifyApi from "spotify-api";
import SingleTrack from "./DisplayTracks/SingleTrack";
import TrackList from "./DisplayTracks/TrackList";

const RecentlyPlayed = () => {
  const { recentlyPlayed, isLoading, isFetching } = useSpotify();

  const [trackData, setTrackData] = useState<{
    items: SpotifyApi.TrackObjectFull[];
    next: string | null;
  }>();

  useEffect(() => {
    const formatData = () => {
      const tempData: {
        items: SpotifyApi.TrackObjectFull[];
        next: string | null;
      } = { items: [], next: null };

      recentlyPlayed?.items?.forEach((item) => tempData.items.push(item.track));
      if (recentlyPlayed?.next) {
        tempData.next = recentlyPlayed?.next;
      }

      setTrackData(tempData);
    };
    formatData();
  }, [recentlyPlayed]);

  return (
    <section className="top_tracks" id="recently_played">
      <h2>Recently Played</h2>
      {isLoading && <div>Loading...</div>}

      {trackData && (
        <TrackList trackData={trackData} tracksAreFetchable={false} />
        // <div className="top-tracks_container">
        //   <div className="top-tracks_table">
        //     {trackData?.items?.map((item, index) => (
        //       <SingleTrack item={item} key={index} />
        //     ))}
        //   </div>
        // </div>
      )}
    </section>
  );
};

export default RecentlyPlayed;
