import logo from "../assets/logo.png";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Navbar({
  token,
  setToken,
  cartCount,
  wishlistCount,
  searchInput,
  setSearchInput,
  handleSearch
}) {

  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  return (
    <nav style={{
      backgroundColor: "#b42ed9",
      padding: "10px 20px",
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      boxSizing: "border-box",
      zIndex: 9999,
      width:"100%"
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>

        <Link
          to="/"
          onClick={()=> setSelectedProduct(null)}
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "1px",
            textDecoration: "none"
          }}>
          <img 
            src={logo} 
            alt="logo" 
            style={{ 
              height: "38px",
              cursor: "pointer",
            }} />
          <span style= {{
            fontSize: "28px", 
            fontWeight: "700",
            letterSpacing: "0.5px", 
            color :"#fff",
            cursor: "pointer",
            marginLeft: "2px"
          }}>
             Zyntra
          </span>
        </Link>
        <div style={{
          width: "40%",
          display: "flex",
          alignItems: "center",
          background: "#f1f3f6",
          padding: "5px 10px",
          borderRadius: "8px"
        }}>
          <input
            type="text"
            placeholder="Search for products or categories"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{
              flex: 1,
              padding: "8px",
              background: "transparent",
              border: "none",
              outline: "none"
            }}
          />

          <button
            onClick={handleSearch}
            style={{
              background: "#b42ed9",
              color: "#fff",
              border: "none",
              padding: "8px 15px",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Search
          </button>
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "25px"
        }}>

          {token ? (
            <>
              <span style={{ color: "white", fontWeight: "bold" }}>
                Hi, {username}
              </span>
              <div
                onClick={() => navigate("/wishlist")}
                style={{ position: "relative", cursor: "pointer" }}
              >
                <FaHeart size={22} color="#fff" />
                <span style={badgeStyle}>
                  {wishlistCount}
                </span>
              </div>
              <div
                onClick={() => navigate("/cart")}
                style={{ position: "relative", cursor: "pointer" }}
              >
                <FaShoppingCart size={22} color="#fff" />
                <span style={badgeStyle}>
                  {cartCount}
                </span>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("username");
                  setToken(null);
                  navigate("/"); 
                }}
                style={logoutStyle}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              style={loginStyle}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

const badgeStyle = {
  position: "absolute",
  top: "-8px",
  right: "-8px",
  background: "#4287f5",
  color: "#fff",
  borderRadius: "50%",
  padding: "2px 6px",
  fontSize: "12px",
  fontWeight: "bold"
};

const logoutStyle = {
  background: "none",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "bold"
};

const loginStyle = {
  background: "none",
  color: "white",
  border: "none",
  padding: "6px 15px",
  fontWeight: "bold",
  cursor: "pointer",
  borderRadius: "5px"
};