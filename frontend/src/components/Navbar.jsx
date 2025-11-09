import React, { useContext } from "react";
import { AuthContext } from "../context/useAuthStore.jsx";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  return (
    <nav className="bg-blue-600 text-white p-3 flex justify-between">
      <span className="font-semibold">Ad Portal</span>
      {user ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <span>Guest</span>
      )}
    </nav>
  );
}
