import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const PayBillsPage = () => {
  const [formData, setFormData] = useState({
        accountNumber: 0,
        billAmount: 0,
        billDescription: "",
  });
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState('');

  

  const fetchActiveAccount = async () => {
    try {
      const response = await fetch("http://localhost:5000/account/active", {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${Cookies.get('authToken') || ''}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const activeAccountData = await response.json();
        // Assuming the backend returns an active account object
        setFormData({
          ...formData,
          accountNumber: activeAccountData.activeAccount.accountNumber,
        });
      } else if (response.status === 401 || response.status === 403) {
        Cookies.remove('authToken');
        setError('Unauthorized access. Please log in again.');
        setSuccessMessage("");
        navigate('/login');
      } else {
        const errorData = await response.json();
        setError('Failed to fetch active account: ' + errorData.message);
        setSuccessMessage('');
      }
    } catch (error) {
      setError('Error fetching active account: ' + error.message);
      setSuccessMessage('');
    }
  };

  // eslint-disable-next-line
  useEffect(() => {
    // Fetch the active account on component mount
    fetchActiveAccount();
  }, [fetchActiveAccount]);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  
    // Reset error when user is typing
    setError('');
    setSuccessMessage("");
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
          billAmount: 0,
          billDescription: "",
        });
      } 
      else if (response.status === 401) {
        // Remove token from cookies
        Cookies.remove('authToken');

        // Notify the user about the token expiration (you can use a toast or other notification method)
        setError('Unauthorized access. Please log in again.');
    
        // Redirect to the login page
        navigate('/login');
      } 
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
        // Handle unauthorized or expired token
        // You can use the handleTokenExpiration function here
        const errorData = await response.json();
        setSuccessMessage("");
        setError('Pay bill failed: ' + errorData.message);
      }
    } catch (error) {
      setSuccessMessage("");
      setError('Error paying bill: ' + error.message);
    }
  };

  return (
    <div className="pay-bills-page">
        <h1>Pay Bills</h1>
        <main>
            <form className="bill-form" onSubmit={handlePayBill}>
                {/* Hidden input for accountNumber */}
                <input type="hidden" name="accountNumber" value={formData.accountNumber} />
                
                <label htmlFor="billDescription">Description:</label>
                <input type="text" id="billDescription" name="billDescription" value={formData.billDescription} onChange={handleChange} required />

                <label htmlFor="billAmount">Bill Amount:</label>
                <input type="number" id="billAmount" name="billAmount" value={formData.billAmount} onChange={handleChange} required />

                <button className="bill-button" type="submit">Pay Bill</button>
                {/* Back Option */}
                <Link to="/dashboard"><button className="back-button">Back</button></Link>
            </form>

            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
        </main>
    </div>  
  );
};

export default PayBillsPage;