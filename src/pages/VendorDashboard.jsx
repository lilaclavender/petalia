import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

import {
  MapPin,
  Tag,
  Flower2,
  ShoppingBag,
  ChartNoAxesCombined,
  Star,
  Search,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import "../styles/VendorDashboard.css";
import VendorHeader from "../components/VendorHeader";
import VendorSidebar from "../components/VendorSidebar";
import productImages from "../data/productImages";
import localShop1 from "../assets/local-shop-1.jpg";
import VendorFooter from "../components/VendorFooter";

function VendorDashboard() {
  const vendorProductImages = {
    "Classic Red Rose Bouquet": productImages[1],
    "Blush Pink Rose Bouquet": productImages[2],
    "Sunshine Sunflower Bouquet": productImages[3],
    "Pink Tulip Bouquet": productImages[4],
    "Pink Rose & Vanilla Candle Gift Set": productImages[11],
    "Sunflower & Scented Candle Gift Set": productImages[12],
  };

  const navigate = useNavigate();

  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [orderCount, setOrderCount] = useState(null);
  const [paidOrderTotal, setPaidOrderTotal] = useState(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");

  useEffect(() => {
    const loadVendor = async () => {
      // Get logged-in user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        navigate("/sign-in");
        return;
      }

      console.log("LOGGED IN USER:", user.id);
      console.log("LOGGED IN EMAIL:", user.email);

      // Get shop owned by logged-in user
      const { data: shopData, error: shopError } = await supabase
        .from("shops")
        .select("*")
        .eq("owner_id", user.id)
        .maybeSingle();

      if (shopError) {
        console.error("Error loading shop:", shopError);
        setLoading(false);
        return;
      }

      console.log("SHOP DATA:", shopData);
      console.log("SHOP ERROR:", shopError);

      if (!shopData) {
        setLoading(false);
        return;
      }

      setShop(shopData);
      // Count every order belonging to this shop.
      const { count, error: countError } = await supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("shop_id", shopData.id);

      if (countError) {
        console.error("Error counting shop orders:", countError);
      } else {
        setOrderCount(count ?? 0);
      }

      // Sum verified paid orders, excluding cancelled/refunded orders.
      // This is an order-value summary, not a seller payout calculation.
      const { data: paidOrders, error: revenueError } = await supabase
        .from("orders")
        .select("total, status")
        .eq("shop_id", shopData.id)
        .eq("payment_status", "paid");

      if (revenueError) {
        console.error("Error loading paid orders:", revenueError);
      } else {
        const excludedStatuses = ["cancelled", "canceled", "refunded"];

        const total = (paidOrders ?? []).reduce((sum, order) => {
          const status = String(order.status ?? "")
            .trim()
            .toLowerCase();

          if (excludedStatuses.includes(status)) return sum;

          const amount = Number(order.total);
          return sum + (Number.isFinite(amount) ? amount : 0);
        }, 0);

        setPaidOrderTotal(total);
      }

      // Get products from this shop
      const { data: productData, error: productError } = await supabase
        .from("products")
        .select("*")
        .eq("shop_id", shopData.id)
        .order("id", { ascending: true });

      if (productError) {
        console.error("Error loading vendor products:", productError);
      } else {
        setProducts(productData || []);
      }

      setLoading(false);
    };

    loadVendor();
  }, [navigate]);

  // Categories
  const categories = [
    "All Categories",
    ...new Set(products.map((product) => product.category).filter(Boolean)),
  ];

  // Search + category filter
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All Categories" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  // Delete product
  const handleDeleteProduct = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      // Get current logged-in seller
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        navigate("/sign-in");
        return;
      }

      // Get seller's shop
      const { data: shopData, error: shopError } = await supabase
        .from("shops")
        .select("id")
        .eq("owner_id", user.id)
        .maybeSingle();

      if (shopError) {
        throw shopError;
      }

      if (!shopData) {
        throw new Error("Your seller shop could not be found.");
      }

      // Delete only if this product belongs to seller's shop
      const { error: deleteError } = await supabase
        .from("products")
        .delete()
        .eq("id", product.id)
        .eq("shop_id", shopData.id);

      if (deleteError) {
        throw deleteError;
      }

      // Remove product from dashboard immediately
      setProducts((previousProducts) =>
        previousProducts.filter((item) => item.id !== product.id),
      );

      alert(`"${product.name}" was deleted successfully.`);
    } catch (error) {
      console.error("Delete product error:", error);

      alert(error.message || "The product could not be deleted.");
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="vendor-loading">
        <Flower2 size={32} />
        <p>Loading your shop...</p>
      </div>
    );
  }

  // No shop
  if (!shop) {
    return (
      <div className="vendor-loading">
        <h1>Vendor Dashboard</h1>
        <p>No shop was found for this account.</p>
      </div>
    );
  }

  return (
    <div className="vendor-center-page">
      {/* ================= SELLER HEADER ================= */}
      <VendorHeader shop={shop} />

      <div className="vendor-dashboard">
        <VendorSidebar shop={shop} />
        {/* ================= MAIN ================= */}

        <main className="vendor-main">
          {/* ================= HERO ================= */}

          <section className="vendor-hero">
            <div className="vendor-hero-content">
              <span className="vendor-greeting">GOOD AFTERNOON,</span>

              <h1>{shop.name}</h1>

              <p>
                Manage your products, orders, and grow your shop
                <br />
                with Petalia.
              </p>

              <div className="vendor-shop-meta">
                <span>
                  <MapPin size={18} />
                  {shop.location}
                </span>

                <span>
                  <Tag size={18} />
                  {shop.category}
                </span>
              </div>
            </div>

            <div className="vendor-hero-image">
              <img
                src={localShop1}
                alt={shop.name}
                className="vendor-shop-hero-img"
              />

              <div className="vendor-hero-overlay" />
            </div>
          </section>

          {/* ================= STAT CARDS ================= */}

          <section className="vendor-stats">
            {/* PRODUCTS */}
            <div className="vendor-stat-card">
              <div className="stat-icon pink">
                <Flower2 size={29} />
              </div>

              <div className="stat-info">
                <strong>{products.length}</strong>
                <span>Products</span>
              </div>

              <svg
                className="stat-trend pink-line"
                viewBox="0 0 70 35"
                fill="none"
              >
                <defs>
                  <linearGradient
                    id="productGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="currentColor"
                      stopOpacity="0.18"
                    />

                    <stop
                      offset="100%"
                      stopColor="currentColor"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>

                <path
                  d="
                    M2 31
                    C12 29, 15 15, 25 17
                    C35 19, 38 8, 47 10
                    C56 11, 59 3, 68 2
                    L68 35
                    L2 35
                    Z
                  "
                  fill="url(#productGradient)"
                />

                <path
                  d="
                    M2 31
                    C12 29, 15 15, 25 17
                    C35 19, 38 8, 47 10
                    C56 11, 59 3, 68 2
                  "
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* ORDERS */}
            <div className="vendor-stat-card">
              <div className="stat-icon pink">
                <ShoppingBag size={29} strokeWidth={1.7} />
              </div>

              <div className="stat-info">
                <strong>{orderCount === null ? "—" : orderCount}</strong>
                <span>Total Orders</span>
              </div>

              <svg
                className="stat-trend pink-line"
                viewBox="0 0 70 35"
                fill="none"
              >
                <defs>
                  <linearGradient
                    id="orderGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="currentColor"
                      stopOpacity="0.18"
                    />

                    <stop
                      offset="100%"
                      stopColor="currentColor"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>

                <path
                  d="
                    M2 31
                    C10 22, 16 27, 23 19
                    C31 10, 37 18, 45 11
                    C53 4, 60 8, 68 2
                    L68 35
                    L2 35
                    Z
                  "
                  fill="url(#orderGradient)"
                />

                <path
                  d="
                    M2 31
                    C10 22, 16 27, 23 19
                    C31 10, 37 18, 45 11
                    C53 4, 60 8, 68 2
                  "
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* REVENUE */}
            <div className="vendor-stat-card">
              <div className="stat-icon green">
                <ChartNoAxesCombined size={29} strokeWidth={1.7} />
              </div>

              <div className="stat-info">
                <strong>
                  {paidOrderTotal === null
                    ? "—"
                    : `$${paidOrderTotal.toFixed(2)}`}
                </strong>
                <span>Paid Order Total</span>
              </div>

              <svg
                className="stat-trend green-line"
                viewBox="0 0 70 35"
                fill="none"
              >
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="currentColor"
                      stopOpacity="0.18"
                    />

                    <stop
                      offset="100%"
                      stopColor="currentColor"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>

                <path
                  d="
                    M2 31
                    C10 25, 14 17, 23 20
                    C31 22, 35 10, 43 12
                    C52 14, 58 5, 68 2
                    L68 35
                    L2 35
                    Z
                  "
                  fill="url(#revenueGradient)"
                />

                <path
                  d="
                    M2 31
                    C10 25, 14 17, 23 20
                    C31 22, 35 10, 43 12
                    C52 14, 58 5, 68 2
                  "
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* RATING */}
            <div className="vendor-stat-card">
              <div className="stat-icon yellow">
                <Star size={30} strokeWidth={1.7} />
              </div>

              <div className="stat-info">
                <strong>—</strong>
                <span>Shop Rating</span>
              </div>

              <svg
                className="stat-trend yellow-line"
                viewBox="0 0 70 35"
                fill="none"
              >
                <defs>
                  <linearGradient
                    id="ratingGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="currentColor"
                      stopOpacity="0.18"
                    />

                    <stop
                      offset="100%"
                      stopColor="currentColor"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>

                <path
                  d="
                    M2 30
                    C11 20, 17 24, 25 17
                    C33 10, 40 17, 47 10
                    C55 3, 61 7, 68 2
                    L68 35
                    L2 35
                    Z
                  "
                  fill="url(#ratingGradient)"
                />

                <path
                  d="
                    M2 30
                    C11 20, 17 24, 25 17
                    C33 10, 40 17, 47 10
                    C55 3, 61 7, 68 2
                  "
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </section>

          {/* ================= PRODUCTS ================= */}

          <section className="vendor-products-section">
            <div className="vendor-products-header">
              <div>
                <h2>My Products</h2>

                <p>
                  Manage your shop&apos;s products. Add, edit, or remove
                  products anytime.
                </p>
              </div>

              <div className="vendor-product-tools">
                <div className="vendor-product-search">
                  <Search size={18} />

                  <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  className="vendor-add-product"
                  onClick={() => navigate("/vendor/products/add")}
                >
                  <Plus size={19} />
                  Add Product
                </button>
              </div>
            </div>

            {/* ================= PRODUCT TABLE ================= */}

            <div className="vendor-table-wrapper">
              <table className="vendor-product-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="vendor-empty-products">
                        No products found.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product.id}>
                        {/* Checkbox */}

                        {/* Product Image */}
                        <td>
                          <div className="vendor-product-image">
                            {vendorProductImages[product.name] ||
                            product.image ? (
                              <img
                                src={
                                  vendorProductImages[product.name] ||
                                  product.image
                                }
                                alt={product.name}
                              />
                            ) : (
                              <Flower2 size={22} />
                            )}
                          </div>
                        </td>

                        {/* Product Name */}
                        <td className="vendor-product-name">{product.name}</td>

                        {/* Category */}
                        <td>
                          <span
                            className={`vendor-category-badge ${
                              product.category?.toLowerCase().includes("gift")
                                ? "gift"
                                : ""
                            }`}
                          >
                            {product.category || "Product"}
                          </span>
                        </td>

                        {/* Price */}
                        <td>${Number(product.price || 0).toFixed(2)}</td>

                        {/* Status */}
                        <td>
                          <span className="vendor-status-badge">Active</span>
                        </td>

                        {/* Stock */}
                        <td>{product.stock ?? "—"}</td>

                        {/* Actions */}
                        <td>
                          <div className="vendor-actions">
                            <button
                              type="button"
                              className="vendor-product-edit-btn"
                              onClick={() =>
                                navigate(`/vendor/products/edit/${product.id}`)
                              }
                            >
                              <Pencil size={14} strokeWidth={1.8} />
                              <span>Edit</span>
                            </button>

                            <button
                              type="button"
                              className="vendor-delete-btn"
                              onClick={() => handleDeleteProduct(product)}
                            >
                              <Trash2 size={15} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* ================= PAGINATION ================= */}

            <div className="vendor-products-footer">
              <p>
                Showing {filteredProducts.length === 0 ? 0 : 1} -{" "}
                {filteredProducts.length} of {products.length} products
              </p>

              <div className="vendor-pagination">
                <button type="button">
                  <ChevronLeft size={17} />
                </button>

                <button type="button" className="current-page">
                  1
                </button>

                <button type="button">
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </section>
          <VendorFooter />
        </main>
      </div>
    </div>
  );
}
<VendorFooter />;

export default VendorDashboard;
