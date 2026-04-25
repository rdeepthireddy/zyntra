import { useState, useEffect } from "react";
import banner1 from "../assets/banner1.png";
import banner2 from "../assets/banner2.png";
import banner3 from "../assets/banner3.png";

function Banner() {
  const images = [banner1, banner2, banner3];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);


  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <div style={{
      width: "100%",
      position: "relative",
      overflow: "hidden",
      borderRadius: "0",
      margin: "0",
      height:"300px"

    }}>
      <img
        src={images[index]}
        alt="banner"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          userSelect: "none"

        }}
      />
      <button onClick={prevSlide} style={arrowStyle("left")}>
        ‹
      </button>
      <button onClick={nextSlide} style={arrowStyle("right")}>
        ›
      </button>
    </div>
  );
}
const arrowStyle = (side) => ({
  position: "absolute",
  top: "50%",
  [side]: "15px",
  transform: "translateY(-50%)",
  background: "#fff",
  color: "#000",
  border: "none",
  borderRadius: "50%",
  width: "40px",
  height: "40px",
  cursor: "pointer",
  fontSize: "22px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
});

export default Banner;