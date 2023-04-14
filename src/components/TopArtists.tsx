import React from "react";
import { useSpotify } from "../api/api";
import { InfinitySpin } from "react-loader-spinner";
import Spotify_icon from "../assets/Spotify_icon.png";
import TrackRecommendations from "./TrackRecommendations";
import { motion } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";

const TopArtists = () => {
  const {
    topArtists,
    isLoading,
    fetchNextArtists,
    fetchPrevArtists,
    isFetching,
    topArtistsIsFetching,
  } = useSpotify();

  return (
    <section id="top_artists">
      <div className="top_artists-header">
        <h2>Top Artists</h2>
        {topArtists && (
          <TrackRecommendations seed={topArtists} type="artists" />
        )}
      </div>
      {isLoading && <div>Loading...</div>}

      {topArtists && (
        <div className="top-artists_container">
          <div className="top-artists_table">
            {topArtists.items.map((item, index) => (
              <div key={index} className="top-artists_table-card">
                {isFetching || topArtistsIsFetching ? (
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
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        style={{ height: "170px", width: "190px" }}
                      >
                        <LazyLoadImage
                          src={item.images[0].url}
                          className="top-artists_table-card_image"
                          height="170px"
                          width="190px"
                          effect="opacity"
                          alt="artist art"
                        />
                      </motion.div>

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
