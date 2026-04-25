import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Orders({ token, setSelectedOrder }) {
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const fetchOrders = () => {
    axios.get(`${API}/api/orders/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setOrders(res.data))
    .catch(() => {
      toast.error("Failed to orders");
    });
  };
  const cancelOrder = async (id) => {
    try {
      await axios.post(
        `${API}/api/order/cancel/${id}/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (err) {
      toast.error("Order cancellation failed");
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div style={{ background: "#f1f3f6", minHeight: "100vh", padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>My Orders</h2>
      {orders.length === 0 && (
        <p style={{ color: "#777" }}>No orders yet</p>
      )}
      {orders.map(order => {
        const status = (order.status || "pending").toLowerCase();

        return (
          <div
            key={order.id}
            onClick={() => {
              setSelectedOrder(order);
              navigate("/orderDetails");
            }}
            style={{
              background: "#fff",
              borderRadius: "12px",
              marginBottom: "20px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
              cursor: "pointer",
              transition: "0.3s"
            }}
          >
            <div style={{
              padding: "15px",
              borderBottom: "1px solid #eee",
              display: "flex",
              justifyContent: "space-between"
            }}>
              <div>
                <strong>Order {order.id}</strong>
                <p style={{ fontSize: "12px", color: "#777" }}>
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>

              <div style={{ fontWeight: "bold" }}>
                ₹{order.total_price}
              </div>
            </div>
            {order.items.map(item => (
              <div key={item.id} style={{
                display: "flex",
                alignItems: "center",
                padding: "20px",
                borderBottom: "1px solid #eee",
                gap: "20px"
              }}>
                <img
                  src={item.product_image}
                  alt={item.product_name}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "contain",
                    borderRadius: "6px",
                    background: "#f9f9f9",
                    padding: "5px"
                  }}
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: "0 0 5px 0" }}>
                    {item.product_name}
                  </h4>
                  <p style={{ color: "#555", margin: "4px 0" }}>
                    Qty: {item.quantity}
                  </p>
                  <div style={{
                    fontSize: "13px",
                    marginTop: "8px",
                    color: "#555"
                  }}>
                    <span style={{ color: "green" }}>✔ Placed</span>{" "}
                    <span style={{
                      color: status !== "pending" ? "green" : "#aaa"
                    }}>
                      → Shipped
                    </span>{" "}
                    <span style={{
                      color: status === "delivered" ? "green" : "#aaa"
                    }}>
                      → Delivered
                    </span>
                  </div>
                  <p style={{
                    marginTop: "8px",
                    fontWeight: "bold",
                    color:
                      status === "delivered" ? "green" :
                      status === "shipped" ? "#b42ed9" :
                      status === "cancelled" ? "red" :
                      "#b42ed9"
                  }}>
                    {status === "pending" && "Order Placed"}
                    {status === "shipped" && "Shipped"}
                    {status === "delivered" && "Delivered"}
                    {status === "cancelled" && "Cancelled"}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{
                    margin: 0,
                    fontWeight: "bold",
                    fontSize: "16px"
                  }}>
                    ₹{item.price}
                  </p>
                  {status !== "delivered" && status !== "cancelled" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        cancelOrder(order.id);
                      }}
                      style={{
                        marginTop: "10px",
                        background: "#b42ed9",
                        color: "#fff",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontSize: "13px"
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default Orders;