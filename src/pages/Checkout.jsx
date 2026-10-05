import { useState } from "react";
import { useNavigate } from "react-router-dom";
import journeyPetal from "../assets/journey-petal.png";
import journeyFlower from "../assets/journey-flower.png";
import {
  UserRound,
  Phone,
  MapPin,
  CalendarDays,
  Clock3,
  MessageSquareText,
  QrCode,
  ShieldCheck,
  ChevronRight,
  Gift,
  Check,
  Flower2,
  Truck,
} from "lucide-react";
import "../styles/Checkout.css";
import { assertProductsAvailable } from "../lib/productAvailability";
function Checkout() {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString("en-CA");
  const [cartItems] = useState(() => {
    const savedCart = JSON.parse(localStorage.getItem("petaliaCart")) || [];
    return savedCart.map((item) => ({
      ...item,
      quantity: Number(item.quantity) || 1,
      unitPrice:
        Number(item.unitPrice) ||
        Number(item.basePrice || 0) +
          Number(item.wrappingPrice || 0) +
          Number(item.messageCardPrice || 0) +
          Number(item.addonPrice || 0),
    }));
  });
  const [recipientName, setRecipientName] = useState("");
  const [phone, setPhone] = useState("");
  const [isForMe, setIsForMe] = useState(false);
  const [address, setAddress] = useState("");
  const [deliveryArea, setDeliveryArea] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [instructions, setInstructions] = useState("");
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [paymentMethod] = useState("khqr");
  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum + Number(item.unitPrice || 0) * Number(item.quantity || 1),
    0,
  );
  const deliveryFee = 0;
  const total = subtotal;
  const timeOptions = [
    {
      id: "morning",
      title: "Morning",
      time: "8 AM – 12 PM",
    },
    {
      id: "afternoon",
      title: "Afternoon",
      time: "12 PM – 4 PM",
    },
    {
      id: "evening",
      title: "Evening",
      time: "4 PM – 8 PM",
    },
  ];
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (checkingAvailability) return;
    const cleanName = recipientName.trim();
    const cleanPhone = phone.trim();
    const cleanAddress = address.trim();
    const cleanArea = deliveryArea.trim();
    if (cleanName.length < 2 || cleanName.length > 100) {
      alert("Please enter a valid recipient name.");
      return;
    }
    const phonePattern = /^[0-9+\-\s()]{8,20}$/;
    if (!phonePattern.test(cleanPhone)) {
      alert("Please enter a valid phone number.");
      return;
    }
    if (cleanAddress.length < 5 || cleanAddress.length > 200) {
      alert("Please enter a complete delivery address.");
      return;
    }
    if (cleanArea.length < 2 || cleanArea.length > 100) {
      alert("Please enter a valid city or province.");
      return;
    }
    if (!deliveryDate) {
      alert("Please choose a delivery date.");
      return;
    }
    if (deliveryDate < today) {
      alert("Delivery date cannot be in the past.");
      return;
    }
    if (!timeSlot) {
      alert("Please choose a delivery time.");
      return;
    }
    setCheckingAvailability(true);
    try {
      await assertProductsAvailable(cartItems);
      const checkoutData = {
        recipientName,
        phone,
        isForMe,
        address,
        deliveryArea,
        deliveryDate,
        timeSlot,
        instructions,
        paymentMethod,
        subtotal,
        deliveryFee,
        total,
      };
      localStorage.setItem("petaliaCheckout", JSON.stringify(checkoutData));
      navigate("/payment");
    } catch (problem) {
      alert(problem.message || "Could not check product availability.");
    } finally {
      setCheckingAvailability(false);
    }
  };
  if (cartItems.length === 0) {
    return (
      <main className="checkout-page checkout-empty-page">
        <div className="checkout-empty">
          <Flower2 />
          <h1>Your gift basket is empty</h1>
          <p>Add a thoughtful gift before continuing to checkout.</p>
          <button type="button" onClick={() => navigate("/shop")}>
            Explore Gifts
          </button>
        </div>
      </main>
    );
  }
  return (
    <main className="checkout-page">
      <div className="checkout-container">
        {/* Breadcrumb */}
        <div className="checkout-breadcrumb">
          <button type="button" onClick={() => navigate("/")}>
            Home
          </button>
          <span>/</span>
          <button type="button" onClick={() => navigate("/cart")}>
            Your Cart
          </button>
          <span>/</span>
          <strong>Checkout</strong>
        </div>
        {/* Intro */}
        <section className="checkout-intro">
          <span className="checkout-eyebrow">
            <Flower2 size={16} />
            Your gift journey
          </span>
          <h1>
            A thoughtful gift is
            <span> almost ready.</span>
          </h1>
          <p>
            Tell us who it is for, when it should arrive, and how you would like
            to pay.
          </p>
        </section>
        <div className="checkout-layout">
          {/* LEFT SIDE */}
          <form
            id="checkout-form"
            className="checkout-form"
            onSubmit={handleSubmit}
          >
            {/* Petalia growing gift journey */}
            <div className="petalia-growing-journey" aria-hidden="true">
              {/* Soft, mostly-straight stem */}
              <svg
                className="journey-stem-svg"
                viewBox="0 0 90 1000"
                preserveAspectRatio="none"
              >
                <path
                  className="journey-stem-path"
                  d="
                    M48 0
                    C50 110, 44 220, 47 330
                    C50 445, 43 555, 46 665
                    C49 775, 44 885, 48 1000
                  "
                />
              </svg>
              {/* Tiny butterfly 1 */}
              <div className="journey-butterfly butterfly-one">
                <span className="butterfly-wing butterfly-left" />
                <span className="butterfly-body" />
                <span className="butterfly-wing butterfly-right" />
              </div>
              {/* Tiny butterfly 2 */}
              <div className="journey-butterfly butterfly-two">
                <span className="butterfly-wing butterfly-left" />
                <span className="butterfly-body" />
                <span className="butterfly-wing butterfly-right" />
              </div>
              {/* Tiny butterfly 3 — between Step 01 and Step 02 */}
              <div className="journey-butterfly butterfly-three">
                <span className="butterfly-wing butterfly-left" />
                <span className="butterfly-body" />
                <span className="butterfly-wing butterfly-right" />
              </div>
              {/* Tiny butterfly 4 — between Step 01 and Step 02 */}
              <div className="journey-butterfly butterfly-four">
                <span className="butterfly-wing butterfly-left" />
                <span className="butterfly-body" />
                <span className="butterfly-wing butterfly-right" />
              </div>
            </div>
            {/* STEP 1 */}
            <section className="checkout-step checkout-step-one">
              <div className="checkout-step-number step-petal-one">
                <img src={journeyPetal} alt="" />
                <span>01</span>
              </div>
              <div className="checkout-step-content">
                <div className="step-heading">
                  <div>
                    <span className="step-kicker">Recipient</span>
                    <h2>Who is receiving this gift?</h2>
                    <p>Tell us who will receive your thoughtful surprise.</p>
                  </div>
                  <div className="step-heading-icon">
                    <UserRound />
                  </div>
                </div>
                <div className="checkout-field-grid">
                  <label className="checkout-field">
                    <span>
                      Recipient name
                      <strong>*</strong>
                    </span>
                    <div className="checkout-input-wrap">
                      <UserRound />
                      <input
                        type="text"
                        placeholder="e.g. Pumile Pi"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        required
                      />
                    </div>
                  </label>
                  <label className="checkout-field">
                    <span>
                      Phone number
                      <strong>*</strong>
                    </span>
                    <div className="checkout-input-wrap">
                      <Phone />
                      <input
                        type="tel"
                        placeholder="+855 ..."
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                  </label>
                </div>
                <label className="gift-for-me">
                  <input
                    type="checkbox"
                    checked={isForMe}
                    onChange={(e) => setIsForMe(e.target.checked)}
                  />
                  <span className="custom-checkbox">
                    {isForMe && <Check />}
                  </span>
                  This gift is for me
                </label>
              </div>
            </section>
            {/* STEP 2 */}
            <section className="checkout-step checkout-step-two">
              <div className="checkout-step-number step-petal-two">
                <img src={journeyPetal} alt="" />
                <span>02</span>
              </div>
              <div className="checkout-step-content">
                <div className="step-heading">
                  <div>
                    <span className="step-kicker">Delivery</span>
                    <h2>When &amp; where should we send it?</h2>
                    <p>Choose the place and moment that feels right.</p>
                  </div>
                  <div className="step-heading-icon">
                    <Truck />
                  </div>
                </div>
                <label className="checkout-field checkout-field-full">
                  <span>
                    Delivery address
                    <strong>*</strong>
                  </span>
                  <div className="checkout-input-wrap">
                    <MapPin />
                    <input
                      type="text"
                      placeholder="House No., Street, Sangkat..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>
                </label>
                <div className="checkout-field-grid">
                  <label className="checkout-field">
                    <span>
                      City / Province
                      <strong>*</strong>
                    </span>
                    <div className="checkout-input-wrap">
                      <MapPin />
                      <input
                        type="text"
                        placeholder="e.g. Phnom Penh, Siem Reap..."
                        value={deliveryArea}
                        onChange={(e) => setDeliveryArea(e.target.value)}
                        required
                      />
                    </div>
                  </label>
                  <label className="checkout-field">
                    <span>
                      Delivery date
                      <strong>*</strong>
                    </span>
                    <div className="checkout-input-wrap">
                      <CalendarDays />
                      <input
                        type="date"
                        min={today}
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        required
                      />
                    </div>
                  </label>
                </div>
                <div className="delivery-moment">
                  <div className="delivery-moment-title">
                    <Clock3 />
                    <div>
                      <h3>Choose a delivery moment</h3>
                      <p>Pick the time that works best for them.</p>
                    </div>
                  </div>
                  <div className="time-slot-grid">
                    {timeOptions.map((option) => {
                      const selected = timeSlot === option.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          className={`time-slot ${
                            selected ? "time-slot-selected" : ""
                          }`}
                          onClick={() => setTimeSlot(option.id)}
                        >
                          <span className="time-slot-check">
                            {selected && <Check />}
                          </span>
                          <Clock3 />
                          <strong>{option.title}</strong>
                          <small>{option.time}</small>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <label className="checkout-field checkout-field-full">
                  <span>
                    Delivery instructions
                    <em>Optional</em>
                  </span>
                  <div className="checkout-textarea-wrap">
                    <MessageSquareText />
                    <textarea
                      placeholder="Anything helpful for our delivery partner?"
                      maxLength="200"
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                    />
                    <small>{instructions.length}/200</small>
                  </div>
                </label>
              </div>
            </section>
            {/* STEP 3 */}
            <section className="checkout-step checkout-step-three">
              <div className="checkout-step-number step-flower-three">
                <img src={journeyFlower} alt="" />
                <span>03</span>
              </div>
              <div className="checkout-step-content">
                <div className="step-heading">
                  <div>
                    <span className="step-kicker">Payment</span>
                    <h2>Pay with KHQR</h2>
                    <p>
                      Generate a QR code on the next step, then scan it with
                      your banking app to pay.
                    </p>
                  </div>
                  <div className="step-heading-icon">
                    <ShieldCheck />
                  </div>
                </div>
                <div className="khqr-payment-card">
                  <div className="khqr-payment-icon">
                    <QrCode />
                  </div>
                  <div className="khqr-payment-info">
                    <strong>KHQR Payment</strong>
                    <p>Scan securely with your banking app on the next step.</p>
                    <small>Supported by participating banks</small>
                  </div>
                  <div className="khqr-payment-status">
                    <Check />
                    <span>Payment method</span>
                  </div>
                </div>
                <div className="checkout-security-note">
                  <ShieldCheck />
                  <span>
                    Your payment details are protected and handled securely.
                  </span>
                </div>
              </div>
            </section>
            <button
              type="button"
              className="checkout-back"
              onClick={() => navigate("/cart")}
            >
              ← Back to basket
            </button>
          </form>
          {/* RIGHT ORDER SUMMARY */}
          <aside className="checkout-summary">
            <div className="summary-heading">
              <div>
                <span>Your order</span>
                <h2>Your thoughtful gift</h2>
              </div>
              <Gift />
            </div>
            <div className="checkout-summary-items">
              {cartItems.map((item, index) => (
                <article
                  className="checkout-summary-item"
                  key={item.cartId || `${item.id}-${index}`}
                >
                  <div className="summary-product-top">
                    <img src={item.image} alt={item.name} />
                    <div className="summary-product-info">
                      <h3>{item.name}</h3>
                      <p>${Number(item.unitPrice || 0).toFixed(2)}</p>
                      <small>Quantity {item.quantity}</small>
                    </div>
                  </div>
                  <div className="summary-customization">
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
            <div className="summary-divider" />
            <div className="summary-price-row">
              <span>Subtotal</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </div>
            <div className="summary-price-row">
              <span>Delivery</span>
              <small>Arranged separately</small>
            </div>
            <div className="delivery-fee-note">
              <div className="delivery-fee-icon">
                <Truck size={16} />
              </div>
              <div>
                <strong>Delivery arranged separately</strong>
                <span>
                  The seller will confirm the delivery fee based on the
                  recipient's location.
                </span>
              </div>
            </div>
            <div className="summary-divider" />
            <div className="summary-total">
              <span>Gift Total</span>
              <strong>${total.toFixed(2)}</strong>
            </div>
            <button
              type="button"
              className="summary-payment-button"
              disabled={checkingAvailability}
              onClick={() => {
                const form = document.querySelector(".checkout-form");
                form?.requestSubmit();
              }}
            >
              {checkingAvailability
                ? "Checking availability…"
                : "Continue to Payment"}
              <ChevronRight />
            </button>
            <div className="summary-secure">
              <ShieldCheck />
              <div>
                <strong>Secure checkout</strong>
                <span>
                  Your information is used only to prepare and deliver your
                  gift.
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
export default Checkout;
