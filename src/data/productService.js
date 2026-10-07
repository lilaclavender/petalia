import { supabase } from '../lib/supabase';
import catalogImages from './catalogProductImages';
import { chooseProductImage, normalizeCategory, parseList } from './catalogImageRules';

const placeholderSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"><rect width="600" height="600" fill="#f3eaf0"/><rect x="215" y="160" width="170" height="150" rx="20" fill="none" stroke="#b48a9f" stroke-width="7"/><circle cx="260" cy="205" r="15" fill="#b48a9f"/><path d="M230 285l48-50 35 32 36-45 22 63" fill="none" stroke="#b48a9f" stroke-width="7" stroke-linejoin="round"/><text x="300" y="370" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#72586b">Photo coming soon</text></svg>`;
const placeholderImage = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(placeholderSvg)}`;

export const getProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_hidden', false)
    .order('id', { ascending: true });

  if (error) {
    console.error('Error loading products:', error);
    throw error;
  }

  return (data || []).map((product) => {
    const choice = chooseProductImage(product);
    const image = choice.type === 'uploaded'
      ? choice.source
      : choice.type === 'local'
        ? catalogImages[choice.key] || placeholderImage
        : placeholderImage;

    return {
      ...product,
      category: normalizeCategory(product.category),
      image,
      imageSource: choice.type,
      originalImage: product.image,
      emotion: parseList(product.emotion),
      occasion: parseList(product.occasion),
      giftStyles: parseList(product.gift_styles),
      flowerColor: product.flower_color || null,
    };
  });
};
