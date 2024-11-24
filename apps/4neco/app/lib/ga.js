// lib/ga.js
import ReactGA from "react-ga4";

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// Initialize GA
export const initializeGA = () => {
  ReactGA.initialize(GA_TRACKING_ID);
};

// Track page views
export const logPageView = (url) => {
  ReactGA.send({ hitType: "pageview", page: url });
};

// Track custom events
export const logEvent = ({ action, category, label, value }) => {
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
