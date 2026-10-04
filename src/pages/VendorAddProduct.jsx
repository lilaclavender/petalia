import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlus, Plus, X } from "lucide-react";

import { supabase } from "../lib/supabase";

import {
  suggestProductMatches,
  petaliaMatchOptions,
} from "../utils/giftMatching";

import sakuraBranch from "../assets/sakura-branch.png";
import flowersData from "../data/flowersData";
import "../styles/VendorAddProduct.css";


// =====================================================
// PRODUCT OPTIONS
// =====================================================

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


function VendorAddProduct() {
  const navigate = useNavigate();


  // =====================================================
  // SELLER
  // =====================================================

  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);


  // =====================================================
  // IMAGE
  // =====================================================

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);


  // =====================================================
  // SUBMIT STATE
  // =====================================================

  const [submitting, setSubmitting] = useState(false);


  // =====================================================
  // PETALIA MATCHING STATE
  // =====================================================

  const [matchesGenerated, setMatchesGenerated] =
    useState(false);

  const [showAdjustMatches, setShowAdjustMatches] =
    useState(false);

  const [matchMessage, setMatchMessage] =
    useState("");


  // =====================================================
  // FORM
  // =====================================================

  const [formData, setFormData] = useState({
    name: "",
    category: "Flowers",
    price: "",
    stock: "",
    description: "",

    // Petalia Gift Matching
    emotions: [],
    occasions: [],
    recipients: [],
    giftStyles: [],

    badge: "",

    // Flower information
    flower: "",
    flowerColor: "",

    // Candle information
    candleScent: "",

    // Gift Set information
    giftSetContents: [],

    // Personalization
    personalizationOptions: [],
  });


  // =====================================================
  // CATEGORY-SPECIFIC PRODUCT DETAILS
  // =====================================================

  const selectedFlower = flowerOptions.find(
    (flower) => flower.name === formData.flower
  );

  const flowerColorOptions =
    selectedFlower?.colors || [];

  const giftSetHasFlowers =
    formData.category === "Gift Sets" &&
    formData.giftSetContents.includes("flowers");

  const giftSetHasCandle =
    formData.category === "Gift Sets" &&
    formData.giftSetContents.includes("candle");

  const needsFlowerDetails =
    formData.category === "Flowers" ||
    giftSetHasFlowers;

  const needsCandleDetails =
    formData.category === "Candles" ||
    giftSetHasCandle;


  // =====================================================
  // CHECK SELLER
  // =====================================================

  useEffect(() => {
    const checkSeller = async () => {
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

      const {
        data: shopData,
        error: shopError,
      } = await supabase
        .from("shops")
        .select("id, name")
        .eq("owner_id", user.id)
        .maybeSingle();

      if (shopError) {
        console.error(
          "Error checking seller:",
          shopError
        );

        navigate("/", {
          replace: true,
        });

        return;
      }

      if (!shopData) {
        navigate("/", {
          replace: true,
        });

        return;
      }

      setShop(shopData);
      setLoading(false);
    };

    checkSeller();
  }, [navigate]);


  // =====================================================
  // CLEAN IMAGE PREVIEW
  // =====================================================

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);


  // =====================================================
  // RESET PETALIA MATCHES
  // =====================================================

  const resetPetaliaMatches = () => {
    setMatchesGenerated(false);
    setShowAdjustMatches(false);
    setMatchMessage("");
  };


  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    // -----------------------------------------------
    // CATEGORY
    // -----------------------------------------------

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


    // -----------------------------------------------
    // FLOWER
    // -----------------------------------------------

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


    // -----------------------------------------------
    // PRODUCT FACTS THAT AFFECT MATCHING
    // -----------------------------------------------

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


    // -----------------------------------------------
    // NORMAL INPUT
    // -----------------------------------------------

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  // =====================================================
  // GIFT SET CONTENT CHECKBOX
  // =====================================================

  const handleGiftSetContentChange = (value) => {
    setFormData((previous) => {
      const alreadySelected =
        previous.giftSetContents.includes(value);

      const updatedContents = alreadySelected
        ? previous.giftSetContents.filter(
            (item) => item !== value
          )
        : [
            ...previous.giftSetContents,
            value,
          ];

      return {
        ...previous,

        giftSetContents: updatedContents,

        flower:
          value === "flowers" &&
          alreadySelected
            ? ""
            : previous.flower,

        flowerColor:
          value === "flowers" &&
          alreadySelected
            ? ""
            : previous.flowerColor,

        candleScent:
          value === "candle" &&
          alreadySelected
            ? ""
            : previous.candleScent,

        emotions: [],
        occasions: [],
        recipients: [],
        giftStyles: [],
      };
    });

    resetPetaliaMatches();
  };


  // =====================================================
  // PERSONALIZATION CHECKBOX
  // =====================================================

  const handlePersonalizationChange = (value) => {
    setFormData((previous) => {
      const alreadySelected =
        previous.personalizationOptions.includes(
          value
        );

      return {
        ...previous,

        personalizationOptions:
          alreadySelected
            ? previous.personalizationOptions.filter(
                (item) => item !== value
              )
            : [
                ...previous.personalizationOptions,
                value,
              ],
      };
    });
  };


  // =====================================================
  // IMAGE CHANGE
  // =====================================================

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert(
        "Please choose a JPG, PNG, or WEBP image."
      );

      event.target.value = "";
      return;
    }

    const maxSize =
      5 * 1024 * 1024;

    if (file.size > maxSize) {
      alert(
        "Image must be smaller than 5 MB."
      );

      event.target.value = "";
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(file);

    setImagePreview(
      URL.createObjectURL(file)
    );
  };


  // =====================================================
  // VALIDATE CATEGORY DETAILS
  // =====================================================

  const validateProductDetails = () => {
    // -----------------------------------------------
    // FLOWERS
    // -----------------------------------------------

    if (
      formData.category === "Flowers"
    ) {
      if (!formData.flower) {
        alert(
          "Please select the flower type."
        );

        return false;
      }

      if (!formData.flowerColor) {
        alert(
          "Please select the flower color."
        );

        return false;
      }
    }


    // -----------------------------------------------
    // CANDLES
    // -----------------------------------------------

    if (
      formData.category === "Candles"
    ) {
      if (!formData.candleScent) {
        alert(
          "Please select the candle scent."
        );

        return false;
      }
    }


    // -----------------------------------------------
    // GIFT SETS
    // -----------------------------------------------

    if (
      formData.category === "Gift Sets"
    ) {
      if (
        formData.giftSetContents.length === 0
      ) {
        alert(
          "Please select what is included in the gift set."
        );

        return false;
      }

      if (
        giftSetHasFlowers &&
        !formData.flower
      ) {
        alert(
          "Please select the flower type included in the gift set."
        );

        return false;
      }

      if (
        giftSetHasFlowers &&
        !formData.flowerColor
      ) {
        alert(
          "Please select the flower color included in the gift set."
        );

        return false;
      }

      if (
        giftSetHasCandle &&
        !formData.candleScent
      ) {
        alert(
          "Please select the candle scent included in the gift set."
        );

        return false;
      }
    }

    return true;
  };


  // =====================================================
  // PETALIA - SUGGEST GIFT MATCHES
  // =====================================================

  const handleSuggestMatches = () => {
    if (
      !formData.name.trim() ||
      !formData.description.trim()
    ) {
      alert(
        "Please enter the product name and description before asking Petalia to suggest matches."
      );

      return;
    }

    if (!validateProductDetails()) {
      return;
    }

    const suggestions =
      suggestProductMatches({
        name: formData.name,
        description:
          formData.description,
        category:
          formData.category,

        flower:
          needsFlowerDetails
            ? formData.flower
            : "",

        flowerColor:
          needsFlowerDetails
            ? formData.flowerColor
            : "",
      });

    setFormData((previous) => ({
      ...previous,

      emotions:
        suggestions.emotions,

      occasions:
        suggestions.occasions,

      recipients:
        suggestions.recipients,

      giftStyles:
        suggestions.giftStyles,
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
        "Petalia could not find a strong match yet. You can adjust the matches manually using Petalia's approved options."
      );
    } else {
      setMatchMessage(
        "Petalia suggested these matches from your product information. Review them before publishing."
      );
    }
  };


  // =====================================================
  // REMOVE ONE MATCH
  // =====================================================

  const removeMatch = (
    group,
    value
  ) => {
    setFormData((previous) => ({
      ...previous,

      [group]:
        previous[group].filter(
          (item) =>
            item !== value
        ),
    }));
  };


  // =====================================================
  // TOGGLE MATCH FROM APPROVED OPTIONS
  // =====================================================

  const toggleMatch = (
    group,
    value
  ) => {
    setFormData((previous) => {
      const currentValues =
        previous[group];

      const alreadySelected =
        currentValues.includes(
          value
        );

      return {
        ...previous,

        [group]:
          alreadySelected
            ? currentValues.filter(
                (item) =>
                  item !== value
              )
            : [
                ...currentValues,
                value,
              ],
      };
    });

    setMatchesGenerated(true);
  };


  // =====================================================
  // FORMAT TAG LABEL
  // =====================================================

  const formatMatchLabel = (
    value
  ) => {
    const specialLabels = {
      "self-care": "Self-care",
      "peace & calm":
        "Peace & Calm",

      "valentine's day":
        "Valentine's Day",

      "mother's day":
        "Mother's Day",

      "new baby":
        "New Baby",

      "thank you":
        "Thank You",

      "get well soon":
        "Get Well Soon",

      "just because":
        "Just Because",

      "someone special":
        "Someone Special",

      "romantic & sweet":
        "Romantic & Sweet",

      "warm & thoughtful":
        "Warm & Thoughtful",

      "simple & elegant":
        "Simple & Elegant",

      "bright & cheerful":
        "Bright & Cheerful",

      "soft & calm":
        "Soft & Calm",
    };

    if (specialLabels[value]) {
      return specialLabels[value];
    }

    return value.replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    );
  };


  // =====================================================
  // MATCH CHIPS
  // =====================================================

  const renderMatchChips = (
    group
  ) => {
    const values =
      formData[group];

    if (!values.length) {
      return (
        <span className="vendor-match-empty">
          No matches selected
        </span>
      );
    }

    return (
      <div className="vendor-match-chips">
        {values.map((value) => (
          <span
            key={value}
            className="vendor-match-chip"
          >
            {formatMatchLabel(
              value
            )}

            <button
              type="button"
              className="vendor-match-remove"
              onClick={() =>
                removeMatch(
                  group,
                  value
                )
              }
              aria-label={`Remove ${formatMatchLabel(
                value
              )}`}
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
    );
  };


  // =====================================================
  // ADJUST OPTION GROUP
  // =====================================================

  const renderAdjustOptions = (
    title,
    group,
    options
  ) => {
    return (
      <div className="vendor-adjust-group">
        <p className="vendor-adjust-label">
          {title}
        </p>

        <div className="vendor-adjust-options">
          {options.map(
            (option) => {
              const selected =
                formData[
                  group
                ].includes(
                  option
                );

              return (
                <button
                  key={option}
                  type="button"
                  className={`vendor-adjust-option ${
                    selected
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    toggleMatch(
                      group,
                      option
                    )
                  }
                >
                  {selected && (
                    <span className="vendor-adjust-check">
                      ✓
                    </span>
                  )}

                  {formatMatchLabel(
                    option
                  )}
                </button>
              );
            }
          )}
        </div>
      </div>
    );
  };


  // =====================================================
  // ADD PRODUCT
  // =====================================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (!shop) {
      alert(
        "Your seller shop could not be found."
      );

      return;
    }

    if (!imageFile) {
      alert(
        "Please upload a product image."
      );

      return;
    }

    if (
      !formData.name.trim() ||
      !formData.price ||
      formData.stock === "" ||
      !formData.description.trim()
    ) {
      alert(
        "Please complete all required fields."
      );

      return;
    }

    const price =
      Number(formData.price);

    const stock =
      Number(formData.stock);

    if (
      Number.isNaN(price) ||
      price < 0
    ) {
      alert(
        "Please enter a valid price."
      );

      return;
    }

    if (
      Number.isNaN(stock) ||
      stock < 0 ||
      !Number.isInteger(stock)
    ) {
      alert(
        "Stock must be a whole number of 0 or more."
      );

      return;
    }


    // =================================================
    // CATEGORY-SPECIFIC VALIDATION
    // =================================================

    if (!validateProductDetails()) {
      return;
    }


    // =================================================
    // REQUIRE AT LEAST ONE GIFT MATCH
    // =================================================

    const totalMatches =
      formData.emotions.length +
      formData.occasions.length +
      formData.recipients.length +
      formData.giftStyles.length;

    if (totalMatches === 0) {
      alert(
        "Please use Petalia Gift Matching and confirm at least one suitable match before publishing."
      );

      return;
    }

    setSubmitting(true);

    let uploadedFilePath =
      null;

    try {
      // ===============================================
      // 1. GET CURRENT USER
      // ===============================================

      const {
        data: { user },
        error: userError,
      } =
        await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error(
          "You are no longer signed in."
        );
      }


      // ===============================================
      // 2. CREATE SAFE FILE NAME
      // ===============================================

      const extension =
        imageFile.name
          .split(".")
          .pop()
          ?.toLowerCase() ||
        "jpg";

      const safeProductName =
        formData.name
          .trim()
          .toLowerCase()
          .replace(
            /[^a-z0-9]+/g,
            "-"
          )
          .replace(
            /^-+|-+$/g,
            ""
          );

      const uniquePart =
        `${Date.now()}-${crypto.randomUUID()}`;

      const fileName =
        `${
          safeProductName ||
          "product"
        }-${uniquePart}.${extension}`;

      uploadedFilePath =
        `${user.id}/${fileName}`;


      // ===============================================
      // 3. UPLOAD IMAGE
      // ===============================================

      const {
        error: uploadError,
      } =
        await supabase.storage
          .from(
            "product-images"
          )
          .upload(
            uploadedFilePath,
            imageFile,
            {
              cacheControl:
                "3600",

              upsert: false,

              contentType:
                imageFile.type,
            }
          );

      if (uploadError) {
        throw new Error(
          `Image upload failed: ${uploadError.message}`
        );
      }


      // ===============================================
      // 4. GET PUBLIC IMAGE URL
      // ===============================================

      const {
        data: publicUrlData,
      } =
        supabase.storage
          .from(
            "product-images"
          )
          .getPublicUrl(
            uploadedFilePath
          );

      const imageUrl =
        publicUrlData?.publicUrl;

      if (!imageUrl) {
        throw new Error(
          "The image uploaded, but its public URL could not be created."
        );
      }


      // ===============================================
      // 5. PREPARE PRODUCT
      // ===============================================

      const newProduct = {
        name:
          formData.name.trim(),

        category:
          formData.category,

        emotion:
          JSON.stringify(
            formData.emotions
          ),

        occasion:
          JSON.stringify(
            formData.occasions
          ),

        recipients:
          JSON.stringify(
            formData.recipients
          ),

        gift_styles:
          JSON.stringify(
            formData.giftStyles
          ),

        price,

        rating: 0,
        reviews: 0,

        image: imageUrl,

        badge:
          formData.badge ||
          null,

        description:
          formData.description.trim(),

        flower:
          needsFlowerDetails
            ? formData.flower ||
              null
            : null,

        flower_color:
          needsFlowerDetails
            ? formData.flowerColor ||
              null
            : null,

        candle_scent:
          needsCandleDetails
            ? formData.candleScent ||
              null
            : null,

        gift_set_contents:
          formData.category ===
          "Gift Sets"
            ? formData.giftSetContents
            : [],

        personalization_options:
          formData.personalizationOptions,

        shop_id: shop.id,

        stock,
      };

      console.log(
        "Creating product:",
        newProduct
      );


      // ===============================================
      // 6. INSERT PRODUCT
      // ===============================================

      const {
        data: createdProduct,
        error: insertError,
      } =
        await supabase
          .from("products")
          .insert([
            newProduct,
          ])
          .select()
          .single();

      if (insertError) {
        throw new Error(
          `Product could not be created: ${insertError.message}`
        );
      }

      console.log(
        "Product created:",
        createdProduct
      );


      // ===============================================
      // 7. SUCCESS
      // ===============================================

      alert(
        "Product added successfully!"
      );

      navigate(
        "/vendor-dashboard",
        {
          replace: true,
        }
      );
    } catch (error) {
      console.error(
        "Add product error:",
        error
      );

      /*
        If the image uploaded but database insertion
        failed, try to remove the unused image.
      */

      if (uploadedFilePath) {
        const {
          error: cleanupError,
        } =
          await supabase.storage
            .from(
              "product-images"
            )
            .remove([
              uploadedFilePath,
            ]);

        if (cleanupError) {
          console.error(
            "Could not clean up uploaded image:",
            cleanupError
          );
        }
      }

      alert(
        error.message ||
          "Something went wrong."
      );

      setSubmitting(false);
    }
  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="vendor-add-page">
        <main className="vendor-add-main">
          <p>
            Checking seller account...
          </p>
        </main>
      </div>
    );
  }


  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="vendor-add-page">
      <img
        src={sakuraBranch}
        alt=""
        className="vendor-add-flower-decoration"
        aria-hidden="true"
      />
      <main className="vendor-add-main">

        {/* ================= BACK ================= */}

        <button
          type="button"
          className="vendor-add-back"
          onClick={() =>
            navigate(
              "/vendor-dashboard"
            )
          }
        >
          ← Back to Dashboard
        </button>


        {/* ================= HEADING ================= */}

        <div className="vendor-add-heading">
          <h1>
            Add New Product
          </h1>

          <p>
            Create a new product
            for{" "}
            {shop?.name ||
              "your shop"}.
          </p>
        </div>


        <form
          className="vendor-add-card"
          onSubmit={handleSubmit}
        >

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

                    <div className="vendor-image-change">
                      Change image
                    </div>
                  </>
                ) : (
                  <div className="vendor-upload-placeholder">
                    <ImagePlus
                      size={31}
                      strokeWidth={1.6}
                    />

                    <strong>
                      Upload Product Image
                    </strong>

                    <span>
                      Click to choose an image
                    </span>

                    <small>
                      JPG, PNG, WEBP · Max 5 MB
                    </small>
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
                  Use a clear photo of the actual product.
                </span>

                <span>
                  Avoid unrelated images or screenshots.
                </span>
              </div>
            </div>


            {/* BASIC INFORMATION */}

            <div className="vendor-basic-fields">

              <div className="vendor-field vendor-field-full">
                <label htmlFor="name">
                  Product Name{" "}
                  <span>*</span>
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={
                    formData.name
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="e.g. Romantic Rose Bouquet"
                  required
                />
              </div>


              <div className="vendor-field-row">

                <div className="vendor-field">
                  <label htmlFor="category">
                    Category{" "}
                    <span>*</span>
                  </label>

                  <select
                    id="category"
                    name="category"
                    value={
                      formData.category
                    }
                    onChange={
                      handleChange
                    }
                    required
                  >
                    <option value="Flowers">
                      Flowers
                    </option>

                    <option value="Candles">
                      Candles
                    </option>

                    <option value="Gift Sets">
                      Gift Sets
                    </option>
                  </select>
                </div>


                <div className="vendor-field">
                  <label htmlFor="price">
                    Price{" "}
                    <span>*</span>
                  </label>

                  <div className="vendor-price-input">
                    <span>$</span>

                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={
                        formData.price
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

              </div>


              <div className="vendor-field vendor-field-full">
                <label htmlFor="stock">
                  Stock{" "}
                  <span>*</span>
                </label>

                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={
                    formData.stock
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="e.g. 10"
                  required
                />
              </div>


              <div className="vendor-field vendor-field-full">
                <label htmlFor="description">
                  Description{" "}
                  <span>*</span>
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Describe your product, flower meaning, special notes, etc."
                  maxLength={500}
                  required
                />

                <div className="vendor-character-count">
                  {
                    formData
                      .description
                      .length
                  }
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
              <h2>
                Product Details
              </h2>

              <p>
                Add details that
                describe what the
                customer will receive.
              </p>
            </div>


            {/* =============================================
                FLOWERS
            ============================================= */}

            {formData.category ===
              "Flowers" && (
              <div className="vendor-field-row">

                <div className="vendor-field">
                  <label htmlFor="flower">
                    Flower Type{" "}
                    <span>*</span>
                  </label>

                  <select
                    id="flower"
                    name="flower"
                    value={
                      formData.flower
                    }
                    onChange={
                      handleChange
                    }
                    required
                  >
                    <option value="">
                      Select flower
                    </option>

                    {flowerOptions.map(
                      (flower) => (
                        <option
                          key={
                            flower.id
                          }
                          value={
                            flower.name
                          }
                        >
                          {
                            flower.name
                          }
                        </option>
                      )
                    )}
                  </select>

                  <small className="vendor-field-hint">
                    Select the main
                    flower used in this
                    product.
                  </small>
                </div>


                <div className="vendor-field">
                  <label htmlFor="flowerColor">
                    Flower Color{" "}
                    <span>*</span>
                  </label>

                  <select
                    id="flowerColor"
                    name="flowerColor"
                    value={
                      formData.flowerColor
                    }
                    onChange={
                      handleChange
                    }
                    disabled={
                      !formData.flower
                    }
                    required
                  >
                    <option value="">
                      {formData.flower
                        ? "Select color"
                        : "Select flower first"}
                    </option>

                    {flowerColorOptions.map(
                      (color) => (
                        <option
                          key={
                            color.id
                          }
                          value={
                            color.name
                          }
                        >
                          {
                            color.name
                          }
                        </option>
                      )
                    )}
                  </select>

                  <small className="vendor-field-hint">
                    Petalia uses the
                    flower and color
                    meaning when
                    suggesting gift
                    matches.
                  </small>
                </div>

              </div>
            )}


            {/* =============================================
                CANDLES
            ============================================= */}

            {formData.category ===
              "Candles" && (
              <div className="vendor-field-row">

                <div className="vendor-field">
                  <label htmlFor="candleScent">
                    Candle Scent{" "}
                    <span>*</span>
                  </label>

                  <select
                    id="candleScent"
                    name="candleScent"
                    value={
                      formData.candleScent
                    }
                    onChange={
                      handleChange
                    }
                    required
                  >
                    <option value="">
                      Select scent
                    </option>

                    {candleScents.map(
                      (scent) => (
                        <option
                          key={scent}
                          value={scent}
                        >
                          {scent}
                        </option>
                      )
                    )}
                  </select>

                  <small className="vendor-field-hint">
                    Select the main
                    scent of the
                    candle.
                  </small>
                </div>

              </div>
            )}


            {/* =============================================
                GIFT SETS
            ============================================= */}

            {formData.category === "Gift Sets" && (
            <>
              <div className="vendor-detail-group">
                <p className="vendor-detail-label">
                  What's included? <span>*</span>
                </p>

                <div className="vendor-option-checks">
                  <label
                    className={`vendor-option-check ${
                      giftSetHasFlowers
                        ? "selected"
                        : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={giftSetHasFlowers}
                        onChange={() =>
                          handleGiftSetContentChange(
                            "flowers"
                          )
                        }
                      />

                      <span>
                        Flowers
                      </span>
                    </label>


                    <label
                      className={`vendor-option-check ${
                        giftSetHasCandle
                          ? "selected"
                          : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={
                          giftSetHasCandle
                        }
                        onChange={() =>
                          handleGiftSetContentChange(
                            "candle"
                          )
                        }
                      />

                      <span>
                        Candle
                      </span>
                    </label>

                  </div>

                  <small className="vendor-field-hint">
                    Select the product
                    types included in
                    this gift set.
                  </small>
                </div>


                {giftSetHasFlowers && (
                  <div className="vendor-conditional-details">

                    <div className="vendor-subsection-title">
                      Flower Details
                    </div>

                    <div className="vendor-field-row">

                      <div className="vendor-field">
                        <label htmlFor="flower">
                          Flower Type{" "}
                          <span>*</span>
                        </label>

                        <select
                          id="flower"
                          name="flower"
                          value={
                            formData.flower
                          }
                          onChange={
                            handleChange
                          }
                        >
                          <option value="">
                            Select flower
                          </option>

                          {flowerOptions.map(
                            (
                              flower
                            ) => (
                              <option
                                key={
                                  flower.id
                                }
                                value={
                                  flower.name
                                }
                              >
                                {
                                  flower.name
                                }
                              </option>
                            )
                          )}
                        </select>
                      </div>


                      <div className="vendor-field">
                        <label htmlFor="flowerColor">
                          Flower Color{" "}
                          <span>*</span>
                        </label>

                        <select
                          id="flowerColor"
                          name="flowerColor"
                          value={
                            formData.flowerColor
                          }
                          onChange={
                            handleChange
                          }
                          disabled={
                            !formData.flower
                          }
                        >
                          <option value="">
                            {formData.flower
                              ? "Select color"
                              : "Select flower first"}
                          </option>

                          {flowerColorOptions.map(
                            (
                              color
                            ) => (
                              <option
                                key={
                                  color.id
                                }
                                value={
                                  color.name
                                }
                              >
                                {
                                  color.name
                                }
                              </option>
                            )
                          )}
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
                          Candle Scent{" "}
                          <span>*</span>
                        </label>

                        <select
                          id="candleScent"
                          name="candleScent"
                          value={
                            formData.candleScent
                          }
                          onChange={
                            handleChange
                          }
                        >
                          <option value="">
                            Select scent
                          </option>

                          {candleScents.map(
                            (
                              scent
                            ) => (
                              <option
                                key={
                                  scent
                                }
                                value={
                                  scent
                                }
                              >
                                {
                                  scent
                                }
                              </option>
                            )
                          )}
                        </select>
                      </div>

                    </div>
                  </div>
                )}
              </>
            )}


            {/* =============================================
                PERSONALIZATION
            ============================================= */}

            <div className="vendor-personalization-block">

              <div className="vendor-subsection-title">
                Personalization
                Options
              </div>

              <p className="vendor-personalization-text">
                Select any
                customization options
                available for this
                product.
              </p>

              <div className="vendor-option-checks">

                <label
                  className={`vendor-option-check ${
                    formData.personalizationOptions.includes(
                      "gift_wrapping"
                    )
                      ? "selected"
                      : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.personalizationOptions.includes(
                      "gift_wrapping"
                    )}
                    onChange={() =>
                      handlePersonalizationChange(
                        "gift_wrapping"
                      )
                    }
                  />

                  <span>
                    Gift Wrapping
                  </span>
                </label>


                <label
                  className={`vendor-option-check ${
                    formData.personalizationOptions.includes(
                      "message_card"
                    )
                      ? "selected"
                      : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.personalizationOptions.includes(
                      "message_card"
                    )}
                    onChange={() =>
                      handlePersonalizationChange(
                        "message_card"
                      )
                    }
                  />

                  <span>
                    Message Card
                  </span>
                </label>


                <label
                  className={`vendor-option-check ${
                    formData.personalizationOptions.includes(
                      "add_ons"
                    )
                      ? "selected"
                      : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.personalizationOptions.includes(
                      "add_ons"
                    )}
                    onChange={() =>
                      handlePersonalizationChange(
                        "add_ons"
                      )
                    }
                  />

                  <span>
                    Add-ons
                  </span>
                </label>

              </div>

            </div>

          </section>


          {/* =================================================
              PETALIA GIFT MATCHING
          ================================================= */}

          <section className="vendor-matching-section">

            <div className="vendor-matching-header">
              <div>
                <span className="vendor-matching-kicker">
                  PETALIA
                </span>

                <h2>
                  Petalia Gift Matching
                </h2>

                <p>
                  Let Petalia suggest
                  suitable gift matches
                  based on your product
                  information and
                  product details.
                </p>
              </div>

              <button
                type="button"
                className="vendor-suggest-button"
                onClick={
                  handleSuggestMatches
                }
              >
                {matchesGenerated
                  ? "Suggest Again"
                  : "Suggest Gift Matches"}
              </button>
            </div>


            {/* BEFORE GENERATING */}

            {!matchesGenerated && (
              <div className="vendor-matching-placeholder">
                <p>
                  Complete the product
                  information above,
                  then ask Petalia to
                  suggest suitable
                  emotions, occasions,
                  recipients, and gift
                  styles.
                </p>
              </div>
            )}


            {/* AFTER GENERATING */}

            {matchesGenerated && (
              <div className="vendor-match-results">

                <div className="vendor-match-intro">
                  <h3>
                    Suggested Matches
                  </h3>

                  <p>
                    {matchMessage}
                  </p>
                </div>


                <div className="vendor-match-row">
                  <div className="vendor-match-title">
                    Emotion
                  </div>

                  {renderMatchChips(
                    "emotions"
                  )}
                </div>


                <div className="vendor-match-row">
                  <div className="vendor-match-title">
                    Occasion
                  </div>

                  {renderMatchChips(
                    "occasions"
                  )}
                </div>


                <div className="vendor-match-row">
                  <div className="vendor-match-title">
                    Recipient
                  </div>

                  {renderMatchChips(
                    "recipients"
                  )}
                </div>


                <div className="vendor-match-row">
                  <div className="vendor-match-title">
                    Gift Style
                  </div>

                  {renderMatchChips(
                    "giftStyles"
                  )}
                </div>


                <div className="vendor-match-controls">
                  <button
                    type="button"
                    className="vendor-adjust-button"
                    onClick={() =>
                      setShowAdjustMatches(
                        (
                          previous
                        ) =>
                          !previous
                      )
                    }
                  >
                    {showAdjustMatches
                      ? "Close Adjustments"
                      : "Adjust Matches"}
                  </button>
                </div>


                {showAdjustMatches && (
                  <div className="vendor-adjust-panel">

                    <div className="vendor-adjust-heading">
                      <h3>
                        Adjust Matches
                      </h3>

                      <p>
                        Add or remove
                        matches using
                        Petalia's
                        approved gift
                        categories.
                      </p>
                    </div>


                    {renderAdjustOptions(
                      "Emotion",
                      "emotions",
                      petaliaMatchOptions.emotions
                    )}


                    {renderAdjustOptions(
                      "Occasion",
                      "occasions",
                      petaliaMatchOptions.occasions
                    )}


                    {renderAdjustOptions(
                      "Recipient",
                      "recipients",
                      petaliaMatchOptions.recipients
                    )}


                    {renderAdjustOptions(
                      "Gift Style",
                      "giftStyles",
                      petaliaMatchOptions.giftStyles
                    )}

                  </div>
                )}

              </div>
            )}

          </section>


          {/* =================================================
              BADGE
          ================================================= */}

          <section className="vendor-form-section vendor-product-extra-section">

            <div className="vendor-section-heading">
              <h2>
                Product Display
              </h2>

              <p>
                Add an optional badge
                to highlight this
                product.
              </p>
            </div>


            <div className="vendor-badge-field">
              <div className="vendor-field">

                <label htmlFor="badge">
                  Badge (Optional)
                </label>

                <select
                  id="badge"
                  name="badge"
                  value={
                    formData.badge
                  }
                  onChange={
                    handleChange
                  }
                >
                  <option value="">
                    None
                  </option>

                  <option value="Best Seller">
                    Best Seller
                  </option>

                  <option value="New">
                    New
                  </option>

                  <option value="Popular">
                    Popular
                  </option>

                  <option value="Limited">
                    Limited
                  </option>
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
              onClick={() =>
                navigate(
                  "/vendor-dashboard"
                )
              }
              disabled={
                submitting
              }
            >
              Cancel
            </button>


            <button
              type="submit"
              className="vendor-submit-product"
              disabled={
                submitting
              }
            >
              <Plus size={17} />

              {submitting
                ? "Adding Product..."
                : "Add Product"}
            </button>

          </div>

        </form>

      </main>
    </div>
  );
}


export default VendorAddProduct;