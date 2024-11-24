"use client"; // Ensure client-side rendering for this layout

import { AuthProvider } from './AuthContext';
import AuthWrapper from './AuthWrapper';
import Navbar from './Navbar'; // Import the Navbar directly
import '../styles/styles.css';

export default function ClientLayout({ children }) {
  return (
    <AuthProvider>
      <AuthWrapper>
        <Navbar />
        <main>{children}</main>
      </AuthWrapper>
    </AuthProvider>
  );
}
