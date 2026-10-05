import {
  ExternalLink,
  ChevronDown,
} from "lucide-react";

import "../styles/VendorHeader.css";
import petaliaLogo from "../assets/petalia-logo.png";

function VendorHeader({ shop }) {

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
      "noopener,noreferrer"
    );
  };


  return (
    <header className="vendor-center-header">

      {/* =========================
          LEFT
      ========================= */}

      <div className="vendor-center-brand">

        <img
          src={petaliaLogo}
          alt="Petalia"
          className="vendor-center-logo"
        />

        <div className="vendor-center-divider"></div>

        <span className="vendor-center-title">
          Seller Center
        </span>

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
        >
          View Shop

          <ExternalLink size={14} />
        </button>


        {/* SELLER ACCOUNT */}

        <button
          type="button"
          className="vendor-center-account"
        >

          <span className="vendor-center-avatar">
            {shop?.name?.charAt(0)?.toUpperCase() || "S"}
          </span>

          <span className="vendor-center-account-text">

            <small>
              Seller Account
            </small>

            <strong>
              {shop?.name || "My Shop"}
            </strong>

          </span>

          <ChevronDown size={16} />

        </button>

      </div>

    </header>
  );
}

export default VendorHeader;