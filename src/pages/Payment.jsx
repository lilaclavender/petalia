import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { QRCodeSVG } from "qrcode.react";
import "../styles/Payment.css";

function Payment() {
  const navigate = useNavigate();

  /* =========================
     CHECKOUT DATA
  ========================= */

  const [checkoutData] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("petaliaCheckout")) || null;
    } catch {
      return null;
    }
  });

  const [cartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("petaliaCart")) || [];
    } catch {
      return [];
    }
  });

  /* =========================
     ORDER REFERENCE
  ========================= */

  const [orderReference] = useState(() => {
    const existing = localStorage.getItem("petaliaOrderReference");

    if (existing) {
      return existing;
    }

    const reference = `PTL-${Math.floor(1000 + Math.random() * 9000)}`;

    localStorage.setItem("petaliaOrderReference", reference);

    return reference;
  });

  /* =========================
     PAYMENT STATE
  ========================= */

  const [isProcessing, setIsProcessing] = useState(false);
  const [khqrPayment, setKhqrPayment] = useState(null);

  /* =========================
     VALUES
  ========================= */

  const paymentMethod = checkoutData?.paymentMethod || "khqr";

  const subtotal = Number(checkoutData?.subtotal || 0);

  const deliveryFee = Number(checkoutData?.deliveryFee || 0);

  const total = Number(checkoutData?.total || subtotal + deliveryFee);

  /* =========================
     SUBMIT ORDER
  ========================= */

  const completePayment = async () => {
    console.log("🔥 PAYMENT BUTTON CLICKED");
    if (isProcessing) {
      return;
    }

    // Card payments are not connected yet.
    if (paymentMethod !== "khqr") {
      alert("Card payments are not connected. Please select KHQR at checkout.");
      return;
    }

    // Check checkout and basket.
    if (!checkoutData || cartItems.length === 0) {
      alert("Your checkout or basket is empty. Please return to your basket.");
      return;
    }

    // For now, support one shop per order.
    const shopIds = [...new Set(cartItems.map((item) => item.shop_id))];

    if (shopIds.length !== 1 || shopIds[0] == null) {
      alert("For now, please order gifts from one shop at a time.");
      return;
    }

    setIsProcessing(true);

    try {
      /* =========================
         CHECK SIGNED-IN USER
      ========================= */

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("Please sign in before placing your order.");
        navigate("/sign-in");
        return;
      }

      /* =========================
         CHECK EXISTING ORDER
      ========================= */

      const { data: existingOrder, error: checkError } = await supabase
        .from("orders")
        .select("id")
        .eq("order_reference", orderReference)
        .eq("user_id", user.id)
        .maybeSingle();

      if (checkError) {
        throw checkError;
      }

      if (existingOrder) {
        alert("This order was already submitted. Please start a new checkout.");
        return;
      }

      /* =========================
      CREATE SECURE ORDER
      ========================= */

      const { data: orderId, error: orderError } = await supabase.rpc(
        "create_order_secure",
        {
          p_recipient_name: checkoutData.recipientName || "",

          p_phone: checkoutData.phone || "",

          p_delivery_address: checkoutData.address || "",

          p_delivery_area: checkoutData.deliveryArea || "",

          p_delivery_date: checkoutData.deliveryDate || null,

          p_delivery_time: checkoutData.timeSlot || "",

          p_delivery_instructions: checkoutData.instructions || "",

          p_payment_method: paymentMethod,

          p_items: cartItems,

          p_order_reference: orderReference,
        },
      );

      if (orderError) {
        throw orderError;
      }

      console.log("Secure order created:", orderId);

      /* =========================
        GET TRUSTED ORDER TOTALS
      ========================= */

      const { data: secureOrder, error: secureOrderError } = await supabase
        .from("orders")
        .select(
          "id, order_reference, subtotal, delivery_fee, total, status, payment_status",
        )
        .eq("id", orderId)
        .single();

      if (secureOrderError) {
        throw secureOrderError;
      }

      console.log("Trusted order data:", secureOrder);

      /* =========================
         GENERATE REAL KHQR
      ========================= */

      const { data: khqrData, error: khqrError } =
        await supabase.functions.invoke("bakong-payment", {
          body: {
            orderId: secureOrder.id,
          },
        });

      if (khqrError) {
        console.error("KHQR function error:", khqrError);
        throw khqrError;
      }

      if (!khqrData?.success || !khqrData?.qr || !khqrData?.md5) {
        console.error("Invalid KHQR response:", khqrData);
        throw new Error("Unable to generate KHQR.");
      }

      console.log("KHQR generated:", khqrData);
      setKhqrPayment(khqrData);

      // /* =========================
      //    SAVE PAYMENT INFORMATION
      // ========================= */

      // const paymentData = {
      //   orderId: secureOrder.id,

      //   orderReference: secureOrder.order_reference,

      //   paymentMethod: paymentMethod,

      //   subtotal: Number(secureOrder.subtotal),

      //   deliveryFee: Number(secureOrder.delivery_fee),

      //   total: Number(secureOrder.total),

      //   status: secureOrder.status,

      //   paymentStatus: secureOrder.payment_status,

      //   paidAt: null,
      // };

      // localStorage.setItem("petaliaPayment", JSON.stringify(paymentData));

      // /* =========================
      //    CLEAR COMPLETED CHECKOUT
      // ========================= */

      // localStorage.removeItem("petaliaCart");

      // localStorage.removeItem("petaliaCheckout");

      // localStorage.removeItem("petaliaOrderReference");

      // // Notify the header/cart if it listens for this event.
      // window.dispatchEvent(new Event("petaliaCartUpdated"));

      // /* =========================
      //    ORDER CONFIRMATION
      // ========================= */

      // navigate("/order-confirmation");
    } catch (error) {
      console.error("Error saving order:", error);

      alert("We could not save your order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const checkBakongPayment = async () => {
    if (!khqrPayment?.orderId) {
      alert("Please generate the KHQR first.");
      return;
    }

    if (isProcessing) {
      return;
    }

    setIsProcessing(true);

    try {
      console.log("Checking Bakong payment...");

      const { data, error } = await supabase.functions.invoke(
        "bakong-payment",
        {
          body: {
            action: "check",
            orderId: khqrPayment.orderId,
          },
        },
      );

      if (error) {
        console.error("Bakong check error:", error);
        throw error;
      }

      console.log("Bakong payment result:", data);

      /* =========================
        PAYMENT NOT RECEIVED
      ========================= */

      if (!data?.paid) {
        alert("Payment has not been received yet.");
        return;
      }

      /* =========================
        PAYMENT VERIFIED
      ========================= */

      const { data: confirmedOrder, error: confirmedOrderError } =
        await supabase
          .from("orders")
          .select(
            "id, order_reference, subtotal, delivery_fee, total, status, payment_status",
          )
          .eq("id", khqrPayment.orderId)
          .single();

      if (confirmedOrderError) {
        console.error("Unable to load confirmed order:", confirmedOrderError);

        throw confirmedOrderError;
      }

      if (confirmedOrder?.payment_status !== "paid") {
        throw new Error("Payment verification was not saved.");
      }

      /* =========================
        SAVE PAYMENT INFORMATION
      ========================= */

      const paymentData = {
        orderId: confirmedOrder.id,

        orderReference: confirmedOrder.order_reference,

        paymentMethod: "khqr",

        subtotal: Number(confirmedOrder.subtotal),

        deliveryFee: Number(confirmedOrder.delivery_fee),

        total: Number(confirmedOrder.total),

        status: "paid",

        orderStatus: confirmedOrder.status,

        paymentStatus: confirmedOrder.payment_status,

        transaction: data?.transaction || null,
      };

      localStorage.setItem("petaliaPayment", JSON.stringify(paymentData));

      /* =========================
        CLEAR COMPLETED CHECKOUT
      ========================= */

      localStorage.removeItem("petaliaCart");

      localStorage.removeItem("petaliaCheckout");

      localStorage.removeItem("petaliaOrderReference");

      window.dispatchEvent(new Event("petaliaCartUpdated"));

      /* =========================
        ORDER CONFIRMATION
      ========================= */

      navigate("/payment-success", {
        replace: true,
      });
    } catch (error) {
      console.error("Payment verification error:", error);

      alert("Unable to verify your payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  /* =========================
     MISSING CHECKOUT DATA
  ========================= */

  if (!checkoutData) {
    return (
      <main className="payment-page payment-empty-page">
        <div className="payment-empty-card">
          <div className="payment-empty-icon">
            <i className="fi fi-rr-shopping-bag" />
          </div>

          <span>PAYMENT</span>

          <h1>No checkout information found</h1>

          <p>Please complete your delivery information before continuing.</p>

          <button type="button" onClick={() => navigate("/cart")}>
            Return to Basket
          </button>
        </div>
      </main>
    );
  }

  /* =========================
     PAYMENT PAGE
  ========================= */

  return (
    <main className="payment-page">
      <div className="payment-container">
        {/* =========================
            BREADCRUMB
        ========================= */}

        <nav className="payment-breadcrumb">
          <button type="button" onClick={() => navigate("/")}>
            Home
          </button>

          <span>/</span>

          <button type="button" onClick={() => navigate("/cart")}>
            Basket
          </button>

          <span>/</span>

          <button type="button" onClick={() => navigate("/checkout")}>
            Checkout
          </button>

          <span>/</span>

          <strong>Payment</strong>
        </nav>

        {/* =========================
            INTRO
        ========================= */}

        <section className="payment-intro">
          <div className="payment-intro-copy">
            <span className="payment-eyebrow">
              <i className="fi fi-rr-flower" />
              Final step
            </span>

            <h1>
              Complete your
              <span> order.</span>
            </h1>

            <p>
              One final moment before your thoughtful gift is ready for the next
              step.
            </p>
          </div>

          <div className="payment-intro-progress" aria-hidden="true">
            <span className="progress-line" />

            <div className="progress-step progress-done">
              <i className="fi fi-rr-leaf" />
              <span>Gift</span>
            </div>

            <div className="progress-step progress-done">
              <i className="fi fi-rr-leaf" />
              <span>Delivery</span>
            </div>

            <div className="progress-step progress-current">
              <span className="progress-pulse" />
              <span>Payment</span>
            </div>
          </div>
        </section>

        {/* =========================
            MAIN LAYOUT
        ========================= */}

        <div className="payment-layout">
          {/* =========================
              PAYMENT EXPERIENCE
          ========================= */}

          <section className="payment-experience">
            {/* Decorative background */}

            <div
              className="payment-soft-orb payment-orb-one"
              aria-hidden="true"
            />

            <div
              className="payment-soft-orb payment-orb-two"
              aria-hidden="true"
            />

            <div className="payment-tiny-butterfly" aria-hidden="true">
              <span className="tiny-wing tiny-wing-left" />
              <span className="tiny-butterfly-body" />
              <span className="tiny-wing tiny-wing-right" />
            </div>

            {/* =========================
                PAYMENT HEADING
            ========================= */}

            <header className="payment-experience-header">
              <div>
                <span className="payment-section-label">Selected payment</span>

                <h2>
                  {paymentMethod === "khqr" ? "KHQR payment" : "Card payment"}
                </h2>
              </div>

              <div className="selected-payment-badge">
                {paymentMethod === "khqr" ? (
                  <>
                    <i className="fi fi-rr-qr-scan" />
                    KHQR
                  </>
                ) : (
                  <>
                    <i className="fi fi-rr-credit-card" />
                    Card
                  </>
                )}
              </div>
            </header>

            {/* =========================
                KHQR PAYMENT
            ========================= */}

            {paymentMethod === "khqr" && (
              <div className="khqr-payment">
                <div className="khqr-amount">
                  <span>Order total</span>

                  <strong>${total.toFixed(2)}</strong>
                </div>

                {/* QR prototype */}

                <div className="khqr-visual-area">
                  <div className="khqr-glow" />

                  <div className="khqr-frame">
                    <div className="khqr-top">
                      <span>KHQR</span>

                      <small>PETALIA</small>
                    </div>

                    <div className="khqr-code-placeholder">
                      {khqrPayment?.qr ? (
                        <QRCodeSVG
                          value={khqrPayment.qr}
                          size={180}
                          level="M"
                        />
                      ) : (
                        <>
                          <i className="fi fi-rr-qr-scan" />
                          <span>Generate KHQR to pay</span>
                        </>
                      )}
                    </div>

                    <div className="khqr-bottom">
                      <span>Petalia</span>

                      <strong>${total.toFixed(2)}</strong>
                    </div>
                  </div>
                </div>

                {/* Payment instruction */}

                <div className="khqr-instruction">
                  <div className="khqr-instruction-icon">
                    <i className="fi fi-rr-mobile-button" />
                  </div>

                  <div>
                    <strong>Pay securely with KHQR</strong>

                    <p>
                      Generate your KHQR, scan it with your banking app, then
                      verify your payment to complete the order.
                    </p>
                  </div>
                </div>

                {/* Pending status */}

                <div className="payment-waiting">
                  <div className="waiting-dots">
                    <span />
                    <span />
                    <span />
                  </div>

                  <div>
                    <strong>Payment pending</strong>

                    <small>Payment has not been verified.</small>
                  </div>
                </div>

                {/* Submit order */}

                                {/* =========================
                    PAYMENT ACTION
                ========================= */}

                {!khqrPayment?.qr ? (
                  <button
                    type="button"
                    className={`complete-payment-button ${
                      isProcessing ? "payment-processing" : ""
                    }`}
                    onClick={completePayment}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <span className="button-spinner" />
                        Generating KHQR...
                      </>
                    ) : (
                      <>
                        Generate KHQR
                        <i className="fi fi-rr-arrow-right" />
                      </>
                    )}
                  </button>
                ) : (
                  <div className="khqr-ready-section">
                    <div className="khqr-ready-message">
                      <div className="khqr-ready-icon">
                        <i className="fi fi-rr-check" />
                      </div>

                      <div>
                        <strong>KHQR ready</strong>

                        <span>
                          Scan the QR with your banking app. Once payment is
                          complete, verify it below.
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`complete-payment-button ${
                        isProcessing ? "payment-processing" : ""
                      }`}
                      onClick={checkBakongPayment}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <span className="button-spinner" />
                          Checking Payment...
                        </>
                      ) : (
                        <>
                          Check Payment
                          <i className="fi fi-rr-arrow-right" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* =========================
                KHQR PAYMENT
            ========================= */}

            {paymentMethod === "khqr" && (
              <div className="khqr-payment">

                <div className="khqr-amount">
                  <span>Order total</span>
                  <strong>${total.toFixed(2)}</strong>
                </div>

                {/* QR */}
                <div className="khqr-visual-area">
                  <div className="khqr-glow" />

                  <div className="khqr-frame">
                    <div className="khqr-top">
                      <span>KHQR</span>
                      <small>PETALIA</small>
                    </div>

                    <div className="khqr-code-placeholder">
                      {khqrPayment?.qr ? (
                        <QRCodeSVG
                          value={khqrPayment.qr}
                          size={180}
                          level="M"
                        />
                      ) : (
                        <>
                          <i className="fi fi-rr-qr-scan" />
                          <span>Generate KHQR to pay</span>
                        </>
                      )}
                    </div>

                    <div className="khqr-bottom">
                      <span>Petalia</span>
                      <strong>${total.toFixed(2)}</strong>
                    </div>
                  </div>
                </div>

                {/* Payment instruction */}
                <div className="khqr-instruction">
                  <div className="khqr-instruction-icon">
                    <i className="fi fi-rr-mobile-button" />
                  </div>

                  <div>
                    <strong>Pay securely with KHQR</strong>

                    <p>
                      Generate your KHQR, scan it with your banking app,
                      then verify your payment to complete the order.
                    </p>
                  </div>
                </div>

                {/* Payment status */}
                <div className="payment-waiting">
                  <div className="waiting-dots">
                    <span />
                    <span />
                    <span />
                  </div>

                  <div>
                    <strong>Payment pending</strong>
                    <small>Payment has not been verified.</small>
                  </div>
                </div>

                {/* Payment action */}
                {!khqrPayment?.qr ? (
                  <button
                    type="button"
                    className={`complete-payment-button ${
                      isProcessing ? "payment-processing" : ""
                    }`}
                    onClick={completePayment}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <span className="button-spinner" />
                        Generating KHQR...
                      </>
                    ) : (
                      <>
                        Generate KHQR
                        <i className="fi fi-rr-arrow-right" />
                      </>
                    )}
                  </button>
                ) : (
                  <div className="khqr-ready-section">

                    <div className="khqr-ready-message">
                      <div className="khqr-ready-icon">
                        <i className="fi fi-rr-check" />
                      </div>

                      <div>
                        <strong>KHQR ready</strong>
                        <span>
                          Scan the QR with your banking app. Once payment
                          is complete, verify it below.
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`complete-payment-button ${
                        isProcessing ? "payment-processing" : ""
                      }`}
                      onClick={checkBakongPayment}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <span className="button-spinner" />
                          Checking Payment...
                        </>
                      ) : (
                        <>
                          Check Payment
                          <i className="fi fi-rr-arrow-right" />
                        </>
                      )}
                    </button>

                  </div>
                )}

              </div>
            )}

            {/* =========================
                SECURITY NOTICE
            ========================= */}

            <div className="payment-security">
              <div className="payment-security-icon">
                <i className="fi fi-rr-shield" />
              </div>

              <div>
                <strong>Order information</strong>

                <span>
                  Your payment is verified securely before your order is
                  confirmed.
                </span>
              </div>
            </div>

            {/* =========================
                REFERENCE
            ========================= */}

            <div className="payment-reference-row">
              <div>
                <span>Order reference</span>

                <strong>#{orderReference}</strong>
              </div>

              <div>
                <span>Total amount</span>

                <strong>${total.toFixed(2)}</strong>
              </div>
            </div>
          </section>

          {/* =========================
              ORDER SUMMARY
          ========================= */}

          <aside className="payment-summary">
            <header className="payment-summary-heading">
              <div>
                <span>Your gift</span>

                <h2>Order Summary</h2>
              </div>

              <i className="fi fi-rr-gift" />
            </header>

            {/* Products */}

            <div className="payment-summary-products">
              {cartItems.map((item, index) => (
                <article
                  className="payment-summary-product"
                  key={item.cartId || `${item.id}-${index}`}
                >
                  <div className="payment-product-top">
                    <div className="payment-product-image-wrap">
                      <img src={item.image} alt={item.name} />

                      <span>{item.quantity || 1}</span>
                    </div>

                    <div className="payment-product-info">
                      <h3>{item.name}</h3>

                      <strong>${Number(item.unitPrice || 0).toFixed(2)}</strong>
                    </div>
                  </div>

                  {/* Customization */}

                  <div className="payment-customization">
                    {item.wrapping && (
                      <div>
                        <span>Wrapping</span>

                        <strong>{item.wrapping}</strong>
                      </div>
                    )}

                    {item.messageCard && (
                      <div>
                        <span>Message card</span>

                        <strong>{item.messageCard}</strong>
                      </div>
                    )}

                    {item.addon && (
                      <div>
                        <span>Add-on</span>

                        <strong>{item.addon}</strong>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {/* =========================
                PRICES
            ========================= */}

            <div className="payment-summary-divider" />

            <div className="payment-price-row">
              <span>Subtotal</span>

              <strong>${subtotal.toFixed(2)}</strong>
            </div>

            <div className="payment-price-row">
              <span>Delivery</span>

              <strong>${deliveryFee.toFixed(2)}</strong>
            </div>

            <div className="payment-summary-divider" />

            <div className="payment-total-row">
              <span>Total</span>

              <strong>${total.toFixed(2)}</strong>
            </div>

            {/* =========================
                PENDING NOTE
            ========================= */}

            <div className="gift-reserved-note">
              <i className="fi fi-rr-lock" />

              <div>
                <strong>Order awaiting payment</strong>

                <span>
                  Your order will remain pending until payment is verified.
                </span>
              </div>
            </div>

            {/* =========================
                BACK TO CHECKOUT
            ========================= */}

            <button
              type="button"
              className="payment-back-button"
              onClick={() => navigate("/checkout")}
              disabled={isProcessing}
            >
              <i className="fi fi-rr-arrow-left" />
              Back to Checkout
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default Payment;
