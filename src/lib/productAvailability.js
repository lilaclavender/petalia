import { supabase } from "./supabase";

// This improves the message in the UI. The database also checks new orders.
export async function assertProductsAvailable(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Your basket is empty.");
  }
  const ids = [...new Set(items.map((item) => String(item.id)))];
  if (ids.some((id) => !/^[0-9]+$/.test(id))) {
    throw new Error("Your basket contains an invalid product. Please update your basket.");
  }
  const { data, error } = await supabase.from("products")
    .select("id").in("id", ids).eq("is_hidden", false);
  if (error) throw new Error("Could not check product availability. Please try again.");
  const available = new Set((data || []).map((product) => String(product.id)));
  if (ids.some((id) => !available.has(id))) {
    throw new Error("A product in your basket is unavailable. Please remove it from your basket before checkout.");
  }
}
