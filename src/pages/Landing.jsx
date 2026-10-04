import { useNavigate } from "react-router-dom";
import "../styles/Landing.css";

import petaliaLogo from "../assets/petalia-logo.png";
import flowerIcon from "../assets/flower-icon.png";
import candleIcon from "../assets/candle-icon.png";
import messageIcon from "../assets/message-icon.png";

// Magnolia decoration
import pinkMagnolia from "../assets/pink-magnolia.png";


function Landing() {
  const navigate = useNavigate();

  return (
    <main className="landing-page">

      <section className="landing-hero">

        {/* =========================
            BOTANICAL CORNER
        ========================= */}

        <div className="pink-magnolia-wrap">
          <img
            src={pinkMagnolia}
            alt=""
            className="pink-magnolia"
          />
        </div>


        {/* =========================
            FLOATING ICONS
        ========================= */}

        <div className="landing-decorations">

          <img
            src={flowerIcon}
            alt=""
            className="
              landing-motion-icon
              landing-motion-flower
            "
          />

          <img
            src={candleIcon}
            alt=""
            className="
              landing-motion-icon
              landing-motion-candle
            "
          />

          <img
            src={messageIcon}
            alt=""
            className="
              landing-motion-icon
              landing-motion-message
            "
          />

        </div>


        {/* =========================
            CENTER CONTENT
        ========================= */}

        <div className="landing-content">

          <img
            src={petaliaLogo}
            alt="Petalia"
            className="landing-logo"
          />


          <h1 className="landing-tagline">
            Where feelings find the perfect gift
          </h1>


          <p className="landing-description">
            A thoughtful platform that turns your feelings
            into meaningful gifts from curated flowers
            and hand-poured candles to personalized keepsakes.
          </p>


          <div className="landing-actions">

            <button
              type="button"
              className="
                landing-btn
                landing-primary-btn
              "
              onClick={() =>
                navigate("/gift-finder")
              }
            >
              Find a Gift
            </button>


            <button
              type="button"
              className="
                landing-btn
                landing-secondary-btn
              "
              onClick={() =>
                navigate("/shop")
              }
            >
              Browse Gifts
            </button>

          </div>

        </div>

      </section>

    </main>
  );
}


export default Landing;