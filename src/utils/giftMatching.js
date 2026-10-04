import flowersData from "../data/flowersData";

import {
  emotionRules,
  occasionRules,
  relationshipRules,
} from "../data/recommendationRules";


// =====================================================
// HELPER: Clean text
// =====================================================

const normalize = (text = "") => {
  return String(text).toLowerCase().trim();
};


// =====================================================
// HELPER: Remove duplicates
// =====================================================

const unique = (items = []) => {
  return [...new Set(items)];
};


// =====================================================
// HELPER: Get all meanings from one flower
// Used by CUSTOMER flower recommendation
// =====================================================

const getFlowerMeanings = (flower) => {
  const meanings = [];

  if (flower.feelings) {
    meanings.push(...flower.feelings);
  }

  if (flower.colors) {
    flower.colors.forEach((color) => {
      if (color.expresses) {
        meanings.push(...color.expresses);
      }
    });
  }

  return meanings.map(normalize);
};


// =====================================================
// HELPER: Count matches
// =====================================================

const countMatches = (
  flowerMeanings,
  ruleMeanings = []
) => {
  return ruleMeanings.reduce((score, meaning) => {
    const target = normalize(meaning);

    const matched = flowerMeanings.some(
      (flowerMeaning) =>
        flowerMeaning === target ||
        flowerMeaning.includes(target) ||
        target.includes(flowerMeaning)
    );

    return matched ? score + 1 : score;
  }, 0);
};


// =====================================================
// CUSTOMER SIDE
// MAIN FLOWER MATCHER
// =====================================================

export const matchFlowers = ({
  emotion = "",
  occasion = "",
  relationship = "",
}) => {
  const emotionMeanings =
    emotionRules[emotion] || [];

  const occasionMeanings =
    occasionRules[occasion] || [];

  const relationshipMeanings =
    relationshipRules[relationship] || [];

  const results = Object.values(flowersData).map(
    (flower) => {
      const flowerMeanings =
        getFlowerMeanings(flower);

      const emotionScore = countMatches(
        flowerMeanings,
        emotionMeanings
      );

      const occasionScore = countMatches(
        flowerMeanings,
        occasionMeanings
      );

      const relationshipScore = countMatches(
        flowerMeanings,
        relationshipMeanings
      );

      const totalScore =
        emotionScore +
        occasionScore +
        relationshipScore;

      return {
        flower,
        score: totalScore,

        matches: {
          emotion: emotionScore,
          occasion: occasionScore,
          relationship: relationshipScore,
        },
      };
    }
  );

  return results
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score);
};


// =====================================================
// CUSTOMER SIDE
// GET ONLY FLOWER NAMES
// =====================================================

export const getRecommendedFlowerNames = (
  answers
) => {
  return matchFlowers(answers).map(
    (result) => result.flower.name
  );
};


// =====================================================
// SELLER SIDE
// CONTROLLED PETALIA TAGS
// =====================================================
//
// Sellers cannot create random recommendation tags.
//
// Petalia suggests tags from these approved values.
// Sellers can remove suggestions or add another
// approved value during review.
//
// =====================================================

export const petaliaMatchOptions = {
  emotions: [
    "love",
    "happiness",
    "joy",
    "gratitude",
    "appreciation",
    "friendship",
    "care",
    "comfort",
    "sympathy",
    "thinking of you",
    "encouragement",
    "hope",
    "celebration",
    "congratulations",
    "apology",
    "self-care",
    "peace & calm",
  ],

  occasions: [
    "birthday",
    "anniversary",
    "valentine's day",
    "wedding",
    "graduation",
    "mother's day",
    "christmas",
    "new baby",
    "thank you",
    "get well soon",
    "housewarming",
    "farewell",
    "retirement",
    "congratulations",
    "just because",
    "encouragement",
  ],

  recipients: [
    "partner",
    "friend",
    "family",
    "parent",
    "colleague",
    "teacher",
    "someone special",
  ],

  giftStyles: [
    "romantic & sweet",
    "warm & thoughtful",
    "simple & elegant",
    "bright & cheerful",
    "soft & calm",
  ],
};


// =====================================================
// SELLER SIDE
// FIND FLOWER FROM flowersData.js
// =====================================================

const findFlower = (flowerName = "") => {
  const target = normalize(flowerName);

  if (!target) {
    return null;
  }

  return (
    Object.values(flowersData).find((flower) => {
      return (
        normalize(flower.id) === target ||
        normalize(flower.name) === target
      );
    }) || null
  );
};


