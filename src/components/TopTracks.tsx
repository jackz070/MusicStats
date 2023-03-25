import React from "react";
import { useSpotify } from "../api";
import { InfinitySpin } from "react-loader-spinner";
import Spotify_icon from "../../public/Spotify_icon.png";

const TopTracks = () => {
  const { topTracks, isLoading, fetchPrevTracks, fetchNextTracks, isFetching } =
    useSpotify();

  return (
    <section id="top_tracks">
      <h2>Your Top Tracks</h2>
      {isLoading && <div>Loading...</div>}
      {topTracks && (
        <div className="top-tracks_container">
          <div className="top-tracks_table">
            {topTracks?.items?.map((item, index) => (
              <div key={index} className="top-tracks_table-item">
                {isFetching ? (
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
                        {item.artists.map((artist, index) => (
                          <div key={index} className="top-tracks_table-artist">
                            {artist.name}
                          </div>
                        ))}
                      </div>
                      <div className="top-tracks_table-item_spotify-icon-container">
                        <img
                          src={Spotify_icon}
                          className="top-tracks_table-item_spotify-icon"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          <div>
            {topTracks?.previous && (
              <button onClick={() => fetchPrevTracks()}>prev</button>
            )}
            {topTracks?.next && (
              <button onClick={() => fetchNextTracks()}>next</button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default TopTracks;
