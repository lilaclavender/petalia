import { useEffect,useMemo, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  Bookmark,
  Clock,
  MapPin,
  Star,
  Truck,
  Leaf,
  Contact,
} from "lucide-react";

import ProductCard from "../components/ProductCard";
import { supabase } from "../lib/supabase";
import productImages from "../data/productImages";
import lavenderCorner1 from "../assets/lavender-corner1.png";

import localShop1Img from "../assets/local-shop-1.jpg";
import localShop2Img from "../assets/local-shop-2.jpg";
import localShop3Img from "../assets/local-shop-3.jpg";
import localShop4Img from "../assets/local-shop-4.jpg";
import localShop5Img from "../assets/local-shop-5.jpg";
import localShop6Img from "../assets/local-shop-6.jpg";
import localShop7Img from "../assets/local-shop-7.jpg";
import localShop8Img from "../assets/local-shop-8.jpg";

import "../styles/LocalShopDetail.css";


/* =====================================================
   LOCAL SHOP DATA
===================================================== */

const localShops = [
  {
    id: 1,
    name: "Bloom & Co.",
    image: localShop1Img,
    location: "Phnom Penh",
    rating: 4.8,
    reviews: 120,

    specialties: [
      "Flowers",
      "Bouquets",
      "Gift Sets",
    ],

    productCategories: [
      "Flowers",
      "Gift Sets",
    ],

    description:
      "Fresh flowers, thoughtfully arranged for life's meaningful moments. At Bloom & Co., every flower tells a story.",

    about:
      "Bloom & Co. is a local flower studio in Phnom Penh, passionate about bringing natural beauty into everyday moments. From romantic bouquets to cheerful arrangements, every bloom is prepared with care.",

    quote:
      "Flowers aren't just gifts, they're little reminders that someone cares.",

    hours:
      "Mon – Sun, 8:00 AM – 7:00 PM",

    delivery:
      "Available via Petalia Delivery",

    supportTitle:
      "Supports Local Growers",

    supportText:
      "Sourcing seasonal flowers from Cambodian farms.",

    productIds: [
      1,
      2,
      3,
      4,
      11,
      12,
    ],
  },


  {
    id: 2,
    name: "Scent Studio",
    image: localShop2Img,
    location: "Phnom Penh",
    rating: 4.7,
    reviews: 98,

    specialties: [
      "Candles",
      "Home Fragrance",
      "Gift Sets",
    ],

    productCategories: [
      "Candles",
      "Gift Sets",
    ],

    description:
      "Warm scents and softly glowing candles created to bring comfort, calm, and meaning to thoughtful gifts.",

    about:
      "Scent Studio is a local candle maker in Phnom Penh creating comforting fragrances for everyday moments and meaningful celebrations. Each candle is selected to make gifting feel warm and personal.",

    quote:
      "A familiar scent can turn a simple moment into a memory.",

    hours:
      "Mon – Sat, 9:00 AM – 7:00 PM",

    delivery:
      "Available via Petalia Delivery",

    supportTitle:
      "Made Locally",

    supportText:
      "Thoughtfully prepared by a Cambodian local maker.",

    productIds: [
      6,
      7,
      8,
      9,
      10,
      13,
    ],
  },


  {
    id: 3,
    name: "Petal House",
    image: localShop3Img,
    location: "Siem Reap",
    rating: 4.9,
    reviews: 86,

    specialties: [
      "Flowers",
      "Bouquets",
      "Events",
    ],

    productCategories: [
      "Flowers",
    ],

    description:
      "Elegant flowers and expressive bouquets created for celebrations, appreciation, and heartfelt moments.",

    about:
      "Petal House brings together fresh flowers and thoughtful arrangements for meaningful occasions in Siem Reap. Their style is soft, elegant, and inspired by the emotions behind each gift.",

    quote:
      "Every bouquet begins with a feeling worth sharing.",

    hours:
      "Mon – Sun, 8:30 AM – 6:30 PM",

    delivery:
      "Available via Petalia Delivery",

    supportTitle:
      "Fresh Local Flowers",

    supportText:
      "Working with local suppliers whenever seasonal blooms are available.",

    productIds: [
      1,
      2,
      3,
      4,
      5,
    ],
  },


  {
    id: 4,
    name: "Candle Corner",
    image: localShop4Img,
    location: "Phnom Penh",
    rating: 4.5,
    reviews: 57,

    specialties: [
      "Candles",
      "Gift Sets",
      "Home Decor",
    ],

    productCategories: [
      "Candles",
      "Gift Sets",
    ],

    description:
      "Cozy candles and gentle fragrances made for peaceful homes, thoughtful gestures, and comforting gifts.",

    about:
      "Candle Corner creates simple scented candles and gift combinations designed to make everyday spaces feel warmer and more personal.",

    quote:
      "Sometimes a little light is the most thoughtful gift.",

    hours:
      "Mon – Sat, 9:00 AM – 6:30 PM",

    delivery:
      "Available via Petalia Delivery",

    supportTitle:
      "Small-Batch Craft",

    supportText:
      "Candles prepared in small batches by a local maker.",

    productIds: [
      6,
      7,
      8,
      9,
      10,
      14,
    ],
  },


  {
    id: 5,
    name: "The Flower Room",
    image: localShop5Img,
    location: "Battambang",
    rating: 4.7,
    reviews: 72,

    specialties: [
      "Flowers",
      "Bouquets",
      "Events",
    ],

    productCategories: [
      "Flowers",
    ],

    description:
      "Fresh floral arrangements with a gentle, natural style for birthdays, appreciation, and special occasions.",

    about:
      "The Flower Room is a Battambang florist focused on fresh flowers and carefully arranged bouquets for personal celebrations and meaningful gestures.",

    quote:
      "A thoughtful bloom can say what words sometimes cannot.",

    hours:
      "Mon – Sun, 8:00 AM – 6:00 PM",

    delivery:
      "Available via Petalia Delivery",

    supportTitle:
      "Local Florist",

    supportText:
      "Helping locally prepared flowers reach more meaningful moments.",

    productIds: [
      1,
      2,
      3,
      4,
      5,
    ],
  },


  {
    id: 6,
    name: "Bloom & Glow",
    image: localShop6Img,
    location: "Phnom Penh",
    rating: 4.8,
    reviews: 81,

    specialties: [
      "Flowers",
      "Candles",
      "Gift Sets",
    ],

    productCategories: [
      "Flowers",
      "Candles",
      "Gift Sets",
    ],

    description:
      "Flowers and candle pairings brought together for warm, personal, and beautifully balanced gifts.",

    about:
      "Bloom & Glow combines flowers and scented candles to create gifts that feel complete without becoming complicated. Their collections are designed around warmth, celebration, and care.",

    quote:
      "A beautiful gift can brighten more than one moment.",

    hours:
      "Mon – Sun, 9:00 AM – 7:00 PM",

    delivery:
      "Available via Petalia Delivery",

    supportTitle:
      "Thoughtfully Paired",

    supportText:
      "Combining products from local flower and candle makers.",

    productIds: [
      2,
      3,
      6,
      7,
      11,
      12,
      14,
    ],
  },


  {
    id: 7,
    name: "Leaf & Light",
    image: localShop7Img,
    location: "Phnom Penh",
    rating: 4.6,
    reviews: 64,

    specialties: [
      "Flowers",
      "Candles",
      "Keepsakes",
    ],

    productCategories: [
      "Flowers",
      "Candles",
      "Gift Sets",
    ],

    description:
      "Soft florals, calming candles, and thoughtful combinations inspired by simple and meaningful gifting.",

    about:
      "Leaf & Light focuses on gentle gifts with a natural feeling. Flowers and fragrances are chosen to help customers express comfort, appreciation, and care.",

    quote:
      "The quietest gifts can carry the warmest feelings.",

    hours:
      "Mon – Sat, 9:00 AM – 6:00 PM",

    delivery:
      "Available via Petalia Delivery",

    supportTitle:
      "Mindful Gifting",

    supportText:
      "Choosing simple products that feel personal and thoughtful.",

    productIds: [
      4,
      5,
      6,
      9,
      13,
      14,
    ],
  },


  {
    id: 8,
    name: "Mint & Petal",
    image: localShop8Img,
    location: "Sihanoukville",
    rating: 4.6,
    reviews: 51,

    specialties: [
      "Flowers",
      "Gift Sets",
      "Events",
    ],

    productCategories: [
      "Flowers",
      "Gift Sets",
    ],

    description:
      "Bright flowers and cheerful gift combinations created for celebrations and happy everyday surprises.",

    about:
      "Mint & Petal creates fresh and cheerful floral gifts in Sihanoukville. Their arrangements are made for birthdays, congratulations, and moments that deserve a little extra joy.",

    quote:
      "Small celebrations deserve beautiful memories too.",

    hours:
      "Mon – Sun, 8:30 AM – 6:30 PM",

    delivery:
      "Available via Petalia Delivery",

    supportTitle:
      "Created Close to Home",

    supportText:
      "Supporting local gifting and creative makers in Sihanoukville.",

    productIds: [
      2,
      3,
      4,
      11,
      12,
    ],
  },
];


function LocalShopDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  /* =====================================================
     LOCAL PRODUCT IMAGE FALLBACK
  ===================================================== */

  const getLocalProductImage = (product) => {
    const name = String(product.name || "").toLowerCase();
    const category = String(product.category || "").toLowerCase();

    // =====================================================
    // FLOWERS
    // =====================================================

    if (category === "flowers") {
      if (
        name.includes("red rose") ||
        name.includes("crimson") ||
        name.includes("deep red")
      ) {
        return productImages[1];
      }

      if (name.includes("orchid")) {
        return productImages[25];
      }

      if (
        name.includes("gerbera") ||
        name.includes("daisy")
      ) {
        return productImages[26];
      }

      if (
        name.includes("baby's breath") ||
        name.includes("babys breath") ||
        name.includes("baby breath")
      ) {
        return productImages[27];
      }

      if (name.includes("lisianthus")) {
        return productImages[28];
      }

      if (name.includes("tulip")) {
        return productImages[4];
      }

      if (name.includes("lily")) {
        return productImages[5];
      }

      if (name.includes("sunflower")) {
        return productImages[3];
      }

      if (name.includes("lotus")) {
        return productImages[15];
      }

      if (name.includes("jasmine")) {
        return productImages[16];
      }

      if (name.includes("lavender")) {
        return productImages[19];
      }

      if (
        name.includes("white") ||
        name.includes("harmony")
      ) {
        return productImages[17];
      }

      if (
        name.includes("golden") ||
        name.includes("yellow")
      ) {
        return productImages[18];
      }

      if (
        name.includes("pink") ||
        name.includes("blush") ||
        name.includes("rose")
      ) {
        return productImages[2];
      }

      return productImages[3];
    }

    // =====================================================
    // CANDLES
    // =====================================================

    if (category === "candles") {
      if (name.includes("lavender")) {
        return productImages[6];
      }

      if (name.includes("jasmine")) {
        return productImages[7];
      }

      if (name.includes("vanilla")) {
        return productImages[8];
      }

      if (
        name.includes("mint") ||
        name.includes("fresh")
      ) {
        return productImages[9];
      }

      if (
        name.includes("citrus") ||
        name.includes("orange") ||
        name.includes("lemon")
      ) {
        return productImages[10];
      }

      if (name.includes("rose")) {
        return productImages[22];
      }

      return productImages[8];
    }

    // =====================================================
    // GIFT SETS
    // =====================================================

    if (
      category === "gift sets" ||
      category === "gift set"
    ) {
      if (name.includes("sunflower")) {
        return productImages[12];
      }

      if (name.includes("lavender")) {
        return productImages[14];
      }

      if (name.includes("amber")) {
        return productImages[13];
      }

      if (
        name.includes("comfort") ||
        name.includes("care")
      ) {
        return productImages[21];
      }

      if (
        name.includes("rose") ||
        name.includes("pink") ||
        name.includes("vanilla")
      ) {
        return productImages[11];
      }

      return productImages[11];
    }

    return productImages[1];
  };


  /* =====================================================
     FIND CURRENT SHOP
  ===================================================== */

  const staticShop = localShops.find(
    (shopItem) => shopItem.id === Number(id)
  );


  /* =====================================================
     STATES
  ===================================================== */

  const [shopData, setShopData] = useState(null);
  const [shopLoading, setShopLoading] = useState(true);

  const [isShopSaved, setIsShopSaved] = useState(false);

  const [activeCategory, setActiveCategory] =
    useState("All");

  const [showAllProducts, setShowAllProducts] =
    useState(false);

  const [shopProductsData, setShopProductsData] =
    useState([]);

  const [productsLoading, setProductsLoading] =
    useState(true);


  /* =====================================================
   LOAD SHOP FROM SUPABASE
===================================================== */