// =====================================================
// SELLER SIDE
// FIND SPECIFIC FLOWER COLOR
// =====================================================

const findFlowerColor = (
  flower,
  colorName = ""
) => {
  if (
    !flower ||
    !flower.colors ||
    !colorName
  ) {
    return null;
  }

  const target = normalize(colorName);

  return (
    flower.colors.find((color) => {
      return (
        normalize(color.id) === target ||
        normalize(color.name) === target ||
        normalize(color.color) === target
      );
    }) || null
  );
};


// =====================================================
// SELLER SIDE
// GET MEANINGS FOR SPECIFIC FLOWER + COLOR
// =====================================================
//
// Example:
//
// Rose + Pink uses:
// - General Rose meanings
// - Pink Rose meanings
//
// It does NOT use meanings from all Rose colors.
//
// =====================================================

const getSpecificFlowerMeanings = (
  flowerName = "",
  flowerColor = ""
) => {
  const flower = findFlower(flowerName);

  if (!flower) {
    return {
      flower: null,
      color: null,
      meanings: [],
      directOccasions: [],
    };
  }

  const color = findFlowerColor(
    flower,
    flowerColor
  );

  const meanings = [];

  // General meanings of the flower
  if (flower.feelings) {
    meanings.push(...flower.feelings);
  }

  // Meanings ONLY from selected color
  if (color?.expresses) {
    meanings.push(...color.expresses);
  }

  const directOccasions =
    color?.occasions?.map(normalize) || [];

  return {
    flower,
    color,

    meanings: unique(
      meanings.map(normalize)
    ),

    directOccasions: unique(
      directOccasions
    ),
  };
};


// =====================================================
// SELLER SIDE
// CHECK WHETHER MEANINGS MATCH A RULE
// =====================================================

const ruleHasMatch = (
  productMeanings = [],
  ruleMeanings = []
) => {
  return ruleMeanings.some((ruleMeaning) => {
    const target = normalize(ruleMeaning);

    return productMeanings.some(
      (productMeaning) =>
        productMeaning === target ||
        productMeaning.includes(target) ||
        target.includes(productMeaning)
    );
  });
};


// =====================================================
// SELLER SIDE
// MAP MEANINGS -> EMOTIONS
// =====================================================

const suggestEmotions = (meanings = []) => {
  const suggestions = [];

  Object.entries(emotionRules).forEach(
    ([emotion, ruleMeanings]) => {
      if (
        ruleHasMatch(
          meanings,
          ruleMeanings
        )
      ) {
        suggestions.push(
          normalize(emotion)
        );
      }
    }
  );

  /*
    Extra Petalia mappings for product tags
    that are more specific than the main
    recommendation-rule keys.
  */

  const directEmotionMap = {
    joy: "joy",
    appreciation: "appreciation",
    comfort: "comfort",
    sympathy: "sympathy",
    hope: "hope",
    congratulations: "congratulations",
    apology: "apology",
  };

  meanings.forEach((meaning) => {
    const mapped =
      directEmotionMap[meaning];

    if (mapped) {
      suggestions.push(mapped);
    }
  });

  return unique(suggestions).filter(
    (emotion) =>
      petaliaMatchOptions.emotions.includes(
        emotion
      )
  );
};


// =====================================================
// SELLER SIDE
// MAP MEANINGS -> OCCASIONS
// =====================================================

const suggestOccasions = (
  meanings = [],
  directOccasions = []
) => {
  const suggestions = [];

  // Use Petalia recommendation rules
  Object.entries(occasionRules).forEach(
    ([occasion, ruleMeanings]) => {
      if (
        ruleHasMatch(
          meanings,
          ruleMeanings
        )
      ) {
        let normalizedOccasion =
          normalize(occasion);

        // Convert JS rule keys to database values
        if (occasion === "valentinesDay") {
          normalizedOccasion =
            "valentine's day";
        }

        if (occasion === "mothersDay") {
          normalizedOccasion =
            "mother's day";
        }

        if (occasion === "newBaby") {
          normalizedOccasion =
            "new baby";
        }

        suggestions.push(
          normalizedOccasion
        );
      }
    }
  );

  // Occasions stored directly in flower data
  directOccasions.forEach((occasion) => {
    const value = normalize(occasion);

    const aliases = {
      "valentines day":
        "valentine's day",

      "valentine's day":
        "valentine's day",

      "mothers day":
        "mother's day",

      "mother's day":
        "mother's day",

      weddings: "wedding",
      wedding: "wedding",

      "thank you": "thank you",

      birthday: "birthday",

      congratulations:
        "congratulations",

      graduation: "graduation",

      "new baby": "new baby",

      "housewarming gifts":
        "housewarming",

      housewarming: "housewarming",
    };

    if (aliases[value]) {
      suggestions.push(
        aliases[value]
      );
    }
  });

  return unique(suggestions).filter(
    (occasion) =>
      petaliaMatchOptions.occasions.includes(
        occasion
      )
  );
};


