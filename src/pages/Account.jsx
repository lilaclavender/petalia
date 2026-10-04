import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, ReceiptText, CreditCard, LogOut, Settings } from "lucide-react";
import { supabase } from "../lib/supabase";
import productImages from "../data/productImages";
import sakuraBranch1 from "../assets/sakura-branch1.png";
import "../styles/Account.css";

function Account() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Error loading user:", error);
        navigate("/sign-in");
        return;
      }

      if (!user) {
        navigate("/sign-in");
        return;
      }

      setUser(user);

      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (orderError) {
        console.error("Error loading orders:", orderError);
      } else {
        setOrders(orderData || []);
      }
    };

    loadUser();
  }, [navigate]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error);
      return;
    }

    navigate("/sign-in");
  };

  // Safely read the JSONB order items.
  // This also works if Supabase returns the items as a JSON string.
  const getOrderItems = (items) => {
    if (!items) return [];

    if (Array.isArray(items)) {
      return items;
    }

    if (typeof items === "string") {
      try {
        const parsedItems = JSON.parse(items);
        return Array.isArray(parsedItems) ? parsedItems : [];
      } catch (error) {
        console.error("Could not read order items:", error);
        return [];
      }
    }

    return [];
  };

  // Count actual purchased quantity.
  // Example: quantity 2 = "2 items", even if there is only one product object.
  const getTotalItemCount = (items) => {
    return items.reduce(
      (total, item) => total + Number(item.quantity || 1),
      0
    );
  };

  const getProductNames = (items) => {
    return items
      .map((item) => item.name)
      .filter(Boolean)
      .join(" + ");
  };

  const getOrderImage = (items) => {
    if (items.length === 0) return null;

    const firstItem = items[0];

    return productImages[firstItem.id] || null;
  };

  if (!user) {
    return <p>Loading account...</p>;
  }

  const fullName =
    user.user_metadata?.full_name || "Petalia Customer";

  const initial = fullName.charAt(0).toUpperCase();

  return (
    <main className="account-page">
      {/* Decorative background */}
    
      <div className="account-container">
        <img
          src={sakuraBranch1}
          alt=""
          className="account-sakura-branch"
          aria-hidden="true"
        />

        <div className="account-container"></div>
        
        {/* PAGE HEADING */}
        <div className="account-heading">
          <span>YOUR PETALIA SPACE</span>

          <h1>My Account</h1>

          <p>Your gifts, orders, and account details in one place.</p>
        </div>

        <div className="account-layout">
          {/* PROFILE */}
          <section className="account-profile-card">
            <div className="account-avatar">{initial}</div>

            <h2>{fullName}</h2>

            <p className="account-email">{user.email}</p>

            <div className="account-divider"></div>

            <button
              type="button"
              className="account-signout"
              onClick={handleSignOut}
            >
              <LogOut size={17} strokeWidth={1.7} />
              <span>Sign Out</span>
            </button>

            <button
              type="button"
              className="account-settings-button"
              onClick={() => navigate("/account/settings")}
            >
              <Settings size={17} />
              Account Settings
            </button>
          </section>

          {/* ORDERS */}
          <section className="account-orders">
            <div className="account-orders-heading">
              <div>
                <span>ORDER HISTORY</span>
                <h2>My Orders</h2>
              </div>

              <p>
                {orders.length} {orders.length === 1 ? "order" : "orders"}
              </p>
            </div>

            {orders.length === 0 ? (
              <div className="account-empty">
                <h3>No orders yet</h3>
                <p>Your Petalia orders will appear here.</p>
              </div>
            ) : (
              <div className="account-order-list">
                {orders.map((order) => {
                  const items = getOrderItems(order.items);

                  const itemCount = getTotalItemCount(items);

                  const productNames = getProductNames(items);

                  const orderImage = getOrderImage(items);

                  return (
                    <article
                      className="account-order-card"
                      key={order.id}
                    >
                      <div className="account-order-main">
                        {/* PRODUCT IMAGE */}
                        {orderImage ? (
                          <div className="account-order-image">
                            <img
                              src={orderImage}
                              alt={
                                items[0]?.name ||
                                "Petalia order"
                              }
                            />
                          </div>
                        ) : (
                          <div className="account-order-image account-order-image-empty">
                            <span>P</span>
                          </div>
                        )}

                        {/* ORDER INFO */}
                        <div className="account-order-content">
                          <div className="account-order-top">
                            <div>
                              <span>ORDER</span>

                              <h3>
                                {order.order_reference ||
                                  `Order #${order.id}`}
                              </h3>
                            </div>

                            <span className="account-status">
                              {order.status || "pending"}
                            </span>
                          </div>

                          {items.length > 0 && (
                            <div className="account-products-summary">
                              <span>
                                {itemCount}{" "}
                                {itemCount === 1 ? "item" : "items"}
                              </span>

                              {productNames && (
                                <>
                                  <span className="account-summary-dot">
                                    •
                                  </span>

                                  <p>{productNames}</p>
                                </>
                              )}
                            </div>
                          )}

                          <div className="account-order-details">
                            <div className="account-detail-item">
                              <CalendarDays
                                size={19}
                                strokeWidth={1.6}
                              />

                              <div>
                                <span>Order Date</span>

                                <p>
                                  {new Date(
                                    order.created_at
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>

                            <div className="account-detail-item">
                              <ReceiptText
                                size={19}
                                strokeWidth={1.6}
                              />

                              <div>
                                <span>Total</span>

                                <p>
                                  $
                                  {Number(order.total).toFixed(2)}
                                </p>
                              </div>
                            </div>

                            <div className="account-detail-item">
                              <CreditCard
                                size={19}
                                strokeWidth={1.6}
                              />

                              <div>
                                <span>Payment Status</span>

                                <p>
                                   {order.payment_status || "pending"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default Account;