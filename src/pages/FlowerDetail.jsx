import { useEffect, useMemo, useState } from "react";
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
import { getProducts } from "../data/productService";
import usePetalia from "../context/usePetalia";

import "../styles/FlowerDetail.css";

const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const flowerTerms = {
  rose: ["rose", "roses"],
  tulip: ["tulip", "tulips"],
  lily: ["lily", "lilies"],
  orchid: ["orchid", "orchids"],
  sunflower: ["sunflower", "sunflowers"],
  "gerbera-daisy": ["gerbera", "gerbera daisy", "gerbera daisies"],
  "babys-breath": ["baby's breath", "babys breath", "baby’s breath"],
  jasmine: ["jasmine"],
  lotus: ["lotus"],
};

function matchesFlower(product, flower) {
  const terms = flowerTerms[flower.id] || [normalize(flower.name)];
  const metadata = normalize(product.flower);

  // Use structured metadata when available.
  if (metadata) {
    const parts = metadata.split(/[,;/&]+/).map(normalize);
    return parts.some((part) => terms.includes(part));
  }

  // Match whole words rather than unrelated partial names.
  const name = normalize(product.name).replace(/[’]/g, "'");

  return terms.some((term) => {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`\\b${escaped}\\b`, "i").test(name);
  });
}

function getFeelingIcon(feeling) {
  const text = normalize(feeling);

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
}

