import { useNavigate } from "react-router-dom";
import "../styles/OrderConfirmation.css";

function OrderConfirmation() {
  const navigate = useNavigate();

  const paymentData = (() => {
    try {
      return JSON.parse(
        localStorage.getItem("petaliaPayment") || "null"
      );
    } catch {
      return null;
    }
  })();

  if (!paymentData) {
    return (
      <main className="order-confirmation-page">
        <section className="order-confirmation-card">
          <p className="order-confirmation-eyebrow">PETALIA</p>

          <h1>No order found</h1>

          <p className="order-confirmation-description">
            Please place an order first.
          </p>

          <button
            type="button"
            className="order-confirmation-button"
            onClick={() => navigate("/shop")}
          >
            Continue Shopping
          </button>
        </section>
      </main>
    );
  }

  const { orderReference, paymentMethod, total, status } = paymentData;
  const isPaid = status === "paid";
  const amount = Number(total);

  return (
    <main className="order-confirmation-page">
      <section className="order-confirmation-card">
        <p className="order-confirmation-eyebrow">
          PETALIA · ORDER CONFIRMATION
        </p>

        <h1>
          {isPaid
            ? "Payment confirmed. Your thoughtful gift comes next."
            : "Your thoughtful gift is one step closer."}
        </h1>

        <p className="order-confirmation-description">
          {isPaid
            ? "Your payment has been verified. You can follow your order’s progress in your account."
            : "Your order has been created. Payment is still pending and has not been verified."}
        </p>

        <dl className="order-confirmation-details">
          <div>
            <dt>Order reference</dt>
            <dd>{orderReference || "Unavailable"}</dd>
          </div>

          <div>
            <dt>Payment method</dt>
            <dd>{paymentMethod?.toUpperCase() || "Unavailable"}</dd>
          </div>

          <div>
            <dt>Total</dt>
            <dd>
              {Number.isFinite(amount)
                ? `$${amount.toFixed(2)}`
                : "Unavailable"}
            </dd>
          </div>

          <div>
            <dt>Payment status</dt>
            <dd>
              <span
                className={`order-confirmation-status ${
                  isPaid ? "is-paid" : "is-pending"
                }`}
              >
                {isPaid ? "Paid" : "Pending"}
              </span>
            </dd>
          </div>
        </dl>

        <p className="order-confirmation-note">
          {isPaid
            ? "Payment confirmation and delivery progress are separate. Check your account for the latest order status."
            : "Return to the payment page to complete your KHQR payment. Your order remains pending until payment is verified."}
        </p>

        <div className="order-confirmation-actions">
          {!isPaid && (
            <button
              type="button"
              className="order-confirmation-button"
              onClick={() => navigate("/payment")}
            >
              Return to Payment
            </button>
          )}

          <button
            type="button"
            className={`order-confirmation-button ${
              !isPaid ? "is-secondary" : ""
            }`}
            onClick={() => navigate("/shop")}
          >
            Continue Shopping
          </button>
        </div>
      </section>
    </main>
  );
}

export default OrderConfirmation;