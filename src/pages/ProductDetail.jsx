import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  Star,
  Store,
  Gift,
  MessageSquare,
  PackageCheck,
  Truck,
  Flower2,
  Sparkles,
  Leaf,
  Check,
} from "lucide-react";

import ProductCard from "../components/ProductCard";
import { getProducts } from "../data/productService";
import { supabase } from "../lib/supabase";

import usePetalia from "../context/usePetalia";

import "../styles/ProductDetail.css";

/* =========================
   ADD-ON IMAGES
========================= */

import lavenderCandle from "../assets/lavender-candle.png";
import vanillaCandle from "../assets/vanilla-candle.png";

function ProductDetail() {
  /* =========================
     NAVIGATION
  ========================= */

  const navigate = useNavigate();

  const { id } = useParams();

  const [searchParams] = useSearchParams();

  const { isWishlisted, toggleWishlist } = usePetalia();

  /* =========================
     LOAD PRODUCTS FROM SUPABASE
  ========================= */

  const [products, setProducts] = useState([]);

  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();

        setProducts(data);
      } catch (error) {
        console.error("Product Detail could not load products:", error);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  /* =========================
     LOAD CUSTOMIZATION OPTIONS
     FROM SUPABASE
  ========================= */

  const [customizationOptions, setCustomizationOptions] = useState([]);

  const [loadingCustomizations, setLoadingCustomizations] = useState(true);

  useEffect(() => {
    const loadCustomizations = async () => {
      if (!id) {
        setLoadingCustomizations(false);

        return;
      }

      setLoadingCustomizations(true);

      try {
        const { data, error } = await supabase
          .from("product_customization_options")
          .select(`
            option_id,
            shop_id,
            shop_customization_options (
              id,
              category,
              name,
              price,
              image_url,
              is_available
            )
          `)
          .eq("product_id", Number(id));

        if (error) {
          throw error;
        }

        const options = (data || [])
          .map((item) => item.shop_customization_options)
          .filter(Boolean);

        console.log(
          "CUSTOMIZATION OPTIONS FROM SUPABASE:",
          options,
        );

        setCustomizationOptions(options);
      } catch (error) {
        console.error(
          "Error loading customization options:",
          error,
        );

        setCustomizationOptions([]);
      } finally {
        setLoadingCustomizations(false);
      }
    };

    loadCustomizations();
  }, [id]);

  const product = products.find(
    (item) => Number(item.id) === Number(id),
  );
  console.log("CURRENT PRODUCT:", product);
  console.log("PRODUCT IMAGE:", product?.image);

  /* =========================
     EDIT MODE
  ========================= */

  const editCartId = searchParams.get("edit");

  const savedCart =
    JSON.parse(localStorage.getItem("petaliaCart")) || [];

  const editingItem = editCartId
    ? savedCart.find(
        (item) => String(item.cartId) === String(editCartId),
      )
    : null;

  const isEditing = Boolean(editingItem);

  /* =========================
     IMAGE
  ========================= */

  const productImages = product
    ? [product.image, product.image, product.image]
    : [];

  const [selectedImage, setSelectedImage] = useState(0);

  /* =========================
     CUSTOMIZATION OPTIONS
     FROM DATABASE
  ========================= */

  const databasePackagingOptions = customizationOptions.filter(
    (option) => option.category === "packaging",
  );

  const databaseCardOptions = customizationOptions.filter(
    (option) => option.category === "message_card",
  );

  const databaseAddonOptions = customizationOptions.filter(
    (option) => option.category === "add_on",
  );

  const wrappingOptions = databasePackagingOptions.map((option) => ({
    id: option.id,

    name: option.name,

    price: Number(option.price),
  }));

  const cardOptions = databaseCardOptions.map((option) => ({
    id: option.id,

    name: option.name,

    price: Number(option.price),
  }));

  const addonOptions = databaseAddonOptions.map((option) => ({
    id: option.id,

    name: option.name,

    price: Number(option.price),

    image:
      option.image_url ||
      (option.name === "Mini Vanilla Candle"
        ? vanillaCandle
        : option.name === "Mini Lavender Candle"
          ? lavenderCandle
          : null),
  }));

  /* =========================
     PAGE STATE
  ========================= */

  const [quantity, setQuantity] = useState(
    editingItem?.quantity || 1,
  );

  const [selectedWrapping, setSelectedWrapping] = useState(
    editingItem?.wrapping || null,
  );

  const [selectedCard, setSelectedCard] = useState(
    editingItem?.messageCardOptionId || null,
  );

  const [message, setMessage] = useState(
    editingItem?.message || "",
  );

  const [selectedAddon, setSelectedAddon] = useState(
    editingItem?.addon || null,
  );

  const [addedToBasket, setAddedToBasket] = useState(false);

  const customizeSectionRef = useRef(null);


  /* =========================
     CART ICON AUTO-SCROLL
  ========================= */

  useEffect(() => {
    const shouldCustomize =
      searchParams.get("customize") === "true";

    if (!shouldCustomize) {
      return;
    }

    const timer = setTimeout(() => {
      customizeSectionRef.current?.scrollIntoView({
        behavior: "smooth",

        block: "start",
      });
    }, 150);

    return () => clearTimeout(timer);
  }, [searchParams]);

  /* =========================
     PRODUCT NOT FOUND
  ========================= */

  if (loadingProducts || loadingCustomizations) {
    return (
      <main className="product-detail-page">
        <div
          className="product-detail-container"
          style={{
            minHeight: "60vh",

            display: "flex",

            alignItems: "center",

            justifyContent: "center",
          }}
        >
          <p>Loading gift...</p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="product-detail-page">
        <div className="product-detail-container">
          <div className="product-detail-breadcrumb">
            <span>Home</span>

            <span>/</span>

            <span>Shop</span>

            <span>/</span>

            <strong>Product Not Found</strong>
          </div>

          <section
            style={{
              padding: "100px 20px",

              textAlign: "center",
            }}
          >
            <h1>Product not found</h1>

            <p>This gift could not be found.</p>

            <button
              type="button"
              className="personalize-button"
              onClick={() => navigate("/shop")}
            >
              Back to Shop
            </button>
          </section>
        </div>
      </main>
    );
  }

  /* =========================
     WISHLIST
  ========================= */

  const saved = isWishlisted(product.id);

  const handleWishlist = () => {
    toggleWishlist(product);
  };

  /* =========================
     PRICE CALCULATION
  ========================= */

  const wrappingPrice =
    wrappingOptions.find(
      (option) => option.name === selectedWrapping,
    )?.price || 0;

  const cardPrice =
    cardOptions.find(
      (option) => option.id === selectedCard,
    )?.price || 0;

  const addonPrice =
    addonOptions.find(
      (option) => option.id === selectedAddon,
    )?.price || 0;

  const singleGiftPrice =
    Number(product.price) +
    wrappingPrice +
    cardPrice +
    addonPrice;

  const totalPrice = singleGiftPrice * quantity;

  /* =========================
     QUANTITY
  ========================= */

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((current) => current - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity((current) => current + 1);
  };

  /* =========================
     IMAGE CONTROLS
  ========================= */

  const showPreviousImage = () => {
    setSelectedImage((previous) =>
      previous === 0
        ? productImages.length - 1
        : previous - 1,
    );
  };

  const showNextImage = () => {
    setSelectedImage((previous) =>
      previous === productImages.length - 1
        ? 0
        : previous + 1,
    );
  };

  /* =========================
     CUSTOMIZATION SCROLL
  ========================= */

  const goToCustomization = () => {
    customizeSectionRef.current?.scrollIntoView({
      behavior: "smooth",

      block: "start",
    });
  };

  /* =========================
     ADD / UPDATE GIFT
  ========================= */

  const addGiftToBasket = () => {
    const selectedWrappingData = selectedWrapping
      ? wrappingOptions.find(
          (option) => option.name === selectedWrapping,
        )
      : null;

    const selectedCardData = selectedCard
      ? cardOptions.find(
          (card) => card.id === selectedCard,
        )
      : null;

    const selectedAddonData = selectedAddon
      ? addonOptions.find(
          (addon) => addon.id === selectedAddon,
        )
      : null;

    const gift = {
      id: product.id,

      shop_id: product.shop_id,

      name: product.name,

      image: product.image,

      basePrice: Number(product.price),

      quantity,

      /*
        Keep both ID and display information.

        Later the backend can validate these IDs
        instead of trusting prices from the browser.
      */

      wrappingOptionId:
        selectedWrappingData?.id || null,

      wrapping:
        selectedWrappingData?.name || null,

      wrappingPrice:
        selectedWrappingData?.price || 0,

      messageCardOptionId:
        selectedCardData?.id || null,

      messageCard:
        selectedCardData?.name || null,

      messageCardPrice:
        selectedCardData?.price || 0,

      message: message.trim(),

      addonOptionId:
        selectedAddonData?.id || null,

      addon:
        selectedAddonData?.name || null,

      addonPrice:
        selectedAddonData?.price || 0,

      unitPrice: singleGiftPrice,

      total: totalPrice,
    };

    const existingCart =
      JSON.parse(localStorage.getItem("petaliaCart")) || [];

    /* =========================
       UPDATE EXISTING GIFT
    ========================= */

    if (isEditing && editingItem) {
      const updatedCart = existingCart.map((item) => {
        if (
          String(item.cartId) === String(editCartId)
        ) {
          return {
            ...gift,

            cartId: item.cartId,
          };
        }

        return item;
      });

      localStorage.setItem(
        "petaliaCart",

        JSON.stringify(updatedCart),
      );

      window.dispatchEvent(
        new Event("petalia-cart-updated"),
      );

      navigate("/cart");

      return;
    }

    /* =========================
       ADD NEW GIFT
    ========================= */

    const currentCartCounter =
      Number(
        localStorage.getItem("petaliaCartCounter"),
      ) || 0;

    const nextCartCounter = currentCartCounter + 1;

    localStorage.setItem(
      "petaliaCartCounter",

      String(nextCartCounter),
    );

    const newGift = {
      ...gift,

      cartId: `cart-${nextCartCounter}`,
    };

    const updatedCart = [...existingCart, newGift];

    localStorage.setItem(
      "petaliaCart",

      JSON.stringify(updatedCart),
    );

    window.dispatchEvent(
      new Event("petalia-cart-updated"),
    );

    setAddedToBasket(true);

    navigate("/cart");
  };

  /* =========================
     PRODUCT DISPLAY HELPERS
  ========================= */

  const sellerName = "Petalia Local Partner";

  const productTags = [
    ...(product.emotion || []),

    ...(product.occasion || []),
  ].slice(0, 3);

  const isFlower = product.category === "Flowers";

  const isCandle = product.category === "Candles";

  const meaningTitle = isFlower
    ? "Thoughtfully Selected Flowers"
    : isCandle
      ? "A Meaningful Scent"
      : "Thoughtfully Curated Gift";

  const meaningText = isFlower
    ? "Flowers can express care, appreciation, affection, and meaningful emotions."
    : isCandle
      ? "A calming scent can create warmth, comfort, and a thoughtful atmosphere."
      : "A curated combination designed to make meaningful gifting easier.";

  /* =========================
     RELATED PRODUCTS
  ========================= */

  const relatedProducts = products
    .filter((item) => {
      const itemEmotions = Array.isArray(item.emotion)
        ? item.emotion
        : item.emotion
          ? [item.emotion]
          : [];

      const productEmotions = Array.isArray(product.emotion)
        ? product.emotion
        : product.emotion
          ? [product.emotion]
          : [];

      return (
        item.id !== product.id &&
        (item.category === product.category ||
          itemEmotions.some((emotion) =>
            productEmotions.includes(emotion),
          ))
      );
    })
    .slice(0, 4);

  /* =========================
     PAGE
  ========================= */

  return (
    <main className="product-detail-page">
      <div className="product-detail-container">
        {/* =========================
            BREADCRUMB
        ========================= */}

        <div className="product-detail-breadcrumb">
          <span
            onClick={() => navigate("/")}
            style={{
              cursor: "pointer",
            }}
          >
            Home
          </span>

          <span>/</span>

          <span
            onClick={() => navigate("/shop")}
            style={{
              cursor: "pointer",
            }}
          >
            Shop
          </span>

          <span>/</span>

          <span>{product.category}</span>

          <span>/</span>

          <strong>{product.name}</strong>
        </div>

        {/* =========================
            MAIN PRODUCT
        ========================= */}

        <section className="product-main-section">
          {/* PRODUCT GALLERY */}

          <div className="product-gallery">
            <div className="product-main-image-wrapper">
              {product.badge && (
                <span className="detail-product-badge">
                  {product.badge}
                </span>
              )}

              <button
                type="button"
                className={`detail-wishlist-button ${
                  saved ? "active" : ""
                }`}
                onClick={handleWishlist}
                aria-label={
                  saved
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
              >
                <Heart
                  fill={saved ? "currentColor" : "none"}
                />
              </button>

              <button
                type="button"
                className="gallery-arrow gallery-arrow-left"
                onClick={showPreviousImage}
                aria-label="Previous image"
              >
                <ChevronLeft />
              </button>

              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="product-main-image"
              />

              <button
                type="button"
                className="gallery-arrow gallery-arrow-right"
                onClick={showNextImage}
                aria-label="Next image"
              >
                <ChevronRight />
              </button>
            </div>

            <div className="product-thumbnails">
              {productImages.map((image, index) => (
                <button
                  type="button"
                  key={index}
                  className={
                    selectedImage === index
                      ? "product-thumbnail active"
                      : "product-thumbnail"
                  }
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* =========================
              PRODUCT INFORMATION
          ========================= */}

          <div className="product-detail-info">
            <h1>{product.name}</h1>

            <div className="detail-rating">
              <Star fill="currentColor" />

              <strong>{product.rating}</strong>

              <span>({product.reviews} reviews)</span>
            </div>

            <div className="detail-price">
              ${Number(product.price).toFixed(2)}
            </div>

            <div className="detail-seller">
              <Store />

              <span>Sold by</span>

              <strong>{sellerName}</strong>
            </div>

            <p className="detail-description">
              {product.description}
            </p>

            <div className="detail-tags">
              {productTags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>

            {/* MEANING CARD */}

            <div className="detail-meaning-card">
              <Flower2 />

              <div>
                <strong>{meaningTitle}</strong>

                <p>{meaningText}</p>
              </div>
            </div>

            {/* QUANTITY */}

            <div className="detail-quantity-area">
              <span>Quantity</span>

              <div className="quantity-control">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={quantity === 1}
                >
                  <Minus />
                </button>

                <span>{quantity}</span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                >
                  <Plus />
                </button>
              </div>
            </div>

            {/* ACTIONS */}

            <div className="detail-main-actions">
              <button
                type="button"
                className="personalize-button"
                onClick={goToCustomization}
              >
                <Gift />

                Personalize Gift
              </button>

              <button
                type="button"
                className={`detail-secondary-wishlist ${
                  saved ? "active" : ""
                }`}
                onClick={handleWishlist}
              >
                <Heart
                  fill={saved ? "currentColor" : "none"}
                />

                {saved
                  ? "Saved to Wishlist"
                  : "Add to Wishlist"}
              </button>
            </div>
          </div>
        </section>

        {/* =========================
            PERSONALIZE
        ========================= */}

        <section
          className="personalize-section"
          ref={customizeSectionRef}
        >
          <div className="section-heading">
            <span className="section-eyebrow">
              Make it personal
            </span>

            <h2>Personalize Your Gift</h2>

            <p>
              Add thoughtful touches before placing your gift
              in the basket.
            </p>
          </div>

          <div className="personalize-grid">
            {/* PACKAGING / WRAPPING */}

            {wrappingOptions.length > 0 && (
              <div className="customization-card">
                <div className="customization-heading">
                  <span className="customization-number">
                    01
                  </span>

                  <div>
                    <h3>
                      {isCandle
                        ? "Gift Packaging"
                        : "Wrapping Style"}
                    </h3>

                    <span className="required-label">
                      Required
                    </span>
                  </div>
                </div>

                <div className="wrapping-options">
                  {wrappingOptions.map((option) => (
                    <button
                      type="button"
                      key={option.id}
                      className={
                        selectedWrapping === option.name
                          ? "wrapping-option selected"
                          : "wrapping-option"
                      }
                      onClick={() =>
                        setSelectedWrapping(option.name)
                      }
                    >
                      <div className="wrapping-preview">
                        <Gift />
                      </div>

                      <span>{option.name}</span>

                      {option.price > 0 && (
                        <small>
                          +${option.price.toFixed(2)}
                        </small>
                      )}

                      {selectedWrapping ===
                        option.name && (
                        <Check className="selected-check" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="customization-note">
                  <Check />

                  {wrappingPrice > 0
                    ? `Selected packaging adds $${wrappingPrice.toFixed(
                        2,
                      )} to your gift.`
                    : "This packaging option is included with your gift."}
                </div>
              </div>
            )}

            {/* MESSAGE CARD */}

            {cardOptions.length > 0 && (
              <div className="customization-card">
                <div className="customization-heading">
                  <span className="customization-number">
                    {wrappingOptions.length > 0
                      ? "02"
                      : "01"}
                  </span>

                  <div>
                    <h3>Message Card</h3>

                    <span className="optional-label">
                      Optional
                    </span>
                  </div>
                </div>

                <div className="card-options">
                  {cardOptions.map((card) => (
                    <button
                      type="button"
                      key={card.id}
                      className={
                        selectedCard === card.id
                          ? "message-card-option selected"
                          : "message-card-option"
                      }
                      onClick={() =>
                        setSelectedCard(
                          selectedCard === card.id
                            ? null
                            : card.id,
                        )
                      }
                    >
                      <MessageSquare />

                      <span>{card.name}</span>

                      {card.price > 0 && (
                        <small>
                          +${card.price.toFixed(2)}
                        </small>
                      )}
                    </button>
                  ))}
                </div>

                {selectedCard && (
                  <div className="gift-message-area">
                    <textarea
                      maxLength="150"
                      value={message}
                      onChange={(event) =>
                        setMessage(event.target.value)
                      }
                      placeholder="Write your personal message here..."
                    />

                    <span className="message-count">
                      {message.length}/150
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* ADD-ON */}

            {addonOptions.length > 0 && (
              <div className="customization-card">
                <div className="customization-heading">
                  <span className="customization-number">
                    {wrappingOptions.length > 0 &&
                    cardOptions.length > 0
                      ? "03"
                      : wrappingOptions.length > 0 ||
                          cardOptions.length > 0
                        ? "02"
                        : "01"}
                  </span>

                  <div>
                    <h3>Add Something Extra</h3>

                    <span className="optional-label">
                      Optional
                    </span>
                  </div>
                </div>

                <div className="addon-options">
                  {addonOptions.map((addon) => (
                    <button
                      type="button"
                      key={addon.id}
                      className={
                        selectedAddon === addon.id
                          ? "addon-option selected"
                          : "addon-option"
                      }
                      onClick={() =>
                        setSelectedAddon(
                          selectedAddon === addon.id
                            ? null
                            : addon.id,
                        )
                      }
                    >
                      {addon.image ? (
                        <img
                          src={addon.image}
                          alt={addon.name}
                        />
                      ) : (
                        <div className="addon-image-placeholder">
                          <Gift />
                        </div>
                      )}

                      <div>
                        <strong>{addon.name}</strong>

                        <span>
                          +${addon.price.toFixed(2)}
                        </span>
                      </div>

                      {selectedAddon === addon.id && (
                        <Check className="selected-check" />
                      )}
                    </button>
                  ))}

                  <button
                    type="button"
                    className={
                      selectedAddon === null
                        ? "addon-option no-addon selected"
                        : "addon-option no-addon"
                    }
                    onClick={() => setSelectedAddon(null)}
                  >
                    <span>No add-on</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* =========================
            GIFT SUMMARY
        ========================= */}

        <section className="gift-summary-section">
          <div className="gift-summary-heading">
            <h2>Your Gift So Far</h2>

            <span>
              Review before adding it to your basket
            </span>
          </div>

          <div className="gift-summary-grid">
            {/* PRODUCT */}

            <div className="summary-item">
              <img
                src={product.image}
                alt={product.name}
              />

              <div>
                <span>Your Gift</span>

                <strong>{product.name}</strong>

                <small>
                  ${Number(product.price).toFixed(2)}
                </small>
              </div>
            </div>

            {/* WRAPPING / PACKAGING */}

            {wrappingOptions.length > 0 && (
              <div className="summary-item">
                <Gift />

                <div>
                  <span>
                    {isCandle
                      ? "Gift Packaging"
                      : "Wrapping"}
                  </span>

                  <strong>
                    {selectedWrapping ||
                      "No packaging selected"}
                  </strong>

                  <small>
                    {wrappingPrice > 0
                      ? `+$${wrappingPrice.toFixed(2)}`
                      : "Included"}
                  </small>
                </div>
              </div>
            )}

            {/* MESSAGE */}

            {cardOptions.length > 0 && (
              <div className="summary-item">
                <MessageSquare />

                <div>
                  <span>Message Card</span>

                  <strong>
                    {selectedCard
                      ? cardOptions.find(
                          (card) =>
                            card.id === selectedCard,
                        )?.name
                      : "No card selected"}
                  </strong>

                  {selectedCard && cardPrice > 0 && (
                    <small>
                      +${cardPrice.toFixed(2)}
                    </small>
                  )}

                  {selectedCard && message && (
                    <small className="summary-message">
                      “{message}”
                    </small>
                  )}
                </div>
              </div>
            )}

            {/* ADD-ON */}

            {addonOptions.length > 0 && (
              <div className="summary-item">
                <Gift />

                <div>
                  <span>Add-on</span>

                  <strong>
                    {selectedAddon
                      ? addonOptions.find(
                          (addon) =>
                            addon.id === selectedAddon,
                        )?.name
                      : "No add-on"}
                  </strong>

                  {selectedAddon && addonPrice > 0 && (
                    <small>
                      +${addonPrice.toFixed(2)}
                    </small>
                  )}
                </div>
              </div>
            )}

            {/* QUANTITY */}

            <div className="summary-item">
              <PackageCheck />

              <div>
                <span>Quantity</span>

                <strong>{quantity}</strong>
              </div>
            </div>

            {/* TOTAL */}

            <div className="summary-total">
              <span>Estimated Total</span>

              <strong>
                ${totalPrice.toFixed(2)}
              </strong>
            </div>

            {/* ADD / UPDATE */}

            <button
              type="button"
              className="add-gift-basket-button"
              onClick={addGiftToBasket}
            >
              <Gift />

              {isEditing
                ? "Update Gift"
                : "Add Gift to Basket"}
            </button>
          </div>

          {addedToBasket && (
            <div className="basket-success-message">
              <Check />

              Gift added to your basket.
            </div>
          )}
        </section>

        {/* =========================
            WHY THIS GIFT
        ========================= */}

        <section className="why-gift-section">
          <div className="small-section-heading">
            <h2>Why This Gift?</h2>

            <p>
              A thoughtful choice for meaningful moments.
            </p>
          </div>

          <div className="why-gift-grid">
            <div className="why-gift-item">
              <div className="info-icon">
                <Flower2 />
              </div>

              <div>
                <h3>Meaningful Choice</h3>

                <p>
                  Selected to help express care,
                  appreciation, and emotion.
                </p>
              </div>
            </div>

            <div className="why-gift-item">
              <div className="info-icon">
                <Leaf />
              </div>

              <div>
                <h3>Thoughtfully Prepared</h3>

                <p>
                  Prepared with care by a Petalia local
                  partner.
                </p>
              </div>
            </div>

            <div className="why-gift-item">
              <div className="info-icon">
                <Sparkles />
              </div>

              <div>
                <h3>Personal Touch</h3>

                <p>
                  Customize the gift to make the moment feel
                  more personal.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            GOOD TO KNOW
        ========================= */}

        <section className="good-to-know-section">
          <div className="small-section-heading">
            <h2>Good to Know</h2>
          </div>

          <div className="good-to-know-grid">
            <div className="good-to-know-item">
              <Gift />

              <div>
                <h3>What Is Included</h3>

                <p>
                  Your gift and any customization options you
                  choose for this product.
                </p>
              </div>
            </div>

            <div className="good-to-know-item">
              <Truck />

              <div>
                <h3>Delivery Information</h3>

                <p>
                  Delivery area, date, and time will be
                  selected during checkout.
                </p>
              </div>
            </div>

            <div className="good-to-know-item">
              <Flower2 />

              <div>
                <h3>Quality & Care</h3>

                <p>
                  Prepared carefully by a local Petalia
                  partner seller.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            SELLER
        ========================= */}

        <section className="detail-seller-section">
          <div className="seller-section-icon">
            <Store />
          </div>

          <div className="seller-section-content">
            <span>Local Gift Shop</span>

            <h2>{sellerName}</h2>

            <p>
              Prepared by a Petalia partner seller with care
              for every order.
            </p>
          </div>

          <button
            type="button"
            className="view-shop-button"
            onClick={() => navigate("/local-shops")}
          >
            View Shops
          </button>
        </section>

        {/* =========================
            RELATED PRODUCTS
        ========================= */}

        {relatedProducts.length > 0 && (
          <section className="related-gifts-section">
            <div className="related-gifts-heading">
              <div>
                <span>You may also like</span>

                <h2>
                  More Gifts with the Same Feeling
                </h2>
              </div>
            </div>

            <div className="related-gifts-grid">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  id={relatedProduct.id}
                  image={relatedProduct.image}
                  name={relatedProduct.name}
                  price={relatedProduct.price}
                  rating={relatedProduct.rating}
                  reviews={relatedProduct.reviews}
                  badge={relatedProduct.badge}
                  category={relatedProduct.category}
                  description={relatedProduct.description}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default ProductDetail;