useEffect(() => {
  const loadShop = async () => {
    setShopLoading(true);

    const { data, error } = await supabase
      .from("shops")
      .select("*")
      .eq("id", Number(id))
      .single();

    if (error) {
      console.error("Error loading shop:", error);
      setShopData(null);
    } else {
      setShopData(data);
    }

    setShopLoading(false);
  };

  loadShop();
}, [id]);

  /* =====================================================
     MERGE SUPABASE SHOP + EXISTING DESIGN DATA
  ===================================================== */

  const shop = shopData
    ? {
        ...staticShop,
        ...shopData,

        image:
          shopData.cover_image ||
          shopData.image ||
          staticShop?.image ||
          "",

        rating:
          staticShop?.rating ??
          shopData.rating ??
          0,

        reviews:
          staticShop?.reviews ??
          shopData.reviews ??
          0,

        specialties:
          staticShop?.specialties ||
          [shopData.category].filter(Boolean),

        description:
          shopData.description ||
          staticShop?.description ||
          "",

        about:
          shopData.description ||
          staticShop?.about ||
          "",

        quote:
          staticShop?.quote || "",

        delivery:
          staticShop?.delivery ||
          "Available via Petalia Delivery",

        supportTitle:
          staticShop?.supportTitle || "",

        supportText:
          staticShop?.supportText || "",
      }
    : null;


  /* =====================================================
     LOAD SHOP PRODUCTS
  ===================================================== */

  useEffect(() => {
    const loadShopProducts = async () => {
      if (!id) {
        setShopProductsData([]);
        setProductsLoading(false);
        return;
      }

      setProductsLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("shop_id", Number(id))
        .order("id", { ascending: true });

      if (error) {
        console.error(
          "Error loading shop products:",
          error
        );

        setShopProductsData([]);
        setProductsLoading(false);
        return;
      }

      const productsWithImages = (data || []).map(
        (product) => {
          const databaseImage = product.image;

          const hasRealImageUrl =
            typeof databaseImage === "string" &&
            (
              databaseImage.startsWith("http://") ||
              databaseImage.startsWith("https://")
            );

          return {
            ...product,

            image: hasRealImageUrl
              ? databaseImage
              : getLocalProductImage(product),

            giftStyles:
              product.gift_styles || [],

            flowerColor:
              product.flower_color || null,
          };
        }
      );

      setShopProductsData(productsWithImages);
      setProductsLoading(false);
    };

    loadShopProducts();
  }, [id]);


  /* =====================================================
     FILTER SHOP PRODUCTS
  ===================================================== */

  const shopProducts = useMemo(() => {
    if (activeCategory === "All") {
      return shopProductsData;
    }

    return shopProductsData.filter(
      (product) =>
        String(product.category || "")
          .trim()
          .toLowerCase() ===
        String(activeCategory || "")
          .trim()
          .toLowerCase()
    );
  }, [shopProductsData, activeCategory]);


  /* =====================================================
     PRODUCT CATEGORIES
  ===================================================== */

  const productCategories = useMemo(() => {
    return [
      ...new Set(
        shopProductsData
          .map((product) => product.category)
          .filter(Boolean)
      ),
    ];
  }, [shopProductsData]);


  /* =====================================================
     PRODUCTS TO DISPLAY
  ===================================================== */

  const visibleProducts = showAllProducts
    ? shopProducts
    : shopProducts.slice(0, 4);


  /* =====================================================
     BUSINESS HOURS
  ===================================================== */

  const formatTime = (time) => {
    if (!time) return "";

    const [hours, minutes] = time.split(":");

    const date = new Date();

    date.setHours(Number(hours));
    date.setMinutes(Number(minutes));

    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  };


  const businessHours =
    shop?.opening_time && shop?.closing_time
      ? `Daily, ${formatTime(
          shop.opening_time
        )} – ${formatTime(
          shop.closing_time
        )}`
      : shop?.hours || "Hours not provided";


  /* =====================================================
     SHOP LOADING
  ===================================================== */

  if (shopLoading) {
    return (
      <main className="local-detail-page">
        <section className="local-detail-not-found">
          <p>Loading shop...</p>
        </section>
      </main>
    );
  }


  /* =====================================================
     SHOP NOT FOUND
  ===================================================== */

  if (!shop) {
    return (
      <main className="local-detail-page">
        <section className="local-detail-not-found">
          <h2>Shop not found</h2>

          <p>
            We couldn't find this local shop.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/local-shops")
            }
          >
            Back to Local Shops
          </button>
        </section>
      </main>
    );
  }


  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <main className="local-detail-page">

      {/* =================================================
          BREADCRUMB
      ================================================= */}

      <div className="local-detail-breadcrumb">

        <span
          onClick={() => navigate("/")}
        >
          Home
        </span>

        <small>/</small>

        <span
          onClick={() =>
            navigate("/local-shops")
          }
        >
          Local Shops
        </span>

        <small>/</small>

        <strong>
          {shop.name}
        </strong>

      </div>


      {/* =================================================
          SHOP PROFILE
      ================================================= */}

      <section className="local-detail-profile">

        <img
          src={lavenderCorner1}
          alt=""
          className="local-detail-lavender"
        />


        <div className="local-detail-shop-photo">

          <img
            src={shop.image}
            alt={shop.name}
            className="local-detail-shop-image"
          />

        </div>


        <div className="local-detail-shop-profile">

          <p className="local-detail-eyebrow">
            Local Petalia Partner
          </p>

          <h1>
            {shop.name}
          </h1>


          <div className="local-detail-rating-location">

            <div className="local-detail-rating">

              <Star fill="currentColor" />

              <span>
                {shop.rating}
              </span>

              <small>
                ({shop.reviews} reviews)
              </small>

            </div>


            <div className="local-detail-location">

              <MapPin />

              <span>
                {shop.location}
              </span>

            </div>

          </div>


          <div className="local-detail-tags">

            {(shop.specialties || []).map(
              (specialty) => (
                <span key={specialty}>
                  {specialty}
                </span>
              )
            )}

          </div>


          <p className="local-detail-description">
            {shop.description}
          </p>


          <button
            type="button"
            className={`local-detail-save ${
              isShopSaved
                ? "saved"
                : ""
            }`}
            onClick={() =>
              setIsShopSaved(!isShopSaved)
            }
          >

            <Bookmark
              fill={
                isShopSaved
                  ? "currentColor"
                  : "none"
              }
            />

            {isShopSaved
              ? "Shop Saved"
              : "Save Shop"}

          </button>

        </div>

      </section>


      {/* =================================================
          SHOP COLLECTION
      ================================================= */}

      <section className="local-detail-collection">

        <div className="local-detail-section-heading">

          <div>

            <p className="local-detail-section-label">
              Made with meaning
            </p>

            <h2>
              Shop Their Collection
            </h2>

            <p className="local-detail-heading-description">
              Discover thoughtful gifts prepared by{" "}
              {shop.name}.
            </p>

          </div>


          {/* CATEGORY FILTER */}

          <div className="local-detail-filters">

            <button
              type="button"
              className={
                activeCategory === "All"
                  ? "active"
                  : ""
              }
              onClick={() => {
                setActiveCategory("All");
                setShowAllProducts(false);
              }}
            >
              All
            </button>


            {productCategories.map(
              (category) => (

                <button
                  type="button"
                  key={category}
                  className={
                    activeCategory === category
                      ? "active"
                      : ""
                  }
                  onClick={() => {
                    setActiveCategory(category);
                    setShowAllProducts(false);
                  }}
                >
                  {category}
                </button>

              )
            )}

          </div>

        </div>


        {/* =================================================
            PRODUCT CARDS
        ================================================= */}

        {productsLoading ? (

          <div className="local-detail-empty-products">
            Loading products...
          </div>

        ) : visibleProducts.length > 0 ? (

          <>

            <div className="local-detail-products">

              {visibleProducts.map(
                (product) => (

                  <ProductCard
                    key={product.id}
                    {...product}
                  />

                )
              )}

            </div>


            {shopProducts.length > 4 && (

              <div className="local-detail-view-more-wrap">

                <button
                  type="button"
                  className="local-detail-view-more"
                  onClick={() =>
                    setShowAllProducts(
                      !showAllProducts
                    )
                  }
                >

                  {showAllProducts
                    ? "Show Less"
                    : "View More Products"}

                </button>

              </div>

            )}

          </>

        ) : (

          <div className="local-detail-empty-products">
            No products are available in this category yet.
          </div>

        )}

      </section>


      {/* =================================================
          ABOUT + SHOP INFORMATION
      ================================================= */}

      <section className="local-detail-about-section">

        {/* ABOUT THIS SHOP */}

        <div className="local-detail-about">

          <p className="local-detail-section-label">
            Meet the maker
          </p>

          <h2>
            About This Shop
          </h2>

          <p className="local-detail-about-text">
            {shop.about}
          </p>


          {shop.quote && (
            <>
              <blockquote>
                “{shop.quote}”
              </blockquote>

              <p className="local-detail-quote-author">
                — {shop.name}, {shop.location}
              </p>
            </>
          )}

        </div>


        {/* SHOP INFORMATION */}

        <div className="local-detail-information">

          <p className="local-detail-section-label">
            Good to know
          </p>

          <h2>
            Shop Information
          </h2>


          <div className="local-detail-info-grid">

            {/* LOCATION */}

            <div className="local-detail-info-item">

              <div className="local-detail-info-icon">
                <MapPin />
              </div>

              <div>

                <strong>
                  Location
                </strong>

                <span>
                  {shop.location}
                </span>

                {shop.map_url && (

                  <a
                    href={shop.map_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="local-detail-map-link"
                  >
                    View on Google Maps
                  </a>

                )}

              </div>

            </div>


            {/* OPENING HOURS */}

            <div className="local-detail-info-item">

              <div className="local-detail-info-icon">
                <Clock />
              </div>

              <div>

                <strong>
                  Opening Hours
                </strong>

                <span>
                  {businessHours}
                </span>

              </div>

            </div>


            {/* CONTACT */}

            {(shop.phone ||
              shop.business_email) && (

              <div className="local-detail-info-item">

                <div className="local-detail-info-icon">
                  <Contact />
                </div>

                <div>

                  <strong>
                    Contact
                  </strong>

                  {shop.phone && (
                    <span>
                      {shop.phone}
                    </span>
                  )}

                  {shop.business_email && (

                    <a
                      href={`mailto:${shop.business_email}`}
                      className="local-detail-contact-link"
                    >
                      {shop.business_email}
                    </a>

                  )}

                </div>

              </div>

            )}


            {/* DELIVERY */}

            <div className="local-detail-info-item">

              <div className="local-detail-info-icon">
                <Truck />
              </div>

              <div>

                <strong>
                  Delivery
                </strong>

                <span>
                  {shop.delivery}
                </span>

              </div>

            </div>


            {/* SPECIALTIES */}

            <div className="local-detail-info-item">

              <div className="local-detail-info-icon">
                <Star />
              </div>

              <div>

                <strong>
                  Specialties
                </strong>

                <span>
                  {(shop.specialties || []).join(", ")}
                </span>

              </div>

            </div>


            {/* LOCAL SUPPORT */}

            {shop.supportTitle && (

              <div className="local-detail-info-item">

                <div className="local-detail-info-icon">
                  <Leaf />
                </div>

                <div>

                  <strong>
                    {shop.supportTitle}
                  </strong>

                  <span>
                    {shop.supportText}
                  </span>

                </div>

              </div>

            )}

          </div>

        </div>

      </section>

    </main>
  );
}

export default LocalShopDetail;