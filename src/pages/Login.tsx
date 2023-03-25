import React, { useEffect, useState } from "react";
import { useSpotify } from "../api";
import bgVideo from "../../public/abstract-71292.mp4";

const Login = () => {
  const { login, hasLoggedIn } = useSpotify();

  useEffect(() => {
    const video = document.querySelector("video");
    video.playbackRate = 0.4;
  }, []);

  return (
    <section className="loginPage">
      <video loop autoPlay muted id="bgVideo">
        <source src={bgVideo} type="video/mp4" />
      </video>
      <div>
        <h2>Welcome to MusicStats</h2>
        <p>Where you can get all your listening stats</p>
      </div>
      <button onClick={login}>Login with Spotify</button>
    </section>
  );
};

export default Login;
