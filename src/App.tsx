import React, { useEffect, useState } from "react";
import { useSpotify } from "./api";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import SpotifyRedirect from "./pages/SpotifyRedirect";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  // const authEndpoint = "https://accounts.spotify.com/authorize";
  // const clientId = "07ce1de1cb6c4e11aa3fa70bc4576907";
  // const redirectUri = "http://localhost:5173/";
  // const scopes = "user-read-private user-read-email";
  // const [token, setToken] = useState(null);
  // const [userInfo, setUserInfo] = useState(null);

  const {
    hasLoggedIn,
    hasRedirectedFromValidPopup,
    isLoading,
    login,
    logout,
    user,
  } = useSpotify();

  const router = createBrowserRouter(
    createRoutesFromElements([
      <Route
        element={!isLoading && hasLoggedIn ? <Dashboard /> : <Login />}
        path="/"
      />,
      <Route element={<SpotifyRedirect />} path="callback" />,
    ])
  );

  // const hash = window.location.hash
  //   .substring(1)
  //   .split("&")
  //   .reduce(function (initial, item) {
  //     if (item) {
  //       var parts = item.split("=");
  //       initial[parts[0]] = decodeURIComponent(parts[1]);
  //     }
  //     return initial;
  //   }, {});

  // useEffect(() => {
  //   let _token = hash.access_token;
  //   if (_token) {
  //     setToken(_token);
  //   }
  // }, []);

  // const fetchUserInfo = async () => {
  //   await fetch("https://api.spotify.com/v1/me", {
  //     method: "GET",
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   }).then(async (response) => setUserInfo(await response.json()));
  // };

  return (
    <div>
      <h1>MusicStats</h1>
      {isLoading && "Loading..."}
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
