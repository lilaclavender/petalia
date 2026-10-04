import { useNavigate } from "react-router-dom";

import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Star,
} from "lucide-react";

import usePetalia from "../context/usePetalia";
import "../styles/Wishlist.css";

function Wishlist() {
  const navigate = useNavigate();

  const { wishlist, toggleWishlist } = usePetalia();

  /* =====================================================
     EMPTY WISHLIST
  ===================================================== */

  if (wishlist.length === 0) {
    return (
      <main className="wishlist-page">
        <section className="wishlist-empty">

          {/* Subtle decorative petals */}
          <span className="wishlist-petal empty-petal-1" />
          <span className="wishlist-petal empty-petal-2" />
          <span className="wishlist-petal empty-petal-3" />

          <div className="wishlist-empty-heart">
            <Heart />
          </div>

          <span className="wishlist-eyebrow">
            Saved with love
          </span>

          <h1>
            Your wishlist is
            <br />
            <em>waiting for you.</em>
          </h1>

          <p>
            Save flowers, candles, and meaningful gifts that
            catch your heart. They'll be right here whenever
            the perfect moment comes.
          </p>

          <button
            type="button"
            className="wishlist-empty-button"
            onClick={() => navigate("/shop")}
          >
            <ShoppingBag />

            Explore Gifts

            <ArrowRight />
          </button>

        </section>
      </main>
    );
  }


  /* =====================================================
     WISHLIST
  ===================================================== */

  return (
    <main className="wishlist-page">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="wishlist-hero">

        {/* Small decorative petals */}
        <span className="wishlist-petal petal-1" />
        <span className="wishlist-petal petal-2" />
        <span className="wishlist-petal petal-3" />

        {/* Decorative curved line */}
        <div className="wishlist-heart-line">
          <span />

          <Heart />
        </div>


        <div className="wishlist-hero-inner">

          {/* LEFT */}
          <div className="wishlist-hero-text">

            <span className="wishlist-eyebrow">
              Saved with love
            </span>

            <h1>
              Your <em>Wishlist</em>
            </h1>

            <p>
              A little collection of gifts that caught your
              heart. Keep them close until the right moment
              comes.
            </p>

          </div>


          {/* RIGHT — SAVED COUNT */}
          <div className="wishlist-saved-count">

          <div className="wishlist-bloom" aria-hidden="true">
            <span className="wishlist-petal petal-top"></span>
            <span className="wishlist-petal petal-right"></span>
            <span className="wishlist-petal petal-bottom-right"></span>
            <span className="wishlist-petal petal-bottom-left"></span>
            <span className="wishlist-petal petal-left"></span>
          </div>

          <div className="wishlist-bloom-center">

            <div className="wishlist-count-icon">
              <Heart fill="currentColor" />
            </div>

            <div className="wishlist-count-text">
              <strong>{wishlist.length}</strong>

              <span>
                {wishlist.length === 1
                  ? "gift saved"
                  : "gifts saved"}
              </span>
            </div>

          </div>

        </div>

        </div>

      </section>


      {/* =================================================
          SAVED PRODUCTS
      ================================================= */}

      <section className="wishlist-products">

        {/* SECTION HEADER */}
        <div className="wishlist-section-heading">

          <div className="wishlist-section-title">

            <h2>
              Your saved gifts
            </h2>

            <span>
              {wishlist.length}
            </span>

          </div>


          <button
            type="button"
            className="wishlist-continue-button"
            onClick={() => navigate("/shop")}
          >
            Continue exploring

            <ArrowRight />
          </button>

        </div>


        {/* =================================================
            PRODUCT GRID
        ================================================= */}

        <div className="wishlist-grid">

          {wishlist.map((product) => (

            <article
              key={product.id}
              className="wishlist-card"
            >

              <div className="wishlist-card-image">

                {/* PRODUCT IMAGE */}
                <button
                  type="button"
                  className="wishlist-image-button"
                  onClick={() =>
                    navigate(`/product/${product.id}`)
                  }
                  aria-label={`View ${product.name}`}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                  />
                </button>


                {/* SAVED BADGE */}
                <div className="wishlist-saved-badge">

                  <Heart fill="currentColor" />

                  <span>
                    Saved
                  </span>

                </div>


                {/* REMOVE BUTTON */}
                <button
                  type="button"
                  className="wishlist-remove-button"
                  onClick={() =>
                    toggleWishlist(product)
                  }
                  aria-label={`Remove ${product.name} from wishlist`}
                  title="Remove from wishlist"
                >
                  <Trash2 />
                </button>


                {/* =================================================
                    PRODUCT INFORMATION OVER IMAGE
                ================================================= */}

                <div className="wishlist-card-overlay">

                  {product.category && (
                    <span className="wishlist-category">
                      {product.category}
                    </span>
                  )}


                  <h3>
                    {product.name}
                  </h3>


                  {/* Only show rating if product has one */}
                  {product.rating && (

                    <div className="wishlist-rating">

                      <Star fill="currentColor" />

                      <span>
                        {product.rating}
                      </span>

                      {product.reviews && (
                        <small>
                          ({product.reviews})
                        </small>
                      )}

                    </div>

                  )}


                  <div className="wishlist-overlay-footer">

                    <strong className="wishlist-price">
                      ${Number(product.price).toFixed(2)}
                    </strong>


                    <button
                      type="button"
                      className="wishlist-view-button"
                      onClick={() =>
                        navigate(`/product/${product.id}`)
                      }
                    >
                      View Gift

                      <ArrowRight />
                    </button>

                  </div>

                </div>

              </div>

            </article>

          ))}

        </div>


        {/* =================================================
            DISCOVER MORE
        ================================================= */}

        <section className="wishlist-discover">

          {/* SAVED PRODUCT PHOTO STACK */}
          <div className="wishlist-discover-visual">

            {wishlist[0] && (

              <div className="wishlist-polaroid wishlist-polaroid-back">

                <img
                  src={wishlist[0].image}
                  alt=""
                />

              </div>

            )}


            {wishlist[1] && (

              <div className="wishlist-polaroid wishlist-polaroid-front">

                <img
                  src={wishlist[1].image}
                  alt=""
                />

              </div>

            )}


            <div className="wishlist-polaroid-heart">
              <Heart />
            </div>

          </div>


          {/* TEXT */}
          <div className="wishlist-discover-text">

            <span>
              Something else might catch your heart
            </span>

            <h2>
              Still looking for
              <br />
              <em>the perfect one?</em>
            </h2>

            <p>
              Explore more thoughtful gifts made for every
              feeling and meaningful moment.
            </p>

          </div>


          {/* BUTTON */}
          <button
            type="button"
            className="wishlist-discover-button"
            onClick={() => navigate("/shop")}
          >
            Discover More Gifts

            <ArrowRight />
          </button>

        </section>

      </section>

    </main>
  );
}

export default Wishlist;