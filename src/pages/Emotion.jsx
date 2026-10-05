import { useNavigate } from "react-router-dom";

import {
  Heart,
  PartyPopper,
  HandHeart,
  Flower2,
  Sparkles,
  Sun,
  HeartHandshake,
  MessageCircleHeart,
  Sprout,
  Gift,
  Leaf,
  Sunrise,
  ArrowRight,
} from "lucide-react";

import loveBg from "../assets/emotions/love.png";
import celebrationBg from "../assets/emotions/celebration.png";
import comfortBg from "../assets/emotions/comfort.png";
import apologyBg from "../assets/emotions/apology.png";
import selfCareBg from "../assets/emotions/self-care.png";
import happinessBg from "../assets/emotions/happiness.jpg";
import sympathyBg from "../assets/emotions/sympathy.png";
import thinkingBg from "../assets/emotions/thinking-of-you.png";
import encouragementBg from "../assets/emotions/encouragement.png";
import gratitudeBg from "../assets/emotions/gratitude.png";
import peaceBg from "../assets/emotions/peace.png";
import hopeBg from "../assets/emotions/hope.png";
import emotionFinderFloral from "../assets/emotion-finder-floral.png";

import "../styles/Emotion.css";


/* =====================================================
   EMOTION DATA
===================================================== */

const emotions = [
  {
    id: "love",
    name: "Love",
    description:
      "Express affection and meaningful connection.",
    tags: ["Romantic", "Caring"],
    icon: Heart,
    className: "emotion-love",
    image: loveBg,
  },

  {
    id: "celebration",
    name: "Celebration",
    description:
      "Make special moments feel even more joyful.",
    tags: ["Excitement", "Congrats"],
    icon: PartyPopper,
    className: "emotion-celebration",
    image: celebrationBg,
  },

  {
    id: "comfort",
    name: "Comfort",
    description:
      "Bring warmth, calm, and gentle support.",
    tags: ["Warm", "Support"],
    icon: HandHeart,
    className: "emotion-comfort",
    image: comfortBg,
  },

  {
    id: "apology",
    name: "Apology",
    description:
      "Show sincerity and care when words feel difficult.",
    tags: ["Forgiveness", "Hope"],
    icon: Flower2,
    className: "emotion-apology",
    image: apologyBg,
  },

  {
    id: "self-care",
    name: "Self-care",
    description:
      "A little love for yourself and your well-being.",
    tags: ["Relaxation", "Wellness"],
    icon: Sparkles,
    className: "emotion-self-care",
    image: selfCareBg,
  },

  {
    id: "happiness",
    name: "Happiness",
    description:
      "Share joy and brighten someone's day.",
    tags: ["Joyful", "Cheerful"],
    icon: Sun,
    className: "emotion-happiness",
    image: happinessBg,
  },

  {
    id: "sympathy",
    name: "Sympathy",
    description:
      "Send care and support during difficult times.",
    tags: ["Caring", "Support"],
    icon: HeartHandshake,
    className: "emotion-sympathy",
    image: sympathyBg,
  },

  {
    id: "thinking-of-you",
    name: "Thinking of You",
    description:
      "Let someone know they are on your mind.",
    tags: ["Thoughtful", "Remembered"],
    icon: MessageCircleHeart,
    className: "emotion-thinking",
    image: thinkingBg,
  },

  {
    id: "encouragement",
    name: "Encouragement",
    description:
      "Inspire confidence and positive energy.",
    tags: ["Hopeful", "Uplifting"],
    icon: Sprout,
    className: "emotion-encouragement",
    image: encouragementBg,
  },

  {
    id: "gratitude",
    name: "Gratitude",
    description:
      "Say thank you with something thoughtful.",
    tags: ["Appreciation", "Respect"],
    icon: Gift,
    className: "emotion-gratitude",
    image: gratitudeBg,
  },

  {
    id: "peace",
    name: "Peace",
    description:
      "Bring a gentle sense of calm and balance.",
    tags: ["Relaxing", "Peaceful"],
    icon: Leaf,
    className: "emotion-peace",
    image: peaceBg
  },

  {
    id: "hope",
    name: "Hope",
    description:
      "Send a little hope and positivity.",
    tags: ["Optimistic", "Bright"],
    icon: Sunrise,
    className: "emotion-hope",
    image: hopeBg,
  },
];


