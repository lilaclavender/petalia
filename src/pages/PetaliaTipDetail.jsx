import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Flower2,
  Heart,
  Sparkles,
  Sun,
} from "lucide-react";

import "../styles/PetaliaTipDetail.css";

import tipsCandleGuide from "../assets/tips-candle-guide.png";
import tipsGiftGiving from "../assets/tips-gift-giving.png";
import tipsFeatured from "../assets/tips-featured.png";
import FlowerMeaning from "../assets/flower-meaning.png";
import catalogImages from "../data/catalogProductImages";
import flowersData from "../data/flowersData";

function PetaliaTipDetail() {
  const navigate = useNavigate();
  const { tipId } = useParams();

  const [showAllFlowers, setShowAllFlowers] = useState(false);

  // =====================================================
  // FLOWER DATA
  // =====================================================

  const flowers = [
    {
      id: "rose",
      name: "Rose",
      meaning: "Love & Affection",
      description:
        "A timeless flower whose message can change beautifully with its color.",
      icon: Heart,
    },
    {
      id: "tulip",
      name: "Tulip",
      meaning: "Care & Warmth",
      description:
        "A graceful bloom often used to express affection, warmth, and thoughtful care.",
      icon: Flower2,
    },
    {
      id: "lily",
      name: "Lily",
      meaning: "Care & Sincerity",
      description:
        "An elegant flower connected with sincerity, care, and thoughtful feelings.",
      icon: Sparkles,
    },
    {
      id: "sunflower",
      name: "Sunflower",
      meaning: "Joy & Positivity",
      description:
        "A bright bloom often associated with happiness, warmth, and positive energy.",
      icon: Sun,
    },
    {
      id: "orchid",
      name: "Orchid",
      meaning: "Beauty & Admiration",
      description:
        "An elegant flower with meanings that can vary beautifully across its colors.",
      icon: Flower2,
    },
    {
      id: "carnation",
      name: "Carnation",
      meaning: "Love & Appreciation",
      description:
        "A thoughtful flower whose message can change depending on its color.",
      icon: Flower2,
    },
    {
      id: "hydrangea",
      name: "Hydrangea",
      meaning: "Heartfelt Emotion",
      description:
        "A full, graceful bloom with meanings that can vary across its colors.",
      icon: Flower2,
    },
    {
      id: "babys-breath",
      name: "Baby's Breath",
      meaning: "Purity & Lasting Love",
      description:
        "Delicate blooms often used to add a gentle and meaningful touch.",
      icon: Sparkles,
    },
    {
      id: "chrysanthemum",
      name: "Chrysanthemum",
      meaning: "Joy & Friendship",
      description:
        "A meaningful flower whose symbolism can change across different colors.",
      icon: Flower2,
    },
    {
      id: "gerbera-daisy",
      name: "Gerbera Daisy",
      meaning: "Cheerfulness & Joy",
      description:
        "A colorful flower known for its bright and cheerful character.",
      icon: Sun,
    },
    {
      id: "daisy",
      name: "Daisy",
      meaning: "Gentleness & Joy",
      description:
        "A simple and cheerful bloom with a soft and sincere character.",
      icon: Flower2,
    },
    {
      id: "lisianthus",
      name: "Lisianthus",
      meaning: "Appreciation & Grace",
      description: "A graceful bloom suited to thoughtful and heartfelt gifts.",
      icon: Flower2,
    },
    {
      id: "peony",
      name: "Peony",
      meaning: "Love & Happiness",
      description:
        "A lush bloom often connected with affection and meaningful celebrations.",
      icon: Heart,
    },
    {
      id: "ranunculus",
      name: "Ranunculus",
      meaning: "Charm & Affection",
      description:
        "A delicate layered flower with a charming and expressive appearance.",
      icon: Flower2,
    },
    {
      id: "dahlia",
      name: "Dahlia",
      meaning: "Grace & Strength",
      description:
        "A striking flower with rich colors and varied symbolic meanings.",
      icon: Flower2,
    },
    {
      id: "calla-lily",
      name: "Calla Lily",
      meaning: "Elegance & Grace",
      description:
        "An elegant bloom known for its graceful form and meaningful symbolism.",
      icon: Sparkles,
    },
    {
      id: "freesia",
      name: "Freesia",
      meaning: "Friendship & Thoughtfulness",
      description:
        "A delicate flower often suited to warm and thoughtful messages.",
      icon: Flower2,
    },
    {
      id: "iris",
      name: "Iris",
      meaning: "Hope & Wisdom",
      description:
        "A distinctive flower associated with thoughtful and uplifting messages.",
      icon: Flower2,
    },
    {
      id: "jasmine",
      name: "Jasmine",
      meaning: "Love & Beauty",
      description:
        "A delicate flower with a soft, graceful character and meaningful symbolism.",
      icon: Flower2,
    },
    {
      id: "lotus",
      name: "Lotus",
      meaning: "Purity & Renewal",
      description:
        "A symbolic bloom often connected with purity, renewal, and reflection.",
      icon: Flower2,
    },
    {
      id: "lavender",
      name: "Lavender",
      meaning: "Calm & Grace",
      description:
        "A gentle flower with a soft appearance and a calm, thoughtful character.",
      icon: Flower2,
    },
    {
      id: "daffodil",
      name: "Daffodil",
      meaning: "Hope & New Beginnings",
      description:
        "A bright bloom often connected with uplifting messages and fresh beginnings.",
      icon: Sun,
    },
    {
      id: "anemone",
      name: "Anemone",
      meaning: "Hope & Affection",
      description:
        "An expressive flower whose symbolism can change across its colors.",
      icon: Flower2,
    },
    {
      id: "sweet-pea",
      name: "Sweet Pea",
      meaning: "Gratitude & Good Wishes",
      description:
        "A delicate bloom suited to appreciative and thoughtful messages.",
      icon: Flower2,
    },
  ];

  const flowerPhotos = {
    rose: catalogImages.pinkRose,
    tulip: catalogImages.pinkTulip,
    lily: catalogImages.pinkLily,
    sunflower: catalogImages.sunflower,
    orchid: catalogImages.purpleOrchid,
    "gerbera-daisy": catalogImages.gerbera,
    "babys-breath": catalogImages.roseBreath,
    jasmine: catalogImages.jasmine,
    lotus: catalogImages.lotus,
  };

  const availableFlowers = flowers
    .filter((flower) => flowerPhotos[flower.id] && flowersData[flower.id])
    .map((flower) => ({
      ...flower,
      image: flowerPhotos[flower.id],
    }));

  const visibleFlowers = showAllFlowers
    ? availableFlowers
    : availableFlowers.slice(0, 8);

  // =====================================================
  // FEATURED ARTICLE DATA
  // =====================================================

  const articleGuides = {
    "how-to-choose-a-personal-gift": {
      category: "THE ART OF GIFTING",
      title: "How to Choose a Gift That Feels Personal",
      intro:
        "A thoughtful gift does not have to be complicated. The best choices often come from paying attention to the person, your relationship, and the moment you are celebrating.",
      image: tipsFeatured,
      imageAlt: "Thoughtfully arranged personal gift",

      tips: [
        {
          number: "01",
          title: "Think About Their Personality",
          description:
            "Consider what they enjoy, their style, favorite colors, interests, and the little things that make them happy.",
        },
        {
          number: "02",
          title: "Consider Your Relationship",
          description:
            "A gift for a partner can feel different from a gift for a friend, teacher, colleague, or family member.",
        },
        {
          number: "03",
          title: "Match the Moment",
          description:
            "Think about why you are giving the gift. A celebration, thank-you, apology, or comforting moment can guide your choice.",
        },
        {
          number: "04",
          title: "Choose a Feeling",
          description:
            "Decide what you want the gift to express, such as love, gratitude, happiness, encouragement, or care.",
        },
        {
          number: "05",
          title: "Add Something Personal",
          description:
            "A favorite flower, meaningful candle scent, or handwritten message can make a simple gift feel especially thoughtful.",
        },
      ],

      reminderTitle: "Personal does not have to mean complicated.",

      reminderText:
        "A small detail that shows you understand someone can make a gift more meaningful than its price.",
    },

    "flowers-for-different-emotions": {
      category: "FLOWER MEANINGS",
      title: "Flowers for Different Emotions",

      intro:
        "Flowers can communicate feelings in a gentle way. Choosing blooms by emotion can help your gift say something meaningful even before the message card is opened.",

      image: FlowerMeaning,
      imageAlt: "Flowers and flower meaning guide",

      tips: [
        {
          number: "LOVE",
          title: "Rose",
          description: "Roses are a classic expression of love and affection.",
        },
        {
          number: "JOY",
          title: "Sunflower",
          description:
            "Bright sunflowers can express happiness, positivity, and warmth.",
        },
        {
          number: "GRATITUDE",
          title: "Hydrangea",
          description:
            "Hydrangeas can express heartfelt appreciation and gratitude.",
        },
        {
          number: "COMFORT",
          title: "Lavender",
          description:
            "Lavender is associated with calm, peace, care, and comfort.",
        },
        {
          number: "ENCOURAGEMENT",
          title: "Tulip",
          description:
            "Tulips feel warm and hopeful and can be a lovely way to show support.",
        },
        {
          number: "PEACE",
          title: "Lily",
          description: "Lilies can express peace, sincerity, and gentle care.",
        },
        {
          number: "HOPE",
          title: "Daffodil",
          description:
            "Daffodils are often connected with hope and new beginnings.",
        },
        {
          number: "THINKING OF YOU",
          title: "Baby's Breath",
          description:
            "Baby's Breath has a soft feeling that works beautifully for thoughtful moments.",
        },
      ],

      reminderTitle: "There is no single perfect flower.",

      reminderText:
        "Meaning can come from the flower, its color, the occasion, and most importantly, the thought behind your choice.",
    },

    "choosing-a-candle-by-mood": {
      category: "CANDLE GUIDE",
      title: "Choosing a Candle by Mood",

      intro:
        "A candle can do more than add fragrance to a room. The right scent can help create an atmosphere that feels calm, cheerful, romantic, warm, or comforting.",

      image: tipsCandleGuide,
      imageAlt: "Candles arranged for different moods",

      tips: [
        {
          number: "CALM",
          title: "Lavender",
          description:
            "Soft lavender works well for quiet evenings, relaxation, self-care, and peaceful moments.",
        },
        {
          number: "ROMANTIC",
          title: "Floral",
          description:
            "Rose, jasmine, and other floral notes can create a soft and romantic atmosphere.",
        },
        {
          number: "COZY",
          title: "Vanilla",
          description:
            "Vanilla feels warm and familiar, making it a comforting choice for relaxing at home.",
        },
        {
          number: "CHEERFUL",
          title: "Citrus",
          description: "Fresh citrus scents feel bright and energetic.",
        },
        {
          number: "ELEGANT",
          title: "Woody",
          description:
            "Woody notes create a warm, grounded, and sophisticated atmosphere.",
        },
      ],

      reminderTitle: "Think about where the candle will be enjoyed.",

      reminderText:
        "A relaxing bedroom scent may be different from a bright workspace scent or a warm fragrance for a cozy evening.",
    },

    "what-to-write-in-a-gift-card": {
      category: "MESSAGE CARDS",
      title: "What to Write in a Gift Card",

      intro:
        "A message card does not need to be long or perfectly written. A few sincere words can make a gift feel much more personal.",

      image: tipsGiftGiving,
      imageAlt: "Gift with a thoughtful message card",

      tips: [
        {
          number: "01",
          title: "Notice the Little Things",
          description:
            "Think about their favorite colors, scents, flowers, hobbies, or something they mention often.",
        },
        {
          number: "02",
          title: "Choose Something That Feels Like Them",
          description:
            "Instead of choosing what is simply popular, look for something that matches their personality.",
        },
        {
          number: "03",
          title: "Connect It to a Memory",
          description:
            "A shared memory, inside joke, favorite place, or meaningful moment can inspire the gift.",
        },
        {
          number: "04",
          title: "Add One Personal Detail",
          description:
            "Choose their favorite flower, a scent they love, or a small add-on that makes the gift feel intentional.",
        },
        {
          number: "05",
          title: "Write Something From You",
          description:
            "A short personal message can make even a simple gift feel much more meaningful.",
        },
      ],

      reminderTitle:
        "Personal does not have to mean complicated.",

      reminderText:
        "One thoughtful detail can make a simple gift feel made just for them.",
    },
  };

  const currentArticle = articleGuides[tipId];

  /// =====================================================
  // CANDLE GUIDE
  // HERO -> SCENTS -> TIPS -> CTA
  // =====================================================

  if (tipId === "candle-guide") {
    const candleScents = [
      {
        name: "Floral",
        mood: "Soft & Romantic",
        description:
          "Rose, jasmine, and other floral scents create a gentle and romantic atmosphere.",
        icon: Flower2,
      },
      {
        name: "Lavender",
        mood: "Calm & Relaxing",
        description:
          "A peaceful scent for quiet moments, rest, and self-care.",
        icon: Sparkles,
      },
      {
        name: "Vanilla",
        mood: "Warm & Comforting",
        description:
          "A familiar scent that makes a space feel cozy and welcoming.",
        icon: Heart,
      },
      {
        name: "Citrus",
        mood: "Fresh & Cheerful",
        description:
          "Bright citrus scents bring a fresh and uplifting feeling.",
        icon: Sun,
      },
      {
        name: "Woody",
        mood: "Cozy & Elegant",
        description:
          "Warm woody notes create a grounded and sophisticated atmosphere.",
        icon: Sparkles,
      },
      {
        name: "Fruity",
        mood: "Sweet & Playful",
        description:
          "Sweet fruity scents feel cheerful and lighthearted.",
        icon: Heart,
      },
    ];

    const scentTips = [
      {
        title: "For a Relaxing Gift",
        text: "Choose softer scents like lavender for a calm and peaceful feeling.",
      },
      {
        title: "For a Celebration",
        text: "Try fresh citrus or fruity scents for something bright and cheerful.",
      },
      {
        title: "For a Romantic Moment",
        text: "Floral and rose scents create a soft and meaningful atmosphere.",
      },
    ];

    return (
      <main className="petalia-tip-detail-page">

        {/* BREADCRUMB */}
        <div className="tip-detail-breadcrumb-wrap">
          <div className="tip-detail-breadcrumb">
            <button
              type="button"
              onClick={() => navigate("/")}
            >
              Home
            </button>

            <span>/</span>

            <button
              type="button"
              onClick={() => navigate("/petalia-tips")}
            >
              Petalia Tips
            </button>

            <span>/</span>

            <strong>Candle Guide</strong>
          </div>
        </div>

        {/* HERO */}
        <section className="tip-detail-hero">
          <div className="tip-detail-hero-content">
            <p className="tip-detail-eyebrow">
              CANDLE GUIDE
            </p>

            <h1>
              Find a Scent That
              <br />
              Fits the Moment
            </h1>

            <p className="tip-detail-hero-description">
              Different scents can create different feelings.
              Choose one that matches the mood you want your
              gift to bring.
            </p>

            <button
              type="button"
              className="tip-detail-primary-btn"
              onClick={() =>
                document
                  .getElementById("candle-scents")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
            >
              Find Your Scent
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="tip-candle-hero-image">
            <img
              src={tipsCandleGuide}
              alt="Petalia candle scent guide"
            />
          </div>
        </section>

        {/* CHOOSE BY SCENT */}
        <section
          className="tip-detail-section tip-candle-guide"
          id="candle-scents"
        >
          <div className="tip-detail-section-heading">
            <p className="tip-detail-eyebrow">
              CHOOSE BY SCENT
            </p>

            <h2>
              Every scent creates a different feeling.
            </h2>

            <p>
              Start with the atmosphere you want the gift
              to create.
            </p>
          </div>

          <div className="tip-candle-grid">
            {candleScents.map((scent) => {
              const Icon = scent.icon;

              return (
                <article
                  className="tip-candle-card"
                  key={scent.name}
                  onClick={() => navigate("/shop?category=candles")}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      navigate("/shop?category=candles");
                    }
                  }}
                >
                  <div className="tip-candle-icon">
                    <Icon
                      size={20}
                      strokeWidth={1.6}
                    />
                  </div>

                  <p className="tip-candle-name">
                    {scent.name}
                  </p>

                  <h3>{scent.mood}</h3>

                  <p className="tip-candle-description">
                    {scent.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        {/* LITTLE SCENT TIPS */}
        <section className="tip-detail-section tip-candle-mood-section">
          <div className="tip-detail-section-heading">
            <p className="tip-detail-eyebrow">
              A LITTLE SCENT TIP
            </p>

            <h2>
              A few simple ways to choose.
            </h2>

            <p>
              Match the scent to the kind of moment
              you want to create.
            </p>
          </div>

          <div className="tip-candle-mood-grid">
            {scentTips.map((tip) => (
              <article
                className="tip-candle-mood-card"
                key={tip.title}
              >
                <h3>{tip.title}</h3>
                <p>{tip.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="tip-flower-cta">
          <div>
            <p className="tip-detail-eyebrow">
              FROM SCENT TO GIFT
            </p>

            <h2>
              Ready to turn the mood into a gift?
            </h2>

            <p>
              Explore Petalia candles or use the Gift Finder
              to find something thoughtful for the moment.
            </p>
          </div>

          <div className="tip-flower-cta-actions">
            <button
              type="button"
              onClick={() => navigate("/shop")}
            >
              Explore Candles
              <ArrowRight size={15} />
            </button>

            <button
              type="button"
              onClick={() => navigate("/gift-finder")}
            >
              Try Gift Finder
            </button>
          </div>
        </section>
      </main>
    );
  }

  // =====================================================
  // GIFT GIVING
  // Cleaner flow:
  // HERO -> 6 STEPS -> INSPIRATION -> CTA
  // =====================================================

  if (tipId === "gift-giving") {
    const giftSteps = [
      {
        number: "01",
        title: "Think About the Person",
        description:
          "Think about their personality, interests, favorite things, and what usually makes them happy.",
      },
      {
        number: "02",
        title: "Think About the Moment",
        description:
          "A birthday, anniversary, graduation, thank-you, or simple surprise can guide your choice.",
      },
      {
        number: "03",
        title: "Choose the Feeling",
        description:
          "Decide whether you want to express love, gratitude, comfort, celebration, or encouragement.",
      },
      {
        number: "04",
        title: "Keep Your Budget in Mind",
        description:
          "A meaningful gift does not need to be expensive. Thoughtfulness matters more than price.",
      },
      {
        number: "05",
        title: "Add a Personal Touch",
        description:
          "A message card, favorite flower, candle scent, or small add-on can make the gift feel personal.",
      },
      {
        number: "06",
        title: "Make the Presentation Special",
        description:
          "Thoughtful wrapping and a small message can make receiving the gift part of the experience.",
      },
    ];

    const giftIdeas = [
      {
        title: "For Someone You Love",
        description:
          "Flowers, a romantic candle, or a curated gift set can create a warm and personal gift.",
        icon: Heart,
      },
      {
        title: "For a Celebration",
        description:
          "Bright flowers and cheerful gift sets work beautifully for birthdays, graduations, and congratulations.",
        icon: Sparkles,
      },
      {
        title: "For Comfort & Care",
        description:
          "Soft flowers, calming candles, and a thoughtful message can gently show your support.",
        icon: Flower2,
      },
    ];

    return (
      <main className="petalia-tip-detail-page">
        <div className="tip-detail-breadcrumb-wrap">
          <div className="tip-detail-breadcrumb">
            <button type="button" onClick={() => navigate("/")}>
              Home
            </button>

            <span>/</span>

            <button type="button" onClick={() => navigate("/petalia-tips")}>
              Petalia Tips
            </button>

            <span>/</span>

            <strong>Gift Giving</strong>
          </div>
        </div>

        {/* HERO */}
        <section className="tip-detail-hero">
          <div className="tip-detail-hero-content">
            <p className="tip-detail-eyebrow">GIFT GIVING</p>

            <h1>
              Choose a Gift
              <br />
              That Feels Meaningful
            </h1>

            <p className="tip-detail-hero-description">
              Choose something that reflects the person, the moment, and the
              feeling you want to express.
            </p>

            <button
              type="button"
              className="tip-detail-primary-btn"
              onClick={() =>
                document.getElementById("gift-giving-steps")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            >
              Explore the Guide
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="tip-gift-hero-image">
            <img
              src={tipsGiftGiving}
              alt="Thoughtfully prepared Petalia gift"
            />
          </div>
        </section>

        {/* 6 STEPS */}
        <section
          className="tip-detail-section tip-gift-guide"
          id="gift-giving-steps"
        >
          <div className="tip-detail-section-heading">
            <p className="tip-detail-eyebrow">SIMPLE GIFTING GUIDE</p>

            <h2>Six little things to think about.</h2>

            <p>Use these ideas when you are unsure where to start.</p>
          </div>

          <div className="tip-gift-step-grid">
            {giftSteps.map((step) => (
              <article className="tip-gift-step-card" key={step.number}>
                <span className="tip-gift-step-number">{step.number}</span>

                <h3>{step.title}</h3>

                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* INSPIRATION */}
        <section className="tip-detail-section tip-gift-ideas-section">
          <div className="tip-detail-section-heading">
            <p className="tip-detail-eyebrow">A LITTLE INSPIRATION</p>

            <h2>A few ideas for different moments.</h2>
          </div>

          <div className="tip-gift-ideas-grid">
            {giftIdeas.map((idea) => {
              const Icon = idea.icon;

              return (
                <article className="tip-gift-idea-card" key={idea.title}>
                  <div className="tip-gift-idea-icon">
                    <Icon size={20} strokeWidth={1.6} />
                  </div>

                  <h3>{idea.title}</h3>

                  <p>{idea.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="tip-flower-cta">
          <div>
            <p className="tip-detail-eyebrow">NEED A LITTLE HELP?</p>

            <h2>Let Petalia help you find the right gift.</h2>

            <p>
              Use the Gift Finder to narrow down your choices by person,
              occasion, feeling, and budget.
            </p>
          </div>

          <div className="tip-flower-cta-actions">
            <button type="button" onClick={() => navigate("/gift-finder")}>
              Try Gift Finder
              <ArrowRight size={15} />
            </button>

            <button type="button" onClick={() => navigate("/shop")}>
              Explore Gifts
            </button>
          </div>
        </section>
      </main>
    );
  }

  // =====================================================
  // FEATURED ARTICLE PAGES
  // =====================================================

  if (currentArticle) {
    return (
      <main className="petalia-tip-detail-page">
        <div className="tip-detail-breadcrumb-wrap">
          <div className="tip-detail-breadcrumb">
            <button type="button" onClick={() => navigate("/")}>
              Home
            </button>

            <span>/</span>

            <button type="button" onClick={() => navigate("/petalia-tips")}>
              Petalia Tips
            </button>

            <span>/</span>

            <strong>{currentArticle.title}</strong>
          </div>
        </div>

        {/* HERO */}
        <section className="tip-article-hero">
          <div className="tip-article-hero-image">
            <img src={currentArticle.image} alt={currentArticle.imageAlt} />
          </div>

          <div className="tip-article-hero-content">
            <p className="tip-detail-eyebrow">{currentArticle.category}</p>

            <h1>{currentArticle.title}</h1>

            <p>{currentArticle.intro}</p>

            <button
              type="button"
              className="tip-detail-primary-btn"
              onClick={() =>
                document.getElementById("article-guide")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            >
              Read the Guide
              <ArrowRight size={15} />
            </button>
          </div>
        </section>

        {/* ACTUAL GUIDE */}
        <section
          className="tip-detail-section tip-article-guide"
          id="article-guide"
        >
          <div className="tip-article-list">
            {currentArticle.tips.map((tip) => (
              <article
                className="tip-article-row"
                key={`${tip.number}-${tip.title}`}
              >
                <div className="tip-article-number">{tip.number}</div>

                <div className="tip-article-row-content">
                  <h3>{tip.title}</h3>
                  <p>{tip.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* SMALL REMINDER */}
        <section className="tip-article-reminder">
          <div className="tip-article-reminder-icon">
            <Heart size={21} strokeWidth={1.5} />
          </div>

          <p className="tip-detail-eyebrow">A LITTLE PETALIA REMINDER</p>

          <h2>{currentArticle.reminderTitle}</h2>

          <p>{currentArticle.reminderText}</p>
        </section>

        {/* CTA */}
        <section className="tip-flower-cta">
          <div>
            <p className="tip-detail-eyebrow">FIND SOMETHING MEANINGFUL</p>

            <h2>Ready to turn the idea into a gift?</h2>

            <p>
              Explore thoughtful gifts or use the Gift Finder for
              recommendations that match the moment.
            </p>
          </div>

          <div className="tip-flower-cta-actions">
            <button type="button" onClick={() => navigate("/shop")}>
              Explore Gifts
              <ArrowRight size={15} />
            </button>

            <button type="button" onClick={() => navigate("/gift-finder")}>
              Try Gift Finder
            </button>
          </div>
        </section>
      </main>
    );
  }

  // =====================================================
  // FLOWER MEANINGS
  // Cleaner flow:
  // HERO -> FLOWER LIBRARY -> CTA
  // =====================================================

  if (tipId === "flower-meanings") {
    return (
      <main className="petalia-tip-detail-page">
        <div className="tip-detail-breadcrumb-wrap">
          <div className="tip-detail-breadcrumb">
            <button type="button" onClick={() => navigate("/")}>
              Home
            </button>

            <span>/</span>

            <button type="button" onClick={() => navigate("/petalia-tips")}>
              Petalia Tips
            </button>

            <span>/</span>

            <strong>Flower Meanings</strong>
          </div>
        </div>

        {/* HERO */}
        <section className="tip-detail-hero">
          <div className="tip-detail-hero-content">
            <p className="tip-detail-eyebrow">FLOWER MEANINGS</p>

            <h1>
              Flowers Speak in Their
              <br />
              Own Little Way
            </h1>

            <p className="tip-detail-hero-description">
              Discover what different flowers can express, from love and
              gratitude to comfort, happiness, and thoughtful care.
            </p>

            <button
              type="button"
              className="tip-detail-primary-btn"
              onClick={() =>
                document.getElementById("flower-library")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            >
              Explore Flower Meanings
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="tip-detail-hero-image">
            <img src={FlowerMeaning} alt="Petalia flower meanings" />
          </div>
        </section>

        {/* FLOWER LIBRARY */}
        <section
          className="tip-detail-section tip-flower-guide"
          id="flower-library"
        >
          <div className="tip-detail-section-heading">
            <p className="tip-detail-eyebrow">EXPLORE FLOWER MEANINGS</p>

            <h2>Every flower has something to say.</h2>

            <p>Browse the flowers and discover the feeling behind each one.</p>
          </div>

          <div className="tip-flower-grid">
            {visibleFlowers.map((flower) => {

              return (
                <article
                  className="tip-flower-card"
                  key={flower.id}
                  role="button"
                  tabIndex={0}
                  onClick={() =>
                    navigate(`/petalia-tips/flower-meanings/${flower.id}`)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();

                      navigate(`/petalia-tips/flower-meanings/${flower.id}`);
                    }
                  }}
                >
                  <div className="tip-flower-card-image">
                    <img
                      src={flower.image}
                      alt={
                        flower.id === "babys-breath"
                          ? "Pink roses arranged with white baby's breath"
                          : `${flower.name} featured in a bouquet or arrangement`
                      }
                      className="tip-flower-photo"
                      loading="lazy"
                    />

                    <div className="tip-flower-card-overlay" />

                    <div className="tip-flower-card-info">
                      <p className="tip-flower-name">{flower.name}</p>

                      <h3>{flower.meaning}</h3>

                      <p className="tip-flower-description">
                        {flower.description}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* VIEW MORE */}
          <div className="tip-explore-all-wrap">
            <button
              type="button"
              className="tip-explore-all-btn"
              onClick={() => setShowAllFlowers((current) => !current)}
            >
              {showAllFlowers ? (
                <>
                  Show Less
                  <ChevronUp size={15} />
                </>
              ) : (
                <>
                  View More Flowers
                  <ChevronDown size={15} />
                </>
              )}
            </button>

            <p className="tip-flower-count">
              Showing {visibleFlowers.length} of {availableFlowers.length} flowers
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="tip-flower-cta">
          <div>
            <p className="tip-detail-eyebrow">FROM MEANING TO GIFT</p>

            <h2>Found a flower that says what you mean?</h2>

            <p>
              Explore flower gifts or use the Gift Finder to find something that
              matches the story you want your gift to tell.
            </p>
          </div>

          <div className="tip-flower-cta-actions">
            <button type="button" onClick={() => navigate("/shop")}>
              Explore Flowers
              <ArrowRight size={15} />
            </button>

            <button type="button" onClick={() => navigate("/gift-finder")}>
              Try Gift Finder
            </button>
          </div>
        </section>
      </main>
    );
  }

  // =====================================================
  // FALLBACK
  // =====================================================

  return (
    <main className="petalia-tip-detail-page">
      <section className="tip-coming-soon">
        <button
          type="button"
          className="tip-back-btn"
          onClick={() => navigate("/petalia-tips")}
        >
          <ArrowLeft size={15} />
          Back to Petalia Tips
        </button>

        <p className="tip-detail-eyebrow">EXPLORE FLOWER MEANINGS</p>

        <h2>Find the flower that fits your message.</h2>

        <p>Browse each flower to discover the feeling and meaning behind it.</p>
      </section>
    </main>
  );
}

export default PetaliaTipDetail;
