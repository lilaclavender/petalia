import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ChevronLeft,
  Gift,
  MessageSquare,
  Minus,
  PackageCheck,
  Pencil,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";

import "../styles/Cart.css";

function Cart() {
  const navigate = useNavigate();
  const [editingMessageIndex, setEditingMessageIndex] = useState(null);
  const [messageDraft, setMessageDraft] = useState("");

  /* =========================
     CART STATE
  ========================= */

  const [cartItems, setCartItems] = useState(() => {
    const savedCart = JSON.parse(localStorage.getItem("petaliaCart")) || [];

    const normalizedCart = savedCart.map((item) => {
      const safeQuantity =
        item.quantity && item.quantity > 0 ? item.quantity : 1;

      const unitPrice =
        item.unitPrice ??
        (item.total ? item.total / safeQuantity : item.basePrice || 0);

      return {
        ...item,
        quantity: safeQuantity,
        unitPrice,
      };
    });

    return normalizedCart;
  });

  /* =========================
   EDIT MESSAGE
  ========================= */

  const startEditingMessage = (item, index) => {
    setEditingMessageIndex(index);
    setMessageDraft(item.message || "");
  };

  const cancelEditingMessage = () => {
    setEditingMessageIndex(null);
    setMessageDraft("");
  };

  const saveMessage = (index) => {
    const updatedCart = cartItems.map((item, itemIndex) => {
      if (itemIndex === index) {
        return {
          ...item,
          message: messageDraft,
        };
      }

      return item;
    });

    saveCart(updatedCart);

    setEditingMessageIndex(null);
    setMessageDraft("");
  };

  /* =========================
     SAVE CART
  ========================= */

  const saveCart = (updatedCart) => {
    setCartItems(updatedCart);

    localStorage.setItem("petaliaCart", JSON.stringify(updatedCart));

    window.dispatchEvent(new Event("petalia-cart-updated"));
  };
  /* =========================
     QUANTITY
  ========================= */

  const increaseQuantity = (index) => {
    const updatedCart = cartItems.map((item, itemIndex) => {
      if (itemIndex === index) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }

      return item;
    });

    saveCart(updatedCart);
  };

  const decreaseQuantity = (index) => {
    const updatedCart = cartItems.map((item, itemIndex) => {
      if (itemIndex === index) {
        return {
          ...item,

          quantity: Math.max(1, item.quantity - 1),
        };
      }

      return item;
    });

    saveCart(updatedCart);
  };

  /* =========================
     REMOVE ITEM
  ========================= */

  const removeItem = (index) => {
    const updatedCart = cartItems.filter((_, itemIndex) => itemIndex !== index);

    saveCart(updatedCart);
  };

  /* =========================
     PRICE CALCULATION
  ========================= */

  const getLineTotal = (item) => {
    return item.unitPrice * item.quantity;
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + getLineTotal(item),
    0,
  );

  const estimatedTotal = subtotal;

  /* =========================
     NAVIGATION
  ========================= */

  const continueShopping = () => {
    navigate("/shop");
  };

  const editGift = (item, index) => {
    /*
      Some older cart items were created
      before we added cartId.

      If this item doesn't have one,
      give it one now.
    */

    const cartId = item.cartId || `cart-existing-${index}`;

    const updatedCart = cartItems.map((cartItem, cartIndex) => {
      if (cartIndex === index) {
        return {
          ...cartItem,
          cartId,
        };
      }

      return cartItem;
    });

    /*
      Save the cartId so Product Detail
      can find this exact gift.
    */

    saveCart(updatedCart);

    /*
      Open Product Detail in EDIT MODE.
    */

    navigate(`/product/${item.id}?edit=${cartId}`);
  };

  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      return;
    }

    navigate("/checkout");
  };

  /* =========================
     EMPTY CART
  ========================= */

  if (cartItems.length === 0) {
    return (
      <main className="cart-page">
        <div className="cart-container">

          <section className="empty-cart">
            <div className="empty-cart-icon">
              <ShoppingBag />
            </div>

            <h1>Your Gift Basket is Empty</h1>

            <p>You haven't added any thoughtful gifts yet.</p>

            <button type="button" onClick={continueShopping}>
              <ChevronLeft />
              Start Shopping
            </button>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="cart-container">

        {/* =========================
            PAGE HEADER
        ========================= */}

        <div className="cart-page-heading">
          <div>
            <h1>Your Gift Basket</h1>

            <p>Review your thoughtful gifts before checkout.</p>
          </div>

          <div className="cart-care-note">
            <Gift />

            <span>
              Every gift is prepared with care by a local Petalia partner
              seller.
            </span>
          </div>
        </div>

        {/* =========================
            CART LAYOUT
        ========================= */}

        <div className="cart-layout">
          {/* =========================
              LEFT SIDE
          ========================= */}

          <section className="cart-items-area">
            {cartItems.map((item, index) => {
              const lineTotal = getLineTotal(item);

              return (
                <article className="cart-item-card" key={`${item.id}-${index}`}>
                  {/* =========================
                        PRODUCT AREA
                    ========================= */}

                  <div className="cart-item-main">
                    {/* IMAGE */}

                    <div className="cart-item-image">
                      <img src={item.image} alt={item.name} />
                    </div>

                    {/* INFORMATION */}

                    <div className="cart-item-information">
                      <div className="cart-item-title-row">
                        <div>
                          <h2>{item.name}</h2>

                          <strong className="cart-product-price">
                            ${Number(item.basePrice).toFixed(2)}
                          </strong>
                        </div>

                        <button
                          type="button"
                          className="edit-gift-button"
                          onClick={() => editGift(item, index)}
                        >
                          <Pencil />
                          Edit Gift
                        </button>
                      </div>

                      {/* =========================
                            CUSTOMIZATION
                        ========================= */}

                      <div className="cart-customization-list">
                        <div className="cart-customization-row">
                          <Gift />

                          <span className="cart-customization-label">
                            Wrapping
                          </span>

                          <strong>{item.wrapping || "Standard"}</strong>
                        </div>

                        <div className="cart-customization-row">
                          <MessageSquare />

                          <span className="cart-customization-label">
                            Message Card
                          </span>

                          <strong>
                            {item.messageCard || "No card selected"}
                          </strong>
                        </div>

                        <div className="cart-customization-row">
                          <PackageCheck />

                          <span className="cart-customization-label">
                            Add-on
                          </span>

                          <strong>{item.addon || "No add-on"}</strong>
                        </div>
                      </div>

                      {/* =========================
                            QUANTITY / TOTAL
                        ========================= */}

                      <div className="cart-item-bottom">
                        <div className="cart-quantity-area">
                          <span>Quantity</span>

                          <div className="cart-quantity-control">
                            <button
                              type="button"
                              onClick={() => decreaseQuantity(index)}
                              disabled={item.quantity === 1}
                            >
                              <Minus />
                            </button>

                            <strong>{item.quantity}</strong>

                            <button
                              type="button"
                              onClick={() => increaseQuantity(index)}
                            >
                              <Plus />
                            </button>
                          </div>
                        </div>

                        <div className="cart-line-total">
                          <span>Item Total</span>

                          <strong>${lineTotal.toFixed(2)}</strong>
                        </div>

                        <button
                          type="button"
                          className="remove-cart-item"
                          onClick={() => removeItem(index)}
                        >
                          <Trash2 />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* =========================
                        MESSAGE PREVIEW
                    ========================= */}

                  {item.messageCard && (
                    <div className="cart-message-preview">
                      <div className="message-preview-icon">
                        <MessageSquare />
                      </div>

                      {editingMessageIndex === index ? (
                        <div className="message-edit-area">
                          <span>Message Card</span>

                          <textarea
                            value={messageDraft}
                            onChange={(e) => setMessageDraft(e.target.value)}
                            placeholder="Write your personal message..."
                            maxLength={200}
                          />

                          <div className="message-edit-actions">
                            <button
                              type="button"
                              className="message-cancel-button"
                              onClick={cancelEditingMessage}
                            >
                              Cancel
                            </button>

                            <button
                              type="button"
                              className="message-save-button"
                              onClick={() => saveMessage(index)}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="message-preview-content">
                            <span>Message Preview</span>

                            <p>
                              {item.message
                                ? `“${item.message}”`
                                : "No personal message written yet."}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => startEditingMessage(item, index)}
                          >
                            Edit Message
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </article>
              );
            })}

            {/* =========================
                CONTINUE SHOPPING
            ========================= */}

            <button
              type="button"
              className="continue-shopping-button"
              onClick={continueShopping}
            >
              <ChevronLeft />
              Continue Shopping
            </button>
          </section>

          {/* =========================
              ORDER SUMMARY
          ========================= */}

          <aside className="cart-summary">
            <h2>Order Summary</h2>

            {/* =========================
                SUMMARY ITEMS
            ========================= */}

            <div className="summary-product-list">
              {cartItems.map((item, index) => (
                <div
                  className="summary-product-row"
                  key={`summary-${item.id}-${index}`}
                >
                  <div>
                    <span>{item.name}</span>

                    {item.quantity > 1 && <small>× {item.quantity}</small>}
                  </div>

                  <strong>${getLineTotal(item).toFixed(2)}</strong>
                </div>
              ))}
            </div>

            <div className="cart-summary-divider" />

            {/* =========================
                SUBTOTAL
            ========================= */}

            <div className="cart-summary-row">
              <span>Subtotal</span>

              <strong>${subtotal.toFixed(2)}</strong>
            </div>

            {/* =========================
                DELIVERY
            ========================= */}

            <div className="cart-summary-row delivery-row">
              <span>Delivery</span>

              <small>Calculated at checkout</small>
            </div>

            <div className="cart-summary-divider" />

            {/* =========================
                ESTIMATED TOTAL
            ========================= */}

            <div className="cart-summary-total">
              <span>Estimated Total</span>

              <strong>${estimatedTotal.toFixed(2)}</strong>
            </div>

            {/* =========================
                SECURITY
            ========================= */}

            <div className="secure-checkout-note">
              <ShieldCheck />

              <div>
                <strong>Secure Checkout</strong>

                <span>Your information is protected.</span>
              </div>
            </div>

            {/* =========================
                CHECKOUT BUTTON
            ========================= */}

            <button
              type="button"
              className="proceed-checkout-button"
              onClick={proceedToCheckout}
            >
              <ShoppingBag />
              Proceed to Checkout
            </button>

            {/* =========================
                PAYMENT TYPES
            ========================= */}

            <div className="cart-payment-types">
              <span>We accept</span>

              <div>
                <strong>KHQR</strong>

                <strong>VISA</strong>
              </div>
            </div>

            {/* =========================
                DELIVERY NOTE
            ========================= */}

            <div className="cart-delivery-note">
              <Truck />

              <span>
                Delivery cost will be calculated after you choose your delivery
                area.
              </span>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default Cart;
