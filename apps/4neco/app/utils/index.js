import { UAParser } from "ua-parser-js";
import axios from "axios";

export async function generateAuditTrail(req) {
  try {
    // Extract IP address from headers or environment-specific fields
    const ipAddress =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || // Proxy or load balancer
      req.headers["x-real-ip"] || // Custom headers from some proxies
      "0.0.0.0"; // Default fallback if no IP is found

    const userAgent = req.headers["user-agent"] || "Unknown";
    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    // Fetch location data using the IP address
    const locationResponse = await axios.get(
      `http://ip-api.com/json/${ipAddress}`
    );
    let locationData = {};

    if (locationResponse.status === 200) {
      locationData = {
        country: locationResponse.data.country,
        region: locationResponse.data.regionName,
        city: locationResponse.data.city,
        zip: locationResponse.data.zip,
        lat: locationResponse.data.lat,
        lon: locationResponse.data.lon,
        timezone: locationResponse.data.timezone,
      };
    } else {
      console.error(
        "Failed to fetch location data:",
        locationResponse.status,
        locationResponse.statusText
      );
    }

    return {
      ipAddress,
      browser: `${result.browser.name} ${result.browser.version}`,
      os: `${result.os.name} ${result.os.version}`,
      device: result.device.model
        ? `${result.device.vendor} ${result.device.model}`
        : "Unknown",
      location: locationData,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error generating audit trail:", error.message);
    return {};
  }
}

// for testing purpose only use the below function & make sure to change the function name in USERS_TABLE api to "generateAuditTrail" while deploying:
export async function generateAuditTrailTest(req) {
  try {
    const ipAddress =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.headers["x-real-ip"] ||
      "127.0.0.1"; // Use localhost IP for local testing

    const userAgent = req.headers["user-agent"] || "Unknown";
    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    const apiIp = ipAddress === "127.0.0.1" ? "8.8.8.8" : ipAddress;
    let locationData = {};

    try {
      const locationResponse = await axios.get(
        `http://ip-api.com/json/${apiIp}`
      );
      if (locationResponse.status === 200) {
        locationData = {
          country: locationResponse.data.country || "Unknown",
          region: locationResponse.data.regionName || "Unknown",
          city: locationResponse.data.city || "Unknown",
          zip: locationResponse.data.zip || "Unknown",
          lat: locationResponse.data.lat || 0,
          lon: locationResponse.data.lon || 0,
          timezone: locationResponse.data.timezone || "Unknown",
          timestamp:
            locationResponse.data.timestamp || new Date().toISOString(), // Fallback if missing
        };
      }
    } catch (error) {
      console.error("Failed to fetch location data:", error.message);
      // Add default location with timestamp as fallback
      locationData = {
        country: "Unknown",
        region: "Unknown",
        city: "Unknown",
        zip: "Unknown",
        lat: 0,
        lon: 0,
        timezone: "Unknown",
        timestamp: new Date().toISOString(), // Fallback timestamp
      };
    }

    return {
      ipAddress,
      browser: `${result.browser.name || "Unknown"} ${
        result.browser.version || "Unknown"
      }`,
      os: `${result.os.name || "Unknown"} ${result.os.version || "Unknown"}`,
      device: result.device.model
        ? `${result.device.vendor || "Unknown"} ${result.device.model}`
        : "Unknown",
      location: {
        ...locationData,
        timestamp: locationData.timestamp || new Date().toISOString(), // Ensure timestamp is present
      },
      timestamp: new Date().toISOString(), // Top-level timestamp
    };
  } catch (error) {
    console.error("Error generating audit trail:", error.message);
    return {
      ipAddress: "Unknown",
      browser: "Unknown",
      os: "Unknown",
      device: "Unknown",
      location: {
        country: "Unknown",
        region: "Unknown",
        city: "Unknown",
        zip: "Unknown",
        lat: 0,
        lon: 0,
        timezone: "Unknown",
        timestamp: new Date().toISOString(), // Fallback timestamp
      },
      timestamp: new Date().toISOString(),
    };
  }
}

// `getTimeZone` function as provided
export async function getTimeZone() {
  try {
    const response = await axios.get("http://ip-api.com/json/");
    if (response.status === 200) {
      const { timezone } = response.data;
      return timezone;
    } else {
      console.error(
        "Failed to fetch timezone:",
        response.status,
        response.statusText
      );
      return "UTC";
    }
  } catch (error) {
    console.error("Error fetching timezone:", error.message);
    return "UTC";
  }
}

export const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};
