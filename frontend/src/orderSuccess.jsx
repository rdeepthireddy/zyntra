import { FaCheckCircle, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function OrderSuccess({ orderData }) {
  const navigate = useNavigate();
  if (!orderData) {
    return <h2 style={{ textAlign: "center", marginTop: "100px" }}>No order data</h2>;
  }

  return (
    <div style={{
      background: "#f1f3f6",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <div style={{
        background: "#fff",
        padding: "40px",
        borderRadius: "12px",
        width: "420px",
        textAlign: "center",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
      }}>
        <FaCheckCircle size={60} color="green" />
        <h2 style={{ marginTop: "15px" }}>
          Order Placed Successfully! 🎉
        </h2>
        <p style={{ color: "#777", marginTop: "5px" }}>
          Thank you for shopping with <strong>Zyntra</strong>.
        </p>
        <p style={{ fontSize: "14px", color: "#2874f0" }}>
          Order ID: #{orderData.orderId}
        </p>
        <div style={{
          textAlign: "left",
          marginTop: "20px",
          fontSize: "14px",
          lineHeight: "1.8"
        }}>
          <p><strong>Total Amount:</strong> ₹{orderData.total}</p>
          <p><strong>Payment Method:</strong> {orderData.payment}</p>
          {orderData?.address ? (
            <>
              {orderData.address.name} <br />
              {orderData.address.addressLine} <br />
              {orderData.address.city}, {orderData.address.state} - {orderData.address.pincode}
            </>
          ) : (
            <p style={{ color: "red" }}>No address provided</p>
          )}
        </div>
        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: "25px",
            background: "#b42ed9",
            color: "#fff",
            border: "none",
            padding: "12px 20px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            width: "100%"
          }}
        >
          <FaShoppingCart />
          Continue Shopping
        </button>
        <button
          onClick={() => navigate("/orders")}
          style={{
            marginTop: "10px",
            background: "#fff",
            color: "#b42ed9",
            border: "2px solid #b42ed9",
            padding: "12px 20px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            width: "100%",
            transition: "0.3s"
          }}
          onMouseOver={(e) => {
            e.target.style.background = "#b42ed9";
            e.target.style.color = "#fff";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "#fff";
            e.target.style.color = "#b42ed9";
          }}
        >
          View Orders
        </button>

      </div>
    </div>
  );
}

export default OrderSuccess;