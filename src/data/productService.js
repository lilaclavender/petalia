import { supabase } from "../lib/supabase";
import productImages from "./productImages";

// =====================================================
// NORMALIZE TEXT
// =====================================================

const normalizeText = (value) =>
  String(value || "").trim().toLowerCase();


// =====================================================
// CHOOSE LOCAL PRODUCT IMAGE
// =====================================================

const getFallbackImage = (product) => {
  const name = normalizeText(product.name);
  const category = normalizeText(product.category);

  // =====================================================
  // FLOWERS
  // =====================================================

  if (category === "flowers") {

    // -------------------------------------------------
    // Specific mixed bouquets first
    // -------------------------------------------------

    // Blush Rose & Lisianthus:
    // rose is the main flower, so use pink rose.
    if (
      name.includes("blush rose") &&
      name.includes("lisianthus")
    ) {
      return productImages[2];
    }

    // Pure Lisianthus & Rose:
    // lisianthus is the main flower.
    if (
      name.includes("pure lisianthus") &&
      name.includes("rose")
    ) {
      return productImages[28];
    }

    // -------------------------------------------------
    // Red / Crimson Rose
    // -------------------------------------------------

    if (
      name.includes("red rose") ||
      name.includes("crimson") ||
      name.includes("deep red")
    ) {
      return productImages[1];
    }

    // -------------------------------------------------
    // Orchid
    // -------------------------------------------------

    if (name.includes("orchid")) {
      return productImages[25];
    }

    // -------------------------------------------------
    // Gerbera / Daisy
    // -------------------------------------------------

    if (
      name.includes("gerbera") ||
      name.includes("daisy")
    ) {
      return productImages[26];
    }

    // -------------------------------------------------
    // Baby's Breath
    // -------------------------------------------------

    if (
      name.includes("baby's breath") ||
      name.includes("babys breath") ||
      name.includes("baby breath")
    ) {
      return productImages[27];
    }

    // -------------------------------------------------
    // Lisianthus
    // Must stay before generic Rose
    // -------------------------------------------------

    if (name.includes("lisianthus")) {
      return productImages[28];
    }

    // -------------------------------------------------
    // Tulip
    // Must stay before generic Rose
    // -------------------------------------------------

    if (name.includes("tulip")) {
      return productImages[4];
    }

    // -------------------------------------------------
    // Lily
    // Must stay before generic Rose
    // -------------------------------------------------

    if (name.includes("lily")) {
      return productImages[5];
    }

    // -------------------------------------------------
    // Sunflower
    // -------------------------------------------------

    if (name.includes("sunflower")) {
      return productImages[3];
    }

    // -------------------------------------------------
    // Lotus
    // -------------------------------------------------

    if (name.includes("lotus")) {
      return productImages[15];
    }

    // -------------------------------------------------
    // Jasmine
    // -------------------------------------------------

    if (name.includes("jasmine")) {
      return productImages[16];
    }

    // -------------------------------------------------
    // Lavender FLOWER
    // -------------------------------------------------

    if (name.includes("lavender")) {
      return productImages[19];
    }

    // -------------------------------------------------
    // White flowers
    // -------------------------------------------------

    if (
      name.includes("white") ||
      name.includes("harmony")
    ) {
      return productImages[17];
    }

    // -------------------------------------------------
    // Golden / Yellow flowers
    // -------------------------------------------------

    if (
      name.includes("golden") ||
      name.includes("yellow")
    ) {
      return productImages[18];
    }

    // -------------------------------------------------
    // Pink / Blush / Rose
    // -------------------------------------------------

    if (
      name.includes("pink") ||
      name.includes("blush") ||
      name.includes("rose")
    ) {
      return productImages[2];
    }

    // Generic flower fallback
    return productImages[3];
  }


  // =====================================================
  // CANDLES
  // =====================================================

  // =====================================================
// CANDLES
// =====================================================

  if (
    category === "candles" ||
    category === "candle"
  ) {
    // Lavender
    // Use a candle-only image instead of the old
    // bouquet + candle image.
    if (name.includes("lavender")) {
      return productImages[32]; // peony candle
    }

    // Jasmine
    // Use another candle-only floral image.
    if (name.includes("jasmine")) {
      return productImages[30]; // blush candle
    }

    // Vanilla
    if (name.includes("vanilla")) {
      return productImages[29]; // warm vanilla candle
    }

    // Mint
    if (
      name.includes("mint") ||
      name.includes("fresh")
    ) {
      return productImages[9];
    }

    // Citrus
    if (
      name.includes("citrus") ||
      name.includes("orange") ||
      name.includes("lemon")
    ) {
      return productImages[10];
    }

    // Cinnamon
    if (name.includes("cinnamon")) {
      return productImages[31];
    }

    // Peony / Floral
    if (
      name.includes("peony") ||
      name.includes("floral")
    ) {
      return productImages[32];
    }

    // Amber
    if (name.includes("amber")) {
      return productImages[33];
    }

    // Sandalwood
    if (name.includes("sandalwood")) {
      return productImages[34];
    }

    // Rose / Blush
    if (
      name.includes("rose") ||
      name.includes("blush")
    ) {
      return productImages[30];
    }

    // Generic candle fallback
    return productImages[34];
  }

  // =====================================================
  // GIFT SETS
  // =====================================================

  if (
    category === "gift sets" ||
    category === "gift set" ||
    category === "giftsets"
  ) {

    // -------------------------------------------------
    // Sunflower Gift Set
    // -------------------------------------------------

    if (name.includes("sunflower")) {
      return productImages[12];
    }

    // -------------------------------------------------
    // Lavender Gift Set
    // -------------------------------------------------

    if (name.includes("lavender")) {
      return productImages[14];
    }

    // -------------------------------------------------
    // Amber Gift Set
    // -------------------------------------------------

    if (name.includes("amber")) {
      return productImages[13];
    }

    // -------------------------------------------------
    // Comfort / Care Gift Set
    // -------------------------------------------------

    if (
      name.includes("comfort") ||
      name.includes("care")
    ) {
      return productImages[21];
    }

    // -------------------------------------------------
    // Rose / Pink / Vanilla Gift Set
    // -------------------------------------------------

    if (
      name.includes("rose") ||
      name.includes("pink") ||
      name.includes("vanilla")
    ) {
      return productImages[11];
    }

    // Generic Gift Set
    return productImages[11];
  }


  // =====================================================
  // FINAL FALLBACK
  // =====================================================

  return productImages[1];
};


