"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/AuthContext";
import ForgotPassword from "../../components/ForgotPassword";
import CustomToast from "../../components/CustomToast";
import "../../styles/login.css";
import Link from "next/link";
import CryptoJS from "crypto-js";

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_ID;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [toast, setToast] = useState(null);
  const { setAuth, setUsername } = useAuth();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (email && password) {
      try {
        const encryptedPassword = CryptoJS.AES.encrypt(
          password,
          ENCRYPTION_KEY
        ).toString();

        const response = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password: encryptedPassword }),
        });

        if (response.ok) {
          const data = await response.json();
          sessionStorage.setItem("Session_token", data.token);
          sessionStorage.setItem("username", data.email);
          localStorage.setItem("Session_token", data.token);
          localStorage.setItem("username", data.email);
          setAuth(true);
          setUsername(data.email);

          setToast({ message: "Login successful!", type: "success" });

          setTimeout(() => {
            router.push("/");
          }, 200);
        } else {
          const errorData = await response.json();
          setToast({
            message: errorData.message || "Invalid credentials",
            type: "error",
          });
        }
      } catch (error) {
        setToast({
          message: "An error occurred. Please try again.",
          type: "error",
        });
      }
    } else {
      setToast({
        message: "Please enter both email and password.",
        type: "error",
      });
    }
  };

  //   const handleLogin = async (e) => {
  //     e.preventDefault();

  //     if (email && password) {
  //       try {
  //         const response = await fetch("/api/login", {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({ email, password }),
  //         });

  //         if (response.ok) {
  //           const data = await response.json();
  //           sessionStorage.setItem("Session_token", data.token);
  //           sessionStorage.setItem("username", data.email);
  //           localStorage.setItem("Session_token", data.token);
  //           localStorage.setItem("username", data.email);
  //           setAuth(true);
  //           setUsername(data.email);

  //           // Set the success toast message
  //           setToast({ message: "Login successful!", type: "success" });

  //           // Redirect after a short delay to allow the toast to display momentarily
  //           setTimeout(() => {
  //             router.push("/");
  //           }, 200); // Adjust this time if needed
  //         } else {
  //           const errorData = await response.json();
  //           setToast({
  //             message: errorData.message || "Invalid credentials",
  //             type: "error",
  //           });
  //         }
  //       } catch (error) {
  //         setToast({
  //           message: "An error occurred. Please try again.",
  //           type: "error",
  //         });
  //       }
  //     } else {
  //       setToast({
  //         message: "Please enter both email and password.",
  //         type: "error",
  //       });
  //     }
  //   };

  const handleForgotPassword = () => setShowForgotPassword(true);
  const handleCloseForgotPassword = () => setShowForgotPassword(false);

  return (
    <div className="login-container">
      {toast && (
        <CustomToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-btnn">
          Login
        </button>
      </form>
      <button onClick={handleForgotPassword} className="forgot-password-btn">
        Forgot Password?
      </button>
      <p>
        Don&apos;t have an account?
        <Link href="/auth/register" className="register-link">
          Register
        </Link>
      </p>
      {showForgotPassword && (
        <ForgotPassword
          onClose={handleCloseForgotPassword}
          setShowForgotPassword={setShowForgotPassword}
        />
      )}
    </div>
  );
}
