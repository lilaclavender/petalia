import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Flower2,
  Gift,
  Flame,
  Sparkles,
} from "lucide-react";

import "../styles/PetaliaTips.css";


import FlowerMeaning from "../assets/flower-meaning.png";
import tipsCandleGuide from "../assets/tips-candle-guide.png";
import tipsGiftGiving from "../assets/tips-gift-giving.png";
import tipsFeatured from "../assets/tips-featured.png";

// =====================================================
// PETALIA TIPS IMAGES
// =====================================================

function PetaliaTips() {
  const navigate = useNavigate();

  // =====================================================
  // TIP CATEGORIES
  // =====================================================

  const categories = [
    {
      id: "flower-meanings",
      title: "Flower Meanings",
      description: "Understand what different flowers can express.",
      icon: Flower2,
      image: FlowerMeaning,
    },
    {
      id: "candle-guide",
      title: "Candle Guide",
      description: "Find scents that match different moods and moments.",
      icon: Flame,
      image: tipsCandleGuide,
    },
    {
      id: "gift-giving",
      title: "Gift Giving",
      description: "Simple advice for choosing meaningful gifts.",
      icon: Gift,
      image: tipsGiftGiving,
    },
  ];

  // =====================================================
  // MORE FROM PETALIA
  // =====================================================

  const articles = [
    {
      id: "flowers-for-different-emotions",
      title: "Flowers for Different Emotions",
      description:
        "Discover how different flowers can express love, gratitude, comfort and more.",
      image: FlowerMeaning,
    },
    {
      id: "choosing-a-candle-by-mood",
      title: "Choosing a Candle by Mood",
      description:
        "Find the right scent to create the perfect atmosphere for any moment.",
      image: tipsCandleGuide,
    },
    {
      id: "what-to-write-in-a-gift-card",
      title: "What to Write in a Gift Card",
      description:
        "Get inspired with meaningful messages for every occasion.",
      image: tipsGiftGiving,
    },
  ];

  const openGuide = (id) => {
    navigate(`/petalia-tips/${id}`);
  };

  return (
    <main className="petalia-tips-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="tips-hero">
        <div className="tips-hero-content">
          <p className="tips-eyebrow">PETALIA TIPS</p>

          <h1>
            Thoughtful Gifting,
            <br />
            Made Easier
          </h1>

          <p className="tips-hero-description">
            Small guidance for choosing meaningful gifts, understanding flowers,
            candles, and the little details that make every gift feel personal.
          </p>

          <button
            type="button"
            className="tips-primary-btn"
            onClick={() =>
              document
                .getElementById("explore-tips")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Explore Our Guides
            <ArrowRight size={15} strokeWidth={1.8} />
          </button>
        </div>
      </section>

      {/* =====================================================
          EXPLORE PETALIA TIPS
      ===================================================== */}

      <section
        className="tips-section tips-explore"
        id="explore-tips"
      >
        <div className="tips-section-label">
          <p className="tips-eyebrow">
            EXPLORE PETALIA TIPS
          </p>
        </div>

        <div className="tips-category-grid">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <button
                type="button"
                className="tips-category-card"
                key={category.id}
                onClick={() => openGuide(category.id)}
              >
                <div className="tips-category-image-wrap">
                  <img
                    src={category.image}
                    alt={category.title}
                    className={`tips-category-image tips-category-image-${category.id}`}
                  />
                </div>

                <div className="tips-category-content">
                  <div className="tips-category-icon">
                    <Icon
                      size={20}
                      strokeWidth={1.7}
                    />
                  </div>

                  <h3>{category.title}</h3>

                  <p>{category.description}</p>

                  <span className="tips-category-arrow">
                    <ArrowRight size={15} />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          FEATURED GUIDE
      ===================================================== */}

      <section className="tips-section tips-featured-section">
        <p className="tips-eyebrow">
          FEATURED GUIDE
        </p>

        <article className="tips-featured-card">
          <div className="tips-featured-image-wrap">
            <img
              src={tipsFeatured}
              alt="Thoughtfully arranged personal gift"
              className="tips-featured-image"
            />
          </div>

          <div className="tips-featured-content">
            <p className="tips-eyebrow">
              THE ART OF GIFTING
            </p>

            <h2>
              How to Choose a Gift
              <br />
              That Feels Personal
            </h2>

            <p className="tips-featured-description">
              A thoughtful gift doesn't have to be complicated.
              Discover simple ways to choose something that truly
              matches their personality, your relationship, and the
              moment you're celebrating.
            </p>

            <button
              type="button"
              className="tips-primary-btn tips-small-btn"
              onClick={() =>
                openGuide("how-to-choose-a-personal-gift")
              }
            >
              Read Guide
              <ArrowRight size={14} />
            </button>

            <Sparkles
              className="tips-featured-sparkle"
              size={24}
            />
          </div>
        </article>
      </section>

      {/* =====================================================
          MORE FROM PETALIA
      ===================================================== */}

      <section className="tips-section tips-more-section">
        <p className="tips-eyebrow">
          MORE FROM PETALIA
        </p>

        <div className="tips-article-grid">
          {articles.map((article) => (
            <article
              className="tips-article-card"
              key={article.id}
            >
              <button
                type="button"
                className="tips-article-image-button"
                onClick={() => openGuide(article.id)}
                aria-label={`Read ${article.title}`}
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="tips-article-image"
                />
              </button>

              <div className="tips-article-content">
                <h3>{article.title}</h3>

                <p>{article.description}</p>

                <button
                  type="button"
                  className="tips-read-more"
                  onClick={() => openGuide(article.id)}
                >
                  Read More
                  <ArrowRight size={13} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* =====================================================
          GIFT FINDER CTA
      ===================================================== */}

      <section className="tips-finder">
        <div className="tips-finder-icon">
          <Flower2
            size={24}
            strokeWidth={1.6}
          />
        </div>

        <div className="tips-finder-content">
          <p className="tips-eyebrow">
            STILL NOT SURE?
          </p>

          <h2>
            Let Petalia help you find something
            <br />
            that fits.
          </h2>

          <p>
            Use our Gift Finder to get personalized
            recommendations based on emotion, occasion,
            relationship and budget.
          </p>
        </div>

        <button
          type="button"
          className="tips-primary-btn tips-finder-btn"
          onClick={() => navigate("/gift-finder")}
        >
          Try Gift Finder
          <ArrowRight size={15} />
        </button>

        <span className="tips-finder-petal tips-finder-petal-one" />
        <span className="tips-finder-petal tips-finder-petal-two" />
      </section>
    </main>
  );
}

export default PetaliaTips;