"use client";

import { logout } from "./action";

const Logout = () => {
  const _logout = async () => {
    await logout();
  };

  return <button onClick={_logout}>Logout</button>;
};

export default Logout;
