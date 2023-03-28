import React, { useEffect, useState } from "react";
import { useSpotify } from "../api";
import { InfinitySpin } from "react-loader-spinner";
import Spotify_icon from "../../public/Spotify_icon.png";
import SpotifyApi from "spotify-api";

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
    <section className="top_tracks">
      <h2>Recently Played</h2>
      {isLoading && <div>Loading...</div>}

      {trackData && (
        <div className="top-tracks_container">
          <div className="top-tracks_table">
            {trackData?.items?.map((item, index) => (
              <a
                href={`http://open.spotify.com/track/${item.id}`}
                target="_blank"
                key={index}
                className="top-tracks_table-item"
              >
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
                              <span key={artist?.name}>{artist?.name}</span>
                            ) : (
                              <span key={artist?.name}>
                                {artist?.name + ", "}
                              </span>
                            )
                          ) : (
                            <span key={artist?.name}>{artist?.name}</span>
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
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default RecentlyPlayed;
