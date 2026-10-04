import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Gift, Heart, Sparkles } from "lucide-react";

import ProductCard from "../components/ProductCard";
import { getProducts } from "../data/productService";

import birthdayHero from "../assets/birthday-hero.png";
import birthdayGuidance from "../assets/birthday-guidance.png";
import christmasGuidance from "../assets/christmas-guidance.png";

import "../styles/OccasionShop.css";

/* =====================================================
   OCCASION CONTENT
===================================================== */

const occasionPages = {
  birthday: {
    name: "Birthday",

    heroImage: birthdayHero,
    guidanceImage: birthdayGuidance,

    eyebrow: "BIRTHDAY CELEBRATION",

    title: (
      <>
        Make Their Birthday
        <br />
        Feel Extra Special
      </>
    ),

    description:
      "Celebrate their special day with thoughtful flowers, candles, and curated gifts that bring happiness to the moment.",

    meaningEyebrow: "A GIFT FOR THEIR DAY",

    meaningTitle: "What Makes a Birthday Gift Special?",

    meaningDescription:
      "It's more than just a present — it's a way to show you care, celebrate who they are, and make their day feel meaningful.",

    meanings: [
      {
        icon: Gift,
        title: "Thoughtful Choice",
        description: "Selected with care for what they'll love.",
      },
      {
        icon: Heart,
        title: "Personal Touch",
        description: "Add a personal message or a little detail.",
      },
      {
        icon: Sparkles,
        title: "Joyful Moment",
        description: "Make their special day even more memorable.",
      },
    ],

    productTitle: "Thoughtfully Chosen for Birthdays",

    guidanceTitle: "Not sure what feels right?",

    guidanceText:
      "Everyone is different. Explore our tips for meaningful gifting ideas, flower meanings, candle notes, and more — all made for moments like this.",
  },

  anniversary: {
    name: "Anniversary",

    eyebrow: "CELEBRATING TOGETHER",

    title: (
      <>
        Celebrate the Love
        <br />
        You Share
      </>
    ),

    description:
      "Mark meaningful milestones with flowers, candles, and thoughtful gifts chosen with love.",

    meaningEyebrow: "CELEBRATE THE CONNECTION",

    meaningTitle: "A Gift for the Memories You Share",

    meaningDescription:
      "Anniversary gifts can celebrate affection, shared memories, and the journey you continue together.",

    meanings: [
      {
        icon: Heart,
        title: "Shared Love",
        description:
          "Choose something that reflects the affection and connection between you.",
      },
      {
        icon: Sparkles,
        title: "Special Memories",
        description:
          "Celebrate the moments that have made your relationship meaningful.",
      },
      {
        icon: Gift,
        title: "Thoughtful Gesture",
        description:
          "A carefully chosen gift can make the milestone feel even more personal.",
      },
    ],

    productTitle: "Thoughtfully Chosen for Anniversaries",

    guidanceTitle: "Choose something that feels personal",

    guidanceText:
      "Think about your shared memories, their personality, and the feeling you want your anniversary gift to express.",
  },

  christmas: {
    name: "Christmas",

    guidanceImage: christmasGuidance,

    eyebrow: "CHRISTMAS GIFTING",

    title: (
      <>
        Share a Little Warmth
        <br />
        This Christmas
      </>
    ),

    description:
      "Celebrate the festive season with flowers, candles, and curated gifts made for warm and joyful moments.",

    meaningEyebrow: "THOUGHTFUL FESTIVE GIFTING",

    meaningTitle: "Make Christmas Feel a Little More Personal",

    meaningDescription:
      "A thoughtful Christmas gift is less about choosing something big and more about choosing something with care.",

    meanings: [
      {
        icon: Gift,
        title: "Festive Surprise",
        description:
          "Choose something that brings excitement and joy to their celebration.",
      },
      {
        icon: Heart,
        title: "Warm Connection",
        description:
          "Remind someone that they are remembered during the festive season.",
      },
      {
        icon: Sparkles,
        title: "Seasonal Joy",
        description:
          "Flowers, candles, and curated sets can make Christmas feel warmer.",
      },
    ],

    productTitle: "Thoughtfully Chosen for Christmas",

    guidanceTitle: "Not sure what to give this Christmas?",

    guidanceText:
      "Start with the person rather than the product. Think about what they enjoy and the kind of Christmas moment you want to create.",
  },

  graduation: {
    name: "Graduation",

    eyebrow: "CELEBRATE THEIR ACHIEVEMENT",

    title: (
      <>
        Celebrate How Far
        <br />
        They've Come
      </>
    ),

    description:
      "Recognize their hard work and exciting new beginning with a thoughtful gift chosen for the moment.",

    meaningEyebrow: "A PROUD MOMENT",

    meaningTitle: "A Gift for Their Next Chapter",

    meaningDescription:
      "Graduation gifts can celebrate achievement while showing encouragement for everything still ahead.",

    meanings: [
      {
        icon: Sparkles,
        title: "Achievement",
        description:
          "Celebrate the effort and dedication behind their accomplishment.",
      },
      {
        icon: Heart,
        title: "Encouragement",
        description:
          "Let them know you are proud and excited for what comes next.",
      },
      {
        icon: Gift,
        title: "New Beginning",
        description:
          "Choose something meaningful to mark the start of their next chapter.",
      },
    ],

    productTitle: "Thoughtfully Chosen for Graduation",

    guidanceTitle: "Celebrate the person behind the achievement",

    guidanceText:
      "Consider their personality, what they have accomplished, and the encouragement you want your gift to carry.",
  },

  wedding: {
    name: "Wedding",

    eyebrow: "A BEAUTIFUL NEW CHAPTER",

    title: (
      <>
        Celebrate Their
        <br />
        New Beginning
      </>
    ),

    description:
      "Send your warmest wishes with thoughtful gifts chosen to celebrate love and a new chapter together.",

    meaningEyebrow: "GIFTS WITH WARM WISHES",

    meaningTitle: "A Gift for Their New Chapter",

    meaningDescription:
      "Wedding gifts can express happiness, affection, and your warm wishes for the couple's future together.",

    meanings: [
      {
        icon: Heart,
        title: "Love",
        description:
          "Celebrate the connection and commitment at the heart of their special day.",
      },
      {
        icon: Gift,
        title: "Thoughtful Wishes",
        description:
          "Choose something that carries your congratulations in a meaningful way.",
      },
      {
        icon: Sparkles,
        title: "New Beginning",
        description:
          "Mark the start of their new chapter with something memorable and warm.",
      },
    ],

    productTitle: "Thoughtfully Chosen for Weddings",

    guidanceTitle: "Choose something for the couple",

    guidanceText:
      "Think about their style, relationship, and the feeling you want your gift to bring into their new chapter.",
  },

  congratulations: {
    name: "Congratulations",

    eyebrow: "CELEBRATE THEIR MOMENT",

    title: (
      <>
        Make Their Proud Moment
        <br />
        Feel Even More Special
      </>
    ),

    description:
      "Celebrate good news, achievements, and exciting milestones with a thoughtful gift.",

    meaningEyebrow: "SHARE THE EXCITEMENT",

    meaningTitle: "A Little Something to Say Well Done",

    meaningDescription:
      "A congratulations gift can recognize their achievement while sharing in the happiness of the moment.",

    meanings: [
      {
        icon: Sparkles,
        title: "Celebrate",
        description:
          "Make their achievement feel noticed and worth celebrating.",
      },
      {
        icon: Heart,
        title: "Show Support",
        description:
          "Let them know you are happy for them and proud of what they achieved.",
      },
      {
        icon: Gift,
        title: "Mark the Moment",
        description:
          "Choose something thoughtful that helps make the occasion memorable.",
      },
    ],

    productTitle: "Thoughtfully Chosen for Congratulations",

    guidanceTitle: "Match the gift to their achievement",

    guidanceText:
      "Think about what they are celebrating and whether the moment calls for something cheerful, meaningful, or simple.",
  },

  "new-baby": {
    name: "New Baby",

    eyebrow: "WELCOME A LITTLE ONE",

    title: (
      <>
        A Sweet Welcome
        <br />
        for a New Beginning
      </>
    ),

    description:
      "Celebrate the arrival of a little one with gentle and thoughtful gifts for a beautiful new chapter.",

    meaningEyebrow: "A GENTLE CELEBRATION",

    meaningTitle: "A Thoughtful Welcome for the Family",

    meaningDescription:
      "A new baby gift can celebrate the little one while also sending warmth and care to the family.",

    meanings: [
      {
        icon: Heart,
        title: "Warm Welcome",
        description:
          "Share your happiness and affection as the family welcomes someone new.",
      },
      {
        icon: Gift,
        title: "Thoughtful Care",
        description:
          "Choose something gentle and meaningful for this special family moment.",
      },
      {
        icon: Sparkles,
        title: "New Beginning",
        description:
          "Celebrate a beautiful new chapter with something sweet and memorable.",
      },
    ],

    productTitle: "Thoughtfully Chosen for a New Baby",

    guidanceTitle: "Keep the moment gentle and thoughtful",

    guidanceText:
      "Choose something that feels warm and appropriate for the family while keeping the new beginning at the heart of the gift.",
  },

  "just-because": {
    name: "Just Because",

    eyebrow: "NO SPECIAL REASON NEEDED",

    title: (
      <>
        Make an Ordinary Day
        <br />
        Feel a Little Special
      </>
    ),

    description:
      "Sometimes a thoughtful surprise means even more when there is no occasion at all.",

    meaningEyebrow: "A SIMPLE THOUGHTFUL GESTURE",

    meaningTitle: "The Best Gifts Don't Always Need a Reason",

    meaningDescription:
      "A just-because gift can remind someone that you are thinking of them without waiting for a special date.",

    meanings: [
      {
        icon: Heart,
        title: "Thinking of Them",
        description:
          "A small surprise can simply say that they were on your mind.",
      },
      {
        icon: Gift,
        title: "Unexpected Joy",
        description:
          "Make an ordinary day feel different with something they did not expect.",
      },
      {
        icon: Sparkles,
        title: "Simple Kindness",
        description:
          "Sometimes a thoughtful gesture is meaningful precisely because there is no reason.",
      },
    ],

    productTitle: "Thoughtfully Chosen, Just Because",

    guidanceTitle: "Don't overthink a just-because gift",

    guidanceText:
      "Choose something that reminds you of them or something you know would brighten their day.",
  },
};

