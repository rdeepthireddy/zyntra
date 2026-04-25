import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import Login from "./Login";
import Products from "./Products";
import Cart from "./Cart";
import Orders from "./Orders";
import Navbar from "./components/Navbar";
import Category from "./components/Category";
import Banner from "./components/Banner";
import Section from "./components/Productsection";
import Footer from "./components/Footer";
import Wishlist from "./Wishlist";
import Checkout from "./checkout";
import OrderSuccess from "./orderSuccess";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.touchAction = "pan-y";
  }, []);

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [checkoutData, setCheckoutData] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const API = import.meta.env.VITE_API_URL;

 
  useEffect(() => {
    if (token) {
      axios.get(`${API}/api/products/`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setProducts(res.data))
      .catch(() => {
        toast.error("Failed to load products");
      });
    }
  }, [token]);


  const fetchCounts = () => {
    if (!token) return;

    axios.get(`${API}/api/cart/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    // .then(res => setCartCount(res.data.length || 0));
       .then(res => {
        const totalItems = res.data.reduce(
          (sum,item)=> sum + item.quantity,0
        );
        setCartCount(totalItems);

       });

    axios.get(`${API}/api/wishlist/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setWishlistCount(res.data.length || 0));
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
      } else {
        const res = await axios.post(
          `${API}/api/wishlist/`,
          { product: productId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWishlist(prev => [...prev, res.data]);
      }

      fetchCounts();
    } catch (err) {
      toast.error("Wishlist action failed");
    }
  };

  useEffect(() => {
    if(token){
      fetchCounts();
    }
  }, [token]);

  const handleProductClick = (product) => {
    navigate("/products");
    setSelectedCategory(product.category_name);
  };
  const handleSearch = () => {
    setSearch(searchInput);
    navigate("/products");
  };
  return (
    <div >
      <Navbar
        token={token}
        setToken={setToken}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        handleSearch={handleSearch}
        setSelectedProduct={setSelectedProduct}
      />
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/" element={
          token && (
            <>
              {!selectedProduct ? (
                <>
                  <Category onCategoryClick={(category) => setActiveCategory(category)} />
                  <Banner />
                  <div style={{ marginTop: "20px" }} />
                    <h2 style={{
                      textAlign: "center",
                      fontSize: "26px",
                      margin: "20px",
                      fontWeight: "600"
                    }}>
                      Shop By Category
                    </h2>
                    {(!activeCategory || activeCategory === "Grocery") && (
                      <Section
                        title="Grocery"
                        products={products.filter(p => p.category_name === "Grocery")}
                        onProductClick={(p) => setSelectedProduct(p)}
                        onViewAll={() => navigate("/products")}
                      />
                    )}
                    {(!activeCategory || activeCategory === "Mobiles") && (
                      <Section
                        title="Mobiles"
                        products={products.filter(p => p.category_name === "Mobiles")}
                        onProductClick={(p) => setSelectedProduct(p)}
                        onViewAll={() => navigate("/products")}
                      />
                    )}
                    {(!activeCategory || activeCategory === "Fashion") && (
                      <Section
                        title="Fashion"
                        products={products.filter(p => p.category_name === "Fashion")}
                        onProductClick={(p) => setSelectedProduct(p)}
                        onViewAll={() => navigate("/products")}
                      />
                    )}
                    {(!activeCategory || activeCategory === "Laptop") && (
                      <Section
                        title="Laptop"
                        products={products.filter(p => p.category_name === "Laptop")}
                        onProductClick={(p) => setSelectedProduct(p)}
                        onViewAll={() => navigate("/products")}
                      />
                    )}
                    {(!activeCategory || activeCategory === "Toys") && (
                      <Section
                        title="Toys"
                        products={products.filter(p => p.category_name === "Toys")}
                        onProductClick={(p) => setSelectedProduct(p)}
                        onViewAll={() => navigate("/products")}
                      />
                    )}
                    <Footer />
                  </>
                ) : (
                  <div 
                    style={{
                      display: "flex",
                      gap: "40px",
                      padding: "40px",
                      background: "#f8f8f8",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: "80vh",
                    }}>
                    <div style={{
                      flex: 1,
                      alignItems: "center",
                      padding: "20px",
                      display: "flex",
                      justifyContent: "center"
                    }}>
                      <div style={{
                        position: "relative",
                        background: "#f9f9f9",
                        padding: "20px",
                        borderRadius: "12px",
                        width: "260px",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
                      }}>
                        <div
                          onClick={() => toggleWishlist(selectedProduct.id)}
                          style={{
                            position: "absolute",
                            top: "3px",
                            right: "-40px",
                            width: "38px",
                            height: "38px",
                            borderRadius: "50%",
                            background: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                            cursor: "pointer",
                            fontSize: "18px"
                          }}
                        >
                          {wishlist.some(w => w.product === selectedProduct.id) ? "❤️" : "🤍"}
                        </div>
                        <img
                          src={selectedProduct.image}
                          alt={selectedProduct.name}
                          style={{ width: "260px", objectFit: "contain" }}
                        />
                      </div>
                    </div>
                  <div style={{
                    flex: 1,
                    textAlign: "left",
                    maxWidth: "1100px",
                    margin: "0 auto"
                  }}>
                    <h2 style={{ fontSize: "24px", marginBottom: "6px" }}>
                      {selectedProduct.name}
                    </h2>
                    <div style={{ display: "flex", gap: "40px",marginTop: "6px",alignItems: "flex-start" }}>
                      <span style={{ fontSize: "20px", fontWeight: "600" }}>
                        ₹{selectedProduct.price}
                      </span>
                      <span style={{ textDecoration: "line-through", color: "#888", fontSize: "14px"}}>
                        ₹{Math.round(selectedProduct.price * 1.3)}
                      </span>
                      <span style={{ 
                        color: "green",
                        fontWeight: "600",
                        padding: "3px 6px",
                        fontSize: "12px",
                        borderRadius: "4px",
                        background: "#e6f4ea",
                      }}>
                        {selectedProduct.discount}% OFF
                      </span>
                    </div>
                    <p style={{ fontSize: "12px", color: "#777", marginTop: "4px"}}>
                      Inclusive of all taxes
                    </p>
                    <div style={{ marginTop: "20px" }}>
                      <h4 style={{fontSize: "16px",marginBottom: "10px"}}>
                        Why shop from your Zyntra ?
                      </h4>
                      <div style={{ 
                        display: "flex", 
                        flexDirection: "column",
                        gap: "12px"
                      }}>
                      <div style={{
                        display:"flex",
                        gap: "10px"
                      }}>
                        🚀
                        <div>
                          <b>Quick and Easy Checkout </b>
                          <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>
                            Add items to your cart and checkout effortlessly.
                          </p>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "10px" }}>
                        🏷️
                        <div>
                          <b>Best offers & Discounts</b>
                          <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
                            Save big with exclusive deals and special offers.
                          </p>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "10px" }}>
                        🎧
                        <div>
                          <b>Friendly Customer Support</b>
                          <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
                            Get 24/7 assistance with any questions or issues.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: "25px", display: "flex", gap: "15px" }}>
                      <button onClick={() => navigate("/cart")}
                        style={{
                          background: "#b42ed9",
                          color: "#fff",
                          padding: "12px 22px",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: "600",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px"
                        }}
                      >
                        🛒 Go to Cart
                      </button>
                      <button onClick={() => navigate("/checkout")}
                        style = {{
                          background: "#b42ed9",
                          color: "#fff",
                          padding: "12px 22px",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: "600",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px"
                        }}
                      >
                        ⚡ Buy Now
                      </button>
                    </div>

                    <div style={{ marginTop: "20px" }}>
                      <button onClick={() => setSelectedProduct(null)}
                        style={{
                          padding:"8px 16px",
                          border: "1px solid #b42ed9",
                          background: "#b42ed9",
                          color: "white",
                          cursor: "pointer",
                          borderRadius: "6px",
                          fontSize: "14px"
                        }}>
                        ← Back
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )
        } />
        <Route path="/products" element={
          <Products
            token={token}
            selectedCategory={selectedCategory}
            search={search}
            fetchCounts={fetchCounts}
          />
        } />
        <Route path="/cart" element={
          <Cart token={token} fetchCounts={fetchCounts} setCheckoutData={setCheckoutData} />
        } />
        <Route path="/orders" element={
          <Orders
            token={token}
            setSelectedOrder={setSelectedOrder}
          />
        } />
        <Route path="/wishlist" element={
          <Wishlist token={token} fetchCounts={fetchCounts} />
        } />
        <Route path="/checkout" element={
          <Checkout
            cartItems={checkoutData?.cartItems || []}
            token={token}
            setOrderData={setOrderData}
          />
        } />
        <Route path="/orderSuccess" element={
          <OrderSuccess orderData={orderData} />
        } />
      </Routes>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

export default App;