import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ImagePlus, Save, X } from "lucide-react";

import { supabase } from "../lib/supabase";

import {
  suggestProductMatches,
  petaliaMatchOptions,
} from "../utils/giftMatching";

import sakuraBranch from "../assets/sakura-branch.png";
import flowersData from "../data/flowersData";

import "../styles/VendorAddProduct.css";
import "../styles/VendorAddProduct.css";

const candleScents = [
  "Vanilla",
  "Lavender",
  "Rose",
  "Jasmine",
  "Sandalwood",
  "Citrus",
  "Fresh Linen",
  "Unscented",
];

const flowerOptions = Object.values(flowersData);

/* =========================================================
   HELPERS
========================================================= */

const parseArrayField = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (!value) {
    return [];
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);

      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
};

/* =========================================================
   COMPONENT
========================================================= */

function VendorEditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();

  /* =====================================================
     SELLER / PRODUCT
  ===================================================== */

  const [shop, setShop] = useState(null);
  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /* =====================================================
     IMAGE
  ===================================================== */

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [originalImage, setOriginalImage] = useState("");

  /* =====================================================
     PETALIA MATCHING
  ===================================================== */

  const [matchesGenerated, setMatchesGenerated] = useState(false);

  const [showAdjustMatches, setShowAdjustMatches] = useState(false);

  const [matchMessage, setMatchMessage] = useState("");

  /* =====================================================
     FORM
  ===================================================== */

  const [formData, setFormData] = useState({
    name: "",
    category: "Flowers",
    price: "",
    stock: "",
    description: "",

    emotions: [],
    occasions: [],
    recipients: [],
    giftStyles: [],

    badge: "",

    flower: "",
    flowerColor: "",

    candleScent: "",

    giftSetContents: [],

    personalizationOptions: [],
  });

  /* =====================================================
     CATEGORY-SPECIFIC VALUES
  ===================================================== */

  const selectedFlower = flowerOptions.find(
    (flower) => flower.name === formData.flower,
  );

  const flowerColorOptions = selectedFlower?.colors || [];

  const giftSetHasFlowers =
    formData.category === "Gift Sets" &&
    formData.giftSetContents.includes("flowers");

  const giftSetHasCandle =
    formData.category === "Gift Sets" &&
    formData.giftSetContents.includes("candle");

  const needsFlowerDetails =
    formData.category === "Flowers" || giftSetHasFlowers;

  const needsCandleDetails =
    formData.category === "Candles" || giftSetHasCandle;

  /* =====================================================
     LOAD SELLER + PRODUCT
  ===================================================== */

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);

      try {
        /* -----------------------------------------------
           1. CURRENT USER
        ----------------------------------------------- */

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          navigate("/sign-in", {
            replace: true,
          });

          return;
        }

        /* -----------------------------------------------
           2. SELLER SHOP
        ----------------------------------------------- */

        const { data: shopData, error: shopError } = await supabase
          .from("shops")
          .select("id, name")
          .eq("owner_id", user.id)
          .maybeSingle();

        if (shopError) {
          throw shopError;
        }

        if (!shopData) {
          alert("Your seller shop could not be found.");

          navigate("/", {
            replace: true,
          });

          return;
        }

        setShop(shopData);

        /* -----------------------------------------------
           3. PRODUCT

           Important:
           shop_id check prevents seller from editing
           another seller's product.
        ----------------------------------------------- */

        const { data: productData, error: productError } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .eq("shop_id", shopData.id)
          .maybeSingle();

        if (productError) {
          throw productError;
        }

        if (!productData) {
          alert("This product could not be found in your shop.");

          navigate("/vendor-dashboard", {
            replace: true,
          });

          return;
        }

        setProduct(productData);

        /* -----------------------------------------------
           4. PRE-FILL FORM
        ----------------------------------------------- */

        const loadedEmotions = parseArrayField(productData.emotion);

        const loadedOccasions = parseArrayField(productData.occasion);

        const loadedRecipients = parseArrayField(productData.recipients);

        const loadedGiftStyles = parseArrayField(productData.gift_styles);

        const loadedGiftSetContents = parseArrayField(
          productData.gift_set_contents,
        );

        const loadedPersonalization = parseArrayField(
          productData.personalization_options,
        );

        setFormData({
          name: productData.name || "",

          category: productData.category || "Flowers",

          price: productData.price ?? "",

          stock: productData.stock ?? "",

          description: productData.description || "",

          emotions: loadedEmotions,

          occasions: loadedOccasions,

          recipients: loadedRecipients,

          giftStyles: loadedGiftStyles,

          badge: productData.badge || "",

          flower: productData.flower || "",

          flowerColor: productData.flower_color || "",

          candleScent: productData.candle_scent || "",

          giftSetContents: loadedGiftSetContents,

          personalizationOptions: loadedPersonalization,
        });

        /* -----------------------------------------------
           5. CURRENT IMAGE
        ----------------------------------------------- */

        const currentImage = productData.image || "";

        setOriginalImage(currentImage);
        setImagePreview(currentImage);

        /* -----------------------------------------------
           Existing Petalia matches should appear
           immediately on Edit.
        ----------------------------------------------- */

        const hasExistingMatches =
          loadedEmotions.length > 0 ||
          loadedOccasions.length > 0 ||
          loadedRecipients.length > 0 ||
          loadedGiftStyles.length > 0;

        setMatchesGenerated(hasExistingMatches);

        if (hasExistingMatches) {
          setMatchMessage(
            "These are the current gift matches for this product. Review or adjust them before saving.",
          );
        }
      } catch (error) {
        console.error("Load edit product error:", error);

        alert(error.message || "The product could not be loaded.");

        navigate("/vendor-dashboard", {
          replace: true,
        });
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate]);

  /* =====================================================
     CLEAN LOCAL IMAGE PREVIEW
  ===================================================== */

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  /* =====================================================
     RESET PETALIA MATCHES
  ===================================================== */

  const resetPetaliaMatches = () => {
    setMatchesGenerated(false);
    setShowAdjustMatches(false);
    setMatchMessage("");
  };

  /* =====================================================
     INPUT CHANGE
  ===================================================== */

  const handleChange = (event) => {
    const { name, value } = event.target;

    /* -----------------------------------------------
       CATEGORY
    ----------------------------------------------- */

    if (name === "category") {
      setFormData((previous) => ({
        ...previous,

        category: value,

        flower: "",
        flowerColor: "",
        candleScent: "",
        giftSetContents: [],

        emotions: [],
        occasions: [],
        recipients: [],
        giftStyles: [],
      }));

      resetPetaliaMatches();

      return;
    }

    /* -----------------------------------------------
       FLOWER
    ----------------------------------------------- */

    if (name === "flower") {
      setFormData((previous) => ({
        ...previous,

        flower: value,
        flowerColor: "",

        emotions: [],
        occasions: [],
        recipients: [],
        giftStyles: [],
      }));

      resetPetaliaMatches();

      return;
    }

    /* -----------------------------------------------
       MATCHING FACTS
    ----------------------------------------------- */

    const matchingFields = [
      "name",
      "description",
      "flowerColor",
      "candleScent",
    ];

    if (matchingFields.includes(name)) {
      setFormData((previous) => ({
        ...previous,

        [name]: value,

        emotions: [],
        occasions: [],
        recipients: [],
        giftStyles: [],
      }));

      resetPetaliaMatches();

      return;
    }

    /* -----------------------------------------------
       NORMAL FIELD
    ----------------------------------------------- */

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =====================================================
     GIFT SET CONTENT
  ===================================================== */

  const handleGiftSetContentChange = (value) => {
    setFormData((previous) => {
      const alreadySelected = previous.giftSetContents.includes(value);

      const updatedContents = alreadySelected
        ? previous.giftSetContents.filter((item) => item !== value)
        : [...previous.giftSetContents, value];

      return {
        ...previous,

        giftSetContents: updatedContents,

        flower: value === "flowers" && alreadySelected ? "" : previous.flower,

        flowerColor:
          value === "flowers" && alreadySelected ? "" : previous.flowerColor,

        candleScent:
          value === "candle" && alreadySelected ? "" : previous.candleScent,

        emotions: [],
        occasions: [],
        recipients: [],
        giftStyles: [],
      };
    });

    resetPetaliaMatches();
  };

  /* =====================================================
     PERSONALIZATION
  ===================================================== */

  const handlePersonalizationChange = (value) => {
    setFormData((previous) => {
      const alreadySelected = previous.personalizationOptions.includes(value);

      return {
        ...previous,

        personalizationOptions: alreadySelected
          ? previous.personalizationOptions.filter((item) => item !== value)
          : [...previous.personalizationOptions, value],
      };
    });
  };

  /* =====================================================
     IMAGE CHANGE
  ===================================================== */

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      alert("Please choose a JPG, PNG, or WEBP image.");

      event.target.value = "";

      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      alert("Image must be smaller than 5 MB.");

      event.target.value = "";

      return;
    }

    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(file);

    setImagePreview(URL.createObjectURL(file));
  };

  /* =====================================================
     VALIDATE CATEGORY DETAILS
  ===================================================== */

  const validateProductDetails = () => {
    if (formData.category === "Flowers") {
      if (!formData.flower) {
        alert("Please select the flower type.");

        return false;
      }

      if (!formData.flowerColor) {
        alert("Please select the flower color.");

        return false;
      }
    }

    if (formData.category === "Candles") {
      if (!formData.candleScent) {
        alert("Please select the candle scent.");

        return false;
      }
    }

    if (formData.category === "Gift Sets") {
      if (formData.giftSetContents.length === 0) {
        alert("Please select what is included in the gift set.");

        return false;
      }

      if (giftSetHasFlowers && !formData.flower) {
        alert("Please select the flower type included in the gift set.");

        return false;
      }

      if (giftSetHasFlowers && !formData.flowerColor) {
        alert("Please select the flower color included in the gift set.");

        return false;
      }

      if (giftSetHasCandle && !formData.candleScent) {
        alert("Please select the candle scent included in the gift set.");

        return false;
      }
    }

    return true;
  };

  /* =====================================================
     PETALIA MATCHING
  ===================================================== */

  const handleSuggestMatches = () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      alert(
        "Please enter the product name and description before asking Petalia to suggest matches.",
      );

      return;
    }

    if (!validateProductDetails()) {
      return;
    }

    const suggestions = suggestProductMatches({
      name: formData.name,

      description: formData.description,

      category: formData.category,

      flower: needsFlowerDetails ? formData.flower : "",

      flowerColor: needsFlowerDetails ? formData.flowerColor : "",
    });

    setFormData((previous) => ({
      ...previous,

      emotions: suggestions.emotions,

      occasions: suggestions.occasions,

      recipients: suggestions.recipients,

      giftStyles: suggestions.giftStyles,
    }));

    setMatchesGenerated(true);
    setShowAdjustMatches(false);

    const totalMatches =
      suggestions.emotions.length +
      suggestions.occasions.length +
      suggestions.recipients.length +
      suggestions.giftStyles.length;

    if (totalMatches === 0) {
      setMatchMessage(
        "Petalia could not find a strong match yet. You can adjust the matches manually using Petalia's approved options.",
      );
    } else {
      setMatchMessage(
        "Petalia suggested these matches from your updated product information. Review them before saving.",
      );
    }
  };

  /* =====================================================
     MATCH CONTROLS
  ===================================================== */

  const removeMatch = (group, value) => {
    setFormData((previous) => ({
      ...previous,

      [group]: previous[group].filter((item) => item !== value),
    }));
  };

  const toggleMatch = (group, value) => {
    setFormData((previous) => {
      const currentValues = previous[group];

      const alreadySelected = currentValues.includes(value);

      return {
        ...previous,

        [group]: alreadySelected
          ? currentValues.filter((item) => item !== value)
          : [...currentValues, value],
      };
    });

    setMatchesGenerated(true);
  };

  const formatMatchLabel = (value) => {
    const specialLabels = {
      "self-care": "Self-care",
      "peace & calm": "Peace & Calm",

      "valentine's day": "Valentine's Day",

      "mother's day": "Mother's Day",

      "new baby": "New Baby",

      "thank you": "Thank You",

      "get well soon": "Get Well Soon",

      "just because": "Just Because",

      "someone special": "Someone Special",

      "romantic & sweet": "Romantic & Sweet",

      "warm & thoughtful": "Warm & Thoughtful",

      "simple & elegant": "Simple & Elegant",

      "bright & cheerful": "Bright & Cheerful",

      "soft & calm": "Soft & Calm",
    };

    if (specialLabels[value]) {
      return specialLabels[value];
    }

    return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const renderMatchChips = (group) => {
    const values = formData[group];

    if (!values.length) {
      return <span className="vendor-match-empty">No matches selected</span>;
    }

    return (
      <div className="vendor-match-chips">
        {values.map((value) => (
          <span key={value} className="vendor-match-chip">
            {formatMatchLabel(value)}

            <button
              type="button"
              className="vendor-match-remove"
              onClick={() => removeMatch(group, value)}
              aria-label={`Remove ${formatMatchLabel(value)}`}
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
    );
  };

  const renderAdjustOptions = (title, group, options) => {
    return (
      <div className="vendor-adjust-group">
        <p className="vendor-adjust-label">{title}</p>

        <div className="vendor-adjust-options">
          {options.map((option) => {
            const selected = formData[group].includes(option);

            return (
              <button
                key={option}
                type="button"
                className={`vendor-adjust-option ${selected ? "selected" : ""}`}
                onClick={() => toggleMatch(group, option)}
              >
                {selected && <span className="vendor-adjust-check">✓</span>}

                {formatMatchLabel(option)}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  /* =====================================================
     SAVE CHANGES
  ===================================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!shop || !product) {
      alert("The product could not be found.");

      return;
    }

    /* -----------------------------------------------
       REQUIRED FIELDS
    ----------------------------------------------- */

    if (
      !formData.name.trim() ||
      !formData.price ||
      formData.stock === "" ||
      !formData.description.trim()
    ) {
      alert("Please complete all required fields.");

      return;
    }

    const price = Number(formData.price);

    const stock = Number(formData.stock);

    if (Number.isNaN(price) || price < 0) {
      alert("Please enter a valid price.");

      return;
    }

    if (Number.isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
      alert("Stock must be a whole number of 0 or more.");

      return;
    }

    if (!validateProductDetails()) {
      return;
    }

    /* -----------------------------------------------
       REQUIRE GIFT MATCH
    ----------------------------------------------- */

    const totalMatches =
      formData.emotions.length +
      formData.occasions.length +
      formData.recipients.length +
      formData.giftStyles.length;

    if (totalMatches === 0) {
      alert(
        "Please confirm at least one suitable Petalia Gift Match before saving.",
      );

      return;
    }

    setSubmitting(true);

    let uploadedFilePath = null;

    try {
      /* -----------------------------------------------
         CURRENT USER
      ----------------------------------------------- */

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("You are no longer signed in.");
      }

      /* -----------------------------------------------
         CURRENT IMAGE

         If seller did not choose a new image,
         keep existing product image.
      ----------------------------------------------- */

      let imageUrl = originalImage;

      /* -----------------------------------------------
         NEW IMAGE SELECTED
      ----------------------------------------------- */

      if (imageFile) {
        const extension =
          imageFile.name.split(".").pop()?.toLowerCase() || "jpg";

        const safeProductName = formData.name
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");

        const uniquePart = `${Date.now()}-${crypto.randomUUID()}`;

        const fileName = `${
          safeProductName || "product"
        }-${uniquePart}.${extension}`;

        uploadedFilePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(uploadedFilePath, imageFile, {
            cacheControl: "3600",

            upsert: false,

            contentType: imageFile.type,
          });

        if (uploadError) {
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(uploadedFilePath);

        imageUrl = publicUrlData?.publicUrl;

        if (!imageUrl) {
          throw new Error(
            "The image uploaded, but its public URL could not be created.",
          );
        }
      }

      /* -----------------------------------------------
         PRODUCT UPDATE DATA
      ----------------------------------------------- */

      const updatedProduct = {
        name: formData.name.trim(),

        category: formData.category,

        emotion: JSON.stringify(formData.emotions),

        occasion: JSON.stringify(formData.occasions),

        recipients: JSON.stringify(formData.recipients),

        gift_styles: JSON.stringify(formData.giftStyles),

        price,

        image: imageUrl || null,

        badge: formData.badge || null,

        description: formData.description.trim(),

        flower: needsFlowerDetails ? formData.flower || null : null,

        flower_color: needsFlowerDetails ? formData.flowerColor || null : null,

        candle_scent: needsCandleDetails ? formData.candleScent || null : null,

        gift_set_contents:
          formData.category === "Gift Sets" ? formData.giftSetContents : [],

        personalization_options: formData.personalizationOptions,

        stock,
      };

      /* -----------------------------------------------
         UPDATE

         Both id and shop_id are checked.
      ----------------------------------------------- */

      const { data: updatedData, error: updateError } = await supabase
        .from("products")
        .update(updatedProduct)
        .eq("id", product.id)
        .eq("shop_id", shop.id)
        .select()
        .single();

      if (updateError) {
        throw new Error(`Product could not be updated: ${updateError.message}`);
      }

      console.log("Product updated:", updatedData);

      alert("Product updated successfully!");

      navigate("/vendor-dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error("Edit product error:", error);

      /*
        A NEW image was uploaded but the
        database update failed.

        Try to clean up only the newly
        uploaded unused image.
      */

      if (uploadedFilePath) {
        const { error: cleanupError } = await supabase.storage
          .from("product-images")
          .remove([uploadedFilePath]);

        if (cleanupError) {
          console.error("Could not clean up uploaded image:", cleanupError);
        }
      }

      alert(error.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="vendor-add-page">
        <main className="vendor-add-main">
          <p>Loading product...</p>
        </main>
      </div>
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="vendor-add-page">
      <img
        src={sakuraBranch}
        alt=""
        className="vendor-add-flower-decoration"
        aria-hidden="true"
      />

      <main className="vendor-add-main">
        {/* BACK */}

        <button
          type="button"
          className="vendor-add-back"
          onClick={() => navigate("/vendor-dashboard")}
        >
          ← Back to Dashboard
        </button>

        {/* HEADING */}

        <div className="vendor-add-heading">
          <h1>Edit Product</h1>

          <p>Update this product for {shop?.name || "your shop"}.</p>
        </div>

        <form className="vendor-add-card" onSubmit={handleSubmit}>
          {/* =================================================
              PRODUCT INFORMATION
          ================================================= */}

          <div className="vendor-add-top">
            {/* IMAGE */}

            <div className="vendor-image-section">
              <label
                htmlFor="product-image"
                className={`vendor-image-upload ${
                  imagePreview ? "has-image" : ""
                }`}
              >
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="vendor-image-preview"
                    />

                    <div className="vendor-image-change">Change image</div>
                  </>
                ) : (
                  <div className="vendor-upload-placeholder">
                    <ImagePlus size={31} strokeWidth={1.6} />

                    <strong>Upload Product Image</strong>

                    <span>Click to choose an image</span>

                    <small>JPG, PNG, WEBP · Max 5 MB</small>
                  </div>
                )}
              </label>

              <input
                id="product-image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                hidden
              />

              <div className="vendor-image-guidance">
                <strong>Product photo guidelines</strong>

                <span>
                  Keep the current image or choose a new product photo.
                </span>

                <span>Use a clear photo of the actual product.</span>
              </div>
            </div>

            {/* BASIC INFORMATION */}

            <div className="vendor-basic-fields">
              <div className="vendor-field vendor-field-full">
                <label htmlFor="name">
                  Product Name <span>*</span>
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="vendor-field-row">
                <div className="vendor-field">
                  <label htmlFor="category">
                    Category <span>*</span>
                  </label>

                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="Flowers">Flowers</option>

                    <option value="Candles">Candles</option>

                    <option value="Gift Sets">Gift Sets</option>
                  </select>
                </div>

                <div className="vendor-field">
                  <label htmlFor="price">
                    Price <span>*</span>
                  </label>

                  <div className="vendor-price-input">
                    <span>$</span>

                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="vendor-field vendor-field-full">
                <label htmlFor="stock">
                  Stock <span>*</span>
                </label>

                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="vendor-field vendor-field-full">
                <label htmlFor="description">
                  Description <span>*</span>
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  maxLength={500}
                  required
                />

                <div className="vendor-character-count">
                  {formData.description.length}
                  /500
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              PRODUCT DETAILS
          ================================================= */}

          <section className="vendor-form-section vendor-flower-section">
            <div className="vendor-section-heading">
              <h2>Product Details</h2>

              <p>
                Update the details that describe what the customer will receive.
              </p>
            </div>

            {/* FLOWERS */}

            {formData.category === "Flowers" && (
              <div className="vendor-field-row">
                <div className="vendor-field">
                  <label htmlFor="flower">
                    Flower Type <span>*</span>
                  </label>

                  <select
                    id="flower"
                    name="flower"
                    value={formData.flower}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select flower</option>

                    {flowerOptions.map((flower) => (
                      <option key={flower.id} value={flower.name}>
                        {flower.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="vendor-field">
                  <label htmlFor="flowerColor">
                    Flower Color <span>*</span>
                  </label>

                  <select
                    id="flowerColor"
                    name="flowerColor"
                    value={formData.flowerColor}
                    onChange={handleChange}
                    disabled={!formData.flower}
                    required
                  >
                    <option value="">
                      {formData.flower ? "Select color" : "Select flower first"}
                    </option>

                    {flowerColorOptions.map((color) => (
                      <option key={color.id} value={color.name}>
                        {color.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* CANDLES */}

            {formData.category === "Candles" && (
              <div className="vendor-field-row">
                <div className="vendor-field">
                  <label htmlFor="candleScent">
                    Candle Scent <span>*</span>
                  </label>

                  <select
                    id="candleScent"
                    name="candleScent"
                    value={formData.candleScent}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select scent</option>

                    {candleScents.map((scent) => (
                      <option key={scent} value={scent}>
                        {scent}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* GIFT SET */}

            {formData.category === "Gift Sets" && (
              <>
                <div className="vendor-detail-group">
                  <p className="vendor-detail-label">
                    What's included? <span>*</span>
                  </p>

                  <div className="vendor-option-checks">
                    <label
                      className={`vendor-option-check ${
                        giftSetHasFlowers ? "selected" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={giftSetHasFlowers}
                        onChange={() => handleGiftSetContentChange("flowers")}
                      />

                      <span>Flowers</span>
                    </label>

                    <label
                      className={`vendor-option-check ${
                        giftSetHasCandle ? "selected" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={giftSetHasCandle}
                        onChange={() => handleGiftSetContentChange("candle")}
                      />

                      <span>Candle</span>
                    </label>
                  </div>
                </div>

                {giftSetHasFlowers && (
                  <div className="vendor-conditional-details">
                    <div className="vendor-subsection-title">
                      Flower Details
                    </div>

                    <div className="vendor-field-row">
                      <div className="vendor-field">
                        <label htmlFor="flower">
                          Flower Type <span>*</span>
                        </label>

                        <select
                          id="flower"
                          name="flower"
                          value={formData.flower}
                          onChange={handleChange}
                        >
                          <option value="">Select flower</option>

                          {flowerOptions.map((flower) => (
                            <option key={flower.id} value={flower.name}>
                              {flower.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="vendor-field">
                        <label htmlFor="flowerColor">
                          Flower Color <span>*</span>
                        </label>

                        <select
                          id="flowerColor"
                          name="flowerColor"
                          value={formData.flowerColor}
                          onChange={handleChange}
                          disabled={!formData.flower}
                        >
                          <option value="">
                            {formData.flower
                              ? "Select color"
                              : "Select flower first"}
                          </option>

                          {flowerColorOptions.map((color) => (
                            <option key={color.id} value={color.name}>
                              {color.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {giftSetHasCandle && (
                  <div className="vendor-conditional-details">
                    <div className="vendor-subsection-title">
                      Candle Details
                    </div>

                    <div className="vendor-field-row">
                      <div className="vendor-field">
                        <label htmlFor="candleScent">
                          Candle Scent <span>*</span>
                        </label>

                        <select
                          id="candleScent"
                          name="candleScent"
                          value={formData.candleScent}
                          onChange={handleChange}
                        >
                          <option value="">Select scent</option>

                          {candleScents.map((scent) => (
                            <option key={scent} value={scent}>
                              {scent}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* PERSONALIZATION */}

            <div className="vendor-personalization-block">
              <div className="vendor-subsection-title">
                Personalization Options
              </div>

              <p className="vendor-personalization-text">
                Update the customization options available for this product.
              </p>

              <div className="vendor-option-checks">
                {[
                  ["gift_wrapping", "Gift Wrapping"],

                  ["message_card", "Message Card"],

                  ["add_ons", "Add-ons"],
                ].map(([value, label]) => {
                  const selected =
                    formData.personalizationOptions.includes(value);

                  return (
                    <label
                      key={value}
                      className={`vendor-option-check ${
                        selected ? "selected" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => handlePersonalizationChange(value)}
                      />

                      <span>{label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </section>

          {/* =================================================
              PETALIA MATCHING
          ================================================= */}

          <section className="vendor-matching-section">
            <div className="vendor-matching-header">
              <div>
                <span className="vendor-matching-kicker">PETALIA</span>

                <h2>Petalia Gift Matching</h2>

                <p>
                  Review the current matches or let Petalia suggest new ones
                  from the updated product information.
                </p>
              </div>

              <button
                type="button"
                className="vendor-suggest-button"
                onClick={handleSuggestMatches}
              >
                {matchesGenerated ? "Suggest Again" : "Suggest Gift Matches"}
              </button>
            </div>

            {!matchesGenerated && (
              <div className="vendor-matching-placeholder">
                <p>
                  Product information affecting gift matching has changed. Ask
                  Petalia to suggest suitable matches, or adjust them manually.
                </p>
              </div>
            )}

            {matchesGenerated && (
              <div className="vendor-match-results">
                <div className="vendor-match-intro">
                  <h3>Gift Matches</h3>

                  <p>{matchMessage}</p>
                </div>

                <div className="vendor-match-row">
                  <div className="vendor-match-title">Emotion</div>

                  {renderMatchChips("emotions")}
                </div>

                <div className="vendor-match-row">
                  <div className="vendor-match-title">Occasion</div>

                  {renderMatchChips("occasions")}
                </div>

                <div className="vendor-match-row">
                  <div className="vendor-match-title">Recipient</div>

                  {renderMatchChips("recipients")}
                </div>

                <div className="vendor-match-row">
                  <div className="vendor-match-title">Gift Style</div>

                  {renderMatchChips("giftStyles")}
                </div>

                <div className="vendor-match-controls">
                  <button
                    type="button"
                    className="vendor-adjust-button"
                    onClick={() =>
                      setShowAdjustMatches((previous) => !previous)
                    }
                  >
                    {showAdjustMatches ? "Close Adjustments" : "Adjust Matches"}
                  </button>
                </div>

                {showAdjustMatches && (
                  <div className="vendor-adjust-panel">
                    <div className="vendor-adjust-heading">
                      <h3>Adjust Matches</h3>

                      <p>
                        Add or remove matches using Petalia's approved gift
                        categories.
                      </p>
                    </div>

                    {renderAdjustOptions(
                      "Emotion",
                      "emotions",
                      petaliaMatchOptions.emotions,
                    )}

                    {renderAdjustOptions(
                      "Occasion",
                      "occasions",
                      petaliaMatchOptions.occasions,
                    )}

                    {renderAdjustOptions(
                      "Recipient",
                      "recipients",
                      petaliaMatchOptions.recipients,
                    )}

                    {renderAdjustOptions(
                      "Gift Style",
                      "giftStyles",
                      petaliaMatchOptions.giftStyles,
                    )}
                  </div>
                )}
              </div>
            )}
          </section>

          {/* =================================================
              PRODUCT DISPLAY
          ================================================= */}

          <section className="vendor-form-section vendor-product-extra-section">
            <div className="vendor-section-heading">
              <h2>Product Display</h2>

              <p>Update the optional badge used to highlight this product.</p>
            </div>

            <div className="vendor-badge-field">
              <div className="vendor-field">
                <label htmlFor="badge">Badge (Optional)</label>

                <select
                  id="badge"
                  name="badge"
                  value={formData.badge}
                  onChange={handleChange}
                >
                  <option value="">None</option>

                  <option value="Best Seller">Best Seller</option>

                  <option value="New">New</option>

                  <option value="Popular">Popular</option>

                  <option value="Limited">Limited</option>
                </select>
              </div>
            </div>
          </section>

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="vendor-form-actions">
            <button
              type="button"
              className="vendor-cancel-product"
              onClick={() => navigate("/vendor-dashboard")}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="vendor-submit-product"
              disabled={submitting}
            >
              <Save size={16} />

              {submitting ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default VendorEditProduct;
