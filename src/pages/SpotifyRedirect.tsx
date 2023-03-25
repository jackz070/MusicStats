import { useEffect, useState } from "react";
import { useSpotify } from "../api";
import { useNavigate } from "react-router-dom";

// On "cancel" click api returns 200 and "error=access_denied" param
// On back click from authorization page user is redirected to callback page, receives token which is stored and authorized. WITH NO 'ALLOW' CLICK

const SpotifyRedirect = () => {
  const [error, setError] = useState(false);

  const { storeTokenAtRedirect, user } = useSpotify();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      storeTokenAtRedirect();
    } catch {
      setError(true);
      setTimeout(() => {
        setError(false);
        navigate("/");
      }, 3000);
    }

    if (user) {
      navigate("/");
    }
  }, [user, error]);

  return (
    <div className="redirectPage">
      {error ? (
        <div>
          <h2>Authentication failed...</h2> Going back to login page
        </div>
      ) : (
        <h2>Getting your information ready...</h2>
      )}
    </div>
  );
};

export default SpotifyRedirect;