function Emotion() {
  const navigate = useNavigate();


  const openEmotion = (emotionId) => {
    navigate(`/emotion/${emotionId}`);
  };


  return (
    <main className="emotion-page">

      {/* =================================================
          BREADCRUMB
      ================================================= */}

      <div className="emotion-breadcrumb-wrap">

        <div className="emotion-breadcrumb">

          <button
            type="button"
            onClick={() => navigate("/")}
          >
            Home
          </button>

          <span>/</span>

          <strong>
            Shop by Emotion
          </strong>

        </div>

      </div>


      {/* =================================================
          HERO
      ================================================= */}

      <section className="emotion-hero">

        <div className="emotion-hero-inner">

          <div className="emotion-hero-copy">

            <span className="emotion-eyebrow">
              Gifts with meaning
            </span>

            <h1>
              Shop by Emotion
              <Heart
                className="emotion-title-heart"
                fill="currentColor"
              />
            </h1>

            <p>
              Every emotion has a story.
              Choose the feeling you want to express
              and find the perfect gift that speaks
              from the heart.
            </p>

          </div>


          {/* SUBTLE DECORATION */}

          <div
            className="emotion-hero-decoration"
            aria-hidden="true"
          >

            <div className="emotion-decor-circle emotion-decor-circle-one" />
            <div className="emotion-decor-circle emotion-decor-circle-two" />

            <Flower2 className="emotion-decor-flower emotion-decor-flower-one" />
           
            <Heart className="emotion-decor-heart" />

            <Sparkles className="emotion-decor-sparkle" />

            <Leaf className="emotion-decor-leaf" />

          </div>

        </div>

      </section>


      {/* =================================================
          EMOTION INTRO
      ================================================= */}

      <section className="emotion-selection">

        <div className="emotion-selection-heading">

          <span className="emotion-heading-line" />

          <div>
            <Heart />
            <span>
              Find a gift for the moment
            </span>
            <Heart />
          </div>

          <span className="emotion-heading-line" />

        </div>


        {/* =================================================
            EMOTION GRID
        ================================================= */}

        <div className="emotion-grid">

          {emotions.map((emotion) => {
            const Icon = emotion.icon;

            return (
              <button
                type="button"
                key={emotion.id}
                className={`emotion-card ${emotion.className}`}
                onClick={() =>
                  openEmotion(emotion.id)
                }
                aria-label={`Shop gifts for ${emotion.name}`}
              >

                <div
                  className="emotion-card-visual"
                  style={{
                    backgroundImage: `url(${emotion.image})`,
                  }}
                >
                  <div className="emotion-card-image-overlay" />

                  <div className="emotion-card-icon">
                    <Icon />
                  </div>
                </div>


                <div className="emotion-card-content">

                  <h2>
                    {emotion.name}
                  </h2>

                  <p>
                    {emotion.description}
                  </p>


                  <div className="emotion-card-tags">

                    {emotion.tags.map((tag) => (
                      <span key={tag}>
                        {tag}
                      </span>
                    ))}

                  </div>

                </div>

              </button>
            );
          })}

        </div>

      </section>


      {/* =================================================
          GIFT FINDER CTA
      ================================================= */}

      <section className="emotion-finder">

        {/* LEFT FLORAL DECORATION */}
        <div className="emotion-finder-art emotion-finder-art-left" aria-hidden="true">
          <img
            src={emotionFinderFloral}
            alt=""
            className="emotion-finder-floral emotion-finder-floral-left"
          />
        </div>


        {/* MIDDLE CONTENT */}
        <div className="emotion-finder-copy">

          <span className="emotion-finder-eyebrow">
            Need a little guidance?
          </span>

          <h2>
            Not sure which emotion to choose?
          </h2>

          <p>
            Tell us a little more and Petalia will help you find a gift that feels right.
          </p>

          <button
            type="button"
            onClick={() => navigate("/gift-finder")}
          >
            Try Gift Finder
            <ArrowRight />
          </button>

        </div>


        {/* RIGHT BENEFITS */}
        <div className="emotion-finder-points">

          <div>
            <Heart />
            <span>Personalized recommendations</span>
          </div>

          <div>
            <Gift />
            <span>Meaningful gifts made easier</span>
          </div>

          <div>
            <Sparkles />
            <span>Guided by your story</span>
          </div>

        </div>


        {/* RIGHT FLORAL / LEAF DECORATION */}
        <div className="emotion-finder-right-art" aria-hidden="true">
          <img
            src={emotionFinderFloral}
            alt=""
            className="emotion-finder-floral-right"
          />
        </div>

      </section>


      {/* =================================================
          WHY SHOP BY EMOTION
      ================================================= */}

      <section className="emotion-why">

        <div className="emotion-why-heading">

          <span>
            Thoughtful gifting
          </span>

          <h2>
            Why Choose Gifts by Emotion?
          </h2>

          <p>
            Start with how you feel, then find a gift
            that helps you express it.
          </p>

        </div>


        <div className="emotion-why-grid">

          <div className="emotion-why-item">

            <div className="emotion-why-icon">
              <Heart />
            </div>

            <div>
              <h3>
                More Meaningful
              </h3>

              <p>
                Gifts that help express how
                you truly feel.
              </p>
            </div>

          </div>


          <div className="emotion-why-item">

            <div className="emotion-why-icon">
              <Sparkles />
            </div>

            <div>
              <h3>
                Easier to Choose
              </h3>

              <p>
                No more endless browsing.
                We guide the feeling first.
              </p>
            </div>

          </div>


          <div className="emotion-why-item">

            <div className="emotion-why-icon">
              <Gift />
            </div>

            <div>
              <h3>
                More Thoughtful
              </h3>

              <p>
                Every gift is chosen with
                meaning and care.
              </p>
            </div>

          </div>

        </div>

      </section>

    </main>
  );
}


export default Emotion;