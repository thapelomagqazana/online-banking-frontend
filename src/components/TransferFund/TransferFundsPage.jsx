import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const TransferFundsPage = () => {
  const [formData, setFormData] = useState({
        username: "",
        amount: 0,
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
  

  const handleTransfer = async (e) => {
    e.preventDefault();

    // Implement transfer funds to the recipient
    try {
        // console.log(localStorage.getItem('authToken'));
      const response = await fetch("http://localhost:5000/transaction/transfer", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('authToken') || ''}`,
        },
        body: JSON.stringify({
          amount: formData.amount,
          username: formData.username,
        }),
      });

        if (response.ok) {
            console.log('Funds transferred successfully!');
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
            const errorData = await response.json();
            setError('Transfer funds failed: ' + errorData.message);
        }
    } catch (error) {
      setError('Error transferring funds: ' + error.message);
    }
  };

  return (
    <div>
        <header>
            <h1>Transfer Funds</h1>
        </header>
        <main>
            <form onSubmit={handleTransfer}>
                <label htmlFor="recipient">Recipient:</label>
                <input type="text" id="recipient" name="username" value={formData.username} onChange={handleChange} required />

                <label htmlFor="amount">Amount:</label>
                <input type="number" id="amount" name="amount" value={formData.amount} onChange={handleChange} required />


                {error && <p className="error-message">{error}</p>}

                <button type="submit">Transfer Funds</button>
            </form>
        </main>
    </div>  
  );
};

export default TransferFundsPage;