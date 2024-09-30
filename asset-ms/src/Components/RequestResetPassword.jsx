import React, { useState } from "react";
import axios from "axios";

const RequestResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/send-verification-email", { email });
      setMessage(response.data.Message);
    } catch (error) {
      setMessage("Error sending verification email.");
    }
  };

  return (
    <div>
      <h2>Request Password Reset</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Verification Email</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RequestResetPassword;
