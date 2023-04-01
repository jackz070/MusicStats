import React from "react";
import { useSpotify } from "../api";
import { InfinitySpin } from "react-loader-spinner";
import Spotify_icon from "../../public/Spotify_icon.png";
import SingleTrack from "./DisplayTracks/SingleTrack";
import TrackList from "./DisplayTracks/TrackList";
import TrackRecommendations from "./TrackRecommendations";
import { useSpotifyTopTracks } from "../api/useSpotifyTopTracks";

const TopTracks = () => {
  const { isLoading, isFetching } = useSpotify();

  const { fetchPrevTracks, fetchNextTracks, topTracks } = useSpotifyTopTracks();

  return (
    <section id="top_tracks">
      <div className="top-tracks_header">
        <h2>Top Tracks</h2>
        <TrackRecommendations seed={topTracks} type="tracks" />
      </div>
      {isLoading && <div>Loading...</div>}
      {topTracks && (
        <TrackList
          trackData={topTracks}
          tracksAreFetchable={true}
          next={fetchNextTracks}
          prev={fetchPrevTracks}
        />
        // <div className="top-tracks_container">
        //   <div className="top-tracks_table">
        //     {topTracks?.items?.map((item, index) => (
        //       <SingleTrack item={item} fetchable={true} key={index} />
        //     ))}
        //   </div>
        //   <div className="next-button_container">
        //     {topTracks?.previous && (
        //       <button onClick={() => fetchPrevTracks()} className="next-button">
        //         prev
        //       </button>
        //     )}
        //     {topTracks?.next && (
        //       <button onClick={() => fetchNextTracks()} className="next-button">
        //         next
        //       </button>
        //     )}
        //   </div>
        // </div>
      )}
    </section>
  );
};

export default TopTracks;
