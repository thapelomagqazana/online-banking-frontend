import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";


/**
 * Component for creating a new user account.
 */
const CreateAccountPage = () => {
  // React hooks for managing state and navigation
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    accountNumber: "",
    // other fields...
  });
  const [error, setError] = useState(null);

  /**
   * Handles changes in the input fields.
   * @param {Object} e - Event object.
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * Handles the submission of the account creation form.
   * @param {Object} e - Event object.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Assuming you have a backend route for creating an account
      const response = await fetch("https://online-banking-app-production.up.railway.app/account/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Cookies.get('authToken') || ''}`,
        },
        body: JSON.stringify({
            accountNumber : formData.accountNumber,
            title: formData.title,
        }),
      });

      if (response.ok) {
        console.log("Account created successfully!");
        // Redirect to the dashboard after creating an account
        navigate("/view-profile");
      } else {
        const errorData = await response.json();
        setError("Account creation failed: " + errorData.message);
      }
    } catch (error) {
      setError("Error during account creation: " + error.message);
    }
  };
  // Render the component
  return (
    <div className="create-account-page">
      <h1>Create Account</h1>
      {error && <p className="error-message">{error}</p>}
      <form className="create-account-form" onSubmit={handleSubmit}>
        {/* Add input fields for the account creation form */}
        <label htmlFor="title">Title:</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />

        <label htmlFor="accountNumber">Account Number:</label>
            <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} required />

        <button className="create-account-button" type="submit">Create Account</button>
      </form>
      <Link to="/view-profile"><button className="back-button">Back</button></Link>
    </div>
  );
};

export default CreateAccountPage;
