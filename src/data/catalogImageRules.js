// One explicit catalog token per photo. Uploaded seller photos remain supported.
export const localImageDefinitions = {
  "redRose": [
    "Flowers",
    "flowers/redRose.png"
  ],
  "pinkRose": [
    "Flowers",
    "flowers/pinkRose.png"
  ],
  "miniPinkRose": [
    "Flowers",
    "flowers/miniPinkRose.png"
  ],
  "pinkTulip": [
    "Flowers",
    "flowers/pinkTulip.png"
  ],
  "pinkLily": [
    "Flowers",
    "flowers/pinkLily.png"
  ],
  "sunflower": [
    "Flowers",
    "flowers/sunflower.png"
  ],
  "purpleOrchid": [
    "Flowers",
    "flowers/purpleOrchid.png"
  ],
  "jasmine": [
    "Flowers",
    "flowers/jasmine.png"
  ],
  "lotus": [
    "Flowers",
    "flowers/lotus.png"
  ],
  "whiteHarmony": [
    "Flowers",
    "flowers/whiteHarmony.png"
  ],
  "gerbera": [
    "Flowers",
    "flowers/gerbera.png"
  ],
  "goldenRose": [
    "Flowers",
    "flowers/goldenRose.png"
  ],
  "roseBreath": [
    "Flowers",
    "flowers/roseBreath.png"
  ],
  "pinkLisianthus": [
    "Flowers",
    "flowers/pinkLisianthus.png"
  ],
  "blushMixed": [
    "Flowers",
    "flowers/blushMixed.png"
  ],
  "pastelMixed": [
    "Flowers",
    "flowers/pastelMixed.png"
  ],
  "journey": [
    "Flowers",
    "flowers/journey.png"
  ],
  "softEmbrace": [
    "Flowers",
    "flowers/softEmbrace.jpg"
  ],
  "christmasBouquet": [
    "Flowers",
    "flowers/christmasBouquet.png"
  ],
  "lavender": [
    "Candles",
    "candles/lavender.png"
  ],
  "jasmineCandle": [
    "Candles",
    "candles/jasmineCandle.png"
  ],
  "vanilla": [
    "Candles",
    "candles/vanilla.png"
  ],
  "mint": [
    "Candles",
    "candles/mint.png"
  ],
  "citrus": [
    "Candles",
    "candles/citrus.png"
  ],
  "amber": [
    "Candles",
    "candles/amber.png"
  ],
  "sandalwood": [
    "Candles",
    "candles/sandalwood.png"
  ],
  "peony": [
    "Candles",
    "candles/peony.png"
  ],
  "blush": [
    "Candles",
    "candles/blush.png"
  ],
  "cinnamon": [
    "Candles",
    "candles/cinnamon.png"
  ],
  "lavenderSet": [
    "Gift Sets",
    "gift-sets/lavenderSet.png"
  ],
  "jasmineSet": [
    "Gift Sets",
    "gift-sets/jasmineSet.png"
  ],
  "mintSet": [
    "Gift Sets",
    "gift-sets/mintSet.png"
  ],
  "orchidSet": [
    "Gift Sets",
    "gift-sets/orchidSet.png"
  ],
  "redRoseSet": [
    "Gift Sets",
    "gift-sets/redRoseSet.png"
  ],
  "christmasSet": [
    "Gift Sets",
    "gift-sets/christmasSet.png"
  ],
  "whiteTeaSet": [
    "Gift Sets",
    "gift-sets/whiteTeaSet.png"
  ],
  "amberRoseSet": [
    "Gift Sets",
    "gift-sets/amberRoseSet.png"
  ],
  "goldenAmberSet": [
    "Gift Sets",
    "gift-sets/goldenAmberSet.png"
  ]
};
export const legacyImageAliases = {};
export const nameImageAssignments = {
  "Flowers": {
    "crimson red rose bouquet": "redRose",
    "soft pink rose bouquet": "pinkRose",
    "little pink rose bouquet": "miniPinkRose",
    "pink tulip bouquet": "pinkTulip",
    "pink lily bouquet": "pinkLily",
    "sunny sunflower bouquet": "sunflower",
    "purple orchid bouquet": "purpleOrchid",
    "jasmine grace bouquet": "jasmine",
    "pink lotus arrangement": "lotus",
    "white harmony bouquet": "whiteHarmony",
    "cheerful gerbera bouquet": "gerbera",
    "golden gratitude rose bouquet": "goldenRose",
    "pink rose & baby's breath bouquet": "roseBreath",
    "pink lisianthus garden bouquet": "pinkLisianthus",
    "blush rose & lisianthus bouquet": "blushMixed",
    "pastel joy bouquet": "pastelMixed",
    "new journey bouquet": "journey",
    "soft embrace bouquet": "softEmbrace",
    "christmas red & white bouquet": "christmasBouquet"
  },
  "Candles": {
    "lavender calm candle": "lavender",
    "jasmine scented candle": "jasmineCandle",
    "vanilla comfort candle": "vanilla",
    "fresh mint candle": "mint",
    "citrus sunshine candle": "citrus",
    "amber warmth candle": "amber",
    "sandalwood comfort candle": "sandalwood",
    "peony blossom candle": "peony",
    "blush candle": "blush",
    "christmas cinnamon candle": "cinnamon"
  },
  "Gift Sets": {
    "grace & calm gift set": "lavenderSet",
    "white harmony & jasmine gift set": "jasmineSet",
    "fresh start mint gift set": "mintSet",
    "orchid & lavender gift set": "orchidSet",
    "red rose & vanilla gift set": "redRoseSet",
    "christmas warm wishes gift set": "christmasSet",
    "white tea & gentle blooms gift set": "whiteTeaSet",
    "a little amber comfort gift set": "amberRoseSet",
    "golden friendship & amber gift set": "goldenAmberSet"
  }
};
export const normalizeText = (value) => String(value ?? '').trim().replace(/\s+/g, ' ').toLowerCase();
export function normalizeCategory(value) {
 const key=normalizeText(value).replace(/[-_]+/g,' ');
 if(['flower','flowers'].includes(key)) return 'Flowers';
 if(['candle','candles'].includes(key)) return 'Candles';
 if(['gift set','gift sets','giftsets','curated set','curated sets'].includes(key)) return 'Gift Sets';
 return String(value ?? '').trim();
}
export function chooseProductImage(product) {
 const category=normalizeCategory(product.category);
 const source=String(product.image ?? '').trim();
 if(/^https?:\/\//i.test(source)) return {type:'uploaded',source,category};
 const key=legacyImageAliases[source]||source;
 if(localImageDefinitions[key]?.[0]===category) return {type:'local',key,category};
 const assigned=nameImageAssignments[category]?.[normalizeText(product.name)];
 return assigned ? {type:'local',key:assigned,category} : {type:'missing',category};
}
export function parseList(value) {
 let parsed=value;
 for(let pass=0;typeof parsed==='string'&&pass<2;pass++) {
  if(!parsed.trim()||parsed.trim()==='null') return [];
  try {parsed=JSON.parse(parsed.trim());} catch {return [parsed];}
 }
 return Array.isArray(parsed)?parsed:parsed==null?[]:[parsed];
}
