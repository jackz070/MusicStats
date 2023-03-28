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

  // TODO: each artists, tracks and genres get button for recomendations based on top 5 of those
  // TODO: that button is animated, loads and when ready a popup opens with recommended tracks
  // TODO: the tracks (and also current tracks in top...) can be added to favs with a heart button and added to custom playlists
  return (
    <section id="top_artists">
      <h2>Top Artists</h2>
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
          <div className="next-button_container">
            {" "}
            {topArtists?.previous && (
              <button
                onClick={() => fetchPrevArtists()}
                className="next-button"
              >
                prev
              </button>
            )}
            {topArtists?.next && (
              <button
                onClick={() => fetchNextArtists()}
                className="next-button"
              >
                next
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default TopArtists;
