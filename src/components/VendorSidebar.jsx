import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  CircleUserRound,
  Settings,
  LogOut,
} from "lucide-react";

import { supabase } from "../lib/supabase";

import sidebarFlowers from "../assets/blur sakura.png";
import localShop1 from "../assets/local-shop-1.jpg";

function VendorSidebar({ shop }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/sign-in");
  };

  const handleProducts = () => {
    // If already on dashboard, scroll directly to products.
    if (location.pathname === "/vendor-dashboard") {
      document.querySelector(".vendor-products-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      return;
    }

    // From another seller page, return to dashboard.
    navigate("/vendor-dashboard#products");
  };

  const isDashboard = location.pathname === "/vendor-dashboard";

  const isShopProfile = location.pathname === "/vendor/shop-profile";

  const isOrders = location.pathname === "/vendor/orders";

  const isSettings = location.pathname === "/vendor/settings";

  const isProducts = location.pathname.startsWith("/vendor/products");

  return (
    <aside className="vendor-sidebar">
      {/* SHOP ACCOUNT */}
      <div className="vendor-shop-card">
        <img
          src={shop?.logo_image || localShop1}
          alt={shop?.name || "Seller shop"}
          className="vendor-shop-avatar"
        />

        <div className="vendor-shop-card-info">
          <strong>{shop?.name || "My Shop"}</strong>
          <span>Seller Account</span>
        </div>
      </div>

      {/* MAIN NAVIGATION */}
      <nav className="vendor-sidebar-nav">
        <button
          type="button"
          className={`vendor-nav-item ${isDashboard ? "active" : ""}`}
          onClick={() => navigate("/vendor-dashboard")}
        >
          <LayoutDashboard size={19} />
          <span>Dashboard</span>
        </button>

        <button
          type="button"
          className={`vendor-nav-item ${isProducts ? "active" : ""}`}
          onClick={handleProducts}
        >
          <Package size={19} />
          <span>Products</span>
        </button>

        <button
          type="button"
          className={`vendor-nav-item ${isOrders ? "active" : ""}`}
          onClick={() => navigate("/vendor/orders")}
        >
          <ClipboardList size={19} />
          <span>Orders</span>
        </button>

        <button
          type="button"
          className={`vendor-nav-item ${isShopProfile ? "active" : ""}`}
          onClick={() => navigate("/vendor/shop-profile")}
        >
          <CircleUserRound size={19} />
          <span>Shop Profile</span>
        </button>
      </nav>

      <div className="vendor-sidebar-divider" />

      {/* BOTTOM NAVIGATION */}
      <div className="vendor-sidebar-bottom">
        <button
          type="button"
          className={`vendor-nav-item ${isSettings ? "active" : ""}`}
          onClick={() => navigate("/vendor/settings")}
        >
          <Settings size={19} />
          <span>Settings</span>
        </button>

        <button
          type="button"
          className="vendor-nav-item"
          onClick={handleLogout}
        >
          <LogOut size={19} />
          <span>Log Out</span>
        </button>
      </div>

      {/* DECORATION */}
      <div className="vendor-sidebar-decoration">
        <img src={sidebarFlowers} alt="" className="sidebar-flower-image" />

        <div className="sidebar-flower-text">
          Flowers
          <br />
          Gifts
          <br />
          Brighter Days
        </div>
      </div>
    </aside>
  );
}

export default VendorSidebar;
