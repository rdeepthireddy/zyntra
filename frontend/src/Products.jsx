import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {FaShoppingCart} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Products({ token, selectedCategory, fetchCounts, search}) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("");
  const [price, setPrice] = useState(1000000);
  const [rating, setRating] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [fastDelivery, setFastDelivery] = useState(false);
  const [includeOutOfStock, setIncludeOutOfStock] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [clickedItems, setClickedItems] = useState([]);
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios.get(`${API}/api/products/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setProducts(res.data))
    .catch(() => {
      toast.error("Failed to load products");
    });
  }, [token]);

  useEffect(() => {
    if (!token) return;
    axios.get(`${API}/api/wishlist/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setWishlist(res.data))
    .catch(() =>{
      toast.error("Failed to load wishlist")
    });
  }, [token]);

  useEffect(() => {
  if(token){
    axios.get(
      `${API}/api/cart/`,
      {
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    )
    .then(res=>{
        setCartItems(res.data);
    })
    .catch(() => {
      toast.error("Failed to load products");
    });
  }
  },[token]);

  const addToCart = async (productId) => {
    if (!token) {
      toast.error("Please login first");
      return;
    }
    try {
      const res = await axios.post(
        `${API}/api/cart/add/`,
        { product_id: productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Added to cart");
      setCartItems(prev => [
      ...prev,
      {
        product: productId,
        quantity:1
      }
      ]);
      fetchCounts();

    } catch (err) {
      toast.error("Failed to add");
    }
  };
  const toggleWishlist = async (productId) => {
    try {
      const existing = wishlist.find(w => w.product === productId);
      if (existing) {
        await axios.delete(
          `${API}/api/wishlist/${existing.id}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setWishlist(prev => prev.filter(w => w.product !== productId));
        toast.info("Removed from wishlist ❌");

      } else {
        const res = await axios.post(
          `${API}/api/wishlist/`,
          { product: productId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setWishlist(prev => [...prev, res.data]);
        toast.success("Added to wishlist ❤️");
      }

      fetchCounts();
    } catch {
      toast.error("Wishlist failed ❌");
    }
  };
  let filteredProducts = [...products];
  if (search) {
    filteredProducts = filteredProducts.filter(p =>
      p.name?.toLowerCase().includes(search.toLowerCase())
    );
  }
  if (category !== "All") {
    filteredProducts = filteredProducts.filter(
      p => p.category_name === category
    );
  }
  filteredProducts = filteredProducts.filter(
    p => Number(p.price || 0) <= Number(price)
  );
  if (sort === "low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  }
  if (sort === "high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }
  filteredProducts = filteredProducts.filter(
    p => rating === 0 || Number(p.rating || 0) >= rating
  );
  filteredProducts = filteredProducts.filter(
    p => discount === 0 || Number(p.discount || 0) >= discount
  );
  if (!includeOutOfStock) {
    filteredProducts = filteredProducts.filter(p => p.in_stock !== false);
  }
  if (fastDelivery) {
    filteredProducts = filteredProducts.filter(p => p.fast_delivery === true);
  }
  return (
  <div style={{ display: "flex", marginTop: "30px" }}>
    <div style={{
      width: "20%",
      padding: "20px",
      background: "#fff",
      borderRight: "1px solid #ddd",
      height: "100vh",
      overflowY: "auto"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3>Filter</h3>
        <span
          style={{ color: "red", cursor: "pointer" }}
          onClick={() => {
            setCategory("All");
            setSort("");
            setPrice(1000000);
            setRating(0);
            setDiscount(0);
            setFastDelivery(false);
            setIncludeOutOfStock(true);
          }}
        >
          Clear
        </span>
      </div>

      <h4 style={{ marginTop: "20px" }}>Price</h4>
      <input
        type="range"
        min="0"
        max="1000000"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        style={{ width: "100%" }}
      />

      <h4 style={{ marginTop: "20px" }}>Category</h4>
      {["All", "Grocery", "Mobiles", "Fashion", "Laptop", "Toys"].map(c => (
        <div key={c}>
          <input
            type="radio"
            checked={category === c}
            onChange={() => setCategory(c)}
          />
          {c}
        </div>
      ))}
      <h4 style={{ marginTop: "20px" }}>Sort by</h4>
      <div>
        <input type="radio" checked={sort === "low"} onChange={() => setSort("low")} />Low to High
      </div>
      <div>
        <input type="radio" checked={sort === "high"} onChange={() => setSort("high")} />High to Low
      </div>
      <h4 style={{ marginTop: "20px" }}>Rating</h4>
      {[4,3,2,1].map(r => (
        <div key={r}>
          <input
            type="radio"
            checked={rating === r}
            onChange={() => setRating(r)}
          />
          {r}stars and above
        </div>
      ))}
      <h4 style={{ marginTop: "20px" }}>Discount</h4>
      {[50,30,20].map(d => (
        <div key={d}>
          <input
            type="radio"
            checked={discount === d}
            onChange={() => setDiscount(d)}
          />
          {d}%+
        </div>
      ))}
      <h4 style={{ marginTop: "20px" }}>Additional</h4>
      <div>
        <input
          type="checkbox"
          checked={!includeOutOfStock}
          onChange={() => setIncludeOutOfStock(prev => !prev)}
        />
        Include Out of Stock
      </div>
      <div>
        <input
          type="checkbox"
          checked={fastDelivery}
          onChange={() => setFastDelivery(prev => !prev)}
        />
        Fast Delivery
      </div>
    </div>
    <div style={{ width: "80%", margin: "0 auto" }}>
      <div style={{
        padding: "10px 20px",
        fontSize: "20px",
        fontWeight: "600",
        marginTop: "6px",
        textAlign: "center",
        
      }}>
        {category !== "All" ? category : "All Products"}
      </div>
      <div style={{
        padding: "10px 20px",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "16px"
      }}>
        {filteredProducts.map(p => {
          const isAdded = cartItems.some(
            item => item.product === p.id
          );
          const isClicked = clickedItems.includes(p.id);

          return (
            <div key={p.id}
              style={{
                background: "#fff",
                borderRadius: "12px",
                display: "flex",
                flexDirection: "column",
                minHeight: "260px",
                padding: "10px",
                position: "relative",
                overflow: "hidden",
                transition: " all 0.3s ease",
                transform: "translateY(-6px)",
                boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.12)";
              }}
            >
              {p.fast_delivery && (
                <span style={{
                  position: "absolute",
                  top: "30px",
                  left: "10px",
                  background: "#00c6b7",
                  color: "white",
                  padding: "4px 8px",
                  fontSize: "12px",
                  borderRadius: "5px"
                }}>
                  Express
                </span>
              )}
              <span
                onClick={() => toggleWishlist(p.id)}
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
                {wishlist.some(w => w.product === p.id) ? "❤️" : "🤍"}
              </span>
              {p.discount > 0 && (
                <span style={{
                  position: "absolute",
                  top: "8px",
                  left: "8px",
                  background: "#388e3c",
                  color: "#fff",
                  fontSize: "11px",
                  padding: "3px 6px",
                  borderRadius: "4px"
                }}>
                  {p.discount}% OFF
                </span>
              )}
              <div style={{
                height: "160px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}>
                <img
                  src={p.image || "https://via.placeholder.com/150"}
                  alt={p.name}
                  style={{
                    width: "100%",
                    maxHeight: "100%",
                    objectFit: "contain"
                  }}
                />
              </div>
              <div style={{ padding: "8px 10px", flex: 1 }}>
                <h4 style={{
                  fontSize: "15px",
                  marginBottom: "4px"
                }}>
                  {p.name}
                </h4>
                <div style={{
                  background: "#388e3c",
                  color: "#fff",
                  display: "inline-block",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  margin: "6px 0"
                }}>
                  {p.rating || 4.2} ★
                </div>
                <div style={{
                  display: "flex",
                  gap: "6px"
                }}>
                  <span style={{ fontWeight: "bold" }}>₹{p.price}</span>
                  <span style={{
                    textDecoration: "line-through",
                    color: "#888",
                    fontSize: "12px"
                  }}>
                    ₹{Math.round(p.price * 1.3)}
                  </span>
                </div>
                <div style={{
                  color: "#388e3c",
                  fontSize: "13px"
                }}>
                  {p.discount}% off
                </div>
                <div style={{
                  fontSize: "12px",
                  color: "#777"
                }}>
                   {p.in_stock ? "In Stock" : "Out of Stock"}
                </div>
              </div>
              <button
                onClick={() => {
                  if (!isAdded) {
                    addToCart(p.id);
                  } else {
                      setClickedItems(prev => [...prev, p.id]);
                    setTimeout(() => {
                      navigate("/cart");
                    }, 300);
                  }
                }}
                style={{
                  margin: "8px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  background: isClicked ? "#28a745" : "#fff",
                  color: isClicked ? "#fff" : "#b42ed9",
                  border: "1px solid #b42ed9",
                  padding : "8px"
             
                }}
                onMouseEnter={(e) => {
                  if (!isClicked && !isAdded) {  
                    e.currentTarget.style.background = "#b42ed9";
                    e.currentTarget.style.color = "#fff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isClicked && !isAdded) {
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.color = "#b42ed9";
                  }
                }}
              >
                <FaShoppingCart size={14} />
                {isAdded ? "Go to Cart" : "Add to Cart"}
              </button>
            </div>
          );
        })}

      </div>
    </div>
  </div>
); 
}
export default Products;