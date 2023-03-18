import React from "react";
import { useSpotify } from "../api";

const Login = () => {
  const { login, hasLoggedIn } = useSpotify();
  console.log(hasLoggedIn);

  return <a onClick={login}>Login</a>;
};

export default Login;
