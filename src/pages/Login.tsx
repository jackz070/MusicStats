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
      <p className="login-notice">MusicStats is front-end only and stores no data. Everything happens only in your browser.</p>
    </section>
  );
};

export default Login;