// =====================================================
// SELLER SIDE
// MAP MEANINGS -> RECIPIENTS
// =====================================================

const suggestRecipients = (
  meanings = []
) => {
  const suggestions = [];

  Object.entries(
    relationshipRules
  ).forEach(
    ([relationship, ruleMeanings]) => {
      if (
        ruleHasMatch(
          meanings,
          ruleMeanings
        )
      ) {
        suggestions.push(
          normalize(relationship)
        );
      }
    }
  );

  /*
    Some Petalia recipient categories do not
    currently have their own relationship rule.

    These mappings are intentionally conservative.
  */

  if (
    meanings.some((meaning) =>
      [
        "gratitude",
        "appreciation",
        "thankfulness",
        "respect",
      ].includes(meaning)
    )
  ) {
    suggestions.push("teacher");
  }

  if (
    meanings.some((meaning) =>
      [
        "care",
        "gratitude",
        "appreciation",
        "affection",
        "warmth",
      ].includes(meaning)
    )
  ) {
    suggestions.push("parent");
  }

  if (
    meanings.some((meaning) =>
      [
        "love",
        "affection",
        "care",
        "gratitude",
        "friendship",
      ].includes(meaning)
    )
  ) {
    suggestions.push(
      "someone special"
    );
  }

  return unique(suggestions).filter(
    (recipient) =>
      petaliaMatchOptions.recipients.includes(
        recipient
      )
  );
};


// =====================================================
// SELLER SIDE
// MAP MEANINGS -> GIFT STYLE
// =====================================================

const suggestGiftStyles = (
  meanings = []
) => {
  const styles = [];

  const hasAny = (targets) => {
    return meanings.some((meaning) =>
      targets.includes(meaning)
    );
  };

  // Romantic
  if (
    hasAny([
      "love",
      "romance",
      "passion",
      "devotion",
      "affection",
      "desire",
      "attraction",
      "true love",
    ])
  ) {
    styles.push(
      "romantic & sweet"
    );
  }

  // Warm / thoughtful
  if (
    hasAny([
      "gratitude",
      "appreciation",
      "care",
      "thoughtfulness",
      "support",
      "friendship",
      "thankfulness",
      "warmth",
    ])
  ) {
    styles.push(
      "warm & thoughtful"
    );
  }

  // Simple / elegant
  if (
    hasAny([
      "grace",
      "purity",
      "elegance",
      "sincerity",
      "admiration",
      "beauty",
    ])
  ) {
    styles.push(
      "simple & elegant"
    );
  }

  // Bright / cheerful
  if (
    hasAny([
      "joy",
      "happiness",
      "cheerfulness",
      "positivity",
      "positive energy",
      "optimism",
      "enthusiasm",
      "energy",
      "celebration",
      "congratulations",
    ])
  ) {
    styles.push(
      "bright & cheerful"
    );
  }

  // Soft / calm
  if (
    hasAny([
      "comfort",
      "sympathy",
      "peace",
      "serenity",
      "gentleness",
      "compassion",
      "emotional healing",
      "hope",
      "care",
    ])
  ) {
    styles.push(
      "soft & calm"
    );
  }

  return unique(styles).filter(
    (style) =>
      petaliaMatchOptions.giftStyles.includes(
        style
      )
  );
};


// =====================================================
// SELLER SIDE
// TEXT-BASED SUPPORT
// =====================================================
//
// This does NOT replace flower meanings.
//
// It helps Petalia understand obvious information
// written in the product name or description.
//
// Example:
// "Mother's Day Pink Rose Bouquet"
// can suggest Mother's Day.
//
// =====================================================

