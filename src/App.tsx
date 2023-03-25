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
import { Navbar } from "./components/Navbar";

function App() {
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

  return (
    <div>
      <Navbar />
      <div className="pageContainer">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
