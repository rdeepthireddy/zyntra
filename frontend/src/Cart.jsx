import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Cart({ token, fetchCounts, setCheckoutData}) {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [active, setActive] = useState(false);
  const API = import.meta.env.VITE_API_URL;
  const fetchCart = () => {
    if (!token){
      toast.error("please login first");
      return;
    }
    axios.get(`${API}/api/cart/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setCartItems(res.data))
    .catch(() => {
      toast.error("Failed to load products");
    });
  };

  useEffect(() => {
    if (token) fetchCart();
  }, [token]);

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    axios.put(
      `${API}/api/cart/update/${id}/`,
      { quantity },
      { headers: { Authorization: `Bearer ${token}` }}
    ).then(() => {
      fetchCart();
      fetchCounts();
    });
  };

  const removeItem = (id) => {
    axios.delete(
      `${API}/api/cart/update/${id}/`,
      { headers: { Authorization: `Bearer ${token}` }}
    ).then(() => {
      fetchCart();
      fetchCounts();
    });
  };

  const moveToWishlist = async (item) => {
    try {
      const productId = item.product || item.product_id;
      if (!productId) {
        toast.error("Product ID missing");
        return;
      }
      await axios.post(
        `${API}/api/wishlist/`,
        { product: productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await axios.delete(
        `${API}/api/cart/update/${item.id}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Moved to wishlist ❤️");
      fetchCart();
      fetchCounts();

    } catch (err) {
      toast.error("Failed ❌");
    }
  };

  const placeOrder = () => {
    axios.post(
      `${API}/api/order/place/`,
      {},
      { headers: { Authorization: `Bearer ${token}` }}
    ).then(() => {
      fetchCart();
      fetchCounts();
    });
  };
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * item.quantity,
    0
  );
  const discount = Math.floor(totalPrice * 0.15);
  const delivery = cartItems.length === 0 ? 0 : (totalPrice > 1000 ? 0 : 150);
  const finalAmount = totalPrice - discount + delivery;

  const btn = {
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    border: "1px solid #ccc",
    background: "#fff",
    cursor: "pointer"
  };

  const removeBtn = {
    background: "#b42ed9",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer"
  };

  const wishlistBtn = {
    border: "1px solid #b42ed9",
    color: "#b42ed9",
    padding: "10px 15px",
    borderRadius: "5px",
    background: "#fff",
    cursor: "pointer"
  };

  return (
    <div style={{ padding: "30px", background: "#f1f3f6", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center" }}>My Cart</h1>
      {cartItems.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "80px" }}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
            alt="empty cart"
            style={{ width: "220px", marginBottom: "20px" }}
          />
          <h2>Your cart is empty</h2>
          <p style={{ color: "#777", marginBottom: "20px" }}>
            Just Relax, let us help you find some great products.
          </p>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "#b42ed9",
              color: "#fff",
              border: "none",
              padding: "12px 30px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", gap: "30px", marginTop: "30px" }}>
          <div style={{ flex: 2 }}>
            {cartItems.map(item => {
              const imageUrl = item.product_image?.startsWith("http")
                ? item.product_image
                : `${API}${item.product_image}`;

              return (
                <div key={item.id} style={{
                  display: "flex",
                  background: "#fff",
                  alignItems: "flex-start",
                  padding: "20px",
                  gap: "25px",
                  borderRadius: "10px",
                  marginBottom: "20px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }}>

                  <img 
                    src={imageUrl} 
                    alt="" 
                    style={{ 
                      width: "180px",
                      height: "180px",
                      objectFit: "contain"
                    }} />

                  <div style={{ marginLeft: "20px", flex:1 }}>
                    <h3>{item.product_name}</h3>
                    <h3>₹{item.price}</h3>

                    <div style={{ marginTop: "15px", display: "flex", alignItems: "center" }}>
                      <button style={{backgroundColor:"#b42ed9",color:"white",borderRadius: "50%",width:"30px",height:"30px" ,border: "gray"}} 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}>-
                      </button>
                      <span style={{ margin: "0 15px" }}>{item.quantity}</span>
                      <button style={{backgroundColor:"#b42ed9",color:"white",borderRadius: "50%",width:"30px",height:"30px" ,border: "gray"}} 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}>+
                      </button>
                    </div>

                    <div style={{ marginTop: "20px", display: "flex", gap: "15px" }}>
                      <button style={removeBtn} onClick={() => removeItem(item.id)}>
                        Remove
                      </button>

                      <button style={wishlistBtn} onClick={() => moveToWishlist(item)}>
                        Move to Wishlist
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{
            flex: 1,
            background: "#fff",
            padding: "20px",
            borderRadius: "10px",
            height: "fit-content"
          }}>
            <h2>Price Details</h2>
            <hr />
            <p>Total Items: {cartItems.length}</p>
            <p>Price: ₹{totalPrice}</p>
            <p>Discount: -₹{discount}</p>
            <p>Delivery: ₹{delivery}</p>
            <hr />
            <h3>Total Amount: ₹{finalAmount}</h3>
            <p style={{ color: "green" }}>You will save ₹{discount}</p>
            <button
              onClick={() => {
                setActive(true);
                setCheckoutData({
                  cartItems: cartItems,
                }); 
                navigate("/checkout")
              }}
              onMouseEnter={(e) => {
                if (!active) 
                  e.target.style.background = "#b42ed9";
                  e.target.style.color = "#fff"

              }}
              onMouseLeave={(e) => {
                if (!active) 
                  e.target.style.background = "#fff";
                  e.target.style.color = "#b42ed9";

              }}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "0.3s",
                background: active ? "#b42ed9" : "#fff",
                color: active ? "#fff" : "#b42ed9",
                border: "2px solid #b42ed9"
              }}
              >
                Proceed to Checkout
            </button>
          </div>

        </div>
      )}
    </div>
  );
}

export default Cart;