import { useRef, useState } from "react";
import "./Section.css";

function Section({ title, products = [], onProductClick,onViewAll }) {
  const scrollRef = useRef();
  const [showArrows, setShowArrows] = useState(false);
  const safeProducts = Array.isArray(products) ? products : [];
  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -300 : 300,
      behavior: "smooth"
    });
  };

  return (
    <div style={{
      display: "flex",
      background: "#fff",
      margin: "20px",
      padding: "20px",
      borderRadius: "10px",
      gap:"20px",
      border:"1px solid #eee",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
    }}>
      <div style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
        borderRadius: "10px",
        padding: "20px"
      }}>
        <h2 style={{
          fontSize: "22px",
          fontWeight: "600",
          marginBottom: "10px"
        }}>
          {title}
        </h2>

        <button onClick= {() => onViewAll(title)}
        style={{
          padding: "8px 14px",
          background: "#b42ed9",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "12px"
        }}>
          VIEW ALL
        </button>
      </div>

      <div
        style={{ width: "80%", position: "relative" }}
        onMouseEnter={() => setShowArrows(true)}
        onMouseLeave={() => setShowArrows(false)}
      >
        {showArrows && (
          <>
            <button onClick={() => scroll("left")} style={arrowStyle("left")}>‹</button>
            <button onClick={() => scroll("right")} style={arrowStyle("right")}>›</button>
          </>
        )}

        <div
          ref={scrollRef}
          className="scroll-container"
          style={{
            display: "flex",
            gap: "16px",
            padding: "10px",
            overflowX: "auto"
          }}
        >
          {safeProducts.map((p, index) => (
            <ProductCard
              key={p?.id || index}
              product={p}
              onProductClick={onProductClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, onProductClick }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onClick={() => onProductClick(product)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        minWidth: "170px",
        padding: "12px",
        borderRadius: "10px",
        background: "#fff",
        boxShadow: hover
          ? "0 4px 15px rgba(0,0,0,0.15)"
          : "0 1px 5px rgba(0,0,0,0.08)",
        transition: "0.3s",
        cursor: "pointer"
      }}
    >

      <div style={{
        height: "180px",
        width:"100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow:"hidden"
      }}>
        <img
          src={product?.image || "https://via.placeholder.com/150"}
          alt={product?.name}
          style={{
            height:"100%",
            width: "100%",
            objectFit: "contain",
          }}
        />
      </div>

      <div style={{
        fontSize: "16px",
        marginTop: "8px",
        height: "34px",
        overflow: "hidden"
      }}>
        {product?.name}
      </div>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "5px",
        marginTop: "4px"
      }}>
        <span style={{
          background: "#388e3c",
          color: "#fff",
          fontSize: "11px",
          padding: "2px 5px",
          borderRadius: "3px"
        }}>
          {product?.rating || 4.1} ★
        </span>
      </div>
      <div style={{ marginTop: "6px" }}>
        <div>
          <span style={{ fontWeight: "bold", fontSize: "15px" }}>
            ₹{product?.price}
          </span>

          <span style={{
            marginLeft: "6px",
            textDecoration: "line-through",
            color: "#878787",
            fontSize: "12px"
          }}>
            ₹{product?.original_price || Math.round(product.price * 1.3)}
          </span>
        </div>
        <div>
          <span style={{
            marginLeft: "6px",
            color: "#388e3c",
            fontSize: "12px",
            fontWeight: "500"
          }}>
            {product?.discount || 20}% off
          </span>
        </div>
      </div>
    </div>
  );
}
const arrowStyle = (side) => ({
  position: "absolute",
  top: "50%",
  [side]: "5px",
  transform: "translateY(-50%)",
  zIndex: 2,
  background: "#fff",
  border: "1px solid #ddd",
  borderRadius: "50%",
  width: "30px",
  height: "30px",
  cursor: "pointer"
});
export default Section;

