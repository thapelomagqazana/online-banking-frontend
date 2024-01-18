import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const TransferFundsPage = () => {
  const [formData, setFormData] = useState({
        accountNumber: 0,
        amount: 0,
        recipientAccountNumber: "",
  });
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Fetch the active account on component mount
    fetchActiveAccount();
  }, []);

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
        console.log(activeAccountData.activeAccount.accountNumber);
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
          accountNumber: formData.accountNumber,
          amount: formData.amount,
          recipientAccountNumber: formData.recipientAccountNumber,
        }),
      });

        if (response.ok) {
            const data = await response.json();
            setSuccessMessage(data.message);
            setError('');
            // Reset form data
            setFormData({
              recipientAccountNumber: "",
              amount: 0,
            });
        } 
        else if (response.status === 401) {
            // Remove token from cookies
            Cookies.remove('authToken');

            // Notify the user about the token expiration (you can use a toast or other notification method)
            setError('Unauthorized access. Please log in again.');
            setSuccessMessage("");
          
        
            // Redirect to the login page
            navigate('/login');
        } 
        else if (response.status === 403) {
            // Remove token from cookies
            Cookies.remove('authToken');

            // Notify the user about the token expiration (you can use a toast or other notification method)
            setError('Session expired. Please log in again.');
            setSuccessMessage("");
        
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

                {/* Hidden input for accountNumber */}
                <input type="hidden" name="accountNumber" value={formData.accountNumber} />

                <label htmlFor="recipientAccountNumber">Recipient Acc No:</label>
                <input type="text" id="recipientAccountNumber" name="recipientAccountNumber" value={formData.recipientAccountNumber} onChange={handleChange} required />

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