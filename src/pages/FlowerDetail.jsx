import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Heart,
  Gift,
  ShoppingCart,
  Star,
  Sparkles,
  Users,
  Leaf,
} from "lucide-react";

import flowersData from "../data/flowersData";
import products from "../data/products";
import usePetalia from "../context/usePetalia";

import "../styles/FlowerDetail.css";


function FlowerDetail() {
  const navigate = useNavigate();
  const { flowerId } = useParams();

  /* =========================
     PETALIA CONTEXT
  ========================= */

  const {
    isWishlisted,
    toggleWishlist,
  } = usePetalia();


  /* =========================
     FLOWER DATA
  ========================= */

  const flower = flowersData[flowerId];

  const [selectedColorId, setSelectedColorId] =
    useState("");


  /* =========================
     SELECTED COLOR
  ========================= */

  const selectedColor = useMemo(() => {
    if (!flower?.colors?.length) {
      return null;
    }

    return (
      flower.colors.find(
        (color) =>
          color.id === selectedColorId
      ) || flower.colors[0]
    );
  }, [flower, selectedColorId]);


  /* =========================
     REAL RELATED PRODUCTS
  ========================= */

  const relatedProducts = useMemo(() => {
    if (!flower) {
      return [];
    }

    /*
      First look for products that use our new
      structured metadata:

      flower: "Rose"
      flowerColor: "Red"
    */

    const structuredProducts =
      products.filter(
        (product) =>
          product.flower?.toLowerCase() ===
          flower.name.toLowerCase()
      );

    /*
      Keep compatibility with your existing
      products.js.

      If a product does not have "flower" yet,
      Petalia can still find it from its name,
      for example:

      "Classic Red Rose Bouquet"
      "Pink Tulip Bouquet"
    */

    const nameMatchedProducts =
      products.filter(
        (product) =>
          product.name
            ?.toLowerCase()
            .includes(
              flower.name.toLowerCase()
            )
      );

    const flowerProducts =
      structuredProducts.length > 0
        ? structuredProducts
        : nameMatchedProducts;

    /*
      If we have products for the selected
      flower color, show those first.
    */

    if (selectedColor) {
      const colorProducts =
        flowerProducts.filter(
          (product) =>
            product.flowerColor
              ?.toLowerCase() ===
            selectedColor.name.toLowerCase()
        );

      if (colorProducts.length > 0) {
        return colorProducts.slice(0, 4);
      }
    }

    /*
      If that color does not have a product yet,
      fall back to general products for the flower.
    */

    return flowerProducts.slice(0, 4);

  }, [flower, selectedColor]);


  /* =========================
     FLOWER NOT FOUND
  ========================= */

  if (!flower) {
    return (
      <main className="flower-detail-page">

        <section className="flower-not-found">

          <p className="flower-detail-eyebrow">
            FLOWER MEANING
          </p>

          <h1>
            Flower not found.
          </h1>

          <p>
            This flower guide has not been added yet.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/petalia-tips/flower-meanings"
              )
            }
          >
            Back to Flower Meanings
          </button>

        </section>

      </main>
    );
  }


  /* =========================
     FEELING ICON
  ========================= */

  const getFeelingIcon = (feeling) => {
    const text =
      feeling?.toLowerCase() || "";

    if (
      text.includes("love") ||
      text.includes("affection") ||
      text.includes("romance")
    ) {
      return Heart;
    }

    if (
      text.includes("friend") ||
      text.includes("care") ||
      text.includes("goodwill")
    ) {
      return Users;
    }

    if (
      text.includes("rebirth") ||
      text.includes("beginning") ||
      text.includes("life")
    ) {
      return Leaf;
    }

    return Sparkles;
  };


  /* =========================
     PAGE
  ========================= */

  return (
    <main className="flower-detail-page">


      {/* =====================================
          BREADCRUMB
      ====================================== */}

      <div className="flower-detail-breadcrumb-wrap">

        <div className="flower-detail-breadcrumb">

          <button
            type="button"
            onClick={() => navigate("/")}
          >
            Home
          </button>

          <span>/</span>

          <button
            type="button"
            onClick={() =>
              navigate("/petalia-tips")
            }
          >
            Petalia Tips
          </button>

          <span>/</span>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/petalia-tips/flower-meanings"
              )
            }
          >
            Flower Meanings
          </button>

          <span>/</span>

          <strong>
            {flower.name}
          </strong>

        </div>

      </div>


      {/* =====================================
          HERO
      ====================================== */}

      <section
        className={`flower-detail-hero ${
          flower.image
            ? "flower-detail-hero-has-image"
            : ""
        }`}
        style={
          flower.image
            ? {
                backgroundImage:
                  `url(${flower.image})`,
              }
            : undefined
        }
      >

        {/* PLACEHOLDER BEFORE IMAGE IS ADDED */}

        {!flower.image && (
          <div className="flower-hero-placeholder">
            {flower.name} Hero Image
          </div>
        )}


        <div className="flower-hero-overlay" />


        <div className="flower-hero-content">

          <p className="flower-detail-eyebrow flower-hero-eyebrow">
            {flower.eyebrow}
          </p>


          <h1>
            {flower.name}
          </h1>


          <h2>
            {flower.title}
          </h2>


          <p className="flower-hero-description">
            {flower.description}
          </p>


          {/* FEELINGS */}

          {flower.feelings?.length > 0 && (

            <div className="flower-hero-feelings">

              {flower.feelings.map(
                (feeling) => {

                  const Icon =
                    getFeelingIcon(feeling);

                  return (
                    <div
                      className="flower-hero-feeling"
                      key={feeling}
                    >

                      <Icon
                        size={19}
                        strokeWidth={1.7}
                      />

                      <span>
                        {feeling}
                      </span>

                    </div>
                  );
                }
              )}

            </div>

          )}

        </div>

      </section>


      {/* =====================================
          MEANING BY COLOR
      ====================================== */}

      {flower.colors?.length > 0 &&
        selectedColor && (

        <section className="flower-color-section">


          {/* HEADING */}

          <div className="flower-color-heading">

            <p className="flower-detail-eyebrow">
              MEANING BY COLOR
            </p>

            <h2>
              What does each{" "}
              {flower.name.toLowerCase()}{" "}
              color say?
            </h2>

            <p>
              Select a color to explore its meaning
              and see gift ideas that match.
            </p>

          </div>


          {/* =================================
              COLOR BUTTONS
          ================================== */}

          <div className="flower-color-selector">

            {flower.colors.map((color) => {

              /*
                If the user has not selected
                anything yet, the first flower
                color is active automatically.
              */

              const isActive =
                selectedColor.id === color.id;

              return (
                <button
                  type="button"
                  key={color.id}
                  className={`flower-color-button ${
                    isActive
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedColorId(
                      color.id
                    )
                  }
                >

                  <span
                    className="flower-color-swatch"
                    style={{
                      backgroundColor:
                        color.hex,
                    }}
                  />

                  <span>
                    {color.name}
                  </span>

                </button>
              );
            })}

          </div>


          {/* =================================
              SELECTED COLOR PANEL
          ================================== */}

          <article className="flower-meaning-card">


            {/* IMAGE */}

            <div
              className={`flower-meaning-image ${
                selectedColor.image
                  ? "flower-meaning-image-has-photo"
                  : ""
              }`}
              style={
                selectedColor.image
                  ? {
                      backgroundImage:
                        `url(${selectedColor.image})`,
                    }
                  : undefined
              }
            >

              {!selectedColor.image && (
                <span>
                  {selectedColor.name}{" "}
                  {flower.name} Image
                </span>
              )}


              <div className="flower-meaning-image-gradient" />


              <span className="flower-image-number">

                {String(
                  flower.colors.findIndex(
                    (color) =>
                      color.id ===
                      selectedColor.id
                  ) + 1
                ).padStart(2, "0")}

                {" / "}

                {String(
                  flower.colors.length
                ).padStart(2, "0")}

              </span>

            </div>


            {/* CONTENT */}

            <div className="flower-meaning-content">


              <p className="flower-detail-eyebrow flower-meaning-eyebrow">

                {selectedColor.name.toUpperCase()}{" "}
                {flower.name.toUpperCase()}

              </p>


              <h2>
                {selectedColor.title}
              </h2>


              <p className="flower-meaning-description">
                {selectedColor.description}
              </p>


              <div className="flower-meaning-meta">


                {/* EXPRESSES */}

                {selectedColor.expresses?.length > 0 && (

                  <div className="flower-meaning-meta-item">

                    <div className="flower-meta-title">

                      <Heart
                        size={22}
                        strokeWidth={1.7}
                      />

                      <span>
                        EXPRESSES
                      </span>

                    </div>


                    <div className="flower-meta-tags">

                      {selectedColor.expresses.map(
                        (item) => (

                          <span key={item}>
                            {item}
                          </span>

                        )
                      )}

                    </div>

                  </div>

                )}


                {/* PERFECT FOR */}

                {selectedColor.occasions?.length > 0 && (

                  <div className="flower-meaning-meta-item">

                    <div className="flower-meta-title">

                      <Gift
                        size={22}
                        strokeWidth={1.7}
                      />

                      <span>
                        PERFECT FOR
                      </span>

                    </div>


                    <div className="flower-meta-tags">

                      {selectedColor.occasions.map(
                        (item) => (

                          <span key={item}>
                            {item}
                          </span>

                        )
                      )}

                    </div>

                  </div>

                )}

              </div>

            </div>

          </article>

        </section>

      )}


      {/* =====================================
          RELATED GIFTS
      ====================================== */}

      <section className="flower-related-section">


        {/* HEADING */}

        <div className="flower-related-heading">

          <div>

            <p className="flower-detail-eyebrow">
              FIND SOMETHING WITH THIS MEANING
            </p>

            <h2>
              Gifts that say{" "}

              {selectedColor
                ?.expresses?.[0]
                ?.toLowerCase() ||
                flower.feelings
                  ?.[0]
                  ?.toLowerCase() ||
                "it"}{" "}

              beautifully.
            </h2>

          </div>


          {/* VIEW ALL */}

          <button
            type="button"
            className="flower-view-all-btn"
            onClick={() =>
              navigate(
                `/shop?flower=${encodeURIComponent(
                  flower.name
                )}`
              )
            }
          >
            View All {flower.name} Gifts
          </button>

        </div>


        {/* =================================
            REAL PRODUCT GRID
        ================================== */}

        <div className="flower-product-grid">


          {relatedProducts.length > 0 ? (

            relatedProducts.map(
              (product) => {

                const saved =
                  isWishlisted(
                    product.id
                  );


                /* WISHLIST */

                const handleWishlist =
                  (event) => {

                    event.stopPropagation();

                    toggleWishlist(
                      product
                    );
                  };


                /* CUSTOMIZE / CART */

                const openCustomization =
                  (event) => {

                    event.stopPropagation();

                    navigate(
                      `/product/${product.id}?customize=true`
                    );
                  };


                return (

                  <article
                    className="flower-product-card"
                    key={product.id}
                    onClick={() =>
                      navigate(
                        `/product/${product.id}`
                      )
                    }
                  >


                    {/* PRODUCT IMAGE */}

                    <div
                      className={`flower-product-image ${
                        product.image
                          ? "flower-product-image-has-photo"
                          : ""
                      }`}
                      style={
                        product.image
                          ? {
                              backgroundImage:
                                `url(${product.image})`,
                            }
                          : undefined
                      }
                    >


                      {!product.image && (
                        <span>
                          {product.name} Image
                        </span>
                      )}


                      <div className="flower-product-gradient" />


                      {/* BADGE */}

                      {product.badge && (

                        <span className="flower-product-badge">
                          {product.badge}
                        </span>

                      )}


                      {/* WISHLIST BUTTON */}

                      <button
                        type="button"
                        className={`flower-product-heart ${
                          saved
                            ? "saved"
                            : ""
                        }`}
                        aria-label={
                          saved
                            ? `Remove ${product.name} from wishlist`
                            : `Add ${product.name} to wishlist`
                        }
                        onClick={
                          handleWishlist
                        }
                      >

                        <Heart
                          size={17}
                          strokeWidth={1.8}
                          fill={
                            saved
                              ? "currentColor"
                              : "none"
                          }
                        />

                      </button>


                      {/* PRODUCT INFORMATION */}

                      <div className="flower-product-info">


                        <h3>
                          {product.name}
                        </h3>


                        <div className="flower-product-bottom">


                          {/* PRICE */}

                          <span className="flower-product-price">

                            $
                            {Number(
                              product.price
                            ).toFixed(2)}

                          </span>


                          {/* RATING */}

                          <div className="flower-product-rating">

                            <Star
                              size={13}
                              fill="currentColor"
                              strokeWidth={1.5}
                            />

                            <strong>
                              {product.rating}
                            </strong>

                            <span>
                              ({product.reviews} reviews)
                            </span>

                          </div>


                          {/* CART / CUSTOMIZE */}

                          <button
                            type="button"
                            className="flower-product-cart"
                            aria-label={`Personalize ${product.name}`}
                            title="Personalize and add to basket"
                            onClick={
                              openCustomization
                            }
                          >

                            <ShoppingCart
                              size={16}
                              strokeWidth={1.8}
                            />

                          </button>


                        </div>

                      </div>

                    </div>

                  </article>

                );
              }
            )

          ) : (

            <div className="flower-related-empty">

              <p>
                No {flower.name} gifts
                are available yet.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/shop")
                }
              >
                Explore All Gifts
              </button>

            </div>

          )}

        </div>

      </section>

    </main>
  );
}


export default FlowerDetail;