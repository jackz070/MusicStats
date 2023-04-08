import React, { useEffect } from "react";
import { useSpotify } from "../api/api";
import bgVideo from "../assets/abstract-71292.mp4";

const Login = () => {
  const { login, hasLoggedIn } = useSpotify();

  useEffect(() => {
    const video = document.querySelector("video");
    if (video) {
      video.playbackRate = 0.4;
    }
  }, []);

  return (
    <section className="loginPage">
      <video loop autoPlay muted id="bgVideo">
        <source src={bgVideo} type="video/mp4" />
      </video>
      <div>
        <p className="login-hero">
          <i>All your</i>
          <br /> <b className="login-hero_large">Spotify listening stats</b>
          <br /> <i>in one place</i>
        </p>
      </div>
      <button onClick={login}>Login with Spotify</button>
      <p className="login-notice">
        MusicStats is front-end only and stores no data. Everything happens only
        in your browser.
      </p>
    </section>
  );
};

export default Login;
