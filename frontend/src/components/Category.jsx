import grocery from "../assets/grocery.png";
import mobiles from "../assets/mobiles.jpg";
import fashion from "../assets/fashion.png";
import laptops from "../assets/laptops.png";
import toys from "../assets/toys.jpg";

function Categories({ onCategoryClick }) {
  const items = [
    { name: "Grocery", img: grocery },
    { name: "Mobiles", img: mobiles },
    { name: "Fashion", img: fashion },
    { name: "Laptop", img: laptops },
    { name: "Toys", img: toys }
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        background: "#fff",
        padding: "12px 0",
        boxShadow: "0 1px 5px rgba(0,0,0,0.1)"
      }}
    >
      {items.map((item, index) => (
        <div
          key={index}
          onClick={() => onCategoryClick(item.name)} 
          style={{
            textAlign: "center",
            cursor: "pointer",
            transition: "0.2s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <img
            src={item.img}
            alt={item.name}
            style={{
              width: "50px",
              height: "50px",
              objectFit: "contain"
            }}
          />

          <p
            style={{
              margin: "6px 0 0",
              fontSize: "14px",
              fontWeight: "500"
            }}
          >
            {item.name}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Categories;