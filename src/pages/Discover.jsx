import { useNavigate } from "react-router-dom";

import {
  Heart,
  CalendarHeart,
  Sparkles,
  ArrowRight,
  Flower2,
  WandSparkles,
} from "lucide-react";

import occasionDiscover from "../assets/occasion-discover.png";
import giftFinderDiscover from "../assets/gift-finder-discover.png";
import discoverHeroGifts from "../assets/discover-hero-gifts.png";

/*
  IMPORTANT:
  Change "emotion-bg.png" below ONLY if your real
  image file has a different name.
*/
import emotionCardBg from "../assets/emotion-card-bg.png";
import "../styles/Discover.css";

function Discover() {
  const navigate = useNavigate();

  return (
    <main className="discover-page">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        className="discover-hero"
        style={{
          backgroundImage: `url(${discoverHeroGifts})`,
        }}
      >
        <div className="discover-hero-inner">
          <div className="discover-hero-content">
            <div className="discover-eyebrow">
              <span>Thoughtful gifting starts here</span>
              <span className="discover-eyebrow-line" />
              <span className="discover-eyebrow-diamond" />
            </div>

            <h1>
              Discover a Gift
              <br />
              That Feels Right
            </h1>

            <p>
              Not sure where to begin? Start with a feeling, a special moment,
              or let Petalia guide you to something meaningful.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          DISCOVERY CHOICES
      ===================================================== */}

      <section className="discover-choices">
        <div className="discover-section-heading">
          <span>Find your way</span>

          <h2>How Would You Like to Discover?</h2>

          <p>
            Every meaningful gift starts somewhere. Choose the path that feels
            most natural to you.
          </p>
        </div>

        <div className="discover-card-grid">
          {/* =================================================
              01 — EMOTION
          ================================================= */}

          <article
            className="discover-card discover-card-emotion"
            onClick={() => navigate("/emotion")}
          >
            <div
              className="discover-card-visual discover-image-visual"
              style={{
                backgroundImage: `url(${emotionCardBg})`,
              }}
            >
              <div className="discover-petal-icon">
                <div className="discover-petal-shape">
                  <Heart className="discover-petal-main-icon" />
                </div>
              </div>
            </div>

            <div className="discover-card-content">
              <span className="discover-card-number">01</span>

              <h3>By Emotion</h3>

              <h4>Start with how you want them to feel.</h4>

              <p>
                Explore meaningful gifts through feelings like love, comfort,
                gratitude, happiness, care and more.
              </p>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  navigate("/emotion");
                }}
              >
                Explore Emotions
                <ArrowRight />
              </button>
            </div>
          </article>

          {/* =================================================
              02 — OCCASION
          ================================================= */}

          <article
            className="discover-card discover-card-occasion"
            onClick={() => navigate("/occasion")}
          >
            {/*
              TEMPORARILY using the SAME image as Emotion.

              Later you only need to change:
              emotionBg

              to:
              occasionBg
            */}

            <div
              className="discover-card-visual discover-image-visual"
              style={{
                backgroundImage: `url(${occasionDiscover})`,
              }}
            >
              <div className="discover-petal-icon">
                <div className="discover-petal-shape">
                  <CalendarHeart className="discover-petal-main-icon" />
                </div>
              </div>
            </div>

            <div className="discover-card-content">
              <span className="discover-card-number">02</span>

              <h3>By Occasion</h3>

              <h4>Start with the moment you're celebrating.</h4>

              <p>
                Discover thoughtful flowers, candles and gift sets for
                birthdays, anniversaries, Christmas and meaningful moments.
              </p>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  navigate("/occasion");
                }}
              >
                Explore Occasions
                <ArrowRight />
              </button>
            </div>
          </article>

          {/* =================================================
              03 — GIFT FINDER
          ================================================= */}

          <article
            className="discover-card discover-card-finder"
            onClick={() => navigate("/gift-finder")}
          >
            {/*
              TEMPORARILY using the SAME image as Emotion.

              Later you only change emotionBg
              to your Gift Finder image.
            */}

            <div
              className="discover-card-visual discover-image-visual"
              style={{
                backgroundImage: `url(${giftFinderDiscover})`,
              }}
            >
              <div className="discover-petal-icon">
                <div className="discover-petal-shape">
                  <WandSparkles className="discover-petal-main-icon" />
                </div>
              </div>
            </div>

            <div className="discover-card-content">
              <span className="discover-card-number">03</span>

              <h3>Gift Finder</h3>

              <h4>Let Petalia help you narrow it down.</h4>

              <p>
                Tell us the emotion, occasion, relationship and budget, and
                we'll guide you toward gifts that match your story.
              </p>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  navigate("/gift-finder");
                }}
              >
                Start Gift Finder
                <ArrowRight />
              </button>
            </div>
          </article>
        </div>
      </section>

      {/* =====================================================
          PETALIA CORE
      ===================================================== */}

      <section className="discover-simple">
        <div className="discover-simple-heading">
          <span>The Petalia Way</span>

          <h2>Finding the Right Gift Can Be Simple</h2>

          <p>Begin with what matters, and let the gift follow naturally.</p>
        </div>

        <div className="discover-simple-grid">
          {/* MEANING */}

          <div className="discover-simple-item">
            <div className="discover-simple-icon">
              <Heart />
            </div>

            <div>
              <h3>Start with Meaning</h3>

              <p>Choose the feeling you want your gift to express.</p>
            </div>
          </div>

          <div className="discover-simple-divider" />

          {/* MOMENT */}

          <div className="discover-simple-item">
            <div className="discover-simple-icon">
              <CalendarHeart />
            </div>

            <div>
              <h3>Follow the Moment</h3>

              <p>Find something thoughtful for the occasion you're sharing.</p>
            </div>
          </div>

          <div className="discover-simple-divider" />

          {/* GUIDANCE */}

          <div className="discover-simple-item">
            <div className="discover-simple-icon">
              <Sparkles />
            </div>

            <div>
              <h3>Get Personal Guidance</h3>

              <p>Let Petalia narrow the choices when you're unsure.</p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CLOSING
      ===================================================== */}

      <section className="discover-closing">
        <div className="discover-closing-inner">
          <Flower2 />

          <p>A thoughtful gift doesn't have to be complicated.</p>

          <Heart fill="currentColor" />
        </div>
      </section>
    </main>
  );
}

export default Discover;