/* =====================================================
   PAGE
===================================================== */

function OccasionShop() {
  const navigate = useNavigate();
  const { occasionId } = useParams();

  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("recommended");

  const occasion = occasionPages[occasionId];

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Occasion Shop could not load products:", error);
      }
    };

    loadProducts();
  }, []);

  /* =====================================================
     FILTER PRODUCTS
  ===================================================== */

  const filteredProducts = useMemo(() => {
    if (!occasion) {
      return [];
    }

    let result = products.filter((product) => {
      if (!product.occasion) {
        return false;
      }

      const productOccasions = Array.isArray(product.occasion)
        ? product.occasion
        : [product.occasion];

      return productOccasions.some(
        (item) => String(item).toLowerCase() === occasion.name.toLowerCase(),
      );
    });

    if (category !== "All") {
      result = result.filter((product) => product.category === category);
    }

    if (sortBy === "low-high") {
      result = [...result].sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sortBy === "high-low") {
      result = [...result].sort((a, b) => Number(b.price) - Number(a.price));
    }

    if (sortBy === "popular") {
      result = [...result].sort(
        (a, b) => Number(b.reviews || 0) - Number(a.reviews || 0),
      );
    }

    return result;
  }, [products, occasion, category, sortBy]);

  const categories = ["All", "Flowers", "Candles", "Gift Sets"];

  /* =====================================================
     UNKNOWN OCCASION
  ===================================================== */

  if (!occasion) {
    return (
      <main className="occasion-shop-page">
        <div className="occasion-shop-not-found">
          <h1>Occasion not found</h1>

          <button type="button" onClick={() => navigate("/occasion")}>
            Back to Occasions
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="occasion-shop-page">
      {/* =====================================================
          BREADCRUMB
      ===================================================== */}

      <div className="occasion-shop-breadcrumb-wrap">
        <div className="occasion-shop-breadcrumb">
          <button type="button" onClick={() => navigate("/")}>
            Home
          </button>

          <span>/</span>

          <button type="button" onClick={() => navigate("/occasion")}>
            Shop by Occasion
          </button>

          <span>/</span>

          <strong>{occasion.name}</strong>
        </div>
      </div>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="occasion-shop-hero">
        <span
          className="occasion-shop-hero-petal hero-petal-left"
          aria-hidden="true"
        />

        <span
          className="occasion-shop-hero-petal hero-petal-right"
          aria-hidden="true"
        />

        <div className="occasion-shop-hero-content">
          <p className="occasion-shop-eyebrow">{occasion.eyebrow}</p>

          <h1>{occasion.title}</h1>

          <p className="occasion-shop-hero-description">
            {occasion.description}
          </p>

          <button
            type="button"
            className="occasion-shop-primary-btn"
            onClick={() => {
              document.getElementById("occasion-products")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            Explore {occasion.name} Gifts
            <ArrowRight size={15} />
          </button>
        </div>

        <div className="occasion-shop-hero-art">
          {occasion.heroImage ? (
            <img
              src={occasion.heroImage}
              alt=""
              className="occasion-shop-hero-image"
            />
          ) : (
            <div className="occasion-shop-hero-placeholder">
              <span className="hero-placeholder-circle" />

              <Gift
                className="hero-placeholder-gift"
                size={74}
                strokeWidth={1.15}
              />

              <Sparkles
                className="hero-placeholder-sparkle"
                size={28}
                strokeWidth={1.2}
              />
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          MEANING
      ===================================================== */}

      <section className="occasion-shop-meaning">
        <div className="occasion-shop-section-heading">
          <p className="occasion-shop-section-eyebrow">
            {occasion.meaningEyebrow}
          </p>

          <h2>{occasion.meaningTitle}</h2>

          <p>{occasion.meaningDescription}</p>
        </div>

        <div className="occasion-shop-meaning-grid">
          {occasion.meanings.map((item) => {
            const Icon = item.icon;

            return (
              <article className="occasion-shop-meaning-item" key={item.title}>
                <div className="occasion-shop-meaning-icon">
                  <span
                    className="occasion-shop-icon-petal"
                    aria-hidden="true"
                  />

                  <Icon size={20} strokeWidth={1.5} />
                </div>

                <h3>{item.title}</h3>

                <p>{item.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          PRODUCTS
      ===================================================== */}

      <section className="occasion-shop-products" id="occasion-products">
        <div className="occasion-shop-products-top">
          <div>
            <p className="occasion-shop-section-eyebrow">
              MADE FOR THE CELEBRATION
            </p>

            <h2>{occasion.productTitle}</h2>
          </div>

          <select
            className="occasion-shop-sort"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            aria-label="Sort products"
          >
            <option value="recommended">Recommended</option>

            <option value="popular">Most Popular</option>

            <option value="low-high">Price: Low to High</option>

            <option value="high-low">Price: High to Low</option>
          </select>
        </div>

        <div className="occasion-shop-tabs">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={category === item ? "active" : ""}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="occasion-shop-product-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className="occasion-shop-empty-products">
            <Sparkles size={23} strokeWidth={1.4} />

            <h3>More {occasion.name} gifts are coming</h3>

            <p>Try another category or explore all Petalia gifts.</p>

            <button type="button" onClick={() => navigate("/shop")}>
              Explore All Gifts
            </button>
          </div>
        )}
      </section>

      {/* =====================================================
          PETALIA GUIDANCE
      ===================================================== */}

      <section className="occasion-shop-guidance">
        <div className="occasion-shop-guidance-art">
          {occasion.guidanceImage ? (
            <img
              src={occasion.guidanceImage}
              alt=""
              className="occasion-shop-guidance-image"
            />
          ) : (
            <div className="occasion-shop-guidance-placeholder">
              <Heart size={42} strokeWidth={1.15} />
            </div>
          )}
        </div>

        <div className="occasion-shop-guidance-content">
          <p className="occasion-shop-section-eyebrow">
            A LITTLE PETALIA GUIDANCE
          </p>

          <h2>{occasion.guidanceTitle}</h2>

          <p>{occasion.guidanceText}</p>

          <button type="button" onClick={() => navigate("/petalia-tips")}>
            Explore Petalia Tips
            <ArrowRight size={14} />
          </button>
        </div>

        <span
          className="occasion-guidance-petal guidance-petal-one"
          aria-hidden="true"
        />

        <span
          className="occasion-guidance-petal guidance-petal-two"
          aria-hidden="true"
        />
      </section>

      {/* =====================================================
          GIFT FINDER
      ===================================================== */}

      <section className="occasion-shop-finder">
        <span
          className="occasion-shop-finder-petal finder-petal-one"
          aria-hidden="true"
        />

        <span
          className="occasion-shop-finder-petal finder-petal-two"
          aria-hidden="true"
        />

        <p className="occasion-shop-section-eyebrow">NEED A LITTLE HELP?</p>

        <h2>Still not sure what to choose?</h2>

        <p>
          Tell us about the feeling, occasion, relationship, budget, and
          delivery time. We'll help narrow down gifts that fit the moment.
        </p>

        <button type="button" onClick={() => navigate("/gift-finder")}>
          Try Gift Finder
          <ArrowRight size={15} />
        </button>
      </section>
    </main>
  );
}

export default OccasionShop;
