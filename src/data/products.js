/* =====================================================
   PETALIA PRODUCT DATA

   This is the main product data source for:
   - Shop
   - Gift Finder
   - Product Detail

   Gift Finder uses:
   - recipients
   - emotion
   - occasion
   - giftStyles

   These recommendation tags do NOT need to be shown
   directly to customers.
===================================================== */

/* =========================
   PRODUCT IMAGES
========================= */

import redRose from "../assets/red-rose.png";
import pinkRose from "../assets/pink-rose.png";
import sunflower from "../assets/sunflower.png";
import pinkTulip from "../assets/pink-tulip.png";
import lily from "../assets/lily.png";

import lavenderCandle from "../assets/lavender-candle.png";
import jasmineCandle from "../assets/jasmine-candle.png";
import vanillaCandle from "../assets/vanilla-candle.png";
import mintCandle from "../assets/mint-candle.png";
import citrusCandle from "../assets/citrus-candle.png";

import pinkRoseVanilla from "../assets/pink-rose-vanilla.png";
import sunflowerCandle from "../assets/sunflower-candle.png";
import amberFlower from "../assets/amber-flower.png";
import lavenderCalm from "../assets/lavender-calm.png";

// Homepage Trending Products
import lotusImg from "../assets/lotus-blessing.png";
import jasmineImg from "../assets/jasmine.png";
import whiteHarmonyImg from "../assets/white-harmony.png";
import goldenGratitudeImg from "../assets/golden-gratitude.png";
import lavenderImg from "../assets/lavender.png";
import jasmineSerenityImg from "../assets/jasmine-serenity.png";

import littleComfortImg from "../assets/a-little-comfort.png";
import roseCandleImg from "../assets/rose-candle.png";
import sunflowerCandleImg from "../assets/sunflower-candle.png";
import jasmineCandleImg from "../assets/jasmine-candle.png";


