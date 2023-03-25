import React from "react";
import { useSpotify } from "../api";
import { InfinitySpin } from "react-loader-spinner";
import Spotify_icon from "../../public/Spotify_icon.png";

const TopArtists = () => {
  const {
    topArtists,
    isLoading,
    fetchNextArtists,
    fetchPrevArtists,
    isFetching,
  } = useSpotify();
  return (
    <section id="top_artists">
      <h2>Your Top Artists</h2>
      {isLoading && <div>Loading...</div>}

      {topArtists && (
        <div className="top-artists_container">
          <div className="top-artists_table">
            {topArtists.items.map((item, index) => (
              <div key={index} className="top-artists_table-card">
                {isFetching ? (
                  <div className="top-artists_table-card-fetching">
                    <InfinitySpin width="200" color="white" />
                  </div>
                ) : (
                  <a
                    href={`http://open.spotify.com/artist/${item.id}`}
                    target="_blank"
                    className="top-artists_table-card-link-wrapper"
                  >
                    <div className="top-artists_table-card-top">
                      <img
                        src={item.images[0].url}
                        className="top-artists_table-card_image"
                      />

                      <div className="top-artists_table-card_name">
                        {item.name}
                      </div>
                    </div>
                    <div>
                      <img
                        src={Spotify_icon}
                        className="top-artists_table-card_spotify-icon"
                      />
                    </div>
                  </a>
                )}
              </div>
            ))}
          </div>
          <div>
            {" "}
            {topArtists?.previous && (
              <button onClick={() => fetchPrevArtists()}>prev</button>
            )}
            {topArtists?.next && (
              <button onClick={() => fetchNextArtists()}>next</button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default TopArtists;
