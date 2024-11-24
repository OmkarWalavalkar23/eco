"use client"; // Ensure this is a client component

import { useAuth } from './AuthContext';

export default function AuthWrapper({ children }) {
  const { auth } = useAuth(); // Client-side hook

  if (auth) {
    return <>{children}</>; // Render only children when authenticated
  }

  return children; // Render children if not authenticated
}
