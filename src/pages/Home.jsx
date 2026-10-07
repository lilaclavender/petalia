import heroGifts from "../assets/hero-gifts.png";
import heroBackground from "../assets/heroBg.png";
import lavenderStem from "../assets/lavender-Stem.png";
import anniversaryImg from "../assets/anniversary.png";
import balloonImg from "../assets/balloon.png";
import letterImg from "../assets/letter.png";
import cakeImg from "../assets/cake.png";
import candleImg from "../assets/candle.png";
import graduationImg from "../assets/graduation.png";
import mothersDayImg from "../assets/mother-day.png";
import pinkHeartImg from "../assets/pink-heart.png";
import valentineImg from "../assets/valentine-present.png";
import tulipImg from "../assets/tulip.png";
import ProductCard from "../components/ProductCard";
import CuratedSetCard from "../components/CuratedSetCard";
import littleComfortImg from "../assets/a-little-comfort.png";
import roseCandleImg from "../assets/rose-candle.png";
import jasmineCandleImg from "../assets/jasmine-candle.png";
import TipCard from "../components/TipCard";
import tipFlowerImg from "../assets/flower-meaning.png";
import tipCandleImg from "../assets/candle-tip.png";
import tipMessageImg from "../assets/message-card.png";
import sakura1 from "../assets/sakura1.png";
import curatedSet from "../assets/curated-set.png";
import makeyour from "../assets/make-your.png";
import truck from "../assets/truck.png";
import bloomPetal from "../assets/bloom-petal.png";
import journeyBouquet from "../assets/journey-bouquet.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import localShop1Img from "../assets/local-shop-1.jpg";
import localShop2Img from "../assets/local-shop-2.jpg";
import localshop3Img from "../assets/local-shop-3.jpg";
import localShop6Img from "../assets/local-shop-6.jpg";

import "../styles/Home.css";
import { getProducts } from "../data/productService";

import {
  Heart,
  Flower2,
  Store,
  LockKeyhole,
  Gift,
  Users,
  WalletCards,
  Sparkles,
  ChevronRight,
  MapPin,
  Star,
} from "lucide-react";

const featuredShops = [
  {
    id: 1,
    name: "Bloom & Co.",
    location: "Phnom Penh",
    specialties: ["Flowers", "Bouquets", "Gift Sets"],
    rating: 4.8,
    reviews: 120,
    image: localShop1Img,
  },
  {
    id: 2,
    name: "Scent Studio",
    location: "Phnom Penh",
    specialties: ["Candles", "Home Fragrance", "Gift Sets"],
    rating: 4.7,
    reviews: 98,
    image: localShop2Img,
  },
  {
    id: 3,
    name: "Petal House",
    location: "Siem Reap",
    specialties: ["Flowers", "Bouquets", "Events"],
    rating: 4.9,
    reviews: 86,
    image: localshop3Img,
  },
  {
    id: 6,
    name: "Bloom & Glow",
    location: "Phnom Penh",
    specialties: ["Flowers", "Candles", "Gift Sets"],
    rating: 4.8,
    reviews: 81,
    image: localShop6Img,
  },
];

const petaliaTips = [
  {
    id: "flower-meanings",
    title: "What Do Different Flowers Symbolize?",
    category: "Flower Meanings",
    description: "Learn the meaning behind each bloom.",
    image: tipFlowerImg,
  },
  {
    id: "candle-guide",
    category: "Candle Guide",
    title: "How to Choose the Right Candle Scent",
    description: "Find a scent that matches the feeling you want to create.",
    image: tipCandleImg,
  },
  {
    id: "gift-giving",
    category: "Gift Giving",
    title: "How to Choose a Meaningful Gift",
    description: "Simple ideas for choosing something thoughtful and personal.",
    image: tipMessageImg,
  },
];