const getTextSuggestions = ({
  name = "",
  description = "",
}) => {
  const text = normalize(
    `${name} ${description}`
  );

  const emotions = [];
  const occasions = [];
  const recipients = [];
  const giftStyles = [];

  const containsAny = (words) => {
    return words.some((word) =>
      text.includes(normalize(word))
    );
  };


  // -------------------------
  // Emotion
  // -------------------------

  if (
    containsAny([
      "love",
      "romantic",
      "romance",
    ])
  ) {
    emotions.push("love");
  }

  if (
    containsAny([
      "happy",
      "happiness",
      "cheerful",
    ])
  ) {
    emotions.push("happiness");
  }

  if (
    containsAny([
      "joy",
      "joyful",
    ])
  ) {
    emotions.push("joy");
  }

  if (
    containsAny([
      "gratitude",
      "grateful",
      "thankful",
      "thank you",
    ])
  ) {
    emotions.push("gratitude");
  }

  if (
    containsAny([
      "appreciation",
      "appreciate",
    ])
  ) {
    emotions.push("appreciation");
  }

  if (
    containsAny([
      "friendship",
    ])
  ) {
    emotions.push("friendship");
  }

  if (
    containsAny([
      "care",
      "caring",
    ])
  ) {
    emotions.push("care");
  }

  if (
    containsAny([
      "comfort",
      "comforting",
    ])
  ) {
    emotions.push("comfort");
  }

  if (
    containsAny([
      "sympathy",
    ])
  ) {
    emotions.push("sympathy");
  }

  if (
    containsAny([
      "thinking of you",
    ])
  ) {
    emotions.push(
      "thinking of you"
    );
  }

  if (
    containsAny([
      "encouragement",
      "encourage",
    ])
  ) {
    emotions.push(
      "encouragement"
    );
  }

  if (
    containsAny([
      "hope",
      "hopeful",
    ])
  ) {
    emotions.push("hope");
  }

  if (
    containsAny([
      "celebration",
      "celebrate",
    ])
  ) {
    emotions.push("celebration");
  }

  if (
    containsAny([
      "congratulations",
      "congrats",
      "achievement",
    ])
  ) {
    emotions.push(
      "congratulations"
    );
  }

  if (
    containsAny([
      "apology",
      "sorry",
    ])
  ) {
    emotions.push("apology");
  }

  if (
    containsAny([
      "self-care",
      "self care",
    ])
  ) {
    emotions.push("self-care");
  }

  if (
    containsAny([
      "peace",
      "peaceful",
      "calm",
      "calming",
      "relaxing",
    ])
  ) {
    emotions.push(
      "peace & calm"
    );
  }


  // -------------------------
  // Occasion
  // -------------------------

  if (containsAny(["birthday"])) {
    occasions.push("birthday");
  }

  if (containsAny(["anniversary"])) {
    occasions.push("anniversary");
  }

  if (
    containsAny([
      "valentine",
      "valentine's day",
    ])
  ) {
    occasions.push(
      "valentine's day"
    );
  }

  if (containsAny(["wedding"])) {
    occasions.push("wedding");
  }

  if (
    containsAny([
      "graduation",
      "graduate",
    ])
  ) {
    occasions.push("graduation");
  }

  if (
    containsAny([
      "mother's day",
      "mothers day",
    ])
  ) {
    occasions.push(
      "mother's day"
    );
  }

  if (containsAny(["christmas"])) {
    occasions.push("christmas");
  }

  if (
    containsAny([
      "new baby",
      "baby shower",
    ])
  ) {
    occasions.push("new baby");
  }

  if (containsAny(["thank you"])) {
    occasions.push("thank you");
  }

  if (
    containsAny([
      "get well",
      "get well soon",
    ])
  ) {
    occasions.push(
      "get well soon"
    );
  }

  if (
    containsAny([
      "housewarming",
      "new home",
    ])
  ) {
    occasions.push(
      "housewarming"
    );
  }

  if (
    containsAny([
      "farewell",
      "goodbye",
    ])
  ) {
    occasions.push("farewell");
  }

  if (
    containsAny([
      "retirement",
      "retire",
    ])
  ) {
    occasions.push("retirement");
  }

  if (
    containsAny([
      "congratulations",
      "congrats",
    ])
  ) {
    occasions.push(
      "congratulations"
    );
  }

  if (
    containsAny([
      "just because",
    ])
  ) {
    occasions.push(
      "just because"
    );
  }

  if (
    containsAny([
      "encouragement",
      "encourage",
    ])
  ) {
    occasions.push(
      "encouragement"
    );
  }


  // -------------------------
  // Recipient
  // -------------------------

  if (
    containsAny([
      "partner",
      "boyfriend",
      "girlfriend",
      "husband",
      "wife",
    ])
  ) {
    recipients.push("partner");
  }

  if (
    containsAny([
      "friend",
      "friendship",
    ])
  ) {
    recipients.push("friend");
  }

  if (containsAny(["family"])) {
    recipients.push("family");
  }

  if (
    containsAny([
      "mother",
      "mom",
      "mum",
      "father",
      "dad",
      "parent",
    ])
  ) {
    recipients.push("parent");
  }

  if (
    containsAny([
      "colleague",
      "coworker",
      "co-worker",
    ])
  ) {
    recipients.push("colleague");
  }

  if (containsAny(["teacher"])) {
    recipients.push("teacher");
  }

  if (
    containsAny([
      "someone special",
    ])
  ) {
    recipients.push(
      "someone special"
    );
  }


  // -------------------------
  // Gift Style
  // -------------------------

  if (
    containsAny([
      "romantic",
      "romance",
      "sweet",
    ])
  ) {
    giftStyles.push(
      "romantic & sweet"
    );
  }

  if (
    containsAny([
      "thoughtful",
      "warm",
      "meaningful",
    ])
  ) {
    giftStyles.push(
      "warm & thoughtful"
    );
  }

  if (
    containsAny([
      "simple",
      "elegant",
      "graceful",
      "minimal",
    ])
  ) {
    giftStyles.push(
      "simple & elegant"
    );
  }

  if (
    containsAny([
      "bright",
      "cheerful",
      "energetic",
    ])
  ) {
    giftStyles.push(
      "bright & cheerful"
    );
  }

  if (
    containsAny([
      "soft",
      "calm",
      "calming",
      "peaceful",
      "gentle",
    ])
  ) {
    giftStyles.push(
      "soft & calm"
    );
  }

  return {
    emotions: unique(emotions),
    occasions: unique(occasions),
    recipients: unique(recipients),
    giftStyles: unique(giftStyles),
  };
};


