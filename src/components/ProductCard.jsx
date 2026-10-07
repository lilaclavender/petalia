import { useNavigate } from "react-router-dom";

import { Heart, ShoppingCart, Star } from "lucide-react";

import usePetalia from "../context/usePetalia";

function ProductCard({
  id,
  image,
  name,
  price,
  rating,
  reviews,
  badge,
  category,
  description,
}) {
  const navigate = useNavigate();

  const { isWishlisted, toggleWishlist } = usePetalia();

  const saved = isWishlisted(id);

  const product = {
    id,
    image,
    name,
    price,
    rating,
    reviews,
    badge,
    category,
    description,
  };

  const openProduct = () => {
    navigate(`/product/${id}`);
  };

  const openCustomization = (event) => {
    event.stopPropagation();

    navigate(`/product/${id}?customize=true`);
  };

  const handleWishlist = (event) => {
    event.stopPropagation();

    toggleWishlist(product);
  };

  return (
    <article className="product-card" onClick={openProduct}>
      <img src={image} alt={name} className="product-card-image" />

      <div className="product-card-overlay" />

      {badge && <span className="product-badge">{badge}</span>}

      <button
        type="button"
        className={`product-heart ${saved ? "active" : ""}`}
        onClick={handleWishlist}
        aria-label={
          saved ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`
        }
      >
        <Heart fill={saved ? "currentColor" : "none"} />
      </button>

      <div className="product-card-content">
        <h3>{name}</h3>

        {description?.trim() && (
          <p className="product-card-description">{description}</p>
        )}

        <div className="product-card-bottom">
          <span className="product-price">${price}</span>

          <div className="product-card-actions">
            <div className="product-rating">
              <Star fill="currentColor" />

              <span>{rating}</span>

              <small>({reviews} reviews)</small>
            </div>

            <button
              type="button"
              className="product-cart-btn"
              onClick={openCustomization}
              aria-label={`Personalize ${name}`}
              title="Personalize and add to basket"
            >
              <ShoppingCart />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
