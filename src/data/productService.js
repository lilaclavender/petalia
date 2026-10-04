import { supabase } from "../lib/supabase";
import productImages from "./productImages";

export const getProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error loading products:", error);
    throw error;
  }

  return data.map((product) => {
    const databaseImage = product.image;

    // A real uploaded image from Supabase Storage
    const hasRealImageUrl =
      typeof databaseImage === "string" &&
      (databaseImage.startsWith("http://") ||
        databaseImage.startsWith("https://"));

    // Old products use local images mapped by product ID.
    // New seller-created products use their Supabase Storage URL.
    const resolvedImage = hasRealImageUrl
      ? databaseImage
      : productImages[Number(product.id)] || databaseImage;

    return {
      ...product,

      image: resolvedImage,

      giftStyles: product.gift_styles || [],

      flowerColor: product.flower_color || null,
    };
  });
};
