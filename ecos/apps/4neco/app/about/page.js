import React from "react";
import "../styles/about.css";

const AboutPage = () => {
  return (
    <div className="about-page">
      <h1 className="about-header">About Us:</h1>
      <div className="about-text">
        <p>
          At 4N EcoTech, we build next-generation products and solutions that
          redefine the future of technology and innovation. Rooted in our unique
          approach of exploring problems through multiple dimensions, we are
          committed to delivering solutions that not only push the boundaries of
          technology but also positively impact people and the planet.{" "}
        </p>{" "}
        <p>
          Founded in 2022 and headquartered in New Delhi, 4N EcoTech
          has swiftly positioned itself at the forefront of ethical,
          responsible, and sustainable development. Our work spans various
          industries and focuses on key areas that are essential for a
          sustainable future: Equity, Inclusivity, Ethics, Sustainable
          Development Goals, Product Development, Data and Energy.
        </p>{" "}
        <p>
          As an organization, we believe in driving transformative change
          through technology that is both innovative and conscious. Our
          solutions are carefully crafted to bring value in ways that prioritize
          inclusivity, fairness, and environmental responsibility. and Energy.
          Each product we build is a step towards a future where technology and
          sustainability are seamlessly integrated, helping create a balanced,
          equitable world for future generations.{" "}
        </p>
      </div>
      <br />
      <h1 className="about-header">Our Core Values:</h1>
      <ul className="core-values">
        <li>
          <span className="bold-text">Sustainability:</span> We prioritize
          People Planet and Profit in anything and everything we do. We resolve
          to approach with better more efficient solutions everyday.
        </li>
        <li>
          <span className="bold-text">Continuous Learning:</span> As a pioneer
          in the knowledge economy, we foster a culture of continuous learning
          that helps be better equipped to handle the changing business
          landscape.
        </li>
        <li>
          <span className="bold-text">Honesty & Integrity:</span> We uphold
          transparency, trust, and ethical conduct. Learning never stops. We as
          a team and individuals will strive to learn constantly.
        </li>
        <li>
          <span className="bold-text">Innovation:</span> We drive progress
          through creative and groundbreaking solutions. We are a team working
          smartly and ready to go the extra mile whenever needed.
        </li>
        <li>
          <span className="bold-text">Camaraderie</span> We foster a supportive
          and collaborative work environment. We all are here to support each
          other and work together in a winning way.
        </li>
      </ul>
      <br />
      <p className="join-text">
        Join us as we pave the way for an innovative, inclusive, and sustainable
        future. Together, let’s create solutions that benefit People, the
        Planet, and Generations to come.
      </p>
    </div>
  );
};

export default AboutPage;
