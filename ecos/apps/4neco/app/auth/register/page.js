"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../../styles/login.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icons
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  // const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Toggle for password visibility
  const [registrationError, setRegistrationError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const router = useRouter();

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const clearMessages = () => {
    setRegistrationError('');
    setRegistrationSuccess('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    clearMessages();

    if (password !== confirmPassword) {
      setRegistrationError('Passwords do not match.');
      return;
    }

    if (passwordStrength < 3) {
      setRegistrationError('Password is too weak. Please use a stronger password.');
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setRegistrationSuccess(data.message || 'Registration successful!');
        setShowSuccessMessage(true);

        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } else {
        setRegistrationError(data.message || 'Registration failed.');
      }
    } catch (error) {
      setRegistrationError('An error occurred. Please try again.');
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(checkPasswordStrength(newPassword));
    clearMessages();
  };

  return (
    <div className="login-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        {/* Removed username field
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              clearMessages();
            }}
            required
          />
        </div> */}

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearMessages();
            }}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="eye-icon-btn"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="password-strength">
            <div
              className={`strength-bar ${
                passwordStrength >= 4 ? 'strong' : passwordStrength >= 2 ? 'medium' : 'weak'
              }`}
              style={{ width: `${(passwordStrength / 5) * 100}%` }}
            ></div>
            <p className="strength-text">
              {passwordStrength >= 4 ? 'Strong' : passwordStrength >= 2 ? 'Medium' : 'Weak'}
            </p>
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              clearMessages();
            }}
            required
          />
        </div>
        {registrationError && !registrationSuccess && (
          <div className="error-message">{registrationError}</div>
        )}
        {showSuccessMessage && registrationSuccess && (
          <div className="success-message">{registrationSuccess}</div>
        )}
        <button type="submit" className="login-btn">Register</button>
      </form>
      <p>
        Already have an account?{' '}
        <Link href="/auth/login" className="login-link">Login</Link>
      </p>
    </div>
  );
}
