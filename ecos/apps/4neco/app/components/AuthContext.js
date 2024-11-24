"use client";
import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [username, setUsername] = useState(null);

  // Logic to check for User Login accross different tabs
  useEffect(() => {
    const sessionToken = localStorage.getItem("Session_token"); // Check token in localStorage
    const storedUsername = localStorage.getItem("username"); // Retrieve stored username

    if (sessionToken && storedUsername) {
      try {
        setAuth(true);
        setUsername(storedUsername);
      } catch (error) {
        console.error("Session setup failed:", error);
      }
    }
  }, []);

  // Synchronize login/logout across tabs
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "Session_token") {
        const newToken = localStorage.getItem("Session_token");
        const newUsername = localStorage.getItem("username");

        if (newToken && newUsername) {
          // User logged in from another tab
          setAuth(true);
          setUsername(newUsername);
        } else {
          // User logged out from another tab
          setAuth(false);
          setUsername(null);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Logout Function
  const logout = () => {
    sessionStorage.removeItem("Session_token");
    sessionStorage.removeItem("username");
    localStorage.removeItem("Session_token");
    localStorage.removeItem("username");
    setAuth(false);
    setUsername(null);
  };

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, username, setUsername, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
