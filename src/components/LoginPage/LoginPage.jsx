import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";

const LoginPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [passwordError, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Reset password error when user is typing
    setError();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send login data to the server
    try
    {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok)
      {
        const dataPromise = response.json();
        console.log("Login successful!");
        // Access the token when the promise is fulfilled
        dataPromise.then((data) => {
          const authToken = data.token;
          // save it in Cookies
          Cookies.set('authToken', authToken);
          
        });
        navigate("/dashboard");
      }
      else
      {
        const errorData = await response.json();
        setError("Login failed: " + errorData.message);
      }
    }
    catch (error)
    {
      setError("Error during Logging in: "+ error.message);
    }
  };


  return (
    <div className="auth-page">
      <header>
        <h1>Login to Your Account</h1>
      </header>
      <main className="auth-main">
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required />

          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />

          <label htmlFor="password">Password:</label>
          <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password} onChange={handleChange} required />

          {passwordError && <p className="error-message">{passwordError}</p>}

          <button type="button" onClick={togglePasswordVisibility}>
            {showPassword ? "Hide" : "Show"}
          </button>

          <button type="submit">Log in</button>
        </form>

        <p>
          Don't have an account?{' '}
          <Link to="/register">Create one here</Link>
        </p>
      </main>
    </div>
  );
};

export default LoginPage;
