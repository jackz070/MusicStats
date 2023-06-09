import React, { useEffect, useState } from "react";
import { useSpotify } from "./api/api";
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
import { ErrorBoundary } from "react-error-boundary";

function App() {
  const { hasLoggedIn, isLoading } = useSpotify();

  const router = createBrowserRouter(
    createRoutesFromElements([
      <Route
        element={!isLoading && hasLoggedIn ? <Dashboard /> : <Login />}
        path="/"
      />,
      <Route element={<SpotifyRedirect />} path="callback" />,
    ])
  );

  const Fallback = ({ error }: { error: Error }) => {
    return (
      <div role="alert">
        <p>Something went wrong:</p>
        <pre style={{ color: "red" }}>{error.message}</pre>
      </div>
    );
  };

  return (
    <div>
      <Navbar />
      <div className="pageContainer">
        <ErrorBoundary fallbackRender={Fallback}>
          <RouterProvider router={router} />
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default App;
