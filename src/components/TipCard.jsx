import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function TipCard({
  id,
  image,
  category,
  title,
  description,
}) {
  const navigate = useNavigate();

  const handleReadMore = () => {
    navigate(`/petalia-tips/${id}`);
  };

  return (
    <article
      className="tip-card"
      onClick={handleReadMore}
    >
      <img
        src={image}
        alt={title}
        className="tip-image"
      />

      <div className="tip-overlay"></div>

      <div className="tip-content">
        <span className="tip-category">
          {category}
        </span>

        <h3>{title}</h3>

        <p>{description}</p>

        <button
          type="button"
          className="tip-read-more"
          onClick={(event) => {
            event.stopPropagation();
            handleReadMore();
          }}
        >
          Read more
          <ArrowRight size={14} />
        </button>
      </div>
    </article>
  );
}

export default TipCard;