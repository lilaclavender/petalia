import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  MapPin,
  Search,
  Star,
  Heart,
  ChevronDown,
  LockKeyhole,
  Truck,
} from "lucide-react";

import localShopsHero from "../assets/local-shops-hero.png";
import sakuraBranch from "../assets/sakura-branch.png";
import sakuraIcon from "../assets/sakura-icon.png";
import trustPetal from "../assets/trust-petal.png";

import "../styles/LocalShops.css";

/*
  IMPORTANT:
  Change ONLY these filenames if yours are different.
*/

import localShop1Img from "../assets/local-shop-1.jpg";
import localShop2Img from "../assets/local-shop-2.jpg";
import localshop3Img from "../assets/local-shop-3.jpg";
import localShop4Img from "../assets/local-shop-4.jpg";
import localShop5Img from "../assets/local-shop-5.jpg";
import localShop6Img from "../assets/local-shop-6.jpg";
import localShop7Img from "../assets/local-shop-7.jpg";
import localshop8Img from "../assets/local-shop-8.jpg";


const shops = [
  {
    id: 1,
    name: "Bloom & Co.",
    location: "Phnom Penh",
    category: "Flowers",
    specialties: ["Flowers", "Bouquets", "Gift Sets"],
    rating: 4.8,
    reviews: 120,
    image: localShop1Img,
    featured: true,
  },

  {
    id: 2,
    name: "Scent Studio",
    location: "Phnom Penh",
    category: "Candles",
    specialties: ["Candles", "Home Fragrance", "Gift Sets"],
    rating: 4.7,
    reviews: 98,
    image: localShop2Img,
    featured: true,
  },

  {
    id: 3,
    name: "Petal House",
    location: "Siem Reap",
    category: "Flowers",
    specialties: ["Flowers", "Bouquets", "Events"],
    rating: 4.9,
    reviews: 86,
    image: localshop3Img,
    featured: true,
  },

  {
    id: 4,
    name: "Candle Corner",
    location: "Phnom Penh",
    category: "Candles",
    specialties: ["Candles", "Gift Sets", "Home Decor"],
    rating: 4.5,
    reviews: 57,
    image: localShop4Img,
    featured: false,
  },

  {
    id: 5,
    name: "The Flower Room",
    location: "Battambang",
    category: "Flowers",
    specialties: ["Flowers", "Bouquets", "Events"],
    rating: 4.7,
    reviews: 72,
    image: localShop5Img,
    featured: false,
  },

  {
    id: 6,
    name: "Bloom & Glow",
    location: "Phnom Penh",
    category: "Mixed",
    specialties: ["Flowers", "Candles", "Gift Sets"],
    rating: 4.8,
    reviews: 81,
    image: localShop6Img,
    featured: false,
  },

  {
    id: 7,
    name: "Leaf & Light",
    location: "Phnom Penh",
    category: "Mixed",
    specialties: ["Flowers", "Candles", "Keepsakes"],
    rating: 4.6,
    reviews: 64,
    image: localShop7Img,
    featured: false,
  },

  {
    id: 8,
    name: "Mint & Petal",
    location: "Sihanoukville",
    category: "Flowers",
    specialties: ["Flowers", "Gift Sets", "Events"],
    rating: 4.6,
    reviews: 51,
    image: localshop8Img,
    featured: false,
  },
];


