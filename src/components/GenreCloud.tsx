import React from "react";
import WordCloud from "react-d3-cloud";
import { useSpotify } from "../api";
import LoadingSpinner from "./LoadingSpinner";

const data = [
  { text: "Hey", value: 1 },
  { text: "lol", value: 3 },
  { text: "first impression", value: 2 },
  { text: "very cool", value: 4 },
  { text: "duck", value: 8 },
];

const GenreCloud = () => {
  const { genreData, isFetching } = useSpotify();
  return (
    <section className="genre-cloud_containter">
      <h3>Most Popular Genres</h3>
      {isFetching ? (
        <LoadingSpinner />
      ) : (
        <div>
          {genreData && (
            <WordCloud
              data={genreData}
              rotate={0}
              fontSize={(word) => word.value * 12}
              font="Urbanist"
              height={550}
            />
          )}
        </div>
      )}
    </section>
  );
};

export default GenreCloud;
