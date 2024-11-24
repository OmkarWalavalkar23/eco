"use client";

import Link from "next/link";
import { useAuth } from './AuthContext';
import { FaHome } from 'react-icons/fa';

export default function Navbar() {
  const { auth, username, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link href="/" className="home-icon-link">
          <FaHome size={28} color="#212529" style={{ verticalAlign: "middle" }} />
        </Link>
      </div>
      <div className="nav-auth">
        {auth ? (
          <div>
            <span>{username}</span>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </div>
        ) : (
          <Link href="/auth/login">
            <button className="login-btn">Login</button>
          </Link>
        )}
      </div>
    </nav>
  );
}
