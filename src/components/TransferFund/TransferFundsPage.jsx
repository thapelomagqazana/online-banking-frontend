import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const TransferFundsPage = () => {
  const [formData, setFormData] = useState({
        username: "",
        amount: 0,
  });
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  
    // Reset error when user is typing
    setError('');
    setSuccessMessage("");
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
            const data = await response.json();
            setSuccessMessage(data.message);
            setError('');
            // Reset form data
            setFormData({
              username: "",
              amount: 0,
            });
        } 
        else if (response.status === 401) {
            // Remove token from cookies
            Cookies.remove('authToken');

            // Notify the user about the token expiration (you can use a toast or other notification method)
            alert('Unauthorized access. Please log in again.');
            setSuccessMessage("");
            setError("");
        
            // Redirect to the login page
            navigate('/login');
        } 
        else if (response.status === 403) {
            // Remove token from cookies
            Cookies.remove('authToken');

            // Notify the user about the token expiration (you can use a toast or other notification method)
            alert('Session expired. Please log in again.');
            setSuccessMessage("");
            setError("");
        
            // Redirect to the login page
            navigate('/login');
        } 
        else {
            const errorData = await response.json();
            setError('Transfer funds failed: ' + errorData.message);
            setSuccessMessage('');
        }
    } catch (error) {
      setError('Error transferring funds: ' + error.message);
      setSuccessMessage('');
    }
  };

  return (
    <div className="transfer-funds-page">
        <h1>Transfer Funds</h1>
        
        <main>
            <form className="transfer-form" onSubmit={handleTransfer}>
                <label htmlFor="recipient">Recipient:</label>
                <input type="text" id="recipient" name="username" value={formData.username} onChange={handleChange} required />

                <label htmlFor="amount">Amount:</label>
                <input type="number" id="amount" name="amount" value={formData.amount} onChange={handleChange} required />
                
                <button className="transfer-button" type="submit">Transfer Funds</button>
                {/* Back Option */}
                <Link to="/dashboard"><button className="back-button">Back</button></Link>
            </form>

            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
        </main>
    </div>  
  );
};

export default TransferFundsPage;