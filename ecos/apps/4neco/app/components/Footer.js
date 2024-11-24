"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "../styles/Footer.css";

const Footer = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Function to check if session token exists
  const checkLoginStatus = () => {
    const sessionToken = sessionStorage.getItem("Session_token");
    setIsLoggedIn(!!sessionToken); // Update login state based on session token
  };

  useEffect(() => {
    checkLoginStatus(); // Initial check for login status

    // Listen for storage changes (to catch login/logout across tabs)
    const handleStorageChange = (event) => {
      if (event.key === "Session_token") {
        checkLoginStatus(); // Update login state on storage change
      }
    };

    window.addEventListener("storage", handleStorageChange); // Listen for storage changes

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Function to handle navigation based on login status
  const handleNavigation = (e, pathIfLoggedIn, pathIfNotLoggedIn) => {
    e.preventDefault(); // Prevent the default link behavior

    const sessionToken = sessionStorage.getItem("Session_token");

    // If logged in, go to the main page. Otherwise, go to the login page
    if (sessionToken) {
      router.push(pathIfLoggedIn); // Redirect to logged-in route
    } else {
      router.push(pathIfNotLoggedIn); // Redirect to login route
    }
  };

  return (
    <footer className="footer">
      <div className="footer-left">
        <div className="footer-links eco-logo">
          <a
            href="https://profiles.eco/4n?ref=tm"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="https://trust.profiles.eco/4n/eco-circle.svg?color=%2327B438"
              alt=".eco profile for 4n.eco"
              width="100"
              height="100"
              id="logogreen"
            />
          </a>
        </div>

        <div className="footer-links">
          <h3>Company</h3>
          <ul>
            <li>
              <Link href="/about">About</Link>{" "}
            </li>
            <li>
              <Link href="/contact">Contact</Link>{" "}
            </li>
            <li>
              <Link href="/about" className="empty-li">About</Link>{" "}
            </li>
          </ul>
        </div>

        <div className="footer-links">
          <h3>Products</h3>
          <ul>
            <li>
              <Link
                href="/auth/login"
                onClick={(e) => handleNavigation(e, "/", "/auth/login")}
              >
                URL Shortener
              </Link>
            </li>
            <li>
              <Link
                href="/auth/login"
                onClick={(e) => handleNavigation(e, "/", "/auth/login")}
              >
                QR Codes
              </Link>
            </li>
            <li>
              <Link
                href="/auth/login"
                onClick={(e) => handleNavigation(e, "/", "/auth/login")}
              >
                Custom URLs
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer-links">
          <h3>Resource</h3>
          <ul>
            <li>
              <Link href="/">Blog</Link>
            </li>
            <li>
              <Link href="/about" className="empty-li">About</Link>{" "}
            </li>
            <li>
              <Link href="/about" className="empty-li">About</Link>{" "}
            </li>
          </ul>
        </div>

        <div className="footer-links">
          <h3>Legal</h3>
          <ul>
            <li>
              <Link href="/">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/">Terms of Service</Link>
            </li>
            <li>
              <Link href="/">Code of Conduct</Link>
            </li>
          </ul>
        </div>

        <div className="footer-links">
          <h3>Social Media</h3>
          <ul>
            <li>
              <Link
                href="https://www.facebook.com/people/4N-EcoTech/61564581987548/"
                target="_blank"
              >
                Facebook
              </Link>
            </li>
            <li>
              <Link href="https://www.instagram.com/4necotech" target="_blank">
                Instagram
              </Link>
            </li>
            <li>
              <Link
                href="https://www.linkedin.com/company/4necotech/"
                target="_blank"
              >
                LinkedIn
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer-links">
          {" "}
          <div className="company-logo">
            {" "}
            <Image
              src="/4N EcoTech LOGO.png"
              alt="Company Logo"
              width={70}
              height={70}
            />
          </div>
          <p className="copyright">© 2024 4N EcoTech. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
