import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

/**
 * Component for the Pay Bills page.
 * Allows users to pay bills by providing account number, bill amount, and description.
 */

const PayBillsPage = () => {
  // State to manage form data, navigation, and error/success messages
  const [formData, setFormData] = useState({
        accountNumber: "",
        billAmount: "",
        billDescription: "",
  });
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState('');

  /**
   * Handles form input changes.
   * @param {Object} e - Event object.
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  
    // Reset error when user is typing
    setError('');
    setSuccessMessage("");
  };

   /**
   * Handles the bill payment process.
   * @param {Object} e - Event object.
   */
  const handlePayBill = async (e) => {
    e.preventDefault();
    // Implement logic to pay the bill
    try {
        
      const response = await fetch("https://online-banking-app-production-0b9c.up.railway.app/bill/pay", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('authToken') || ''}`,
        },
        body: JSON.stringify({
          accountNumber: formData.accountNumber,
          billAmount: formData.billAmount,
          billDescription: formData.billDescription,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage(data.message);
        setError('');
        // Reset form data
        setFormData({
          accountNumber: "",
          billAmount: "",
          billDescription: "",
        });
      }
      // Handle unauthorized access 
      else if (response.status === 401) {
        // Remove token from cookies
        Cookies.remove('authToken');

        // Notify the user about the token is unauthorized (you can use a toast or other notification method)
        setError('Unauthorized access. Please log in again.');
    
        // Redirect to the login page
        navigate('/login');
      }
      // Handle session expiration
      else if (response.status === 403) {
          // Remove token from cookies
          Cookies.remove('authToken');
          setSuccessMessage("");
          setError("");
          // Notify the user about the token expiration (you can use a toast or other notification method)
          setError('Session expired. Please log in again.');
      
          // Redirect to the login page
          navigate('/login');
      } 
      else {
        const errorData = await response.json();
        setSuccessMessage("");
        setError('Pay bill failed: ' + errorData.message);
      }
    } catch (error) {
      setSuccessMessage("");
      setError('Error paying bill: ' + error.message);
    }
  };

  // Render the component
  return (
    <div className="pay-bills-page">
        <h1>Pay Bills</h1>
        <main>
            <form className="bill-form" onSubmit={handlePayBill}>
                {/* Form fields */}
                <label htmlFor="accountNumber">Sender Acc No:</label>
                <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} required />
                
                <label htmlFor="billDescription">Description:</label>
                <input type="text" id="billDescription" name="billDescription" value={formData.billDescription} onChange={handleChange} required />

                <label htmlFor="billAmount">Bill Amount:</label>
                <input type="text" id="billAmount" name="billAmount" value={formData.billAmount} onChange={handleChange} required />

                {/* Submit button and Back option */}
                <button className="bill-button" type="submit">Pay Bill</button>
                <Link to="/dashboard"><button className="back-button">Back</button></Link>
            </form>

            {/* Display error and success messages */}
            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
        </main>
    </div>  
  );
};

export default PayBillsPage;