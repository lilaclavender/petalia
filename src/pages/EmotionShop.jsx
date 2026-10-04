import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Heart,
  Flower2,
  Gift,
  ArrowRight,
  PartyPopper,
  HandHeart,
  Sparkles,
  Sun,
  Handshake,
  MessageCircleHeart,
  Sprout,
  Leaf,
  Sunrise,
} from "lucide-react";

import ProductCard from "../components/ProductCard";
import { getProducts } from "../data/productService";

import loveHero from "../assets/love-hero.png";
import loveGuidance from "../assets/love-guidance.png";
import loveGiftFinder from "../assets/love-gift-finder.png";

import "../styles/EmotionShop.css";

/* =====================================================
   EMOTION DATA

   IMPORTANT:
   For now, emotions without their own images reuse the
   Love images so every page works without missing files.

   Later, when we create the real images, we only change:
   heroImage
   guidanceImage
   finderImage
===================================================== */

const emotionPages = {
  /* =====================================================
     1. LOVE
  ===================================================== */

  love: {
    name: "Love",
    eyebrow: "Love & Affection",

    title: (
      <>
        Gifts That Say
        <br />
        “I Love You”
      </>
    ),

    description:
      "Express affection with flowers, candles, and thoughtful gifts chosen to make someone feel deeply loved.",

    heroImage: loveHero,
    guidanceImage: loveGuidance,
    finderImage: loveGiftFinder,

    meaningTitle: "What Does Love Mean?",

    meaningDescription:
      "Love can be expressed in many ways — through affection, care, appreciation, and the little gestures that make someone feel truly special.",

    meanings: [
      {
        title: "Romantic Love",
        description: "Show your affection and create meaningful moments.",
        icon: Heart,
      },
      {
        title: "Thoughtful Affection",
        description: "A gentle way to say you care.",
        icon: Flower2,
      },
      {
        title: "Meaningful Connection",
        description: "Gifts that bring you closer to the people you love.",
        icon: Gift,
      },
    ],

    guidance:
      "Roses are a timeless symbol of love and deep affection, while a softly scented candle can add warmth and intimacy to your gift. Choose something that reflects the feeling you want them to remember.",
  },

  /* =====================================================
     2. CELEBRATION
  ===================================================== */

  celebration: {
    name: "Celebration",
    eyebrow: "Joy & Celebration",

    title: (
      <>
        Gifts Made for
        <br />
        Happy Moments
      </>
    ),

    description:
      "Celebrate meaningful moments with flowers, candles, and thoughtful gifts chosen to make the occasion feel even more special.",

    heroImage: loveHero,
    guidanceImage: loveGuidance,
    finderImage: loveGiftFinder,

    meaningTitle: "What Does Celebration Mean?",

    meaningDescription:
      "Celebration is about sharing happiness, recognizing special moments, and making memories with the people who matter.",

    meanings: [
      {
        title: "Share the Joy",
        description: "Make happy moments feel even more memorable.",
        icon: PartyPopper,
      },
      {
        title: "Celebrate Together",
        description: "Show someone that their special moment matters.",
        icon: Heart,
      },
      {
        title: "Create Memories",
        description: "Choose a thoughtful gift they can remember.",
        icon: Gift,
      },
    ],

    guidance:
      "Bright flowers and cheerful gift sets are a lovely way to celebrate an exciting moment. Choose something that matches the energy and personality of the person receiving it.",
  },

  /* =====================================================
     3. COMFORT
  ===================================================== */

  comfort: {
    name: "Comfort",
    eyebrow: "Warmth & Support",

    title: (
      <>
        Gifts That Bring
        <br />
        Gentle Comfort
      </>
    ),

    description:
      "Offer warmth and support with thoughtful gifts chosen to bring a little calm during difficult or quiet moments.",

    heroImage: loveHero,
    guidanceImage: loveGuidance,
    finderImage: loveGiftFinder,

    meaningTitle: "What Does Comfort Mean?",

    meaningDescription:
      "Comfort is about being present, showing care, and reminding someone that they do not have to face a difficult moment alone.",

    meanings: [
      {
        title: "Gentle Support",
        description: "Let someone know you are there for them.",
        icon: HandHeart,
      },
      {
        title: "Warmth & Care",
        description: "Bring a little warmth to a difficult day.",
        icon: Heart,
      },
      {
        title: "Thoughtful Presence",
        description: "Show your care even when words are difficult.",
        icon: Flower2,
      },
    ],

    guidance:
      "Soft flowers, calming colors, and gently scented candles can create a comforting feeling. Keep the gift simple, warm, and thoughtful.",
  },

  /* =====================================================
     4. APOLOGY
  ===================================================== */

  apology: {
    name: "Apology",
    eyebrow: "Sincerity & Care",

    title: (
      <>
        A Thoughtful Way
        <br />
        to Say “I’m Sorry”
      </>
    ),

    description:
      "Express sincerity and care with a meaningful gift when finding the right words feels difficult.",

    heroImage: loveHero,
    guidanceImage: loveGuidance,
    finderImage: loveGiftFinder,

    meaningTitle: "What Does an Apology Mean?",

    meaningDescription:
      "A sincere apology shows that you recognize someone’s feelings, value the relationship, and want to make things better.",

    meanings: [
      {
        title: "Show Sincerity",
        description: "Let your gesture reflect a genuine apology.",
        icon: HandHeart,
      },
      {
        title: "Express Care",
        description: "Remind them that the relationship matters.",
        icon: Flower2,
      },
      {
        title: "A New Beginning",
        description: "Offer a thoughtful step toward making things right.",
        icon: Sprout,
      },
    ],

    guidance:
      "Choose something gentle rather than overly dramatic. Soft flowers with a sincere message card can help your apology feel personal and meaningful.",
  },

  /* =====================================================
     5. SELF-CARE
  ===================================================== */

  "self-care": {
    name: "Self-care",
    eyebrow: "Rest & Wellness",

    title: (
      <>
        A Little Something
        <br />
        Just for You
      </>
    ),

    description:
      "Make time for yourself with calming flowers, candles, and thoughtful gifts that encourage rest and well-being.",

    heroImage: loveHero,
    guidanceImage: loveGuidance,
    finderImage: loveGiftFinder,

    meaningTitle: "What Does Self-care Mean?",

    meaningDescription:
      "Self-care is about making space to rest, recharge, and appreciate your own well-being through small and meaningful moments.",

    meanings: [
      {
        title: "Slow Down",
        description: "Give yourself permission to pause and rest.",
        icon: Leaf,
      },
      {
        title: "Create Calm",
        description: "Bring peaceful details into your personal space.",
        icon: Sparkles,
      },
      {
        title: "Treat Yourself",
        description: "Choose something simply because it makes you happy.",
        icon: Gift,
      },
    ],

    guidance:
      "A softly scented candle and gentle flowers can turn an ordinary evening into a calming self-care moment. Choose scents and colors that make you feel relaxed.",
  },

  /* =====================================================
     6. HAPPINESS
  ===================================================== */

  happiness: {
    name: "Happiness",
    eyebrow: "Joy & Cheer",

    title: (
      <>
        Gifts Made to
        <br />
        Brighten Their Day
      </>
    ),

    description:
      "Share a little happiness with cheerful flowers and thoughtful gifts chosen to make someone smile.",

    heroImage: loveHero,
    guidanceImage: loveGuidance,
    finderImage: loveGiftFinder,

    meaningTitle: "What Does Happiness Mean?",

    meaningDescription:
      "Happiness can come from simple moments of joy, cheerful surprises, and knowing that someone was thinking of you.",

    meanings: [
      {
        title: "Share a Smile",
        description: "Bring a cheerful moment into someone’s day.",
        icon: Sun,
      },
      {
        title: "Spread Joy",
        description: "Celebrate the little things that make life brighter.",
        icon: Flower2,
      },
      {
        title: "A Happy Surprise",
        description: "Give something thoughtful when they least expect it.",
        icon: Gift,
      },
    ],

    guidance:
      "Bright flowers, fresh colors, and cheerful gift combinations work beautifully for happiness. Choose something lively that reflects their personality.",
  },

  /* =====================================================
     7. SYMPATHY
  ===================================================== */

  sympathy: {
    name: "Sympathy",
    eyebrow: "Care & Support",

    title: (
      <>
        A Gentle Way
        <br />
        to Show You Care
      </>
    ),

    description:
      "Offer quiet support with thoughtful flowers and gifts chosen to express care during a difficult time.",

    heroImage: loveHero,
    guidanceImage: loveGuidance,
    finderImage: loveGiftFinder,

    meaningTitle: "What Does Sympathy Mean?",

    meaningDescription:
      "Sympathy is about acknowledging someone’s difficult moment and offering your presence, kindness, and support.",

    meanings: [
      {
        title: "Quiet Support",
        description: "Show that you are thinking of them.",
        icon: Handshake,
      },
      {
        title: "Gentle Care",
        description: "Offer comfort without asking for anything in return.",
        icon: Heart,
      },
      {
        title: "Thoughtful Presence",
        description: "A small gesture can remind them they are not alone.",
        icon: Flower2,
      },
    ],

    guidance:
      "For sympathy, simple and gentle choices are usually best. Soft white flowers, greenery, and a short sincere message can express care without feeling overwhelming.",
  },

  /* =====================================================
     8. THINKING OF YOU
  ===================================================== */

  "thinking-of-you": {
    name: "Thinking of You",
    eyebrow: "Thoughtful & Remembered",

    title: (
      <>
        A Little Reminder
        <br />
        That You Care
      </>
    ),

    description:
      "Send a thoughtful surprise simply to let someone know they have been on your mind.",

    heroImage: loveHero,
    guidanceImage: loveGuidance,
    finderImage: loveGiftFinder,

    meaningTitle: "What Does Thinking of You Mean?",

    meaningDescription:
      "Sometimes a gift does not need a special occasion. It can simply say that someone matters and has been on your mind.",

    meanings: [
      {
        title: "You’re Remembered",
        description: "Let them know they have been on your mind.",
        icon: MessageCircleHeart,
      },
      {
        title: "A Small Surprise",
        description: "Brighten an ordinary day with something thoughtful.",
        icon: Gift,
      },
      {
        title: "Stay Connected",
        description: "Show care even when you cannot be there in person.",
        icon: Heart,
      },
    ],

    guidance:
      "Keep a thinking-of-you gift personal and easy. A favorite flower, a small candle, or a simple gift set with a short message can make an ordinary day feel special.",
  },

  /* =====================================================
     9. ENCOURAGEMENT
  ===================================================== */

  encouragement: {
    name: "Encouragement",
    eyebrow: "Hope & Support",

    title: (
      <>
        Gifts That Say
        <br />
        “You’ve Got This”
      </>
    ),

    description:
      "Send positive energy and thoughtful support to someone facing a challenge, change, or important new step.",

    heroImage: loveHero,
    guidanceImage: loveGuidance,
    finderImage: loveGiftFinder,

    meaningTitle: "What Does Encouragement Mean?",

    meaningDescription:
      "Encouragement reminds someone that you believe in them and that they have support as they move forward.",

    meanings: [
      {
        title: "Believe in Them",
        description: "Remind them of their strength and ability.",
        icon: Sprout,
      },
      {
        title: "Lift Their Spirit",
        description: "Bring positive energy to a challenging moment.",
        icon: Sunrise,
      },
      {
        title: "Support the Journey",
        description: "Celebrate their effort as well as their success.",
        icon: Heart,
      },
    ],

    guidance:
      "Choose something fresh and uplifting. Bright flowers, gentle greenery, or an encouraging message card can help the gift feel positive without adding pressure.",
  },

  /* =====================================================
     10. GRATITUDE
  ===================================================== */

  gratitude: {
    name: "Gratitude",
    eyebrow: "Thanks & Appreciation",

    title: (
      <>
        A Thoughtful Way
        <br />
        to Say “Thank You”
      </>
    ),

    description:
      "Show your appreciation with a thoughtful gift chosen to make someone feel seen and valued.",

    heroImage: loveHero,
    guidanceImage: loveGuidance,
    finderImage: loveGiftFinder,

    meaningTitle: "What Does Gratitude Mean?",

    meaningDescription:
      "Gratitude is about recognizing someone’s kindness, effort, or presence and letting them know that it truly matters.",

    meanings: [
      {
        title: "Say Thank You",
        description: "Express your appreciation in a meaningful way.",
        icon: Heart,
      },
      {
        title: "Recognize Their Care",
        description: "Show that their kindness did not go unnoticed.",
        icon: HandHeart,
      },
      {
        title: "Give Something Back",
        description: "Return their kindness with a thoughtful gesture.",
        icon: Gift,
      },
    ],

    guidance:
      "For gratitude, choose something warm and thoughtful rather than overly romantic. Flowers, a small candle, or a curated gift set paired with a thank-you message works beautifully.",
  },

  /* =====================================================
     11. PEACE
  ===================================================== */

  peace: {
    name: "Peace",
    eyebrow: "Calm & Balance",

    title: (
      <>
        Gifts for a
        <br />
        Little More Calm
      </>
    ),

    description:
      "Create a gentle sense of peace with calming flowers, candles, and thoughtful gifts inspired by quiet moments.",

    heroImage: loveHero,
    guidanceImage: loveGuidance,
    finderImage: loveGiftFinder,

    meaningTitle: "What Does Peace Mean?",

    meaningDescription:
      "Peace can mean slowing down, finding balance, and creating a quiet space where the mind and heart can feel at ease.",

    meanings: [
      {
        title: "Find Calm",
        description: "Create space for quiet and restful moments.",
        icon: Leaf,
      },
      {
        title: "Gentle Balance",
        description: "Bring softness and simplicity into the day.",
        icon: Flower2,
      },
      {
        title: "A Peaceful Space",
        description: "Choose gifts that help create a calming atmosphere.",
        icon: Sparkles,
      },
    ],

    guidance:
      "Soft neutral flowers, greenery, and subtle candle scents work especially well for a peaceful gift. Keep the colors and arrangement simple and calming.",
  },

  /* =====================================================
     12. HOPE
  ===================================================== */

  hope: {
    name: "Hope",
    eyebrow: "Light & Positivity",

    title: (
      <>
        A Little Hope
        <br />
        for Brighter Days
      </>
    ),

    description:
      "Send warmth and positivity with thoughtful gifts chosen to remind someone that brighter moments can be ahead.",

    heroImage: loveHero,
    guidanceImage: loveGuidance,
    finderImage: loveGiftFinder,

    meaningTitle: "What Does Hope Mean?",

    meaningDescription:
      "Hope is about looking forward with courage, positivity, and the belief that even difficult moments can lead to something brighter.",

    meanings: [
      {
        title: "Look Forward",
        description: "Offer a gentle reminder of brighter days ahead.",
        icon: Sunrise,
      },
      {
        title: "Share Positivity",
        description: "Bring warmth and optimism to their day.",
        icon: Sun,
      },
      {
        title: "Keep Going",
        description: "Remind them that small steps still move forward.",
        icon: Sprout,
      },
    ],

    guidance:
      "Fresh flowers in warm, uplifting colors can symbolize new beginnings and positivity. Pair them with a simple message that feels hopeful and genuine.",
  },
};

