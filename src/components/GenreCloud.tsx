import React from "react";
import WordCloud from "react-d3-cloud";
import { useSpotify } from "../api";
import LoadingSpinner from "./LoadingSpinner";

const GenreCloud = () => {
  const { genreData, isFetching } = useSpotify();
  return (
    <section className="genre-cloud_containter" id="top_genres">
      <h2>Top Genres</h2>
      {isFetching ? (
        <LoadingSpinner />
      ) : (
        <div className="genre-cloud">
          {genreData && (
            <WordCloud
              data={genreData}
              rotate={0}
              fontSize={(word) => word.value * 12}
              font="Open Sans"
              height={530}
              padding={5}
              onWordMouseOver={(d, i) => {
                d.target.style.textDecoration = "underline";
                d.target.style.cursor = "pointer";
                d.target.style.zIndex = "10";
              }}
              onWordMouseOut={(d, i) => {
                d.target.style.textDecoration = "none";
                d.target.style.cursor = "auto";
                d.target.style.zIndex = "1";
              }}
              onWordClick={(d, i) =>
                window.open(
                  `https://open.spotify.com/search/${i.text}`,
                  "_blank"
                )
              }
            />
          )}
        </div>
      )}
    </section>
  );
};

export default GenreCloud;
