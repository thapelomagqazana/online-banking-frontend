import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const PayBillsPage = () => {
  const [formData, setFormData] = useState({
        billAmount: 0,
        billDescription: "",
  });
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  
    // Reset error when user is typing
    setError('');
  };
  

  const handlePayBill = async (e) => {
    e.preventDefault();

    // Implement logic to pay the bill
    try {
        
      const response = await fetch("http://localhost:5000/bill/pay", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('authToken') || ''}`,
        },
        body: JSON.stringify({
          billAmount: formData.billAmount,
          billDescription: formData.billDescription,
        }),
      });

      if (response.ok) {
        console.log('Bill paid successfully!');
        navigate("/dashboard");
      } 
      else if (response.status === 401) {
        // Remove token from cookies
        Cookies.remove('authToken');

        // Notify the user about the token expiration (you can use a toast or other notification method)
        alert('Unauthorized access. Please log in again.');
    
        // Redirect to the login page
        navigate('/login');
      } 
      else if (response.status === 403) {
          // Remove token from cookies
          Cookies.remove('authToken');

          // Notify the user about the token expiration (you can use a toast or other notification method)
          alert('Session expired. Please log in again.');
      
          // Redirect to the login page
          navigate('/login');
      } 
      else {
        // Handle unauthorized or expired token
        // You can use the handleTokenExpiration function here
        const errorData = await response.json();
        setError('Pay bill failed: ' + errorData.message);
      }
    } catch (error) {
      setError('Error paying bill: ' + error.message);
    }
  };

  return (
    <div>
        <header>
            <h1>Pay Bills</h1>
        </header>
        <main>
            <form onSubmit={handlePayBill}>
                <label htmlFor="billAmount">Bill Amount:</label>
                <input type="number" id="billAmount" name="billAmount" value={formData.billAmount} onChange={handleChange} required />

                <label htmlFor="billDescription">Description:</label>
                <input type="text" id="billDescription" name="billDescription" value={formData.billDescription} onChange={handleChange} required />


                {error && <p className="error-message">{error}</p>}

                <button type="submit">Pay Bill</button>
            </form>
        </main>
    </div>  
  );
};

export default PayBillsPage;