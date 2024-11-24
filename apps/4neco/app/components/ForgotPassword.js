"use client";
import { useState } from 'react';
import Axios from 'axios';
import CustomToast from './CustomToast';
import '../styles/ForgotPassword.css'; // Ensure the correct path

export default function ForgotPassword({ onClose, setShowForgotPassword }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await Axios.post(`/api/forgot-password`, { email });
      if (response.status === 200) {
        setToast({ message: 'Password reset link sent to your email.', type: 'success' });
        setTimeout(() => setShowForgotPassword(false), 2000);
      } else {
        setToast({ message: 'Failed to send password reset link.', type: 'error' });
      }
    } catch (error) {
      setToast({ message: 'An error occurred. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {toast && <CustomToast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <button className="close-btn" onClick={onClose} aria-label="Close">
          &times;
        </button>
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="forgot-email"
            />
          </div>
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
}