const testimonials = [
  {
    id: 1,
    quote:
      "Petalia made it easier to choose a gift that felt thoughtful and personal.",
    name: "Demo Customer",
    context: "Gift for a friend",
    image: littleComfortImg,
  },
  {
    id: 2,
    quote:
      "I liked being able to choose a gift based on the feeling I wanted to express.",
    name: "Demo Customer",
    context: "Birthday gift",
    image: roseCandleImg,
  },
  {
    id: 3,
    quote:
      "The gift ideas felt simple to explore and helped me decide much faster.",
    name: "Demo Customer",
    context: "Gift for family",
    image: jasmineCandleImg,
  },
];

function Home() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [favoriteShops, setFavoriteShops] = useState([]);

  const toggleFavoriteShop = (shopId) => {
    setFavoriteShops((current) =>
      current.includes(shopId)
        ? current.filter((id) => id !== shopId)
        : [...current, shopId],
    );
  };

  useEffect(() => {
    const loadProducts = async () => {
      const data = await getProducts();
      setProducts(data);
    };

    loadProducts();
  }, []);

  const trendingIds = [15, 16, 17, 18, 19, 20];

  const trendingProducts = products.filter((product) =>
    trendingIds.includes(product.id),
  );

  const curatedSets = products
    .filter((product) => product.category === "Gift Sets")
    .slice(0, 4);

  const [activeTestimonial, setActiveTestimonial] = useState(0);

  return (
    <main className="home-page">
      {/* HERO */}
      <section
        className="hero-section"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="hero-container">
          <div className="hero-content">
            <p className="hero-label">Meaningful gifting, made personal</p>

            <h1>
              Give more than a gift.
              <br />
              Give a feeling that lasts.
            </h1>

            <p className="hero-description">
              Discover flowers, candles, curated gift sets, and personalized
              keepsakes from local shops.
            </p>

            <div className="hero-buttons">
              <button className="primary-btn" onClick={() => navigate("/shop")}>
                Explore Gifts
              </button>

              <button
                className="secondary-btn"
                onClick={() => {
                  document
                    .getElementById("discover-petalia")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Discover Petalia
                <span>♡</span>
              </button>
            </div>

            <div className="hero-benefits">
              <span>
                <Heart />
                Meaningfully Personal
              </span>

              <span>
                <Flower2 />
                Curated with Care
              </span>

              <span>
                <Store />
                Support Local
              </span>

              <span>
                <LockKeyhole />
                Secure Checkout
              </span>
            </div>
          </div>

          <div className="hero-image-wrapper">
            <img
              src={heroGifts}
              alt="Flowers, candle, gift box, and keepsake arrangement"
              className="hero-image"
            />
          </div>
        </div>
      </section>

      {/* GIFT FINDER */}
      <section className="gift-finder-preview">
        <div className="gift-finder-container">
          {/* LEFT SIDE */}
          <div className="gift-finder-intro">
            <p className="gift-finder-label">Not sure what to get?</p>

            <h2>
              We’ll help you find
              <br />a gift that <span>feels right.</span>
            </h2>

            <p className="gift-finder-description">
              Tell us a little, and we’ll bring you the most thoughtful picks.
            </p>

            <button
              className="gift-finder-btn"
              onClick={() => navigate("/gift-finder")}
            >
              Start Gift Finder
            </button>
          </div>

          {/* GIFT FINDER STEPS */}
          <div className="finder-step">
            <div className="finder-step-bloom">
              <span>01</span>
            </div>

            <div className="step-icon">
              <Users />
            </div>

            <h3>Who is the gift for?</h3>

            <p>Partner, friend, family, teacher, or someone special</p>
          </div>

          {/* STEP 2 — OCCASION */}
          <div className="finder-step">
            <div className="finder-step-bloom">
              <span>02</span>
            </div>

            <div className="step-icon">
              <Gift />
            </div>

            <h3>What’s the occasion?</h3>

            <p>Birthday, graduation, anniversary, or other</p>
          </div>

          {/* STEP 3 — EMOTION */}
          <div className="finder-step">
            <div className="finder-step-bloom">
              <span>03</span>
            </div>

            <div className="step-icon">
              <Heart />
            </div>

            <h3>What do you want to express?</h3>

            <p>Love, joy, comfort, gratitude, or encouragement</p>
          </div>

          {/* STEP 4 — BUDGET */}
          <div className="finder-step">
            <div className="finder-step-bloom">
              <span>04</span>
            </div>

            <div className="step-icon">
              <WalletCards />
            </div>

            <h3>What’s your budget?</h3>

            <p>Choose a range that works for you</p>
          </div>

          {/* STEP 5 — GIFT STYLE */}
          <div className="finder-step">
            <div className="finder-step-bloom">
              <span>05</span>
            </div>

            <div className="step-icon">
              <Sparkles />
            </div>

            <h3>What gift style do you prefer?</h3>

            <p>Flowers, candles, gift sets, or surprise me</p>
          </div>

          {/* DECORATION */}
          <img src={lavenderStem} alt="" className="gift-finder-flower" />
        </div>
      </section>

      {/* SHOP BY EMOTION + OCCASION */}
      <section className="discover-categories" id="discover-petalia">
        <div className="discover-categories-container">
          {/* ================= SHOP BY EMOTION ================= */}
          <div className="category-panel">
            <div className="category-panel-header">
              <h2>Shop by Emotion</h2>

              <button
                className="view-all-btn"
                onClick={() => navigate("/emotion")}
              >
                View all
                <ChevronRight />
              </button>
            </div>

            <div className="category-items">
              {/* LOVE */}
              <div
                className="category-item"
                onClick={() => navigate("/emotion/love")}
              >
                <div className="category-image-box">
                  <img
                    src={pinkHeartImg}
                    alt="Love"
                    className="category-image"
                  />
                </div>
                <p>Love</p>
              </div>

              {/* CELEBRATION */}
              <div
                className="category-item"
                onClick={() => navigate("/emotion/celebration")}
              >
                <div className="category-image-box">
                  <img
                    src={balloonImg}
                    alt="Celebration"
                    className="category-image"
                  />
                </div>
                <p>Celebration</p>
              </div>

              {/* COMFORT */}
              <div
                className="category-item"
                onClick={() => navigate("/emotion/comfort")}
              >
                <div className="category-image-box">
                  <img
                    src={candleImg}
                    alt="Comfort"
                    className="category-image"
                  />
                </div>
                <p>Comfort</p>
              </div>

              {/* SELF-CARE */}
              <div
                className="category-item"
                onClick={() => navigate("/emotion/self-care")}
              >
                <div className="category-image-box">
                  <img
                    src={letterImg}
                    alt="Self-care"
                    className="category-image"
                  />
                </div>
                <p>Self-care</p>
              </div>

              {/* GRATITUDE */}
              <div
                className="category-item"
                onClick={() => navigate("/emotion/gratitude")}
              >
                <div className="category-image-box">
                  <img
                    src={tulipImg}
                    alt="Gratitude"
                    className="category-image"
                  />
                </div>
                <p>Gratitude</p>
              </div>
            </div>
          </div>

          {/* ================= SHOP BY OCCASION ================= */}
          <div className="category-panel">
            <div className="category-panel-header">
              <h2>Shop by Occasion</h2>

              <button
                className="view-all-btn"
                onClick={() => navigate("/occasion")}
              >
                View all
                <ChevronRight />
              </button>
            </div>

            <div className="category-items">
              {/* BIRTHDAY */}
              <div
                className="category-item"
                onClick={() => navigate("/occasion/birthday")}
              >
                <div className="category-image-box">
                  <img
                    src={cakeImg}
                    alt="Birthday"
                    className="category-image"
                  />
                </div>
                <p>Birthday</p>
              </div>

              {/* GRADUATION */}
              <div
                className="category-item"
                onClick={() => navigate("/occasion/graduation")}
              >
                <div className="category-image-box">
                  <img
                    src={graduationImg}
                    alt="Graduation"
                    className="category-image"
                  />
                </div>
                <p>Graduation</p>
              </div>

              {/* ANNIVERSARY */}
              <div
                className="category-item"
                onClick={() => navigate("/occasion/anniversary")}
              >
                <div className="category-image-box">
                  <img
                    src={anniversaryImg}
                    alt="Anniversary"
                    className="category-image"
                  />
                </div>
                <p>Anniversary</p>
              </div>

              {/* CHRISTMAS */}
              <div
                className="category-item"
                onClick={() => navigate("/occasion/christmas")}
              >
                <div className="category-image-box">
                  <img
                    src={mothersDayImg}
                    alt="Christmas"
                    className="category-image"
                  />
                </div>
                <p>Christmas</p>
              </div>

              {/* JUST BECAUSE */}
              <div
                className="category-item"
                onClick={() => navigate("/occasion/just-because")}
              >
                <div className="category-image-box">
                  <img
                    src={valentineImg}
                    alt="Just Because"
                    className="category-image"
                  />
                </div>
                <p>Just Because</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* TRENDING NOW */}
      <section className="trending-section">
        <div className="trending-container">
          <div className="trending-header">
            <div>
              <h2>Trending Now</h2>
              <p>Popular picks people are loving right now.</p>
            </div>

            <button
              className="trending-view-all"
              onClick={() => navigate("/shop?category=trending")}
            >
              View all
              <ChevronRight />
            </button>
          </div>
          <div className="trending-grid shop-product-grid">
            {trendingProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                image={product.image}
                name={product.name}
                description={product.description}
                category={product.category}
                price={product.price}
                rating={product.rating}
                reviews={product.reviews}
                badge={product.badge}
              />
            ))}
          </div>
        </div>
      </section>
      {/* CURATED GIFT SETS */}
      <section className="curated-section">
        <div className="curated-container">
          <div className="curated-header">
            <div>
              <h2>Curated Gift Sets</h2>
              <p>Thoughful combinations, ready to give.</p>
            </div>
            <button
              className="curated-view-all"
              onClick={() => navigate("/shop?category=gift-sets")}
            >
              View all
              <ChevronRight />
            </button>
          </div>

          <div className="curated-grid">
            {curatedSets.map((set) => (
              <CuratedSetCard
                key={set.id}
                id={set.id}
                image={set.image}
                name={set.name}
                description={set.description}
                price={set.price}
              />
            ))}
          </div>
        </div>
      </section>
      {/* FEATURED LOCAL SHOPS */}
      <section className="featured-shops-section">
        <div className="featured-shops-container">
          <div className="featured-shops-header">
            <div>
              <h2>Featured Local Shops</h2>
              <p>Discover thoughtful gifts from local sellers.</p>
            </div>

            <button
              type="button"
              className="shops-view-all"
              onClick={() => navigate("/local-shops")}
            >
              View all
              <ChevronRight />
            </button>
          </div>

          <div className="featured-shops-grid">
            {featuredShops.map((shop) => (
              <article className="home-local-shop-card" key={shop.id}>
                <img
                  src={shop.image}
                  alt={shop.name}
                  className="home-local-shop-image"
                />

                <div className="home-local-shop-overlay"></div>

                <button
                  type="button"
                  className={`home-local-shop-heart ${
                    favoriteShops.includes(shop.id) ? "active" : ""
                  }`}
                  onClick={() => toggleFavoriteShop(shop.id)}
                  aria-label={`Save ${shop.name}`}
                >
                  <Heart
                    fill={favoriteShops.includes(shop.id) ? "#D35B8C" : "none"}
                  />
                </button>

                <div className="home-local-shop-content">
                  <h3>{shop.name}</h3>

                  <div className="home-local-shop-location">
                    <MapPin />
                    <span>{shop.location}</span>
                  </div>

                  <div className="home-local-shop-tags">
                    {shop.specialties.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>

                  <div className="home-local-shop-bottom">
                    <div className="home-local-shop-rating">
                      <Star fill="#F5B942" />
                      <span>{shop.rating}</span>
                      <small>({shop.reviews})</small>
                    </div>

                    <button
                      type="button"
                      className="home-local-shop-view-btn"
                      onClick={() => navigate(`/local-shops/${shop.id}`)}
                    >
                      View Shop
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      {/* PETALIA TIPS */}
      <section className="tips-section">
        <div className="tips-container">
          <div className="tips-header">
            <div>
              <h2>Petalia Tips</h2>
              <p>Small ideas for more meaningful gifting.</p>
            </div>
          </div>

          <div className="tips-grid">
            {petaliaTips.map((tip) => (
              <TipCard
                key={tip.id}
                id={tip.id}
                image={tip.image}
                category={tip.category}
                title={tip.title}
                description={tip.description}
                onClick={() => navigate("/petalia-tips")}
              />
            ))}
          </div>
        </div>
      </section>
      {/* WHY CHOOSE PETALIA */}
      <section className="why-petalia-section">
        <div className="why-petalia-container">
          {/* LEFT SIDE */}
          <div className="why-petalia-left">
            <span className="why-petalia-label">Why choose Petalia?</span>

            <h2>
              Thoughtful gifting,
              <br />
              <span>made easy and meaningful.</span>
            </h2>

            <p>
              From finding the right gift to final delivery, we're here for
              every meaningful moment in between.
            </p>

            <button
              type="button"
              className="why-petalia-btn"
              onClick={() => navigate("/shop")}
            >
              Explore Gifts
              <span>→</span>
            </button>
          </div>

          {/* RIGHT SIDE — PETALIA GIFT JOURNEY */}
          <div className="why-petalia-right">
            {/* Curved journey path */}
            <svg
              className="why-gift-path"
              viewBox="0 0 1000 160"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="
                  M 0 62

                  C 80 45, 130 45, 180 72
                  C 220 95, 250 100, 285 72

                  C 315 48, 345 45, 375 65

                  C 395 78, 405 82, 414 72
                  C 423 61, 410 55, 404 65
                  C 399 75, 410 80, 425 70

                  C 470 45, 520 45, 565 65

                  C 610 88, 650 94, 685 70

                  C 705 56, 720 56, 728 68
                  C 736 80, 723 86, 716 76
                  C 709 66, 722 61, 740 70

                  C 790 92, 840 98, 875 72

                  C 910 48, 950 48, 1000 60
                "
              />
            </svg>

            <div className="why-steps">
              {/* STEP 01 */}
              <div className="why-step why-step-one">
                <div className="why-visual why-visual-one">
                  <img src={bloomPetal} alt="" className="why-bloom-image" />

                  <img
                    src={journeyBouquet}
                    alt="Petalia flower bouquet"
                    className="why-product-cutout why-bouquet-cutout"
                  />
                </div>
                <div className="why-step-text">
                  <span className="why-step-number">01</span>

                  <h3>Find the Feeling</h3>

                  <p>
                    Start with the emotion
                    <br />
                    you want to express.
                  </p>
                </div>
              </div>

              {/* STEP 02 */}
              <div className="why-step why-step-two">
                <div className="why-visual why-visual-one">
                  <img src={bloomPetal} alt="" className="why-bloom-image" />

                  <img
                    src={curatedSet}
                    alt="Curated candle gift"
                    className="why-product-cutout why-bouquet-cutout"
                  />
                </div>

                <div className="why-step-text">
                  <span className="why-step-number">02</span>
                  <h3>Curated with Care</h3>
                  <p>
                    Thoughtful flowers, candles,
                    <br />
                    and meaningful sets.
                  </p>
                </div>
              </div>

              {/* STEP 03 */}
              <div className="why-step why-step-three">
                <div className="why-visual why-visual-one">
                  <img src={bloomPetal} alt="" className="why-bloom-image" />

                  <img
                    src={makeyour}
                    alt="Personalized gift"
                    className="why-product-cutout why-bouquet-cutout"
                  />
                </div>

                <div className="why-step-text">
                  <span className="why-step-number">03</span>
                  <h3>Make It Yours</h3>
                  <p>
                    Add a message, choose wrapping,
                    <br />
                    and include extra touches.
                  </p>
                </div>
              </div>

              {/* STEP 04 */}
              <div className="why-step why-step-four">
                <div className="why-visual why-visual-one">
                  <img src={bloomPetal} alt="" className="why-bloom-image" />

                  <img
                    src={truck}
                    alt="Petalia delivery"
                    className="why-product-cutout why-bouquet-cutout"
                  />
                </div>

                <div className="why-step-text">
                  <span className="why-step-number">04</span>
                  <h3>Delivered with Joy</h3>
                  <p>
                    Fast and reliable delivery
                    <br />
                    across Phnom Penh.
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative petals */}
            <span className="why-decor-petal why-petal-1">✦</span>
            <span className="why-decor-petal why-petal-2">✦</span>
            <span className="why-decor-petal why-petal-3">✦</span>
          </div>
        </div>
      </section>
      {/* GIFTING EXPERIENCES */}
      <section className="testimonials-section">
        <div className="testimonials-container">
          {/* LEFT SIDE */}
          <div className="testimonials-header">
            <span className="testimonials-label">Gifting Experiences</span>

            <div className="testimonial-mood">
              <img src={sakura1} alt="" className="testimonial-mood-img" />

              <span>Kind words, meaningful moments</span>

              <img src={sakura1} alt="" className="testimonial-mood-img" />
            </div>

            <h2>
              Thoughtful gifting,
              <br />
              <span className="testimonial-highlight">shared by others.</span>
            </h2>
            <p>A glimpse of how meaningful gifting can feel.</p>

            {/* ARROWS */}
          </div>

          {/* RIGHT SIDE */}
          <div className="testimonial-carousel">
            <div className="testimonial-card-stack">
              {testimonials.map((testimonial, index) => {
                let position = "hidden";

                if (index === activeTestimonial) {
                  position = "active";
                } else if (
                  index ===
                  (activeTestimonial - 1 + testimonials.length) %
                    testimonials.length
                ) {
                  position = "previous";
                } else if (
                  index ===
                  (activeTestimonial + 1) % testimonials.length
                ) {
                  position = "next";
                }

                return (
                  <div
                    key={testimonial.id}
                    className={`testimonial-slide testimonial-${position}`}
                    onClick={() => {
                      if (position !== "active") {
                        setActiveTestimonial(index);
                      }
                    }}
                  >
                    <div className="testimonial-card-content">
                      <div className="testimonial-copy">
                        <div className="testimonial-stars">★ ★ ★ ★ ★</div>

                        <p className="testimonial-quote">
                          “{testimonial.quote}”
                        </p>

                        <div className="testimonial-person">
                          <strong>{testimonial.name}</strong>
                          <span>{testimonial.context}</span>
                        </div>
                      </div>

                      <div className="testimonial-gift-image">
                        <img
                          src={testimonial.image}
                          alt={testimonial.context}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* DOTS */}
            <div className="testimonial-dots">
              {testimonials.map((testimonial, index) => (
                <button
                  key={testimonial.id}
                  type="button"
                  className={`testimonial-dot ${
                    index === activeTestimonial ? "active" : ""
                  }`}
                  onClick={() => setActiveTestimonial(index)}
                  aria-label={`Show testimonial ${index + 1}`}
                />
              ))}
            </div>

            {/* DECORATION */}
            <span className="testimonial-petal testimonial-petal-one">✦</span>

            <span className="testimonial-petal testimonial-petal-two">✦</span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