const products = [
  /* =====================================================
     FLOWERS
  ===================================================== */

  {
    id: 1,
    name: "Classic Red Rose Bouquet",
    category: "Flowers",

    emotion: ["love"],

    occasion: ["anniversary", "valentine's day"],

    recipients: ["partner", "someone special"],

    giftStyles: ["romantic & sweet", "simple & elegant"],

    price: 12,
    rating: 4.9,
    reviews: 42,
    image: redRose,
    badge: "Best Seller",

    description:
      "A classic red rose bouquet made for expressing love and meaningful romantic moments.",
  },

  {
    id: 2,
    name: "Blush Pink Rose Bouquet",
    category: "Flowers",

    emotion: ["love", "gratitude"],

    occasion: [
      "birthday",
      "anniversary",
      "mother's day",
      "thank you",
      "wedding",
    ],

    recipients: ["partner", "family", "friend", "someone special"],

    giftStyles: [
      "romantic & sweet",
      "warm & thoughtful",
      "soft & calm",
    ],

    price: 11,
    rating: 4.8,
    reviews: 36,
    image: pinkRose,
    badge: null,

    description:
      "Soft pink roses with a gentle and thoughtful feeling, perfect for showing affection and appreciation.",
  },

  {
    id: 3,
    name: "Sunshine Sunflower Bouquet",
    category: "Flowers",

    emotion: [
      "celebration",
      "congratulations",
      "appreciation",
      "happiness",
      "joy",
      "encouragement",
      "hope",
    ],

    occasion: ["birthday", "graduation", "thank you"],

    recipients: [
      "family",
      "friend",
      "teacher",
      "colleague",
      "someone special",
    ],

    giftStyles: ["bright & cheerful", "warm & thoughtful"],

    price: 10,
    rating: 4.9,
    reviews: 51,
    image: sunflower,
    badge: null,

    description:
      "A cheerful sunflower bouquet that brings warmth, happiness, and positive energy to special moments.",
  },

  {
    id: 4,
    name: "Pink Tulip Bouquet",
    category: "Flowers",

    flower: "Tulip",
    flowerColor: "Pink",

    emotion: [
      "love",
      "appreciation",
      "gratitude",
      "thinking of you",
      "apology",
    ],

    occasion: [
      "birthday",
      "anniversary",
      "valentine's day",
      "thank you",
    ],

    recipients: ["partner", "family", "friend", "someone special"],

    giftStyles: [
      "simple & elegant",
      "romantic & sweet",
      "soft & calm",
    ],

    price: 14,
    rating: 4.8,
    reviews: 39,
    image: pinkTulip,
    badge: "Popular",

    description:
      "Elegant pink tulips with a soft and graceful look for birthdays, appreciation, and romantic occasions.",
  },

  {
    id: 5,
    name: "Pink Lily Bouquet",
    category: "Flowers",

    emotion: [
      "appreciation",
      "sympathy",
      "gratitude",
      "comfort",
      "thinking of you",
      "apology",
    ],

    occasion: [
      "birthday",
      "mother's day",
      "thank you",
      "get well soon",
      "new baby",
    ],

    recipients: [
      "family",
      "friend",
      "teacher",
      "colleague",
      "someone special",
    ],

    giftStyles: [
      "simple & elegant",
      "warm & thoughtful",
      "soft & calm",
    ],

    price: 12,
    rating: 4.8,
    reviews: 32,
    image: lily,
    badge: null,

    description:
      "Graceful pink lilies chosen for thoughtful gestures, appreciation, comfort, and gentle celebrations.",
  },

  /* =====================================================
     CANDLES
  ===================================================== */

  {
    id: 6,
    name: "Lavender Scented Candle",
    category: "Candles",

    emotion: [
      "appreciation",
      "sympathy",
      "comfort",
      "peace & calm",
      "gratitude",
      "self-care",
    ],

    occasion: [
      "birthday",
      "mother's day",
      "get well soon",
      "thank you",
      "just because",
    ],

    recipients: [
      "family",
      "friend",
      "teacher",
      "colleague",
      "someone special",
    ],

    giftStyles: [
      "soft & calm",
      "warm & thoughtful",
      "simple & elegant",
    ],

    price: 16,
    rating: 4.8,
    reviews: 34,
    image: lavenderCandle,
    badge: "Best Seller",

    description:
      "A calming lavender-scented candle designed for peaceful, comforting, and thoughtful moments.",
  },

  {
    id: 7,
    name: "Jasmine Scented Candle",
    category: "Candles",

    emotion: [
      "appreciation",
      "love",
      "gratitude",
      "comfort",
      "peace & calm",
    ],

    occasion: [
      "birthday",
      "mother's day",
      "anniversary",
      "thank you",
      "just because",
    ],

    recipients: [
      "partner",
      "family",
      "friend",
      "teacher",
      "someone special",
    ],

    giftStyles: [
      "warm & thoughtful",
      "soft & calm",
      "romantic & sweet",
    ],

    price: 16,
    rating: 4.9,
    reviews: 47,
    image: jasmineCandle,
    badge: null,

    description:
      "A gentle jasmine candle with a warm floral scent for appreciation, affection, and relaxing moments.",
  },

  {
    id: 8,
    name: "Vanilla Scented Candle",
    category: "Candles",

    emotion: [
      "love",
      "appreciation",
      "comfort",
      "gratitude",
      "self-care",
    ],

    occasion: [
      "birthday",
      "anniversary",
      "valentine's day",
      "christmas",
      "just because",
    ],

    recipients: ["partner", "family", "friend", "someone special"],

    giftStyles: [
      "warm & thoughtful",
      "romantic & sweet",
      "soft & calm",
    ],

    price: 15,
    rating: 4.7,
    reviews: 31,
    image: vanillaCandle,
    badge: null,

    description:
      "A warm vanilla-scented candle with a sweet and comforting character for cozy and meaningful gifting.",
  },

  {
    id: 9,
    name: "Fresh Mint Scented Candle",
    category: "Candles",

    emotion: [
      "appreciation",
      "congratulations",
      "self-care",
      "encouragement",
      "joy",
      "hope",
    ],

    occasion: [
      "birthday",
      "graduation",
      "thank you",
      "just because",
    ],

    recipients: [
      "family",
      "friend",
      "teacher",
      "colleague",
      "someone special",
    ],

    giftStyles: ["bright & cheerful", "simple & elegant"],

    price: 15,
    rating: 4.8,
    reviews: 28,
    image: mintCandle,
    badge: null,

    description:
      "A refreshing mint-scented candle for uplifting moments, encouragement, and simple thoughtful gestures.",
  },

  {
    id: 10,
    name: "Citrus Scented Candle",
    category: "Candles",

    emotion: [
      "celebration",
      "congratulations",
      "happiness",
      "self-care",
      "joy",
      "encouragement",
      "hope",
    ],

    occasion: [
      "birthday",
      "graduation",
      "christmas",
      "thank you",
    ],

    recipients: [
      "family",
      "friend",
      "teacher",
      "colleague",
      "someone special",
    ],

    giftStyles: ["bright & cheerful", "warm & thoughtful"],

    price: 15,
    rating: 4.7,
    reviews: 25,
    image: citrusCandle,
    badge: null,

    description:
      "A fresh citrus candle with a bright and energetic scent for celebrations and cheerful gifting.",
  },

  /* =====================================================
     GIFT SETS
  ===================================================== */

  {
    id: 11,
    name: "Pink Rose & Vanilla Candle Gift Set",
    category: "Gift Sets",

    emotion: ["love", "appreciation", "gratitude"],

    occasion: [
      "anniversary",
      "valentine's day",
      "birthday",
    ],

    recipients: ["partner", "someone special", "family"],

    giftStyles: ["romantic & sweet", "warm & thoughtful"],

    price: 32,
    rating: 4.9,
    reviews: 44,
    image: pinkRoseVanilla,
    badge: "Popular",

    description:
      "A romantic combination of soft pink roses and a warm vanilla candle, curated for meaningful celebrations.",
  },

  {
    id: 12,
    name: "Sunflower & Scented Candle Gift Set",
    category: "Gift Sets",

    emotion: [
      "celebration",
      "congratulations",
      "appreciation",
      "happiness",
      "joy",
      "encouragement",
      "hope",
    ],

    occasion: ["birthday", "graduation", "thank you"],

    recipients: [
      "family",
      "friend",
      "teacher",
      "colleague",
      "someone special",
    ],

    giftStyles: ["bright & cheerful", "warm & thoughtful"],

    price: 30,
    rating: 4.8,
    reviews: 37,
    image: sunflowerCandle,
    badge: null,

    description:
      "A cheerful sunflower and scented candle pairing created for celebrations, encouragement, and appreciation.",
  },

  {
    id: 13,
    name: "Amber Candle & Flower Gift Set",
    category: "Gift Sets",

    emotion: [
      "appreciation",
      "sympathy",
      "gratitude",
      "comfort",
      "peace & calm",
      "apology",
    ],

    occasion: [
      "birthday",
      "mother's day",
      "thank you",
      "get well soon",
    ],

    recipients: [
      "family",
      "friend",
      "teacher",
      "colleague",
      "someone special",
    ],

    giftStyles: [
      "warm & thoughtful",
      "simple & elegant",
      "soft & calm",
    ],

    price: 34,
    rating: 4.8,
    reviews: 32,
    image: amberFlower,
    badge: null,

    description:
      "A warm candle and flower combination curated for appreciation, comfort, and thoughtful gifting.",
  },

  {
    id: 14,
    name: "Lavender Candle & Flower Gift Set",
    category: "Gift Sets",

    emotion: [
      "appreciation",
      "sympathy",
      "love",
      "comfort",
      "peace & calm",
      "gratitude",
    ],

    occasion: [
      "birthday",
      "mother's day",
      "anniversary",
      "get well soon",
      "thank you",
    ],

    recipients: [
      "partner",
      "family",
      "friend",
      "teacher",
      "someone special",
    ],

    giftStyles: [
      "soft & calm",
      "warm & thoughtful",
      "romantic & sweet",
    ],

    price: 34,
    rating: 4.8,
    reviews: 32,
    image: lavenderCalm,
    badge: "Trending",

    description:
      "A soothing lavender candle and flower pairing designed for comfort, affection, and peaceful meaningful moments.",
  },

  /* =====================================================
     HOMEPAGE TRENDING PRODUCTS
  ===================================================== */

  {
    id: 15,
    name: "Lotus Arrangement",
    category: "Flowers",

    emotion: [
      "appreciation",
      "gratitude",
      "peace & calm",
      "thinking of you",
    ],

    occasion: ["birthday", "thank you", "just because"],

    recipients: [
      "family",
      "friend",
      "teacher",
      "someone special",
    ],

    giftStyles: [
      "simple & elegant",
      "soft & calm",
      "warm & thoughtful",
    ],

    price: 28,
    rating: 4.8,
    reviews: 120,
    image: lotusImg,
    badge: "Trending",

    description:
      "A graceful lotus arrangement created for peaceful, thoughtful, and meaningful gifting.",
  },

  {
    id: 16,
    name: "Jasmine Grace Bouquet",
    category: "Flowers",

    emotion: [
      "love",
      "appreciation",
      "gratitude",
      "peace & calm",
    ],

    occasion: [
      "birthday",
      "anniversary",
      "thank you",
      "just because",
      "wedding",
    ],

    recipients: [
      "partner",
      "family",
      "friend",
      "someone special",
    ],

    giftStyles: [
      "simple & elegant",
      "soft & calm",
      "warm & thoughtful",
    ],

    price: 32,
    rating: 4.7,
    reviews: 98,
    image: jasmineImg,
    badge: null,

    description:
      "A delicate jasmine bouquet with a graceful and calming character for thoughtful moments.",
  },

  {
    id: 17,
    name: "White Harmony Bouquet",
    category: "Flowers",

    emotion: [
      "appreciation",
      "sympathy",
      "comfort",
      "peace & calm",
      "thinking of you",
    ],

    occasion: [
      "thank you",
      "get well soon",
      "just because",
      "new baby",
    ],

    recipients: [
      "family",
      "friend",
      "teacher",
      "colleague",
      "someone special",
    ],

    giftStyles: [
      "simple & elegant",
      "soft & calm",
    ],

    price: 18,
    rating: 4.9,
    reviews: 156,
    image: whiteHarmonyImg,
    badge: "Popular",

    description:
      "A soft white floral arrangement designed to express peace, comfort, and thoughtful appreciation.",
  },

  {
    id: 18,
    name: "Golden Gratitude Bouquet",
    category: "Flowers",

    emotion: [
      "gratitude",
      "appreciation",
      "happiness",
      "joy",
      "congratulations",
      "celebration",
    ],

    occasion: [
      "birthday",
      "graduation",
      "thank you",
      "congratulations",
    ],

    recipients: [
      "family",
      "friend",
      "teacher",
      "colleague",
      "someone special",
    ],

    giftStyles: [
      "bright & cheerful",
      "warm & thoughtful",
    ],

    price: 28,
    rating: 4.8,
    reviews: 112,
    image: goldenGratitudeImg,
    badge: null,

    description:
      "A warm golden bouquet created to celebrate gratitude, happiness, and meaningful achievements.",
  },

  {
    id: 19,
    name: "Lavender Calm Candle",
    category: "Candles",

    emotion: [
      "comfort",
      "peace & calm",
      "appreciation",
      "gratitude",
      "self-care",
    ],

    occasion: [
      "birthday",
      "thank you",
      "get well soon",
      "just because",
    ],

    recipients: [
      "family",
      "friend",
      "teacher",
      "colleague",
      "someone special",
    ],

    giftStyles: [
      "soft & calm",
      "warm & thoughtful",
      "simple & elegant",
    ],

    price: 16,
    rating: 4.7,
    reviews: 90,
    image: lavenderImg,
    badge: null,

    description:
      "A calming lavender candle made for peaceful evenings, self-care, comfort, and thoughtful gifting.",
  },

  {
    id: 20,
    name: "Jasmine Serenity Candle",
    category: "Candles",

    emotion: [
      "love",
      "appreciation",
      "gratitude",
      "comfort",
      "peace & calm",
    ],

    occasion: [
      "birthday",
      "anniversary",
      "thank you",
      "just because",
    ],

    recipients: [
      "partner",
      "family",
      "friend",
      "someone special",
    ],

    giftStyles: [
      "soft & calm",
      "warm & thoughtful",
      "romantic & sweet",
    ],

    price: 30,
    rating: 4.8,
    reviews: 104,
    image: jasmineSerenityImg,
    badge: "Trending",

    description:
      "A jasmine-scented candle with a soft floral character for relaxing and meaningful moments.",
  },

  /* =====================================================
     CURATED GIFT SETS - HOMEPAGE
  ===================================================== */

  {
    id: 21,
    name: "A Little Comfort",
    category: "Gift Sets",

    price: 32,
    rating: 4.8,
    reviews: 86,
    image: littleComfortImg,
    badge: "Curated",

    description:
      "A gentle gift set created to bring comfort, warmth, and a little reminder that someone cares.",

    emotion: ["care", "encouragement", "thinking of you"],

    occasion: ["encouragement"],

    recipients: ["friend", "family"],

    giftStyles: ["thoughtful", "comforting"],
  },

  {
    id: 22,
    name: "With Love",
    category: "Gift Sets",

    price: 38,
    rating: 4.9,
    reviews: 124,
    image: roseCandleImg,
    badge: "Popular",

    description:
      "A romantic combination of flowers and candlelight, thoughtfully curated for meaningful moments with someone special.",

    emotion: ["love"],

    occasion: ["anniversary", "valentine'sday"],

    recipients: ["partner"],

    giftStyles: ["romantic", "thoughtful"],
  },

  {
    id: 23,
    name: "Warm Wishes",
    category: "Gift Sets",

    price: 36,
    rating: 4.8,
    reviews: 97,
    image: sunflowerCandleImg,
    badge: "Curated",

    description:
      "A bright and cheerful gift set designed to send happiness, encouragement, and warm wishes.",

    emotion: [
      "happiness",
      "encouragement",
      "celebration",
      "hope",
    ],

    occasion: [
      "birthday",
      "congratulations",
      "graduation",
    ],

    recipients: ["friend", "family", "colleague"],

    giftStyles: ["cheerful", "thoughtful"],
  },

  {
    id: 24,
    name: "Quiet Moments",
    category: "Gift Sets",

    price: 34,
    rating: 4.7,
    reviews: 78,
    image: jasmineCandleImg,
    badge: "Curated",

    description:
      "A calming floral and candle gift set made for peaceful moments, relaxation, and gentle self-care.",

    emotion: ["care", "peace", "self-care"],

    occasion: ["encouragement"],

    recipients: ["friend", "family"],

    giftStyles: ["calming", "thoughtful"],
  },
  
];

export default products;