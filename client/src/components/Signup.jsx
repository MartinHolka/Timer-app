import axios from "axios";
import { useState } from "react";
import "../styles/Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/v1/auth/signup", {
        username,
        password,
      });
      if (res.status === 201) {
        setMessage(res.data.message);
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.error);
      } else {
        setMessage("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Signup</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="username"
            placeholder="Username"
            className="input-field"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="button">
            Create account
          </button>
        </form>
        {message && <p className="message">{message}</p>} {/* Message display */}
        <a href="/forgot-password" className="link">
          Forgot Password?
        </a>
        <a href="/login" className="link">
          Log in
        </a>
      </div>
    </div>
  );
};

export default Login;
