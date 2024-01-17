import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Cookies from "js-cookie";


const Dashboard = () => {
    const [balance, setBalance] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user's account balance from the server
        const fetchBalance = async () => {
            try
            {   
                const response = await fetch("http://localhost:5000/account/balance", {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${Cookies.get('authToken') || ''}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok)
                {
                    const balanceData = await response.json();
                    setBalance(balanceData.balance);
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
                else 
                {
                    console.error('Failed to fetch account balance:', response.status);
                    // Handle error case, setBalance to an appropriate default value
                    setBalance(0);   
                }
            }
            catch (error)
            {
                console.error('Error during account balance fetch:', error.message);
                // Handle error case, setBalance to an appropriate default value
                setBalance(0);
            }
        };
        fetchBalance();

    }, []); // Empty dependency array to run the effect only once on component mount

    const data = [
      { name: 'January', spending: 200 },
      { name: 'February', spending: 150 },
      { name: 'March', spending: 300 },
      { name: 'April', spending: 250 },
    ];

    return (
      <div className="dashboard">
        {/* Account Balance Section */}
        <div className="account-balance">
          <h2>Account Balance</h2>
          {balance !== null ? (
                <p>R {balance}</p>
            ) : (
                <p>Loading...</p>
            )}
        </div>
  
        {/* Quick Links Section */}
        <div className="quick-links">
          <h2>Quick Links</h2>

          <div>
            <Link to="/view-transactions"><button className="quick-link-button">View Transactions</button></Link>
            <Link to="/transfer-funds"><button className="quick-link-button">Transfer Funds</button></Link>
            <Link to="/pay-bill"><button className="quick-link-button">Pay Bill</button></Link>
          </div>
        </div>
  
        {/* Notifications Section */}
        <div className="notifications">
          <h2>Notifications</h2>
          <div className="notification-item">
            <p>New Transaction: $100.00 received</p>
            <span className="notification-badge">New</span>
          </div>
          <div className="notification-item">
            <p>Payment due for Credit Card</p>
            <span className="notification-badge">Due</span>
          </div>
          {/* Add more notification items as needed */}
        </div>
  
        {/* Data Visualization (Example: Bar Chart) */}
        <div className="bar-chart">
        <h2 className="chart-title">Monthly Spending</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="spending" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      </div>
    );
};

export default Dashboard;