import React from "react";
import { useSpotify } from "../api";
import { redirect } from "react-router-dom";

const Dashboard = () => {
  const { user, logout, hasLoggedIn, topArtists, topTracks } = useSpotify();

  return (
    <div>
      <h2>Dashboard</h2>
      <div>Hello, {user?.display_name}</div>
      <a onClick={logout}>Logout</a>
    </div>
  );
};

export default Dashboard;
