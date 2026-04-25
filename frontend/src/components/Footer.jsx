function Footer() {
  return (
    <div style={{ background: "#172337", color: "white", padding: "40px 60px" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(6, 1fr)",
        gap: "20px",
        marginBottom: "30px"
      }}>
        <div>
          <h4>ABOUT</h4>
          <p>Contact Us</p>
          <p>About Us</p>
          <p>Careers</p>
          <p>Zyntra Stories</p>
          <p>Press</p>
          <p>Zyntra Wholesales</p>
          <p>Coporate Information</p>
        </div>

        <div>
          <h4>HELP</h4>
          <p>Payments</p>
          <p>Shipping</p>
          <p>Cancellation</p>
          <p>FAQ</p>
          <p>Report Infringement</p>
        </div>

        <div>
          <h4>CONSUMER POLICY</h4>
          <p>Cancellation and Return</p>
          <p>Terms Of Use</p>
          <p>Security</p>
          <p>Privacy</p>
          <p>Sitemap</p>
        </div>

        <div>
          <h4>SOCIAL</h4>
          <p>Facebook</p>
          <p>Twitter</p>
          <p>YouTube</p>
        </div>

        <div>
          <h4>Mail Us:</h4>
          <p>Zyntra Internet Pvt Ltd,</p>
          <p>Bangalore, India</p>
        </div>

        <div>
          <h4>Registered Office Address:</h4>
          <p>Bangalore, India</p>
        </div>

      </div>

      <div style={{
        borderTop: "1px solid gray",
        paddingTop: "20px",
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap"
      }}>
        <p>Become a Seller</p>
        <p>Advertise</p>
        <p>Gift Cards</p>
        <p>Help Center</p>
        <p>© 2026 Zyntra.com</p>
      </div>

    </div>
  );
}

export default Footer;