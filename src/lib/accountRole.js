import { supabase } from "./supabase";

export async function getAccountDestination(user) {
  if (!user) return "/sign-in";

  const { data: isAdmin, error: adminError } =
    await supabase.rpc("petalia_is_admin");

  if (adminError) throw adminError;

  if (isAdmin === true) return "/admin";

  const { data: shop, error: shopError } = await supabase
    .from("shops")
    .select("id, name")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (shopError) throw shopError;

  return shop ? "/vendor-dashboard" : "/";
}