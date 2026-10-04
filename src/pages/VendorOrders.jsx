
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import VendorHeader from "../components/VendorHeader";
import VendorSidebar from "../components/VendorSidebar";
import "../styles/VendorDashboard.css";
import productImages from "../data/productImages";
import "../styles/VendorOrders.css";

function VendorOrders() {
  const navigate = useNavigate();

  const [shop, setShop] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updatingOrder, setUpdatingOrder] = useState(null);

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrder(orderId);

    const { data, error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId)
      .eq("shop_id", shop.id)
      .select("id, status")
      .single();

    if (error) {
      console.error("Error updating order:", error);
      alert("Could not update the order status: " + error.message);
    } else {
      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.id === data.id
            ? { ...order, status: data.status }
            : order
        )
      );
    }

    setUpdatingOrder(null);
  };

  useEffect(() => {
    const loadOrders = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        navigate("/sign-in");
        return;
      }

      const { data: shopData, error: shopError } = await supabase
        .from("shops")
        .select("*")
        .eq("owner_id", user.id)
        .maybeSingle();

      if (shopError || !shopData) {
        setErrorMessage(
          shopError?.message || "No shop was found for this account."
        );
        setLoading(false);
        return;
      }

      setShop(shopData);

      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("shop_id", shopData.id)
        .order("created_at", { ascending: false });

      if (orderError) {
        setErrorMessage(orderError.message);
      } else {
        setOrders(orderData || []);
      }

      setLoading(false);
    };

    loadOrders();
  }, [navigate]);

  if (loading) {
    return <div className="vendor-loading">Loading orders...</div>;
  }

  if (errorMessage || !shop) {
    return (
      <div className="vendor-loading">
        <p>{errorMessage || "Shop not found."}</p>
      </div>
    );
  }

  return (
    <div className="vendor-center-page">
      <VendorHeader shop={shop} />

      <div className="vendor-dashboard">
        <VendorSidebar shop={shop} />

        <main className="vendor-main">
          <section className="vendor-orders-section">
            <div className="vendor-orders-heading">
              <div>
                <span className="vendor-orders-eyebrow">
                  SHOP MANAGEMENT
                </span>
                <h1>My Orders</h1>
                <p>
                  View customer orders and their payment status.
                </p>
              </div>

              <span className="vendor-orders-count">
                {orders.length} orders
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="vendor-orders-empty">
                No orders yet. New customer orders will appear here.
              </div>
            ) : (
              <div className="vendor-orders-list">
                {orders.map((order) => {
                  const items = Array.isArray(order.items)
                    ? order.items
                    : [];

                  const isExpanded = expandedOrder === order.id;

                  return (
                    <article
                      className="vendor-order-card"
                      key={order.id}
                    >
                      <div className="vendor-order-top">
                        <div>
                          <span className="vendor-order-reference">
                            #{order.order_reference || order.id}
                          </span>
                          <p>
                            {new Date(
                              order.created_at
                            ).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="vendor-order-statuses">
                          <select
                            className="vendor-order-badge"
                            value={order.status}
                            disabled={
                              updatingOrder === order.id ||
                              order.status === "completed" ||
                              order.status === "cancelled"
                            }
                            onChange={(e) =>
                              updateOrderStatus(order.id, e.target.value)
                            }
                          >
                            <option value="pending">Pending</option>
                            <option value="preparing">Preparing</option>
                            <option value="ready">Ready</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>

                          <span className="vendor-payment-badge">
                            Payment: {order.payment_status}
                          </span>
                        </div>
                      </div>

                      <div className="vendor-order-details">
                        <div>
                          <small>Customer</small>
                          <strong>
                            {order.customer_name || "Customer"}
                          </strong>
                        </div>

                        <div>
                          <small>Products</small>
                          <strong>
                            {items.reduce(
                              (sum, item) =>
                                sum + Number(item.quantity || 1),
                              0
                            )}{" "}
                            item(s)
                          </strong>
                        </div>

                        <div>
                          <small>Payment method</small>
                          <strong>
                            {order.payment_method?.toUpperCase()}
                          </strong>
                        </div>

                        <div>
                          <small>Total</small>
                          <strong>
                            ${Number(order.total || 0).toFixed(2)}
                          </strong>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="vendor-order-toggle"
                        onClick={() =>
                          setExpandedOrder(
                            isExpanded ? null : order.id
                          )
                        }
                      >
                        {isExpanded
                          ? "Hide Details"
                          : "View Details"}
                      </button>

                      {isExpanded && (
                        <div className="vendor-order-expanded">
                          <h3>Purchased gifts</h3>

                          {items.map((item, index) => (
                            <div
                              className="vendor-order-item"
                              key={item.cartId || index}
                            >
                              {(productImages[item.id] || item.image) && (
                                <img
                                  src={productImages[item.id] || item.image}
                                  alt={item.name}
                                />
                              )}

                              <div>
                                <strong>{item.name}</strong>
                                <p>
                                  Quantity: {item.quantity || 1}
                                </p>

                                {item.wrapping && (
                                  <p>Wrapping: {item.wrapping}</p>
                                )}

                                {item.messageCard && (
                                  <p>
                                    Message card: {item.messageCard}
                                  </p>
                                )}

                                {item.message && (
                                  <p>Message: {item.message}</p>
                                )}

                                {item.addon && (
                                  <p>Add-on: {item.addon}</p>
                                )}
                              </div>
                            </div>
                          ))}

                          <h3>Delivery information</h3>
                          <p>
                            <strong>Phone:</strong>{" "}
                            {order.phone || "—"}
                          </p>
                          <p>
                            <strong>Address:</strong>{" "}
                            {order.delivery_address || "—"}
                          </p>
                          <p>
                            <strong>Area:</strong>{" "}
                            {order.delivery_area || "—"}
                          </p>
                          <p>
                            <strong>Date:</strong>{" "}
                            {order.delivery_date || "—"}
                          </p>
                          <p>
                            <strong>Time:</strong>{" "}
                            {order.delivery_time || "—"}
                          </p>
                          <p>
                            <strong>Instructions:</strong>{" "}
                            {order.delivery_instructions || "—"}
                          </p>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default VendorOrders;