function LocalShops() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Shops");
  const [sort, setSort] = useState("Recommended");
  const navigate = useNavigate();
  const [favoriteShops, setFavoriteShops] = useState([]);


  const filteredShops = useMemo(() => {
    let result = [...shops];

    if (category !== "All Shops") {
      result = result.filter((shop) => shop.category === category);
    }

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter((shop) => {
        return (
          shop.name.toLowerCase().includes(query) ||
          shop.location.toLowerCase().includes(query) ||
          shop.specialties.some((item) =>
            item.toLowerCase().includes(query)
          )
        );
      });
    }

    if (sort === "Highest Rated") {
      result.sort((a, b) => b.rating - a.rating);
    }

    if (sort === "Most Reviewed") {
      result.sort((a, b) => b.reviews - a.reviews);
    }

    return result;
  }, [search, category, sort]);


  const featuredShops = shops.filter((shop) => shop.featured);

  const toggleFavorite = (shopId) => {
    setFavoriteShops((currentFavorites) => {
      if (currentFavorites.includes(shopId)) {
        return currentFavorites.filter((id) => id !== shopId);
      }

      return [...currentFavorites, shopId];
    });
  };

  return (
    <main className="local-shops-page">

      {/* ==================================================
          HERO
      ================================================== */}

      <section className="local-shops-hero"
          style={{
        backgroundImage: `
          url(${localShopsHero})
        `,
      }}>
        <img
          src={sakuraBranch}
          alt=""
          className="hero-flower hero-flower-left"
        />

        <img
          src={sakuraBranch}
          alt=""
          className="hero-flower hero-flower-right"
        />

        <div className="local-shops-hero-overlay"></div>

        <div className="local-shops-hero-content">

          <p className="local-shops-eyebrow">
            Local Shops
          </p>

          <h1>
            Meet Our
            <br />
            Local Gift Shops
          </h1>

          <h2>
            Thoughtful gifts, created closer to home.
          </h2>

          <p>
            Discover local florists and candle makers behind
            gifts on Petalia. Support small businesses and
            spread more kindness together.
          </p>


          {/* SEARCH + FILTER */}

          <div className="local-shops-search-row">

            <div className="local-shops-search-box">

              <Search />

              <input
                type="text"
                placeholder="Search local shops..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />

            </div>

            <div className="category-select-wrapper">

              <select
                className="local-shops-category"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
              >
                <option>All Shops</option>
                <option>Flowers</option>
                <option>Candles</option>
                <option>Mixed</option>
              </select>

              <ChevronDown className="category-chevron" />
            </div>

          </div>

        </div>

      </section>


      {/* ==================================================
          FEATURED
      ================================================== */}

      <section className="local-shops-section">

        <div className="local-shops-heading-row">

          <div>

            <p className="local-shops-section-label">
              Discover
            </p>

            <h2>
              Featured Local Shops
            </h2>

          </div>

        </div>


        <div className="local-featured-grid">

          {featuredShops.map((shop) => (

            <article
              key={shop.id}
              className="local-featured-card"
            >

              <img
                src={shop.image}
                alt={shop.name}
                className="local-shop-image"
              />


              <div className="local-shop-dark-overlay"></div>


              <button
                className={`local-shop-heart ${
                  favoriteShops.includes(shop.id) ? "active" : ""
                }`}
                onClick={() => toggleFavorite(shop.id)}
                aria-label={
                  favoriteShops.includes(shop.id)
                    ? "Remove from favorites"
                    : "Add to favorites"
                }
              >
                <Heart
                  fill={
                    favoriteShops.includes(shop.id)
                      ? "#D35B8C"
                      : "none"
                  }
                />
              </button>


              <div className="local-shop-content">

                <h3>
                  {shop.name}
                </h3>


                <div className="local-shop-location">
                  <MapPin />
                  <span>{shop.location}</span>
                </div>


                <div className="local-shop-tags">

                  {shop.specialties.map((item) => (
                    <span key={item}>
                      {item}
                    </span>
                  ))}

                </div>


                <div className="local-shop-bottom">

                  <div className="local-shop-rating">

                    <Star />

                    <span>
                      {shop.rating}
                    </span>

                    <small>
                      ({shop.reviews})
                    </small>

                  </div>


                  <button
                    type="button"
                    className="local-shop-view-btn"
                     onClick={() => navigate(`/local-shops/${shop.id}`)}
                  >
                    View Shop
          
                  </button>

                </div>

              </div>

            </article>

          ))}

        </div>

      </section>


      {/* ==================================================
          ALL SHOPS
      ================================================== */}

      <section className="local-shops-section local-all-section">

        <div className="local-shops-heading-row">

          <div>

            <p className="local-shops-section-label">
              Explore more
            </p>

            <h2>
              All Local Shops
            </h2>

          </div>

          <div className="sort-select-wrapper">

            <select
              className="local-shops-sort"
              value={sort}
              onChange={(event) =>
                setSort(event.target.value)
              }
            >
              <option>Recommended</option>
              <option>Highest Rated</option>
              <option>Most Reviewed</option>
            </select>

            <ChevronDown className="sort-chevron" />
          </div>

        </div>


        {filteredShops.length > 0 ? (

          <div className="local-all-grid">

            {filteredShops.map((shop) => (

              <article
                key={shop.id}
                className="local-small-card"
              >

                <img
                  src={shop.image}
                  alt={shop.name}
                  className="local-shop-image"
                />


                <div className="local-shop-dark-overlay"></div>


                <button
                  type="button"
                  className={`local-shop-heart ${
                    favoriteShops.includes(shop.id) ? "active" : ""
                  }`}
                  onClick={() => toggleFavorite(shop.id)}
                  aria-label={
                    favoriteShops.includes(shop.id)
                      ? `Remove ${shop.name} from favorites`
                      : `Save ${shop.name}`
                  }
                >
                  <Heart
                    fill={
                      favoriteShops.includes(shop.id)
                        ? "#D35B8C"
                        : "none"
                    }
                  />
                </button>


                <div className="local-shop-content">

                  <h3>
                    {shop.name}
                  </h3>


                  <div className="local-shop-location">

                    <MapPin />

                    <span>
                      {shop.location}
                    </span>

                  </div>


                  <div className="local-shop-tags">

                    {shop.specialties.slice(0, 3).map((item) => (
                      <span key={item}>
                        {item}
                      </span>
                    ))}

                  </div>


                  <div className="local-shop-bottom">

                    <div className="local-shop-rating">

                      <Star />

                      <span>
                        {shop.rating}
                      </span>

                      <small>
                        ({shop.reviews})
                      </small>

                    </div>


                    <button
                      type="button"
                      className="local-shop-view-btn"
                      onClick={() => navigate(`/local-shops/${shop.id}`)}
                    >
                      View Shop

                    </button>

                  </div>

                </div>

              </article>

            ))}

          </div>

        ) : (

          <div className="local-shops-empty">

            <h3>
              No shops found
            </h3>

            <p>
              Try another shop name or category.
            </p>

          </div>

        )}

      </section>


      {/* ==================================================
          SUPPORT LOCAL
      ================================================== */}

      <section className="local-support">

        <div className="local-support-line"></div>

        <p className="local-support-small">
          Thoughtful gifting, closer to home
        </p>

        <h2>
          Supporting local,
          <br />
          one gift at a time.
        </h2>

        <p className="local-support-description">
          Every Petalia order helps local florists,
          candle makers, and gift creators share
          their craft with more people.
        </p>

      </section>

      {/* ==================================================
      PETALIA TRUST STRIP
      ================================================== */}

      <section className="petalia-trust-strip">

        <div className="petalia-trust-item">
          <div className="trust-icon">
            <img
              src={trustPetal}
              alt=""
              className="trust-petal-bg"
            />
            <Heart className="trust-main-icon" />
          </div>

          <div>
            <h4>Handmade with Love</h4>
            <p>
              Crafted with care
              <br />
              for your special moment
            </p>
          </div>
        </div>


        <div className="petalia-trust-item">
          <div className="trust-icon">
            <img
              src={trustPetal}
              alt=""
              className="trust-petal-bg"
            />
            <LockKeyhole className="trust-main-icon" />
          </div>

          <div>
            <h4>Secure Payment</h4>
            <p>
              Safe & trusted
              <br />
              checkout
            </p>
          </div>
        </div>


        <div className="petalia-trust-item">
          <div className="trust-icon">
            <img
              src={trustPetal}
              alt=""
              className="trust-petal-bg"
            />
            <Truck className="trust-main-icon" />
          </div>

          <div>
            <h4>Fast Delivery</h4>
            <p>
              Delivering happiness
              <br />
              to your doorstep
            </p>
          </div>
        </div>


        <div className="petalia-trust-item">
          <div className="trust-icon">
            <img
              src={trustPetal}
              alt=""
              className="trust-petal-bg"
            />
             <img
                src={sakuraIcon}
                alt=""
                className="trust-custom-icon"
              />
          </div>

          <div>
            <h4>Customer Support</h4>
            <p>
              We're here for you
              <br />
              when you need us
            </p>
          </div>
        </div>

      </section>

    </main>
  );
}


export default LocalShops;