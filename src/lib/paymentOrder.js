import { supabase } from "./supabase";
import { assertProductsAvailable } from "./productAvailability";

export function basketIdentity(items) {
  let rows = items;
  for (let pass = 0; typeof rows === "string" && pass < 2; pass++) rows = JSON.parse(rows);
  if (!Array.isArray(rows)) throw new Error("The saved order basket could not be read.");
  return JSON.stringify(rows.map((item) => JSON.stringify({
    id: String(item.id ?? item.product_id ?? item.productId),
    quantity: Number(item.quantity || 1),
    wrapping: String(item.wrapping || ""),
    messageCard: String(item.messageCard || ""),
    addon: String(item.addon || ""),
    message: String(item.message || ""),
  })).sort());
}

export function checkoutIdentity(checkout, items) {
  return JSON.stringify({ basket: basketIdentity(items),
    recipientName: checkout?.recipientName || "", phone: checkout?.phone || "",
    address: checkout?.address || "", deliveryArea: checkout?.deliveryArea || "",
    deliveryDate: checkout?.deliveryDate || "", timeSlot: checkout?.timeSlot || "",
    instructions: checkout?.instructions || "", isForMe: Boolean(checkout?.isForMe),
  });
}

export function getCheckoutReference(storage, checkout, items) {
  const identity = checkoutIdentity(checkout, items);
  const existing = storage.getItem("petaliaOrderReference");
  const previous = storage.getItem("petaliaOrderIdentity");
  if (existing && (!previous || previous === identity)) {
    storage.setItem("petaliaOrderIdentity", identity);
    return existing;
  }
  let reference;
  do { reference = `PTL-${Math.floor(1000 + Math.random() * 9000)}`; }
  while (reference === existing);
  storage.setItem("petaliaOrderReference", reference);
  storage.setItem("petaliaOrderIdentity", identity);
  return reference;
}

// Reuse the same order for the same checkout. A saved order's basket is immutable.
export async function resolvePaymentOrder(user, reference, checkout, items) {
  async function lookup() {
    const { data, error } = await supabase.from("orders")
      .select("id,items,payment_status,status")
      .eq("order_reference", reference).eq("user_id", user.id).maybeSingle();
    if (error) throw error;
    return data;
  }
  function validate(order) {
    if (basketIdentity(order.items) !== basketIdentity(items)) {
      throw new Error("This reference belongs to a different basket. Return to checkout and start a new order.");
    }
    if (["cancelled", "canceled", "refunded"].includes(order.status) ||
        !["pending", "paid"].includes(order.payment_status)) {
      throw new Error("This order cannot accept a payment. Please start a new checkout.");
    }
    return order.id;
  }
  const existing = await lookup();
  if (existing) return validate(existing);
  await assertProductsAvailable(items);
  const { data: id, error } = await supabase.rpc("create_order_secure", {
    p_recipient_name: checkout.recipientName || "", p_phone: checkout.phone || "",
    p_delivery_address: checkout.address || "", p_delivery_area: checkout.deliveryArea || "",
    p_delivery_date: checkout.deliveryDate || null, p_delivery_time: checkout.timeSlot || "",
    p_delivery_instructions: checkout.instructions || "", p_payment_method: checkout.paymentMethod || "khqr",
    p_items: items, p_order_reference: reference,
  });
  if (error) {
    // Another tab may have finished creating this same order first.
    const raced = await lookup();
    if (raced) return validate(raced);
    throw error;
  }
  if (id == null) throw new Error("Order creation returned no order ID.");
  return id;
}
