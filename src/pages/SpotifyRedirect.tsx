import { useEffect } from "react";
import { useSpotify } from "../api";
import { useNavigate } from "react-router-dom";

const SpotifyRedirect = () => {
  const { storeTokenAtRedirect, user } = useSpotify();
  const navigate = useNavigate();

  useEffect(() => {
    storeTokenAtRedirect();

    if (user) {
      navigate("/");
    }
  }, [user]);

  return (
    <div>
      <h1>Redirecting...</h1>
    </div>
  );
};

export default SpotifyRedirect;