/* =====================================================
   PAGE
===================================================== */

function EmotionShop() {
  const navigate = useNavigate();
  const { emotionId } = useParams();

  const [activeCategory, setActiveCategory] = useState("All");

  const [sortBy, setSortBy] = useState("recommended");

  const emotion = emotionPages[emotionId];

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Emotion Shop could not load products:", error);
      }
    };

    loadProducts();
  }, []);

  /* =====================================================
     FILTER + SORT PRODUCTS
  ===================================================== */

  const emotionProducts = useMemo(() => {
    if (!emotion) return [];

    let result = products.filter((product) => {
      if (!product.emotion) {
        return false;
      }

      const productEmotions = Array.isArray(product.emotion)
        ? product.emotion
        : [product.emotion];

      return productEmotions.some(
        (item) => String(item).toLowerCase() === emotion.name.toLowerCase(),
      );
    });

    if (activeCategory !== "All") {
      result = result.filter((product) => product.category === activeCategory);
    }

    if (sortBy === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price);
    }

    if (sortBy === "price-high") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    if (sortBy === "popular") {
      result = [...result].sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
    }

    return result;
  }, [products, emotion, activeCategory, sortBy]);

  /* =====================================================
     EMOTION NOT FOUND
  ===================================================== */

  if (!emotion) {
    return (
      <main className="emotion-detail-page">
        <div className="emotion-detail-not-found">
          <Heart />

          <h1>Emotion not found</h1>

          <p>This emotion page is still being prepared.</p>

          <button type="button" onClick={() => navigate("/emotion")}>
            Back to Emotions
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="emotion-detail-page">
      {/* =================================================
          BREADCRUMB
      ================================================= */}

      <div className="emotion-detail-breadcrumb-wrap">
        <div className="emotion-detail-breadcrumb">
          <button type="button" onClick={() => navigate("/")}>
            Home
          </button>

          <span>/</span>

          <button type="button" onClick={() => navigate("/emotion")}>
            Shop by Emotion
          </button>

          <span>/</span>

          <strong>{emotion.name}</strong>
        </div>
      </div>

      {/* =================================================
          HERO
      ================================================= */}

      <section className="emotion-detail-hero">
        <div className="emotion-detail-hero-copy">
          <span className="emotion-detail-eyebrow">{emotion.eyebrow}</span>

          <h1>{emotion.title}</h1>

          <p>{emotion.description}</p>

          <button
            type="button"
            className="emotion-detail-explore-btn"
            onClick={() =>
              document.getElementById("emotion-products")?.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            Explore {emotion.name} Gifts
            <ArrowRight />
          </button>
        </div>

        <div className="emotion-detail-hero-image-wrap">
          <img
            src={emotion.heroImage}
            alt={`${emotion.name} gifts`}
            className="emotion-detail-hero-image"
          />

          <span
            className="
              emotion-detail-petal
              emotion-detail-petal-one
            "
          />

          <span
            className="
              emotion-detail-petal
              emotion-detail-petal-two
            "
          />
        </div>
      </section>

      {/* =================================================
          EMOTION MEANING
      ================================================= */}

      <section className="emotion-detail-meaning">
        <div className="emotion-detail-section-heading">
          <span>Gifts with meaning</span>

          <h2>{emotion.meaningTitle}</h2>

          <div className="emotion-detail-heading-line" />

          <p>{emotion.meaningDescription}</p>
        </div>

        <div className="emotion-detail-meaning-grid">
          {emotion.meanings.map((item) => {
            const Icon = item.icon;

            return (
              <article className="emotion-detail-meaning-item" key={item.title}>
                <div className="emotion-detail-meaning-icon">
                  <Icon />
                </div>

                <h3>{item.title}</h3>

                <p>{item.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* =================================================
          PRODUCTS
      ================================================= */}

      <section className="emotion-detail-products" id="emotion-products">
        <div className="emotion-detail-section-heading">
          <span>Chosen for the feeling</span>

          <h2>Thoughtfully Chosen for {emotion.name}</h2>

          <div className="emotion-detail-heading-line" />

          <p>
            Explore thoughtful gifts that beautifully express{" "}
            {emotion.name.toLowerCase()}.
          </p>
        </div>

        <div className="emotion-detail-product-tools">
          <div className="emotion-detail-category-tabs">
            {["All", "Flowers", "Candles", "Gift Sets"].map((category) => (
              <button
                type="button"
                key={category}
                className={activeCategory === category ? "active" : ""}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <select
            className="emotion-detail-sort"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="recommended">Recommended</option>

            <option value="popular">Most Popular</option>

            <option value="price-low">Price: Low to High</option>

            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {emotionProducts.length > 0 ? (
          <div className="emotion-detail-product-grid">
            {emotionProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className="emotion-detail-empty">
            <Flower2 />

            <h3>No gifts found here yet</h3>

            <p>Try another category to discover more thoughtful gifts.</p>
          </div>
        )}
      </section>

      {/* =================================================
          PETALIA GUIDANCE
          IMAGE LEFT / TEXT RIGHT
      ================================================= */}

      <section className="emotion-detail-guidance">
        <div className="emotion-detail-guidance-image-wrap">
          <img
            src={emotion.guidanceImage}
            alt={`${emotion.name} gift guidance`}
            className="emotion-detail-guidance-image"
          />
        </div>

        <div className="emotion-detail-guidance-copy">
          <span>The Petalia Way</span>

          <h2>A Little Petalia Guidance</h2>

          <div className="emotion-detail-guidance-line" />

          <p>{emotion.guidance}</p>

          <button type="button" onClick={() => navigate("/petalia-tips")}>
            Explore Petalia Tips
            <ArrowRight />
          </button>
        </div>
      </section>

      {/* =================================================
          GIFT FINDER
          TEXT LEFT / IMAGE RIGHT
      ================================================= */}

      <section className="emotion-detail-finder">
        <div className="emotion-detail-finder-copy">
          <span>Need a little more help?</span>

          <h2>Still not sure what feels right?</h2>

          <p>
            Tell Petalia a little more about the person and moment, and we'll
            help you find the perfect gift.
          </p>

          <button type="button" onClick={() => navigate("/gift-finder")}>
            Try Gift Finder
            <ArrowRight />
          </button>
        </div>

        <div className="emotion-detail-finder-image-wrap">
          <img
            src={emotion.finderImage}
            alt={`Thoughtful ${emotion.name.toLowerCase()} gift`}
            className="emotion-detail-finder-image"
          />
        </div>
      </section>
    </main>
  );
}

export default EmotionShop;
