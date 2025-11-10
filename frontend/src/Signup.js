import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/signup", { name, password });
      setMessage(" Sign Up Successful!");
      setName("");
      setPassword("");
    } catch (err) {
      // If backend sends message like "User already exists"
      if (err.response && err.response.data && err.response.data.message) {
        setMessage(` ${err.response.data.message}`);
      } else {
        setMessage(" Error signing up");
      }
    }
  };

  return (
    <div className="signup-container">
      <h1>Sign Up</h1>
      <p>
        Already a member? <Link to="/login">Log In</Link>
      </p>

      <form onSubmit={handleSignup}>
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

        <button type="submit">Sign Up</button>
      </form>

      {message && <p className="msg">{message}</p>}
    </div>
  );
}

export default Signup;
