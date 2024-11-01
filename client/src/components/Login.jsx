import axios from 'axios';
import { useState } from "react";
import "../styles/Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // State for message

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/v1/auth/login', { username, password });
      if (response.status === 200) {
        // Set the success message
        setMessage(response.data.message); 
        localStorage.setItem("token", response.data.token);
      }
    } catch (error) {
      // Set error message based on the response error
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
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
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
          <button type="submit" className="button">Login</button>
        </form>
        
        {message && <p className="message">{message}</p>} {/* Message display */}
        
        <a href="/forgot-password" className="link">Forgot Password?</a>
        <a href="/signup" className="link">Create Account</a>
      </div>
    </div>
  );
};

export default Login;
