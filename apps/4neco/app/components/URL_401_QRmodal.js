import { useRef } from "react";
import QRCode from "react-qr-code";
import "../styles/modal.css";
import { useAuth } from "./AuthContext";

const URL_401_QRmodal = ({
  isOpen,
  onClose,
  url,
  qrImage,
  setCopiedMessage,
  setErrorMessage,
  clearMessages,
}) => {
  const qrCodeRef = useRef();
  const { auth } = useAuth();

  const match = url.match(/https?:\/\/(?:www\.)?4n\.eco\/(.+)/);
  const extractedPart = match ? match[1] : null;

  // Display the default 4N_ECOTechLOGO if the user has not logged in
  const default4nLogo = "/4NECOtechLOGO.png";
  const imageToUse = qrImage || default4nLogo;
  const overlaySize = 80; // Size of the overlay image in px
  const padding = 2; // Padding around the overlay image

  const downloadQR = async (format) => {
    const qrSize = 256;
    const canvas = document.createElement("canvas");
    canvas.width = qrSize;
    canvas.height = qrSize;
    const context = canvas.getContext("2d");

    // Render QR Code onto a temporary canvas from the SVG
    const svgElement = qrCodeRef.current.querySelector("svg");
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const img = new Image();
    img.onload = () => {
      context.clearRect(0, 0, qrSize, qrSize);
      context.drawImage(img, 0, 0, qrSize, qrSize);

      // Apply white padding to the overlay image
      if (imageToUse) {
        const overlayImg = new Image();
        overlayImg.src = imageToUse;
        overlayImg.onload = () => {
          const offsetX = (qrSize - overlaySize) / 2;
          const offsetY = (qrSize - overlaySize) / 2;

          // Draw the white padding rectangle first
          context.fillStyle = "#FFFFFF";
          context.fillRect(
            offsetX - padding,
            offsetY - padding,
            overlaySize + padding * 2,
            overlaySize + padding * 2
          );

          // Draw the overlay image on top of the white rectangle
          context.drawImage(
            overlayImg,
            offsetX,
            offsetY,
            overlaySize,
            overlaySize
          );

          // Convert canvas to the desired format and trigger download
          canvas.toBlob((blob) => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `Qr-code-with-overlay-${extractedPart}.${format}`;
            link.click();
          });
        };
      } else {
        // If no overlay, download the QR code image alone
        canvas.toBlob((blob) => {
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = `qr-code.${format}`;
          link.click();
        });
      }
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  const toBase64 = (url) =>
    fetch(url)
      .then((response) => response.blob())
      .then(
        (blob) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      );

  const downloadQRasSVG = async () => {
    const qrSize = 256;
    const svgElement = qrCodeRef.current.querySelector("svg");
    const qrSvgString = new XMLSerializer().serializeToString(svgElement);

    // Convert image to base64 if necessary
    let embeddedImage = "";
    if (imageToUse) {
      embeddedImage = await toBase64(imageToUse);
    }

    // Embed overlay image with padding and border-radius in the SVG if available
    const svgDocument = `
      <svg width="${qrSize}" height="${qrSize}" xmlns="http://www.w3.org/2000/svg">
        ${qrSvgString}
        ${
          embeddedImage
            ? `<rect x="${(qrSize - overlaySize) / 2 - padding}" y="${
                (qrSize - overlaySize) / 2 - padding
              }" width="${overlaySize + padding * 2}" height="${
                overlaySize + padding * 2
              }" fill="white" rx="${overlaySize / 2 + padding}" ry="${
                overlaySize / 2 + padding
              }"/>
            <image href="${embeddedImage}" x="${
                (qrSize - overlaySize) / 2
              }" y="${
                (qrSize - overlaySize) / 2
              }" width="${overlaySize}" height="${overlaySize}" rx="${
                overlaySize / 2
              }" ry="${overlaySize / 2}"/>`
            : ""
        }
      </svg>
    `;

    const svgBlob = new Blob([svgDocument], {
      type: "image/svg+xml;charset=utf-8",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(svgBlob);
    link.download = `Qr-code-with-overlay-${extractedPart}.svg`;
    link.click();
  };

  const copyToClipboard = () => {
    try {
      navigator.clipboard
        .writeText(url)
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

  return (
    <div
      className={`modal ${isOpen ? "open" : ""} ${
        auth ? "auth-tru" : "auth-fls"
      }`}
    >
      <div className="qr-modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <div className="qr-wrapper" ref={qrCodeRef}>
          <QRCode value={url} size={256} level="H" />
          {imageToUse && (
            <img
              src={imageToUse}
              alt="Overlay"
              className="overlay-image"
              style={{
                padding: `${padding}px`,
                backgroundColor: "#fff",
                borderRadius: "5px",
              }}
            />
          )}
        </div>
        <div className="qr-buttons">
          <button className="download-btn" onClick={() => downloadQR("png")}>
            Download PNG
          </button>
          <button className="copy-btn" onClick={copyToClipboard}>
            Copy URL
          </button>
          <button className="download-btn" onClick={downloadQRasSVG}>
            Download SVG
          </button>
        </div>
      </div>
    </div>
  );
};

export default URL_401_QRmodal;
