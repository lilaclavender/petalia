import "../styles/Footer.css";
import petaliaLogo from "../assets/petalia-logo.png";

import {
  FaFacebookF,
  FaInstagram,
  FaTiktok
} from "react-icons/fa";

import { ArrowRight } from "lucide-react";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* BRAND */}
        <div className="footer-brand">
          <img
            src={petaliaLogo}
            alt="Petalia"
            className="footer-logo"
          />

          <p>
            Meaningful gifts,
            <br />
            from the heart.
          </p>

          <div className="footer-socials">
            <a href="#" aria-label="TikTok">
              <FaTiktok />
            </a>

            <a href="#" aria-label="Facebook">
              <FaFacebookF />
            </a>

            <a href="#" aria-label="Instagram">
              <FaInstagram />
            </a>
          </div>
        </div>


        {/* SHOP */}
        <div className="footer-column">
          <h3>Shop</h3>

          <a href="#">All Gifts</a>
          <a href="#">Flowers</a>
          <a href="#">Candles</a>
          <a href="#">Gift Sets</a>
        </div>


        {/* DISCOVER */}
        <div className="footer-column">
          <h3>Discover</h3>

          <a href="#">By Emotion</a>
          <a href="#">By Occasion</a>
          <a href="#">Gift Finder</a>
        </div>


        {/* HELP */}
        <div className="footer-column">
          <h3>Help</h3>

          <a href="#">FAQ</a>
          <a href="#">Shipping & Delivery</a>
          <a href="#">Returns & Refunds</a>
          <a href="#">Contact Us</a>
        </div>


        {/* ABOUT */}
        <div className="footer-column">
          <h3>About Petalia</h3>

          <a href="#">Our Story</a>
          <a href="#">Our Partners</a>
          <a href="#">Terms & Privacy</a>
        </div>


        {/* NEWSLETTER */}
        <div className="footer-newsletter">
          <h3>Stay in the loop</h3>

          <p>
            Get updates on new collections,
            gift ideas and special moments.
          </p>

          <div className="footer-email">
            <input
              type="email"
              placeholder="Enter your email"
            />

            <button aria-label="Subscribe">
              <ArrowRight />
            </button>
          </div>
        </div>

      </div>


      {/* BOTTOM */}
      <div className="footer-bottom">
        <span>© 2026 Petalia. All rights reserved.</span>

        <div>
          <a href="#">Privacy Policy</a>
          <span>•</span>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;