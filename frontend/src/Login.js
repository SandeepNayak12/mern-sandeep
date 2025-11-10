import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/login", {
        name,
        password,
      });
      localStorage.setItem("token", res.data.token); // store token
      setMessage("Login Successful!");
      setTimeout(() => navigate("/home"), 1000); // redirect after 1s
    } catch (err) {
      setMessage("Invalid name or password");
    }
  };

  return (
    <div className="signup-container">
      <h1>Log In</h1>
      <p>
        Don’t have an account? <Link to="/">Sign Up</Link>
      </p>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Log In</button>
      </form>

      {message && <p className="msg">{message}</p>}
    </div>
  );
}

export default Login;
