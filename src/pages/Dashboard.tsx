import React from "react";
import TopArtists from "../components/TopArtists";
import TopTracks from "../components/TopTracks";
import GenreCloud from "../components/GenreCloud";
import CurrentlyPlaying from "../components/CurrentlyPlaying";
import FloatingBar from "../components/FloatingBar";
import RecentlyPlayed from "../components/RecentlyPlayed";
import UserInfo from "../components/UserInfo";
import { Toaster } from "react-hot-toast";

const Dashboard = () => {
  return (
    <div id="dashboard">
      <Toaster />
      <UserInfo />
      <CurrentlyPlaying />
      <TopTracks />
      <TopArtists />
      <GenreCloud />
      <FloatingBar />
      <RecentlyPlayed />
    </div>
  );
};

export default Dashboard;
