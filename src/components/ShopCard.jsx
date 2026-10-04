import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, MapPin, Star } from "lucide-react";

function ShopCard({
  id,
  image,
  name,
  location,
  category,
  rating,
  reviews,
}) {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);

  // Save / unsave shop
  const handleSave = (event) => {
    event.stopPropagation();
    setIsSaved((prev) => !prev);
  };

  // Open shop detail page
  const handleVisitShop = () => {
    navigate(`/local-shops/${id}`);
  };

  return (
    <div className="shop-card">
      {/* SHOP IMAGE */}
      <div className="shop-image-wrapper">
        <img
          src={image}
          alt={name}
          className="shop-image"
        />

        {/* SAVE BUTTON */}
        <button
          type="button"
          className={`shop-save-btn ${isSaved ? "saved" : ""}`}
          onClick={handleSave}
          aria-label={isSaved ? "Remove saved shop" : "Save shop"}
        >
          <Bookmark
            fill={isSaved ? "#D35B8C" : "none"}
            color={isSaved ? "#D35B8C" : "#A36F7E"}
          />
        </button>
      </div>

      {/* SHOP INFORMATION */}
      <div className="shop-card-content">
        <h3>{name}</h3>

        <div className="shop-location">
          <MapPin />
          <span>{location}</span>
        </div>

        <p className="shop-category">{category}</p>

        {/* BOTTOM */}
        <div className="shop-bottom">
          <div className="shop-rating">
            <Star />

            <span>
              {rating} ({reviews})
            </span>
          </div>

          {/* VISIT SHOP */}
          <button
            type="button"
            className="visit-shop-btn"
            onClick={handleVisitShop}
          >
            Visit Shop
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShopCard;