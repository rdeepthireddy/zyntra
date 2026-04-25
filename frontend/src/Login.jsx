import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

function Login({ setToken }) {
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: ""
  });

  const handleSubmit = async () => {
    try {
      if (!isLogin) {
        if (form.password !== form.confirmPassword) {
          alert("Passwords do not match");
          return;
        }
      }
      const url = isLogin
        ? `${API}/api/login/`
        : `${API}/api/register/`;

      const payload = {
        username: form.username,
        password: form.password
      };
      const res = await axios.post(url, payload);
      if (isLogin) {
        const token = res.data.access;
        setToken(token);
        localStorage.setItem("token", token);
        localStorage.setItem("username", form.username);
        toast.success("Login successful");
        navigate("/")
      }
      else {
        toast.success("Signup successful! Now login ✅");
        setIsLogin(true);
      }
    } catch (err) {
      toast.error("Signup is Failed");
      const errorData = err.response?.data;
      if (errorData?.username) {
        alert(errorData.username[0]);
      } else if (errorData?.password) {
        alert(errorData.password[0]);
      } else if (errorData?.detail) {
        alert(errorData.detail);
      } else {
        alert("Login/Signup failed");
      }
    }
  };
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.tabs}>
          <span
            style={isLogin ? styles.activeTab : styles.tab}
            onClick={() => setIsLogin(true)}
          >
            Login
          </span>

          <span
            style={!isLogin ? styles.activeTab : styles.tab}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </span>
        </div>
        <input
          type="text"
          placeholder="Enter your username"
          style={styles.input}
          value={form.username}
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />
        <div style={styles.passwordBox}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            style={{ ...styles.input, marginBottom: 0 }}
            value={form.password}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                password: e.target.value
              }))
            }
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={styles.eye}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {!isLogin && (
          <input
            type="password"
            placeholder="Confirm your password"
            style={styles.input}
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
          />
        )}
        <button style={styles.button} onClick={handleSubmit}>
          {isLogin ? "Login" : "Create Account"}
        </button>

      </div>
    </div>
  );
}

export default Login;

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f3f4f6"
  },
  card: {
    width: "350px",
    background: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)"
  },
  tabs: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
    gap: "30px",
    fontWeight: "bold",
    cursor: "pointer"
  },
  tab: {
    color: "#999"
  },
  activeTab: {
    color: "#b42ed9",
    borderBottom: "2px solid #b42ed9",
    paddingBottom: "5px"
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    outline: "none"
  },
  passwordBox: {
    position: "relative",
    marginBottom: "15px"
  },
  eye: {
    position: "absolute",
    right: "10px",
    top: "12px",
    cursor: "pointer"
  },
  button: {
    width: "100%",
    background: "#b42ed9",
    color: "#fff",
    padding: "12px",
    border: "none",
    borderRadius: "5px",
    marginTop: "10px",
    cursor: "pointer",
    fontWeight: "bold"
  }
};