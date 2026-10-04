
import { useNavigate } from "react-router-dom";

function OrderConfirmation() {
  const navigate = useNavigate();

  const paymentData = JSON.parse(
    localStorage.getItem("petaliaPayment") || "null"
  );

  if (!paymentData) {
    return (
      <div className="page-content" style={{ textAlign: "center", padding: "100px 20px" }}>
        <h2>No order found</h2>
        <p>Please place an order first.</p>
        <button onClick={() => navigate("/shop")}>
          Continue Shopping
        </button>
      </div>
    );
  }

  const { orderReference, paymentMethod, total, status } = paymentData;

  return (
    <div
      style={{
        minHeight: "75vh",
        background: "#EEE7F1",
        padding: "70px 20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "650px",
          background: "#FFFAF7",
          borderRadius: "24px",
          padding: "45px",
          textAlign: "center",
          boxShadow: "0 12px 35px rgba(110, 83, 111, 0.08)",
        }}
      >
        <p
          style={{
            color: "#D35B8C",
            fontSize: "12px",
            letterSpacing: "2px",
            fontWeight: "600",
          }}
        >
          PETALIA · ORDER CONFIRMATION
        </p>

        <h1
          style={{
            color: "#6E536F",
            fontFamily: "Georgia, serif",
            fontSize: "34px",
            margin: "20px 0 12px",
          }}
        >
          Your gift is on its way to becoming a special moment.
        </h1>

        <p style={{ color: "#8D798C", lineHeight: "1.7" }}>
          Your order has been placed successfully.
          Payment is still pending and has not been verified.
        </p>

        <div
          style={{
            margin: "30px 0",
            padding: "25px",
            background: "#F8EEF1",
            borderRadius: "16px",
            textAlign: "left",
          }}
        >
          <p><strong>Order Reference:</strong> {orderReference}</p>

          <p>
            <strong>Payment Method:</strong>{" "}
            {paymentMethod?.toUpperCase()}
          </p>

          <p>
            <strong>Total:</strong> ${Number(total).toFixed(2)}
          </p>

          <p>
            <strong>Payment Status:</strong>{" "}
            <span style={{ color: "#A36F7E", fontWeight: "600" }}>
              {status === "paid" ? "Paid" : "Pending"}
            </span>
          </p>
        </div>

        <p
          style={{
            fontSize: "13px",
            color: "#8D798C",
            lineHeight: "1.7",
          }}
        >
          Please complete your payment using the instructions
          provided by the seller. Your order will remain pending
          until payment is verified.
        </p>

        <button
          onClick={() => navigate("/shop")}
          style={{
            marginTop: "25px",
            padding: "14px 35px",
            border: "none",
            borderRadius: "30px",
            background: "#D35B8C",
            color: "#fff",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default OrderConfirmation;
