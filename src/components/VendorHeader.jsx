import { ExternalLink, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

import "../styles/VendorHeader.css";

function VendorHeader({ shop }) {
  const navigate = useNavigate();

  const handleViewShop = () => {
    if (!shop?.id) return;

    navigate(`/local-shops/${shop.id}`);
  };

  return (
    <header className="vendor-center-header">
      {/* LEFT */}
      <div className="vendor-center-brand">
        <button
          type="button"
          className="vendor-center-logo"
          onClick={() => navigate("/vendor-dashboard")}
        >
          Petalia
        </button>

        <span className="vendor-center-divider" />

        <span className="vendor-center-title">
          Seller Center
        </span>
      </div>

      {/* RIGHT */}
      <div className="vendor-center-actions">
        <button
          type="button"
          className="vendor-center-view-shop"
          onClick={handleViewShop}
        >
          View Shop
          <ExternalLink size={15} />
        </button>

        <button
          type="button"
          className="vendor-center-account"
        >
          <span className="vendor-center-avatar">
            {shop?.name?.charAt(0)?.toUpperCase() || "S"}
          </span>

          <span className="vendor-center-account-text">
            <small>Seller Account</small>
            <strong>{shop?.name || "My Shop"}</strong>
          </span>

          <ChevronDown size={16} />
        </button>
      </div>
    </header>
  );
}

export default VendorHeader;