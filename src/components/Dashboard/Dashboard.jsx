import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Chart from 'chart.js/auto';


const Dashboard = () => {
    const [balance, setBalance] = useState(null);
    const [transactionDistribution, setTransactionDistribution] = useState({});
    const [transactionAmounts, setTransactionAmounts] = useState([]);
    const [recentTransactions, setRecentTransactions] = useState([]);
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
                  // alert('Unauthorized access. Please log in again.');
              
                  // Redirect to the login page
                  navigate('/login');
                } 
                else if (response.status === 403) {
                    // Remove token from cookies
                    Cookies.remove('authToken');
        
                    // Notify the user about the token expiration (you can use a toast or other notification method)
                    // alert('Session expired. Please log in again.');
                
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

        const fetchRecentTransactions = async () => {
          try {
              const response = await fetch("http://localhost:5000/transaction/recent", {
                  method: "GET",
                  headers: {
                      'Authorization': `Bearer ${Cookies.get('authToken') || ''}`,
                      'Content-Type': 'application/json',
                  },
              });

              if (response.ok) {
                  const recentTransactionsData = await response.json();
                  setRecentTransactions(recentTransactionsData.transactions);
              } else if (response.status === 401 || response.status === 403) {
                  Cookies.remove('authToken');
                  // alert('Unauthorized access. Please log in again.');
                  navigate('/login');
              } else {
                  console.error('Failed to fetch recent transactions:', response.status);
                  setRecentTransactions([]);
              }
          } catch (error) {
              console.error('Error during recent transactions fetch:', error.message);
              setRecentTransactions([]);
          }
      };

      // Fetch transaction distribution
    const fetchTransactionDistribution = async () => {
      try {
        const response = await fetch('http://localhost:5000/transaction/transaction-distribution', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${Cookies.get('authToken') || ''}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTransactionDistribution(data);
        } else {
          console.error('Failed to fetch transaction distribution:', response.status);
          setTransactionDistribution({});
        }
      } catch (error) {
        console.error('Error during transaction distribution fetch:', error.message);
        setTransactionDistribution({});
      }
    };

    // Fetch transaction amounts for visualization
    const fetchTransactionAmounts = async () => {
      try {
        const response = await fetch('http://localhost:5000/transaction/transaction-amounts', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${Cookies.get('authToken') || ''}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setTransactionAmounts(data.transactionAmounts);
        } else {
          console.error('Failed to fetch transaction distribution:', response.status);
          setTransactionAmounts({});
        }
      } catch (error) {
        console.error('Error during transaction distribution fetch:', error.message);
        setTransactionAmounts({});
      }
    };

      fetchBalance();
      fetchRecentTransactions();
      fetchTransactionAmounts();
      fetchTransactionDistribution();
      

    }, [navigate]); // Empty dependency array to run the effect only once on component mount

    useEffect(() => {
      // Visualize transaction amounts using Chart.js
      const ctx = document.getElementById('transactionChart');
      if (ctx && transactionAmounts.length > 0) {
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: transactionAmounts.map((_, index) => `Transaction ${index + 1}`),
            datasets: [
              {
                label: 'Transaction Amounts',
                data: transactionAmounts,
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Adjust color as needed
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
            ],
          },
        });
      }
    }, [transactionAmounts]);

    const handleLogout = () => {
      // Remove token from cookies
      Cookies.remove('authToken');
      
      // Redirect to the login page
      navigate('/login');
    };
  

    

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
          {/* Logout button */}
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
  
        {/* Notifications Section */}
        <div className="notifications">
            <h2>Notifications</h2>
            {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction) => (
                    <div key={transaction._id} className="notification-item">
                        <p>{transaction.description}</p>
                        <span className="notification-badge">New</span>
                    </div>
                ))
            ) : (
                <div className="empty-state">No recent transactions found.</div>
            )}
        </div>
  
        

      {/* Transaction Amounts Section */}
      <div className="transaction-amounts">
        <h2>Transaction Amounts</h2>
        {transactionAmounts.length > 0 ? (
          <div>
            <canvas id="transactionChart" width="400" height="200"></canvas>
          </div>

        ) : (
          <p>Loading...</p>
        )}
      </div>

      {/* Transaction Distribution Section */}
      <div className="transaction-distribution">
        <h2>Transaction Distribution</h2>
        {transactionDistribution.debitCount !== undefined && transactionDistribution.creditCount !== undefined ? (
          <table className="transaction-table">
            <tbody>
              <tr>
                <td>Debit:</td>
                <td>{transactionDistribution.debitCount}</td>
              </tr>
              <tr>
                <td>Credit:</td>
                <td>{transactionDistribution.creditCount}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>Loading...</p>
        )}
      </div>

        
      </div>
    );
};

export default Dashboard;