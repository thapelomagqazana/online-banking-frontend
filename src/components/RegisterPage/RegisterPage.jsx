import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import './AuthPage.css';

const RegisterPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    // Check if password match
    if (formData.password !== formData.confirmPassword)
    {
      setError("Passwords do not match");
      return;
    }

    // Add logic to check for strong password requirements
    const strongPasswordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
    if (!strongPasswordRegex.test(formData.password))
    {
      setError('Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, and one number.');
      return;
    }

    // Send registration data to the server
    try
    {
      const response = await fetch("http://localhost:5000/auth/register", {
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
        console.log("Registration successful!");
        navigate("/login");
      }
      else
      {
        const errorData = await response.json();
        setError("Registration failed: " + errorData.message);
      }
    }
    catch (error)
    {
      setError("Error during registration: "+ error.message);
    }
  };

  return (
    <div className="auth-page">
      <header>
        <h1>Create Your Account</h1>
      </header>
      <main className="auth-main">
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required />

          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />

          <label htmlFor="password">Password:</label>
          <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password} onChange={handleChange} required />

          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input type={showPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />

          {passwordError && <p className="error-message">{passwordError}</p>}

          <button type="button" onClick={togglePasswordVisibility}>
            {showPassword ? "Hide" : "Show"}
          </button>

          <button type="submit">Register</button>
        </form>

        <p>
          Already have an account?{' '}
          <Link to="/login">Log in here</Link>
        </p>
      </main>
    </div>
  );
};

export default RegisterPage;