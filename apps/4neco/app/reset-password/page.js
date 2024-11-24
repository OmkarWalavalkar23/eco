"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CustomToast from '../components/CustomToast';
import axios from 'axios';
import '../styles/login.css';

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [toast, setToast] = useState(null);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [token, setToken] = useState(null); // New state for the token
  const router = useRouter();

  useEffect(() => {
    // Retrieve token from query parameters on the client side
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get('token');

    if (!tokenParam) {
      setToast({ message: "Invalid or expired link.", type: 'error' });
      return;
    }

    setToken(tokenParam);

    // Check token validity on page load
    const verifyToken = async () => {
      try {
        await axios.post('/api/verify-token', { token: tokenParam });
        setIsTokenValid(true);
      } catch (error) {
        setToast({ message: "Token has expired. Please request a new reset link.", type: 'error' });
        setTimeout(() => router.push('/auth/forgot-password'), 3000);
      }
    };

    verifyToken();
  }, [router]); // Add 'router' to dependencies

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setToast({ message: 'Passwords do not match.', type: 'error' });
      return;
    }

    try {
      const response = await axios.post('/api/reset-password', { token, newPassword });
      if (response.status === 200) {
        setToast({ message: 'Password reset successfully! Redirecting to login...', type: 'success' });
        setTimeout(() => router.push('/auth/login'), 3000);
      } else {
        setToast({ message: response.data.message || 'Failed to reset password.', type: 'error' });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
      setToast({ message: errorMessage, type: 'error' });
    }
  };

  if (!isTokenValid) {
    return (
      <div className="login-container">
        {toast && <CustomToast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    );
  }

  return (
    <div className="login-container">
      {toast && <CustomToast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <h2>Reset Password</h2>
      <form onSubmit={handlePasswordReset}>
        <div className="input-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-btn">Reset Password</button>
      </form>
    </div>
  );
}
