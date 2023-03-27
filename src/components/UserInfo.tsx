import React, { useState } from "react";
import { useSpotify } from "../api";

const UserInfo = () => {
  const { user } = useSpotify();
  
  return (
    <section className="user-info">
      <h2 className="user-info_header">Hello, {user?.display_name}</h2>
    </section>
  );
};

export default UserInfo;