// =====================================================
// LOAD PRODUCTS FROM SUPABASE
// =====================================================

export const getProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error loading products:", error);
    throw error;
  }

  return (data || []).map((product) => {
    const databaseImage = product.image;

    const category = normalizeText(product.category);

    // =================================================
    // CHECK DATABASE IMAGE
    // =================================================

    const hasRealImageUrl =
      typeof databaseImage === "string" &&
      (
        databaseImage.startsWith("http://") ||
        databaseImage.startsWith("https://")
      );


    // =================================================
    // GET CORRECT LOCAL IMAGE
    // =================================================

    const fallbackImage = getFallbackImage(product);


    // =================================================
    // IMAGE RULE
    // =================================================
    //
    // Petalia currently has controlled local images for:
    //
    // Flowers
    // Candles
    // Gift Sets
    //
    // We use those images so that:
    //
    // Candle products do not accidentally show gift sets.
    // Flower products do not accidentally show candles.
    // Gift sets keep gift-set imagery.
    //
    // Other future categories may use uploaded URLs.
    // =================================================

    const usesControlledLocalImage =
      category === "flowers" ||
      category === "flower" ||
      category === "candles" ||
      category === "candle" ||
      category === "gift sets" ||
      category === "gift set" ||
      category === "giftsets";


    const resolvedImage = usesControlledLocalImage
      ? fallbackImage
      : hasRealImageUrl
        ? databaseImage
        : fallbackImage;


    // =================================================
    // RETURN CLEAN PRODUCT
    // =================================================

    return {
      ...product,

      image: resolvedImage,

      giftStyles: Array.isArray(product.gift_styles)
        ? product.gift_styles
        : product.gift_styles
          ? [product.gift_styles]
          : [],

      flowerColor:
        product.flower_color || null,
    };
  });
};