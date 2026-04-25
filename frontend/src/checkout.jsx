import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function Checkout({ cartItems, token,setOrderData}) {
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [payment, setPayment] = useState("cod");
  const [hover, setHover] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [savedAddress, setSavedAddress] = useState(null);
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: ""
  });
  const items = cartItems || [];
  const subtotal = items.reduce(
    (acc, item) => acc + (item.price || 0) * item.quantity,
    0
  );
  const delivery = subtotal < 150 ? 30 : 0 ;
  const finalTotal = subtotal + delivery;
  const handlePayment = async () => {
    let finalAddress = savedAddress;
    if (!finalAddress) {
      if (address.name && address.phone && address.addressLine) {
        finalAddress = address;   
        setSavedAddress(address);
      } else {
        toast.error("Fill address first ❌");
        return;
      }
    }
    try {
      const res = await axios.post(
        `${API}/api/order/place/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data && res.data.order_id) {
        toast.success("Order placed successfully 🎉");

        setOrderData({
          items: cartItems,
          total: finalTotal,
          address: finalAddress,   
          payment: payment,
          orderId: res.data.order_id
        });
        navigate("/orderSuccess");

      } else {
        toast.error("Order failed ❌");
      }
    } catch (err) {
      toast.error("Payment failed ❌");
    }
  };
  const handleSaveAddress = () => {
    if (!address.name || !address.phone || !address.addressLine) {
      alert("Fill all fields");
      return;
    }
    setSavedAddress(address);
    setShowAddressForm(false);
  };


  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    outline: "none"
  };

  const saveBtn = {
    background: "#b42ed9",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    width: "150px"
  };

  return (
    <div style={{
      display: "flex",
      gap: "30px",
      padding: "40px",
      background: "#f5f5f5",
      minHeight: "100vh"
    }}>
      <div style={{
        flex: 2,
        background: "#fff",
        padding: "20px",
        borderRadius: "10px"
      }}>
        <h2>Shipping Address</h2>
        {!showAddressForm && !savedAddress && (
          <>
            <p>No address found. Please add one.</p>
            <button
              onClick={() => setShowAddressForm(true)}
              style={saveBtn}
            >
              Add Address
            </button>
          </>
        )}
        {showAddressForm && (
          <div style={{ marginTop: "20px" }}>
            <input
              placeholder="Full Name"
              value={address.name}
              onChange={(e) =>
                setAddress({ ...address, name: e.target.value })
              }
              style={inputStyle}
            />
            <input
              placeholder="Phone Number"
              value={address.phone}
              onChange={(e) =>
                setAddress({ ...address, phone: e.target.value })
              }
              style={inputStyle}
            />
            <textarea
              placeholder="Address Line"
              value={address.addressLine}
              onChange={(e) =>
                setAddress({ ...address, addressLine: e.target.value })
              }
              style={{ ...inputStyle, height: "70px" }}
            />
            <input
              placeholder="City"
              value={address.city}
              onChange={(e) =>
                setAddress({ ...address, city: e.target.value })
              }
              style={inputStyle}
            />
            <input
              placeholder="State"
              value={address.state}
              onChange={(e) =>
                setAddress({ ...address, state: e.target.value })
              }
              style={inputStyle}
            />
            <input
              placeholder="Pincode"
              value={address.pincode}
              onChange={(e) =>
                setAddress({ ...address, pincode: e.target.value })
              }
              style={inputStyle}
            />
            <button onClick={handleSaveAddress} style={saveBtn}>
              Save Address
            </button>
          </div>
        )}
        {savedAddress && (
          <div style={{ marginTop: "20px" }}>
            <p><strong>{savedAddress.name}</strong></p>
            <p>{savedAddress.phone}</p>
            <p>{savedAddress.addressLine}</p>
            <p>
              {savedAddress.city}, {savedAddress.state} - {savedAddress.pincode}
            </p>
          </div>
        )}
        <hr style={{ margin: "20px 0" }} />
        <h2>Payment Method</h2>
        <div>
          <label>
            <input
              type="radio"
              checked={payment === "cod"}
              onChange={() => setPayment("cod")}
            />
            Cash on Delivery (COD)
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              checked={payment === "upi"}
              onChange={() => setPayment("upi")}
            />
            UPI / PhonePe / Google Pay
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              checked={payment === "card"}
              onChange={() => setPayment("card")}
            />
            Debit / Credit Card
          </label>
        </div>
      </div>
      <div style={{
        flex: 1,
        background: "#fff",
        padding: "20px",
        borderRadius: "10px"
      }}>
        <h2>Order Summary</h2>
        <hr />

        <p>Items: {items.length}</p>
        <p>Subtotal: ₹{subtotal}</p>
        {subtotal < 150 && (
        <p style={{color:"red"}}>
        Add ₹{150-subtotal} more for free delivery
        </p>
        )}
        <p>Delivery charge: {delivery === 0 ? "Free" : `₹${delivery}`}</p>
        <hr />
        <h3>Total Payable: ₹{finalTotal}</h3>
        <button onClick={handlePayment}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            width: "100%",
            background: hover ? "#b42ed9" : "#fff",
            color: hover ? "#fff" : "#b42ed9",
            border: "2px solid #b42ed9",
            padding: "12px",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "0.3s",
            fontWeight: "bold",
            marginTop: "15px"
          }}
        >
          Pay Now
        </button>
      </div>
    </div>
  );
}

export default Checkout;