// =====================================================
// SELLER SIDE
// MAIN PRODUCT MATCHING FUNCTION
// =====================================================
//
// Seller provides:
// - Product name
// - Description
// - Category
// - Flower
// - Flower color
//
// Petalia returns:
// - Emotions
// - Occasions
// - Recipients
// - Gift styles
//
// =====================================================

export const suggestProductMatches = ({
  name = "",
  description = "",
  category = "",
  flower = "",
  flowerColor = "",
}) => {
  const flowerInfo =
    getSpecificFlowerMeanings(
      flower,
      flowerColor
    );

  const textSuggestions =
    getTextSuggestions({
      name,
      description,
    });

  let emotions = [];
  let occasions = [];
  let recipients = [];
  let giftStyles = [];


  // ===================================================
  // FLOWER-BASED SUGGESTIONS
  // ===================================================

  if (flowerInfo.meanings.length > 0) {
    emotions.push(
      ...suggestEmotions(
        flowerInfo.meanings
      )
    );

    occasions.push(
      ...suggestOccasions(
        flowerInfo.meanings,
        flowerInfo.directOccasions
      )
    );

    recipients.push(
      ...suggestRecipients(
        flowerInfo.meanings
      )
    );

    giftStyles.push(
      ...suggestGiftStyles(
        flowerInfo.meanings
      )
    );
  }


  // ===================================================
  // TEXT-BASED SUGGESTIONS
  // ===================================================

  emotions.push(
    ...textSuggestions.emotions
  );

  occasions.push(
    ...textSuggestions.occasions
  );

  recipients.push(
    ...textSuggestions.recipients
  );

  giftStyles.push(
    ...textSuggestions.giftStyles
  );


  // ===================================================
  // CATEGORY SUPPORT
  // ===================================================

  const normalizedCategory =
    normalize(category);

  /*
    Candles may not have flower research data,
    so the name and description are more important.

    Petalia adds only a small fallback instead of
    guessing a specific emotional meaning.
  */

  if (
    normalizedCategory === "candles" &&
    giftStyles.length === 0
  ) {
    giftStyles.push(
      "warm & thoughtful"
    );
  }


  // ===================================================
  // FINAL RESULT
  // ===================================================

  return {
    emotions: unique(emotions).filter(
      (item) =>
        petaliaMatchOptions.emotions.includes(
          item
        )
    ),

    occasions: unique(occasions).filter(
      (item) =>
        petaliaMatchOptions.occasions.includes(
          item
        )
    ),

    recipients: unique(recipients).filter(
      (item) =>
        petaliaMatchOptions.recipients.includes(
          item
        )
    ),

    giftStyles: unique(giftStyles).filter(
      (item) =>
        petaliaMatchOptions.giftStyles.includes(
          item
        )
    ),

    source: {
      flower:
        flowerInfo.flower?.name ||
        null,

      color:
        flowerInfo.color?.name ||
        flowerInfo.color?.color ||
        null,

      meanings:
        flowerInfo.meanings,
    },
  };
};