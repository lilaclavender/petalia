import { ExternalLink, ChevronDown } from "lucide-react";

import "../styles/VendorHeader.css";
import petaliaLogo from "../assets/petalia-logo.png";
import { useNavigate } from "react-router-dom";

function VendorHeader({ shop }) {
  const navigate = useNavigate();

  /* =========================
     VIEW PUBLIC SHOP
  ========================= */

  const handleViewShop = () => {
    if (!shop?.id) {
      console.error("Shop ID is missing.");
      return;
    }

    window.open(
      `/local-shops/${shop.id}?sellerPreview=true`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <header className="vendor-center-header">
      {/* =========================
          LEFT
      ========================= */}

      <div className="vendor-center-brand">
        <img src={petaliaLogo} alt="Petalia" className="vendor-center-logo" />

        <div className="vendor-center-divider"></div>

        <span className="vendor-center-title">Seller Center</span>
      </div>

      {/* =========================
          RIGHT
      ========================= */}

      <div className="vendor-center-actions">
        {/* VIEW PUBLIC STOREFRONT */}

        <button
          type="button"
          className="vendor-view-shop"
          onClick={handleViewShop}
          aria-label="View your public shop in a new tab"
          title="View your public shop"
        >
          View Shop
          <ExternalLink size={14} />
        </button>

        {/* SELLER ACCOUNT */}

        <button
          type="button"
          className="vendor-center-account"
          onClick={() => navigate("/vendor/settings")}
          aria-label="Open seller account settings"
          title="Account settings"
        >
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
