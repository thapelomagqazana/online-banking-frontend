import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Chart from 'chart.js/auto';


const Dashboard = () => {
    const [balance, setBalance] = useState(null);
    const [transactionDistribution, setTransactionDistribution] = useState({});
    const [transactionAmounts, setTransactionAmounts] = useState([]);
    const [recentTransactions, setRecentTransactions] = useState([]);
    
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState("");
    const navigate = useNavigate();
    // Declare a variable to store the Chart instance
    const transactionChartInstance = useRef(null);

    



  useEffect(() => {

      // Fetch user accounts
  const fetchAccounts = async () => {
    try {
      const response = await fetch("https://online-banking-app-production.up.railway.app/account/accounts", {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${Cookies.get('authToken') || ''}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const accountsData = await response.json();
        setAccounts(accountsData.accounts);

      } else if (response.status === 401 || response.status === 403) {
        Cookies.remove('authToken');
        navigate('/login');
      } else {
        console.error('Failed to fetch accounts:', response.status);
        setAccounts([]);
      }
    } catch (error) {
      console.error('Error during accounts fetch:', error.message);
      setAccounts([]);
    }
  };


    fetchAccounts();
  }, [navigate, selectedAccount]);

  // Effect to fetch and update dashboard data when selectedAccount changes
  useEffect(() => {

    const fetchDashboardData = async (accountId) => {
      try {
        // Fetch user's account balance from the server
        const responseBalance = await fetch(`https://online-banking-app-production.up.railway.app/account/balance?accountId=${accountId}`, {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${Cookies.get('authToken') || ''}`,
            'Content-Type': 'application/json',
          },
        });

        if (responseBalance.ok) {
          const balanceData = await responseBalance.json();
          setBalance(balanceData.balance);
        } else if (responseBalance.status === 401 || responseBalance.status === 403) {
          Cookies.remove('authToken');
          navigate('/login');
        } else {
          console.error('Failed to fetch account balance:', responseBalance.status);
          setBalance(0);
        }

        // Fetch recent transactions
        const responseRecentTransactions = await fetch(`https://online-banking-app-production.up.railway.app/transaction/recent?accountId=${accountId}`, {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${Cookies.get('authToken') || ''}`,
            'Content-Type': 'application/json',
          },
        });

        if (responseRecentTransactions.ok) {
          const recentTransactionsData = await responseRecentTransactions.json();
          setRecentTransactions(recentTransactionsData.transactions);
        } else if (responseRecentTransactions.status === 401 || responseRecentTransactions.status === 403) {
          Cookies.remove('authToken');
          navigate('/login');
        } else {
          console.error('Failed to fetch recent transactions:', responseRecentTransactions.status);
          setRecentTransactions([]);
        }

        // Fetch transaction distribution
        const responseTransactionDistribution = await fetch(`https://online-banking-app-production.up.railway.app/transaction/transaction-distribution?accountId=${accountId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${Cookies.get('authToken') || ''}`,
            'Content-Type': 'application/json',
          },
        });

        if (responseTransactionDistribution.ok) {
          const data = await responseTransactionDistribution.json();
          // console.log(data);
          setTransactionDistribution(data);
        } else {
          console.error('Failed to fetch transaction distribution:', responseTransactionDistribution.status);
          setTransactionDistribution({});
        }

        // Fetch transaction amounts for visualization
        const responseTransactionAmounts = await fetch(`https://online-banking-app-production.up.railway.app/transaction/transaction-amounts?accountId=${accountId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${Cookies.get('authToken') || ''}`,
            'Content-Type': 'application/json',
          },
        });

        if (responseTransactionAmounts.ok) {
          const data = await responseTransactionAmounts.json();
          // console.log(data);
          setTransactionAmounts(data.transactionAmounts);
        } else {
          console.error('Failed to fetch transaction distribution:', responseTransactionAmounts.status);
          setTransactionAmounts({});
        }

      } catch (error) {
        console.error('Error during dashboard data fetch:', error.message);
        // Handle error case, setBalance to an appropriate default value
        setBalance(0);
      }
    };


    if (selectedAccount !== "") {
      fetchDashboardData(selectedAccount);
      setActiveAccount(selectedAccount);
    }
  }, [selectedAccount, navigate]);

  

    // Function to set the selected account as active
  const setActiveAccount = async (accountId) => {
    try {
      const response = await fetch(`https://online-banking-app-production.up.railway.app/account/set-active/${accountId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Cookies.get('authToken') || ''}`,
          'Content-Type': 'application/json',
        },
      });

      // if (response.ok)
      // {
      //   console.log("Account activated: "+response);
      // }

      if (!response.ok) {
        console.error('Failed to set active account:', response.status);
        // Handle error case if needed
      }
    } catch (error) {
      console.error('Error setting active account:', error.message);
      // Handle error case if needed
    }
  };

  // Initialize selectedAccount to the first account if available
  useEffect(() => {
    if (accounts.length > 0 && selectedAccount === "") {
      setSelectedAccount(accounts[0]._id);
    }
  }, [accounts, selectedAccount]);

    useEffect(() => {
      // Visualize transaction amounts using Chart.js
      const ctx = document.getElementById('transactionChart');

      if (transactionChartInstance.current) {
        transactionChartInstance.current.destroy();
      }

      if (ctx && transactionAmounts.length > 0) {
        transactionChartInstance.current = new Chart(ctx, {
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
      navigate('/');
    };
  

    const handleAccountChange = (e) => {
      // console.log(selectedAccount);
      const selectedAccountId = e.target.value;
      setSelectedAccount(selectedAccountId);
      setActiveAccount(selectedAccountId);
    };

    return (
      <div className="dashboard">
            {/* Navigation Section */}
            <nav className="navbar">
                <div className="account-selector">
                    <label htmlFor="accountSelect">Select Account: </label>
                    <select id="accountSelect" value={selectedAccount} onChange={handleAccountChange}>
                        {accounts.map(account => (
                            <option key={account._id} value={account._id}>{account.title}</option>
                        ))}
                    </select>
                </div>
                <div className="navbar-buttons">
                    <button className="navbar-button" onClick={handleLogout}>Logout</button>
                    {/* Add a button to view profile if you have a route for that */}
                    <Link to="/view-profile"><button className="navbar-button">View Profile</button></Link>
                </div>
            </nav>

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
            {/* <div className="transaction-amounts">
                <h2>Transaction Amounts</h2>
                {transactionAmounts.length > 0 ? (
                    <div>
                        <canvas id="transactionChart" width="400" height="200"></canvas>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </div> */}

            {/* Transaction Distribution Section */}
            <div className="transaction-distribution">
                <h2>Transaction Distribution</h2>
                {transactionDistribution.debitCount !== undefined && transactionDistribution.creditCount !== undefined ? (
                    <table className="transaction-table">
                        <tbody>
                            <tr>
                                <td>Income Received:</td>
                                <td>{transactionDistribution.debitCount}</td>
                            </tr>
                            <tr>
                                <td>Expense Paid:</td>
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