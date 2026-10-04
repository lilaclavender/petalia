import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Heart,
  Store,
  ShieldCheck,
} from "lucide-react";

import ProductCard from "../components/ProductCard";
import { getProducts } from "../data/productService";

import "../styles/Shop.css";

function Shop() {
  const [searchParams] = useSearchParams();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Shop could not load products:", error);
      }
    };

    loadProducts();
  }, []);

  const flowerSearch = searchParams.get("flower") || "";
  const categorySearch = searchParams.get("category") || "";
  const searchQuery = searchParams.get("search") || "";

  const getInitialCategory = () => {
    if (categorySearch === "gift-sets") return "Gift Sets";
    if (categorySearch === "flowers") return "Flowers";
    if (categorySearch === "candles") return "Candles";

    return "All Gifts";
  };

  /* =========================
     STATE
  ========================= */

  const [currentPage, setCurrentPage] = useState(1);

  const [maxPrice, setMaxPrice] = useState(100);

  const [selectedCategory, setSelectedCategory] = useState(getInitialCategory);

  const [sortBy, setSortBy] = useState("recommended");

  const [selectedEmotions, setSelectedEmotions] = useState([]);

  const [selectedOccasions, setSelectedOccasions] = useState([]);

  const [showMoreEmotions, setShowMoreEmotions] = useState(false);

  const [showMoreOccasions, setShowMoreOccasions] = useState(false);

  /* COLLAPSE / EXPAND */

  const [emotionOpen, setEmotionOpen] = useState(true);

  const [occasionOpen, setOccasionOpen] = useState(true);

  const [priceOpen, setPriceOpen] = useState(true);

  /* =========================
     FILTER OPTIONS
  ========================= */

  const emotionOptions = [
    "Love",
    "Appreciation",
    "Celebration",
    "Congratulations",
    "Sympathy",
    "Comfort",
    "Gratitude",
    "Self Love",
    "Happiness",
    "Encouragement",
    "Hope",
    "Peace & Calm",
  ];

  const occasionOptions = [
    "Birthday",
    "Graduation",
    "Anniversary",
    "Mother's Day",
    "Valentine's Day",
    "Christmas",
    "New Baby",
    "Thank You",
    "Get Well Soon",
    "Housewarming",
    "Farewell",
    "Retirement",
  ];

  const visibleEmotions = showMoreEmotions
    ? emotionOptions
    : emotionOptions.slice(0, 5);

  const visibleOccasions = showMoreOccasions
    ? occasionOptions
    : occasionOptions.slice(0, 5);

  /* =========================
     FILTER FUNCTIONS
  ========================= */

  const toggleEmotion = (emotion) => {
    setSelectedEmotions((previous) => {
      if (previous.includes(emotion)) {
        return previous.filter((item) => item !== emotion);
      }

      return [...previous, emotion];
    });

    setCurrentPage(1);
  };

  const toggleOccasion = (occasion) => {
    setSelectedOccasions((previous) => {
      if (previous.includes(occasion)) {
        return previous.filter((item) => item !== occasion);
      }

      return [...previous, occasion];
    });

    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedEmotions([]);

    setSelectedOccasions([]);

    setSelectedCategory("All Gifts");

    setMaxPrice(100);

    setCurrentPage(1);

    setShowMoreEmotions(false);

    setShowMoreOccasions(false);

    /*
      IMPORTANT:
      We do NOT reset sortBy here.

      Sorting is not a filter.
      If user chose Most Popular,
      it stays Most Popular.
    */
  };

  /* =========================
     FILTER PRODUCTS
  ========================= */

  /* =========================
   FILTER PRODUCTS
========================= */

  const filteredProducts = products.filter((product) => {
    /* CATEGORY */

    const categoryMatch =
      selectedCategory === "All Gifts" || product.category === selectedCategory;

    /* EMOTION */

    const emotionMatch =
      selectedEmotions.length === 0 ||
      selectedEmotions.some((emotion) => product.emotion?.includes(emotion));

    /* OCCASION */

    const occasionMatch =
      selectedOccasions.length === 0 ||
      selectedOccasions.some((occasion) =>
        product.occasion?.includes(occasion),
      );

    /* PRICE */

    const priceMatch = product.price <= maxPrice;

    /* FLOWER FROM PETALIA TIPS */

    const flowerMatch =
      !flowerSearch ||
      product.name.toLowerCase().includes(flowerSearch.toLowerCase());

    /* HEADER SEARCH */

    const normalizedSearch = searchQuery.trim().toLowerCase();

    const searchMatch =
      !normalizedSearch ||
      product.name?.toLowerCase().includes(normalizedSearch) ||
      product.category?.toLowerCase().includes(normalizedSearch) ||
      product.emotion?.some((emotion) =>
        emotion.toLowerCase().includes(normalizedSearch),
      ) ||
      product.occasion?.some((occasion) =>
        occasion.toLowerCase().includes(normalizedSearch),
      );

    return (
      categoryMatch &&
      emotionMatch &&
      occasionMatch &&
      priceMatch &&
      flowerMatch &&
      searchMatch
    );
  });

  /* =========================
     SORT PRODUCTS
  ========================= */

  const sortedProducts = [...filteredProducts];

  if (sortBy === "popular") {
    sortedProducts.sort((a, b) => b.reviews - a.reviews);
  }

  if (sortBy === "low-high") {
    sortedProducts.sort((a, b) => a.price - b.price);
  }

  if (sortBy === "high-low") {
    sortedProducts.sort((a, b) => b.price - a.price);
  }

  /* =========================
     PAGINATION
  ========================= */

  const productsPerPage = 8;

  const totalPages = Math.max(
    1,
    Math.ceil(sortedProducts.length / productsPerPage),
  );

  const startIndex = (currentPage - 1) * productsPerPage;

  const endIndex = startIndex + productsPerPage;

  const displayedProducts = sortedProducts.slice(startIndex, endIndex);

  const firstProductNumber = sortedProducts.length === 0 ? 0 : startIndex + 1;

  const lastProductNumber = Math.min(endIndex, sortedProducts.length);

  return (
    <main className="shop-page">
      <div className="shop-container">
        {/* =========================
            SHOP INTRO
        ========================= */}

        <div className="shop-intro">
          <div className="shop-header">
            <h1>Shop</h1>

            <p>Find a meaningful gift for every feeling and special moment.</p>
          </div>

          <div className="shop-benefits">
            <div className="shop-benefit">
              <div className="shop-benefit-icon">
                <Heart />
              </div>

              <div>
                <h3>Thoughtful Gifts</h3>

                <p>Curated with meaning</p>
              </div>
            </div>

            <div className="shop-benefit">
              <div className="shop-benefit-icon">
                <Store />
              </div>

              <div>
                <h3>Local Sellers</h3>

                <p>Supporting local shops</p>
              </div>
            </div>

            <div className="shop-benefit">
              <div className="shop-benefit-icon">
                <ShieldCheck />
              </div>

              <div>
                <h3>Secure Checkout</h3>

                <p>Safe & easy payment</p>
              </div>
            </div>
          </div>
        </div>

        {/* =========================
            CATEGORY TABS
        ========================= */}

        <div className="shop-category-tabs">
          {["All Gifts", "Flowers", "Candles", "Gift Sets"].map((category) => (
            <button
              key={category}
              className={`shop-category-tab ${
                selectedCategory === category ? "active" : ""
              }`}
              onClick={() => {
                setSelectedCategory(category);

                setCurrentPage(1);
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* =========================
            SHOP CONTENT
        ========================= */}

        <div className="shop-content">
          {/* =========================
              FILTER SIDEBAR
          ========================= */}

          <aside className="shop-filter">
            {/* FILTER HEADER */}

            <div className="filter-heading">
              <div>
                <SlidersHorizontal />

                <h2>Filter by</h2>
              </div>

              <button type="button" onClick={clearAllFilters}>
                Clear all
              </button>
            </div>

            {/* =========================
                EMOTION
            ========================= */}

            <div className="filter-section">
              <button
                type="button"
                className="filter-title filter-title-button"
                onClick={() => setEmotionOpen(!emotionOpen)}
              >
                <h3>By Emotion</h3>

                {emotionOpen ? <ChevronUp /> : <ChevronDown />}
              </button>

              {emotionOpen && (
                <div className="filter-options">
                  {visibleEmotions.map((emotion) => (
                    <label key={emotion}>
                      <input
                        type="checkbox"
                        checked={selectedEmotions.includes(emotion)}
                        onChange={() => toggleEmotion(emotion)}
                      />

                      {emotion}
                    </label>
                  ))}

                  <button
                    type="button"
                    className="filter-see-more"
                    onClick={() => setShowMoreEmotions(!showMoreEmotions)}
                  >
                    {showMoreEmotions ? "See less" : "See more"}
                  </button>
                </div>
              )}
            </div>

            {/* =========================
                OCCASION
            ========================= */}

            <div className="filter-section">
              <button
                type="button"
                className="filter-title filter-title-button"
                onClick={() => setOccasionOpen(!occasionOpen)}
              >
                <h3>By Occasion</h3>

                {occasionOpen ? <ChevronUp /> : <ChevronDown />}
              </button>

              {occasionOpen && (
                <div className="filter-options">
                  {visibleOccasions.map((occasion) => (
                    <label key={occasion}>
                      <input
                        type="checkbox"
                        checked={selectedOccasions.includes(occasion)}
                        onChange={() => toggleOccasion(occasion)}
                      />

                      {occasion}
                    </label>
                  ))}

                  <button
                    type="button"
                    className="filter-see-more"
                    onClick={() => setShowMoreOccasions(!showMoreOccasions)}
                  >
                    {showMoreOccasions ? "See less" : "See more"}
                  </button>
                </div>
              )}
            </div>

            {/* =========================
                PRICE RANGE
            ========================= */}

            <div className="filter-section filter-price">
              <button
                type="button"
                className="filter-title filter-title-button"
                onClick={() => setPriceOpen(!priceOpen)}
              >
                <h3>Price Range</h3>

                {priceOpen ? <ChevronUp /> : <ChevronDown />}
              </button>

              {priceOpen && (
                <div className="filter-options">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(Number(e.target.value));

                      setCurrentPage(1);
                    }}
                  />

                  <div className="price-values">
                    <span>$0</span>

                    <span>${maxPrice}</span>
                  </div>
                </div>
              )}
            </div>

            {/* CLEAR ALL FILTERS */}

            <button
              type="button"
              className="clear-filter-button"
              onClick={clearAllFilters}
            >
              Clear all filters
            </button>
          </aside>

          {/* =========================
              PRODUCT AREA
          ========================= */}

          <section className="shop-products">
            {/* PRODUCT TOP BAR */}

            <div className="shop-products-top">
              <p>
                Showing{" "}
                <strong>
                  {firstProductNumber}–{lastProductNumber}
                </strong>{" "}
                of {sortedProducts.length} gifts
              </p>

              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);

                  setCurrentPage(1);
                }}
              >
                <option value="recommended">Recommended</option>

                <option value="popular">Most Popular</option>

                <option value="low-high">Price: Low to High</option>

                <option value="high-low">Price: High to Low</option>
              </select>
            </div>

            {/* =========================
                PRODUCT GRID
            ========================= */}

            <div className="shop-product-grid">
              {displayedProducts.length > 0 ? (
                displayedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    image={product.image}
                    name={product.name}
                    price={product.price}
                    rating={product.rating}
                    reviews={product.reviews}
                    badge={product.badge}
                  />
                ))
              ) : (
                <div className="shop-no-results">
                  <h3>No gifts found</h3>

                  <p>Try changing your filters.</p>
                </div>
              )}
            </div>

            {/* =========================
                PAGINATION
            ========================= */}

            {totalPages > 1 && (
              <div className="shop-pagination">
                <button
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                  disabled={currentPage === 1}
                >
                  ‹
                </button>

                {Array.from(
                  {
                    length: totalPages,
                  },
                  (_, index) => index + 1,
                ).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    className={currentPage === pageNumber ? "active" : ""}
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  ›
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default Shop;
