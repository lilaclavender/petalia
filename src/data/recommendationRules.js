// =====================================================
// PETALIA RECOMMENDATION RULES
// =====================================================
//
// These are Petalia's internal recommendation rules.
//
// They connect flower meanings to:
// 1. Emotion
// 2. Occasion
// 3. Relationship
//
// IMPORTANT:
// These are recommendation rules, NOT flower research data.
// Flower research stays inside flowersData.js.
// =====================================================


// =====================================================
// 1. EMOTION RULES
// =====================================================

export const emotionRules = {
  love: [
    "Love",
    "Romance",
    "Passion",
    "Devotion",
    "Affection",
    "Desire",
    "Attraction",
    "True Love",
  ],

  happiness: [
    "Joy",
    "Happiness",
    "Cheerfulness",
    "Positivity",
    "Positive Energy",
    "Optimism",
  ],

  gratitude: [
    "Gratitude",
    "Appreciation",
    "Thanks",
    "Thankfulness",
  ],

  friendship: [
    "Friendship",
    "Trust",
    "Loyalty",
    "Goodwill",
  ],

  care: [
    "Care",
    "Thoughtfulness",
    "Support",
    "Comfort",
    "Protection",
    "Sympathy",
    "Sincerity",
  ],

  encouragement: [
    "Hope",
    "Courage",
    "Strength",
    "Success",
    "Perseverance",
    "New Beginnings",
    "Good Luck",
    "Optimism",
  ],
};


// =====================================================
// 2. OCCASION RULES
// =====================================================

export const occasionRules = {
  birthday: [
    "Joy",
    "Happiness",
    "Cheerfulness",
    "Friendship",
    "Affection",
    "Appreciation",
    "Warmth",
  ],

  anniversary: [
    "Love",
    "Romance",
    "Passion",
    "Devotion",
    "Affection",
    "Commitment",
    "True Love",
  ],

  valentinesDay: [
    "Love",
    "Romance",
    "Passion",
    "Desire",
    "Affection",
    "Attraction",
    "True Love",
  ],

  wedding: [
    "Love",
    "Purity",
    "Devotion",
    "Commitment",
    "New Beginnings",
    "Grace",
    "True Love",
  ],

  graduation: [
    "Success",
    "Achievement",
    "Good Luck",
    "Hope",
    "New Beginnings",
    "Optimism",
    "Congratulations",
  ],

  mothersDay: [
    "Love",
    "Gratitude",
    "Appreciation",
    "Care",
    "Admiration",
    "Affection",
    "Thoughtfulness",
  ],

  congratulations: [
    "Success",
    "Achievement",
    "Joy",
    "Good Luck",
    "Prosperity",
    "New Beginnings",
    "Congratulations",
  ],

  newBaby: [
    "Purity",
    "Innocence",
    "Hope",
    "New Beginnings",
    "Joy",
    "Care",
  ],

  apology: [
    "Apology",
    "Forgiveness",
    "Regret",
    "Sincerity",
    "Thoughtfulness",
  ],

  encouragement: [
    "Hope",
    "Optimism",
    "Strength",
    "Courage",
    "Positivity",
    "Positive Energy",
    "Perseverance",
    "Support",
  ],

  friendship: [
    "Friendship",
    "Joy",
    "Happiness",
    "Appreciation",
    "Loyalty",
    "Trust",
  ],
};


// =====================================================
// 3. RELATIONSHIP RULES
// =====================================================

export const relationshipRules = {
  partner: [
    "Love",
    "Romance",
    "Passion",
    "Devotion",
    "Affection",
    "Desire",
    "Attraction",
    "True Love",
  ],

  friend: [
    "Friendship",
    "Joy",
    "Trust",
    "Loyalty",
    "Appreciation",
    "Happiness",
  ],

  family: [
    "Love",
    "Care",
    "Gratitude",
    "Warmth",
    "Appreciation",
    "Affection",
    "Thoughtfulness",
  ],

  colleague: [
    "Congratulations",
    "Success",
    "Appreciation",
    "Good Luck",
    "Encouragement",
    "Achievement",
  ],
};