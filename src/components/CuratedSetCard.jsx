import { useNavigate } from "react-router-dom";

function CuratedSetCard({
  id,
  image,
  name,
  description,
  price,
}) {
  const navigate = useNavigate();

  // Open curated set product detail
  const handleViewSet = () => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="curated-card">
      {/* SET IMAGE */}
      <div className="curated-image-wrapper">
        <img
          src={image}
          alt={name}
          className="curated-image"
        />
      </div>

      {/* SET INFORMATION */}
      <div className="curated-content">
        <h3>{name}</h3>

        <p>{description}</p>

        <div className="curated-bottom">
          <span className="curated-price">
            ${price}
          </span>

          <button
            type="button"
            className="curated-view-btn"
            onClick={handleViewSet}
          >
            View Set
          </button>
        </div>
      </div>
    </div>
  );
}

export default CuratedSetCard;