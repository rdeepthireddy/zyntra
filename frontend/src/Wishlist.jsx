import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function Wishlist({ token, fetchCounts }) {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if(token){
      fetchWishlist();
    }
  }, [token]);

  const fetchWishlist = () => {
    if (!token) {
      toast.error("please login first");
      return;
    }
    axios.get(`${API}/api/wishlist/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      console.log ("Wishlist API:",res.data);
      console.log(res.data);
      setWishlist(res.data);
    })
    .catch(() => {
      toast.error("Failed to load wishlist");
    });
  };

  const removeItem = (id) => {
    axios.delete(`${API}/api/wishlist/${id}/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      fetchWishlist();
      fetchCounts();
    });
  };

  const addToCart = async (productId) => {
    try {
      await axios.post(
        `${API}/api/cart/add/`,
        { product_id: productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Added to cart ✅");
      fetchCounts();
    } catch (err) {
      toast.error("Failed ❌");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ textAlign: "center" }}>My Wishlist</h1>
      {wishlist.length === 0 ? (
        <div style={{
          textAlign: "center",
          marginTop: "80px"
        }}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
            alt="empty"
            style={{ width: "180px", marginBottom: "20px" }}
          />
          <h2>Your Wishlist is Empty</h2>
          <p style={{ color: "#777", marginBottom: "20px" }}>
            Looks like you haven't added anything yet.
          </p>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "#b42ed9",
              color: "#fff",
              border: "none",
              padding: "12px 25px",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px,1fr))",
          gap: "20px",
          marginTop: "30px"
        }}>
          {wishlist.map(item => {
            const imageUrl = item.product_image?.startsWith("http")
              ? item.product_image
              : `${API}${item.product_image}`;

            const price = item.price || 1750;
            const originalPrice = Math.floor(price * 1.4);
            const discount = Math.floor(((originalPrice - price) / originalPrice) * 100);
            const rating = item.rating || 4.5;

            return (
              <div key={item.id} style={{
                background: "#fff",
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                position: "relative"
              }}>
                <span
                  onClick={() => removeItem(item.id)}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    background: "#eee",
                    borderRadius: "50%",
                    padding: "8px",
                    cursor: "pointer"
                  }}
                >
                  ✖
                </span>
                <div style={{ background: "#f5f5f5", padding: "20px" }}>
                  <img
                    src={imageUrl}
                    alt=""
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "contain"
                    }}
                  />
                </div>
                <div style={{ padding: "15px" }}>
                  <h3>{item.product_name}</h3>
                  <p style={{ color: "#555" }}>
                    {item.category_name || "Category"}
                  </p>
                  <div>
                    <strong>₹{price}</strong>
                    <span style={{
                      textDecoration: "line-through",
                      color: "#888",
                      marginLeft: "8px"
                    }}>
                      ₹{originalPrice}
                    </span>

                    <span style={{
                      color: "orange",
                      marginLeft: "8px"
                    }}>
                      ({discount}% OFF)
                    </span>
                  </div>

                  <div style={{ marginTop: "5px" }}>
                    {rating} ⭐
                  </div>

                  <button
                    onClick={() => addToCart(item.product)}
                    style={{
                      width: "100%",
                      background: "#b42ed9",
                      color: "#fff",
                      border: "none",
                      padding: "12px",
                      borderRadius: "5px",
                      marginTop: "10px",
                      cursor: "pointer"
                    }}
                  >
                    🛒 Add to Cart
                  </button>
                </div>

              </div>
            );
          })}

        </div>
      )}
    </div>
  );
}

export default Wishlist;