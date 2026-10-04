import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PaymentSuccess.css";

function PaymentSuccess() {
  const navigate = useNavigate();

  /* =========================================================
     SAVED ORDER DATA
  ========================================================= */

  const [paymentData] = useState(() => {
    return JSON.parse(localStorage.getItem("petaliaPayment")) || null;
  });

  const [checkoutData] = useState(() => {
    return JSON.parse(localStorage.getItem("petaliaCheckout")) || null;
  });

  const [cartItems] = useState(() => {
    return JSON.parse(localStorage.getItem("petaliaCart")) || [];
  });

  const subtotal = Number(
    paymentData?.subtotal ??
      checkoutData?.subtotal ??
      0
  );

  const deliveryFee = Number(
    paymentData?.deliveryFee ??
      checkoutData?.deliveryFee ??
      0
  );

  const total = Number(
    paymentData?.total ??
      checkoutData?.total ??
      subtotal + deliveryFee
  );

  const paymentMethod =
    paymentData?.paymentMethod ??
    checkoutData?.paymentMethod ??
    "khqr";

  const orderReference =
    paymentData?.orderReference ??
    localStorage.getItem("petaliaOrderReference") ??
    "PTL-0000";

  /* =========================================================
     PAGE START
  ========================================================= */

  useEffect(() => {
    window.scrollTo(0, 0);

    // The order is complete, so clear the active shopping cart.
    localStorage.removeItem("petaliaCart");
    localStorage.removeItem("petaliaCheckout");

    // Tell the header that the cart has changed.
    window.dispatchEvent(new Event("petalia-cart-updated"));
  }, []);

  /* =========================================================
     BUTTON ACTIONS
  ========================================================= */

  const handleBackHome = () => {
  navigate("/");
  };

  const handleContinueShopping = () => {
    navigate("/shop");
  };

  /* =========================================================
     NO PAYMENT FOUND
  ========================================================= */

  if (!paymentData || paymentData.status !== "paid") {
    return (
      <main className="success-page success-empty-page">
        <div className="success-empty-card">

          <div className="success-empty-icon">
            <i className="fi fi-rr-receipt" />
          </div>

          <span>PAYMENT STATUS</span>

          <h1>No payment confirmation found</h1>

          <p>
            Please complete your payment before viewing this page.
          </p>

          <button
            type="button"
            onClick={() => navigate("/payment")}
          >
            Return to Payment
          </button>

        </div>
      </main>
    );
  }

  /* =========================================================
     SUCCESS PAGE
  ========================================================= */

  return (
    <main className="success-page">

      <div className="success-container">

        {/* =====================================================
            BREADCRUMB
        ===================================================== */}

        <nav className="success-breadcrumb">

          <button
            type="button"
            onClick={() => navigate("/")}
          >
            Home
          </button>

          <span>/</span>

          <button
            type="button"
            onClick={() => navigate("/cart")}
          >
            Basket
          </button>

          <span>/</span>

          <span>Payment</span>

          <span>/</span>

          <strong>Success</strong>

        </nav>

        {/* =====================================================
            INTRO
        ===================================================== */}

        <section className="success-intro">

          <span className="success-eyebrow">
            <i className="fi fi-rr-sparkles" />
            Gift journey complete
          </span>

          <h1>
            Your gift is
            <span> officially on its way.</span>
          </h1>

          <p>
            Payment confirmed. We’ll now prepare your thoughtful
            gift with care and get it ready for delivery.
          </p>

        </section>

        {/* =====================================================
            MAIN LAYOUT
        ===================================================== */}

        <div className="success-layout">

          {/* ===================================================
              LEFT — SUCCESS EXPERIENCE
          =================================================== */}

          <section className="success-experience">

            {/* soft background glow */}

            <div
              className="success-glow success-glow-one"
              aria-hidden="true"
            />

            <div
              className="success-glow success-glow-two"
              aria-hidden="true"
            />

            {/* floating petals */}

            <span
              className="success-petal success-petal-one"
              aria-hidden="true"
            />

            <span
              className="success-petal success-petal-two"
              aria-hidden="true"
            />

            <span
              className="success-petal success-petal-three"
              aria-hidden="true"
            />

            {/* =================================================
               PETALIA LEAF SUCCESS
            ================================================= */}

            <div className="success-leaf-bloom">

              <div className="leaf-bloom-ring leaf-ring-one" />
              <div className="leaf-bloom-ring leaf-ring-two" />

              <span className="leaf-mini-petal leaf-mini-petal-one" />
              <span className="leaf-mini-petal leaf-mini-petal-two" />

              <div className="leaf-main-icon">
                <i className="fi fi-rr-leaf" />
              </div>

            </div>

            {/* =================================================
                SUCCESS MESSAGE
            ================================================= */}

            <div className="success-message">

              <span className="success-label">
                Payment Successful
              </span>

              <h2>
                A thoughtful moment,
                <br />
                beautifully completed.
              </h2>

              <p>
                Your payment has been confirmed and your order
                is now being prepared.
              </p>

            </div>

            {/* =================================================
                PAYMENT DETAILS
            ================================================= */}

            <div className="success-payment-details">

              <div className="success-main-amount">

                <span>Paid amount</span>

                <strong>
                  ${total.toFixed(2)}
                </strong>

              </div>

              <div className="success-details-grid">

                {/* Payment method */}

                <div className="success-detail-item">

                  <div className="success-detail-icon">

                    {paymentMethod === "khqr" ? (
                      <i className="fi fi-rr-qr-scan" />
                    ) : (
                      <i className="fi fi-rr-credit-card" />
                    )}

                  </div>

                  <div>

                    <span>Payment method</span>

                    <strong>
                      {paymentMethod === "khqr"
                        ? "KHQR"
                        : "Card"}
                    </strong>

                  </div>

                </div>

                {/* Order reference */}

                <div className="success-detail-item">

                  <div className="success-detail-icon">
                    <i className="fi fi-rr-receipt" />
                  </div>

                  <div>

                    <span>Order reference</span>

                    <strong>
                      #{orderReference}
                    </strong>

                  </div>

                </div>

              </div>

            </div>

            {/* =================================================
                SECURE PAYMENT NOTE
            ================================================= */}

            <div className="success-secure-note">

              <div className="success-secure-icon">
                <i className="fi fi-rr-shield" />
              </div>

              <div>

                <strong>
                  Payment received securely
                </strong>

                <span>
                  Your transaction has been confirmed successfully.
                </span>

              </div>

            </div>

            {/* =================================================
                PREPARING ORDER
            ================================================= */}

            <div className="success-preparing">

              <div className="preparing-icon">
                <i className="fi fi-rr-flower-bouquet" />
              </div>

              <div className="preparing-copy">

                <span>
                  WHAT HAPPENS NEXT
                </span>

                <strong>
                  We’re preparing your gift with care.
                </strong>

                <p>
                  Your selected items, wrapping and message
                  will be prepared before delivery.
                </p>

              </div>

              <div className="preparing-status">

                <span className="preparing-dot" />

                Preparing

              </div>

            </div>

            {/* =================================================
                BUTTONS
            ================================================= */}

            <div className="success-actions">

              <button
                type="button"
                className="success-primary-button"
                onClick={handleBackHome}
              >
                <i className="fi fi-rr-home" />
                Back to Home
              </button>

              <button
                type="button"
                className="success-secondary-button"
                onClick={handleContinueShopping}
              >
                Continue Shopping
                <i className="fi fi-rr-arrow-right" />
              </button>

            </div>

          </section>

          {/* ===================================================
              RIGHT — ORDER SUMMARY
          =================================================== */}

          <aside className="success-summary">

            <header className="success-summary-heading">

              <div>

                <span>
                  Your gift
                </span>

                <h2>
                  Order Summary
                </h2>

              </div>

              <i className="fi fi-rr-gift" />

            </header>

            {/* =================================================
                PRODUCTS
            ================================================= */}

            <div className="success-summary-products">

              {cartItems.map((item, index) => (

                <article
                  className="success-summary-product"
                  key={
                    item.cartId ||
                    `${item.id}-${index}`
                  }
                >

                  <div className="success-product-top">

                    <div className="success-product-image-wrap">

                      <img
                        src={item.image}
                        alt={item.name}
                      />

                      <span>
                        {item.quantity || 1}
                      </span>

                    </div>

                    <div className="success-product-info">

                      <h3>
                        {item.name}
                      </h3>

                      <strong>
                        $
                        {Number(
                          item.unitPrice || 0
                        ).toFixed(2)}
                      </strong>

                    </div>

                  </div>

                  {/* customization */}

                  <div className="success-customization">

                    {item.wrapping && (
                      <div>

                        <span>
                          Wrapping
                        </span>

                        <strong>
                          {item.wrapping}
                        </strong>

                      </div>
                    )}

                    {item.messageCard && (
                      <div>

                        <span>
                          Message card
                        </span>

                        <strong>
                          {item.messageCard}
                        </strong>

                      </div>
                    )}

                    {item.addon && (
                      <div>

                        <span>
                          Add-on
                        </span>

                        <strong>
                          {item.addon}
                        </strong>

                      </div>
                    )}

                  </div>

                </article>

              ))}

            </div>

            {/* =================================================
                PRICE SUMMARY
            ================================================= */}

            <div className="success-summary-divider" />

            <div className="success-price-row">

              <span>
                Subtotal
              </span>

              <strong>
                ${subtotal.toFixed(2)}
              </strong>

            </div>

            <div className="success-price-row">

              <span>
                Delivery
              </span>

              <strong>
                ${deliveryFee.toFixed(2)}
              </strong>

            </div>

            <div className="success-summary-divider" />

            <div className="success-total-row">

              <span>
                Total paid
              </span>

              <strong>
                ${total.toFixed(2)}
              </strong>

            </div>

            {/* =================================================
                CONFIRMATION STATUS
            ================================================= */}

            <div className="success-confirmed-card">

              <div className="success-confirmed-leaf">
                <i className="fi fi-rr-leaf" />
              </div>

              <div>

                <strong>
                  Payment confirmed
                </strong>

                <span>
                  Your order is now being prepared.
                </span>

              </div>

            </div>

          </aside>

        </div>

      </div>

    </main>
  );
}

export default PaymentSuccess;