function FlowerDetail() {
  const navigate = useNavigate();
  const { flowerId } = useParams();
  const { isWishlisted, toggleWishlist } = usePetalia();

  const flower = flowersData[flowerId];

  // Store the flower ID too, so changing guides resets the selection.
  const [colorSelection, setColorSelection] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState("");

  useEffect(() => {
    let cancelled = false;

    getProducts()
      .then((data) => {
        if (!cancelled) {
          setProducts(data);
          setProductsError("");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProductsError(
            "We couldn't load gift ideas. Please refresh to try again.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingProducts(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedColor = useMemo(() => {
    const colors = flower?.colors || [];

    if (!colors.length) {
      return null;
    }

    const selected =
      colorSelection?.flowerId === flowerId
        ? colors.find((color) => color.id === colorSelection.colorId)
        : null;

    return selected || colors.find((color) => color.image) || colors[0];
  }, [flower, flowerId, colorSelection]);

  const relatedProducts = useMemo(() => {
    if (!flower) {
      return [];
    }

    // A candle named after a flower is not a flower bouquet.
    const matching = products.filter(
      (product) =>
        product.category === "Flowers" && matchesFlower(product, flower),
    );

    const selectedName = normalize(selectedColor?.name);
    const colorMatches = selectedName
      ? matching.filter(
          (product) => normalize(product.flowerColor) === selectedName,
        )
      : [];

    return (colorMatches.length ? colorMatches : matching).slice(0, 4);
  }, [products, flower, selectedColor]);

  if (!flower) {
    return (
      <main className="flower-detail-page">
        <section className="flower-not-found">
          <p className="flower-detail-eyebrow">FLOWER MEANING</p>
          <h1>Flower not found.</h1>
          <p>This flower guide has not been added yet.</p>

          <button
            type="button"
            onClick={() => navigate("/petalia-tips/flower-meanings")}
          >
            Back to Flower Meanings
          </button>
        </section>
      </main>
    );
  }

  const colorNumber =
    flower.colors.findIndex((color) => color.id === selectedColor?.id) + 1;

  const meaning =
    selectedColor?.expresses?.[0] || flower.feelings?.[0] || "care";

  return (
    <main className="flower-detail-page">
      <div className="flower-detail-breadcrumb-wrap">
        <div className="flower-detail-breadcrumb">
          <button type="button" onClick={() => navigate("/")}>
            Home
          </button>

          <span>/</span>

          <button type="button" onClick={() => navigate("/petalia-tips")}>
            Petalia Tips
          </button>

          <span>/</span>

          <button
            type="button"
            onClick={() => navigate("/petalia-tips/flower-meanings")}
          >
            Flower Meanings
          </button>

          <span>/</span>
          <strong>{flower.name}</strong>
        </div>
      </div>

      <section
        className={`flower-detail-hero ${
          flower.image ? "flower-detail-hero-has-image" : ""
        }`}
        style={
          flower.image
            ? { backgroundImage: `url("${flower.image}")` }
            : undefined
        }
      >
        {!flower.image && (
          <div className="flower-hero-placeholder">
            {flower.name} · Photo coming soon
          </div>
        )}

        <div className="flower-hero-overlay" />

        <div className="flower-hero-content">
          <p className="flower-detail-eyebrow flower-hero-eyebrow">
            {flower.eyebrow}
          </p>

          <h1>{flower.name}</h1>
          <h2>{flower.title}</h2>

          <p className="flower-hero-description">{flower.description}</p>

          {flower.feelings?.length > 0 && (
            <div className="flower-hero-feelings">
              {flower.feelings.map((feeling) => {
                const Icon = getFeelingIcon(feeling);

                return (
                  <div className="flower-hero-feeling" key={feeling}>
                    <Icon size={19} strokeWidth={1.7} />
                    <span>{feeling}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {selectedColor && (
        <section className="flower-color-section">
          <div className="flower-color-heading">
            <p className="flower-detail-eyebrow">MEANING BY COLOR</p>

            <h2>What does each {flower.name.toLowerCase()} color say?</h2>

            <p>Select a color to explore its meaning and gift ideas.</p>
          </div>

          <div className="flower-color-selector">
            {flower.colors.map((color) => (
              <button
                type="button"
                key={color.id}
                className={`flower-color-button ${
                  selectedColor.id === color.id ? "active" : ""
                }`}
                aria-pressed={selectedColor.id === color.id}
                onClick={() =>
                  setColorSelection({
                    flowerId,
                    colorId: color.id,
                  })
                }
              >
                <span
                  className="flower-color-swatch"
                  style={{ backgroundColor: color.hex }}
                />
                <span>{color.name}</span>
              </button>
            ))}
          </div>

          <article className="flower-meaning-card">
            <div
              className={`flower-meaning-image ${
                selectedColor.image ? "flower-meaning-image-has-photo" : ""
              }`}
              style={
                selectedColor.image
                  ? {
                      backgroundImage: `url("${selectedColor.image}")`,
                    }
                  : undefined
              }
            >
              {!selectedColor.image && (
                <span>
                  {selectedColor.name} {flower.name}
                  <br />
                  Photo coming soon
                </span>
              )}

              <div className="flower-meaning-image-gradient" />

              <span className="flower-image-number">
                {String(colorNumber).padStart(2, "0")}
                {" / "}
                {String(flower.colors.length).padStart(2, "0")}
              </span>
            </div>

            <div className="flower-meaning-content">
              <p className="flower-detail-eyebrow flower-meaning-eyebrow">
                {selectedColor.name.toUpperCase()} {flower.name.toUpperCase()}
              </p>

              <h2>{selectedColor.title}</h2>

              <p className="flower-meaning-description">
                {selectedColor.description}
              </p>

              <div className="flower-meaning-meta">
                {selectedColor.expresses?.length > 0 && (
                  <div className="flower-meaning-meta-item">
                    <div className="flower-meta-title">
                      <Heart size={22} strokeWidth={1.7} />
                      <span>EXPRESSES</span>
                    </div>

                    <div className="flower-meta-tags">
                      {selectedColor.expresses.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedColor.occasions?.length > 0 && (
                  <div className="flower-meaning-meta-item">
                    <div className="flower-meta-title">
                      <Gift size={22} strokeWidth={1.7} />
                      <span>PERFECT FOR</span>
                    </div>

                    <div className="flower-meta-tags">
                      {selectedColor.occasions.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </article>
        </section>
      )}

      <section className="flower-related-section">
        <div className="flower-related-heading">
          <div>
            <p className="flower-detail-eyebrow">EXPLORE THIS FLOWER</p>

            <h2>{flower.name} gifts to explore.</h2>

            <p>
              Discover bouquets featuring this flower. Meanings such as{" "}
              {meaning.toLowerCase()} can vary by color.
            </p>
          </div>

          <button
            type="button"
            className="flower-view-all-btn"
            onClick={() => navigate("/shop")}
          >
            Explore All Gifts
          </button>
        </div>

        <div className="flower-product-grid" aria-busy={loadingProducts}>
          {loadingProducts ? (
            <div className="flower-related-empty">
              <p>Loading gift ideas...</p>
            </div>
          ) : productsError ? (
            <div className="flower-related-empty">
              <p role="alert">{productsError}</p>
            </div>
          ) : relatedProducts.length > 0 ? (
            relatedProducts.map((product) => {
              const saved = isWishlisted(product.id);

              return (
                <article className="flower-product-card" key={product.id}>
                  <div
                    className={`flower-product-image ${
                      product.image ? "flower-product-image-has-photo" : ""
                    }`}
                    style={
                      product.image
                        ? {
                            backgroundImage: `url("${product.image}")`,
                          }
                        : undefined
                    }
                  >
                    {!product.image && (
                      <span>{product.name} · Photo coming soon</span>
                    )}

                    <div className="flower-product-gradient" />

                    {product.badge && (
                      <span className="flower-product-badge">
                        {product.badge}
                      </span>
                    )}

                    <button
                      type="button"
                      className={`flower-product-heart ${saved ? "saved" : ""}`}
                      aria-label={
                        saved
                          ? `Remove ${product.name} from wishlist`
                          : `Add ${product.name} to wishlist`
                      }
                      onClick={() => toggleWishlist(product)}
                    >
                      <Heart
                        size={17}
                        strokeWidth={1.8}
                        fill={saved ? "currentColor" : "none"}
                      />
                    </button>

                    <div className="flower-product-info">
                      <h3>
                        <a
                          href={`/product/${product.id}`}
                          onClick={(event) => {
                            if (
                              event.button === 0 &&
                              !event.ctrlKey &&
                              !event.metaKey &&
                              !event.shiftKey &&
                              !event.altKey
                            ) {
                              event.preventDefault();
                              navigate(`/product/${product.id}`);
                            }
                          }}
                          style={{
                            color: "inherit",
                            textDecoration: "none",
                          }}
                        >
                          {product.name}
                        </a>
                      </h3>

                      <div className="flower-product-bottom">
                        <span className="flower-product-price">
                          ${Number(product.price).toFixed(2)}
                        </span>

                        {Number(product.reviews) > 0 &&
                          Number(product.rating) > 0 && (
                            <div className="flower-product-rating">
                              <Star
                                size={13}
                                fill="currentColor"
                                strokeWidth={1.5}
                              />
                              <strong>{product.rating}</strong>
                              <span>({product.reviews} reviews)</span>
                            </div>
                          )}

                        <button
                          type="button"
                          className="flower-product-cart"
                          aria-label={`Personalize ${product.name}`}
                          title="Personalize and add to basket"
                          onClick={() =>
                            navigate(`/product/${product.id}?customize=true`)
                          }
                        >
                          <ShoppingCart size={16} strokeWidth={1.8} />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="flower-related-empty">
              <p>No {flower.name} bouquets are available yet.</p>

              <button type="button" onClick={() => navigate("/shop")}>
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
