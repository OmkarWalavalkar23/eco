"use client";
import { useState, useEffect } from "react";
import { useAuth } from "./components/AuthContext";
import URL_401_QRmodal from "./components/URL_401_QRmodal";
import "./styles/styles.css";

// for google analytics
import { usePathname } from "next/navigation"; // Use App Router navigation hook
import { initializeGA, logPageView, logEvent } from "./lib/ga";

export default function Page() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [aliasAvailable, setAliasAvailable] = useState(true);
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [copiedMessage, setCopiedMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [qrImage, setQrImage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isTriggered, setIsTriggered] = useState(false);
  const [isQrClicked, setIsQrClicked] = useState(false);
  const { auth } = useAuth();

  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

  // Google analytics part starts here
  const pathname = usePathname();

  useEffect(() => {
    initializeGA(); // Initialize GA when the app loads
    // Log initial page view and subsequent route changes
    logPageView(pathname);
  }, [pathname]);
  // Google analytics part ends here

  useEffect(() => {
    if (!auth) {
      clearTable();
    }
  }, [auth]);

  const clearMessages = () => {
    setTimeout(() => {
      setErrorMessage("");
      setCopiedMessage("");
    }, 5000);
  };

  const checkAliasAvailability = async (alias) => {
    if (!auth) return;
    try {
      const response = await fetch(`/api/check-alias?alias=${alias}`);
      const data = await response.json();
      setAliasAvailable(data.available);
    } catch (error) {
      console.error("Alias check failed:", error);
    }
  };

  const generateShortUrl = async () => {
    try {
      setErrorMessage("");

      if (auth && alias) {
        const aliasResponse = await fetch(`/api/check-alias?alias=${alias}`);
        const checkData = await aliasResponse.json();

        if (!checkData.available) {
          setErrorMessage(
            "Alias is already in use. Please choose another one."
          );
          return "";
        }
      }

      const bodyContent = { originalUrl };
      if (auth && alias) bodyContent.alias = alias;

      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyContent),
      });

      if (response.ok) {
        const data = await response.json();
        // setShortenedMessage("Shortened!");
        clearMessages();
        return `${baseUrl}/${data.id}`;
      } else {
        const errorText =
          response.status === 400
            ? "The alias is already in use or the URL format is invalid. Please try a different alias or URL."
            : "Failed to shorten the URL due to a server error. Please try again later.";
        setErrorMessage(errorText);
        clearMessages();
        return "";
      }
    } catch (error) {
      setErrorMessage(
        "Network error occurred. Please check your connection and try again."
      );
      clearMessages();
      return "";
    }
  };

  const handleCopy = () => {
    if (shortenedUrl?.length > 0 && isTriggered) {
      try {
        navigator.clipboard.writeText(shortenedUrl);
        setCopiedMessage("Copied!");
        clearMessages();
      } catch {
        setErrorMessage("Unable to copy the URL.");
      }
    } else if (originalUrl?.length > 5 && !isTriggered) {
      handleSubmit();
    }
  };

  const handleCopyURL = (fullURL) => {
    try {
      navigator.clipboard
        .writeText(fullURL)
        .then(() => {
          setCopiedMessage("Copied!");
          clearMessages();
        })
        .catch(() => {
          setErrorMessage("Unable to copy the URL.");
        });
    } catch (error) {
      setErrorMessage("An unexpected error occurred while copying the URL.");
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setQrImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleQR = () => {
    if (originalUrl?.includes("4n.eco")) {
      setErrorMessage("4n.eco links cannot be shortened");
      clearMessages();
      return;
    } else if (originalUrl?.length > 5 && !isTriggered) {
      handleSubmit();
      setIsQrClicked(true);
      setShowModal(true);
    } else if (shortenedUrl?.length > 0) {
      setShowModal(true);
      handleCopy();
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async () => {
    logEvent({
      action: "button_click",
      category: "User Interaction",
      label: "Shorten Button",
      value: 1,
    });

    if (originalUrl?.includes("4n.eco")) {
      setErrorMessage("4n.eco links cannot be shortened");
      clearMessages();
      return;
    }

    setErrorMessage("");
    // setShortenedMessage("");
    setIsTriggered(true);

    if (auth && !aliasAvailable) {
      setErrorMessage("Alias is already taken.");
      clearMessages();
      return;
    }

    const fullShortUrl = await generateShortUrl();
    if (fullShortUrl) {
      setShortenedUrl(fullShortUrl);
      handleCopyURL(fullShortUrl);
      if (isQrClicked) {
        setShowModal(true);
      }
    }
  };

  const clearTable = () => {
    setOriginalUrl("");
    setAlias("");
    setShortenedUrl("");
    setQrImage("");
    setCopiedMessage("");
    setErrorMessage("");
    setAliasAvailable(true);
    setShowModal(false);
    setIsTriggered(false);
    setIsQrClicked(false);
  };

  const handleChange = (e) => {
    setOriginalUrl(e.target.value);
    if (isTriggered) {
      setIsTriggered(false);
    }
  };

  return (
    <div className="url-shortener-container">
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter original URL"
          value={originalUrl}
          onChange={handleChange}
          onKeyPress={(event) => {
            if (
              event.key === "Enter" &&
              (originalUrl?.length > 5 || !isTriggered)
            ) {
              handleSubmit();
            }
          }}
        />
      </div>

      {auth && (
        <>
          {/* <div className="input-container">
            <input
              type="text"
              placeholder="Custom Alias (Optional)"
              value={alias}
              onChange={(e) => {
                setAlias(e.target.value);
                checkAliasAvailability(e.target.value);
              }}
            />
            <div className="alias-error">
              {!aliasAvailable && (
                <p className="error-message">Alias is taken. Try another.</p>
              )}
            </div>
          </div> */}

          <div
            className={`upload-container ${
              isTriggered ? "disable-upload" : ""
            }`}
          >
            <label htmlFor="image-upload">Upload Custom Image (Optional)</label>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
        </>
      )}

      <div className={`output-container ${auth ? "auth-mt-tru" : ""}`}>
        <input type="text" value={shortenedUrl} readOnly />
        <div className="icons">
          <img
            className="qr-icon"
            src="/QR.png"
            alt="Generate QR"
            width="50"
            height="50"
            onClick={handleQR}
          />
          <img
            className="copy-icon"
            src="/copy.png"
            alt="Copy URL"
            width="30"
            height="30"
            onClick={handleCopy}
          />
        </div>
        <button
          className="shorten-button"
          onClick={handleSubmit}
          disabled={originalUrl?.length < 5 || isTriggered}
        >
          {shortenedUrl ? "Shorten Another" : "Shorten"}
        </button>
      </div>

      <div className="message-container">
        {copiedMessage ? (
          <p className="success-message">{copiedMessage}</p>
        ) : errorMessage ? (
          <p className="error-message">{errorMessage}</p>
        ) : (
          ""
        )}
      </div>

      <URL_401_QRmodal
        isOpen={showModal}
        onClose={handleCloseModal}
        url={shortenedUrl}
        qrImage={qrImage}
        setCopiedMessage={setCopiedMessage}
        setErrorMessage={setErrorMessage}
        clearMessages={clearMessages}
      />
    </div>
  );
}
