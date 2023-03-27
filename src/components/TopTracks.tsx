import React from "react";
import { useSpotify } from "../api";
import { InfinitySpin } from "react-loader-spinner";
import Spotify_icon from "../../public/Spotify_icon.png";

const TopTracks = () => {
  const { topTracks, isLoading, fetchPrevTracks, fetchNextTracks, isFetching } =
    useSpotify();
  // TODO extract this table so that it can be also used by recently played
  return (
    <section className="top_tracks">
      <h2>Top Tracks</h2>
      {isLoading && <div>Loading...</div>}
      {topTracks && (
        <div className="top-tracks_container">
          <div className="top-tracks_table">
            {topTracks?.items?.map((item, index) => (
              <a
                href={`http://open.spotify.com/track/${item.id}`}
                target="_blank"
                key={index}
                className="top-tracks_table-item"
              >
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
                        <div className="top-tracks_table-artist">
                          {item.artists.map((artist, index) =>
                            item?.artists.length > 1 ? (
                              index === item?.artists?.length - 1 ? (
                                <span>{artist?.name}</span>
                              ) : (
                                <span>{artist?.name + ", "}</span>
                              )
                            ) : (
                              <span>{artist?.name}</span>
                            )
                          )}
                        </div>
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
              </a>
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
