import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

/**
 * ViewTransactionsPage component displays a list of transactions with search, filter, and sort options.
 * It fetches transactions from the server and provides pagination controls.
 * @returns {JSX.Element} Rendered ViewTransactionsPage component.
 */
const ViewTransactionsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    /**
     * Memoized function to fetch transactions from the server.
     * @param {Object} queryParams - Additional query parameters for filtering, sorting, and searching transactions.
     * @returns {Promise<void>} Promise representing the asynchronous fetch operation.
     */
    const fetchTransactions = useCallback(async (queryParams = {}) => {
        try
        {
            const queryString = new URLSearchParams(queryParams).toString();
            const response = await fetch(`https://online-banking-app-production-0b9c.up.railway.app/transaction/history?${queryString}`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('authToken') || ''}`,
                },
            });

            if (response.ok)
            {
                const data = await response.json();
                setTransactions(data.transactions);
                setLoading(false);
            }
            else if (response.status === 401) {
                setLoading(false);
                // Remove token from cookies
                Cookies.remove('authToken');
            
                // Redirect to the login page
                navigate('/login');
            } 
            else if (response.status === 403) {
                setLoading(false);
                // Remove token from cookies
                Cookies.remove('authToken');
            
                // Redirect to the login page
                navigate('/login');
            } 
            else {
                const errorData = await response.json();
                console.log('Transfer funds failed: ' + errorData.message);
                setLoading(false);
            }
        }
        catch (error)
        {
            console.error("Error fetching transactions: "+ error);
            setLoading(false);
        }
    }, [navigate]); // Include any other dependencies if needed

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

        return (
            <div className="view-transactions-page">
            <h1>View Transactions</h1>

                 {/* Search bar */}
                 <input className="search-bar"
                    type="text"
                    placeholder="Search transactions..."
                    onChange={(e) => fetchTransactions({ search: e.target.value })}
                />
      
                {/* Add filters, sort, and search */}
                <div className="filter-options">
                    {/* Filter dropdown */}
                    <select onChange={(e) => fetchTransactions({ filter: e.target.value })}>
                    <option value="">All</option>
                    <option value="debit">Income</option>
                    <option value="credit">Expense</option>
                    </select>

                    {/* Sort dropdown */}
                    <select onChange={(e) => fetchTransactions({ sort: e.target.value })}>
                    <option value="date">Sort by Date</option>
                    <option value="amount">Sort by Amount</option>
                    </select>
                </div>
      
            {/* Transaction List */}
            {loading ? (
              <div className="loading-indicator">Loading...</div>
            ) : transactions.length > 0 ? (
              <ul className="transaction-list">
                {transactions.map((transaction) => (
                <li key={transaction.id} className={`transaction-item ${transaction.type.toLowerCase()}-type`}>
                    <div className="transaction-details">
                    <div>
                        <p>{transaction.date}</p>
                        <p>{transaction.description}</p>
                    </div>
                    <p className="transaction-amount">{transaction.amount}</p>
                    </div>
                </li>
                ))}
              </ul>
            ) : (
              <div className="empty-state">No transactions found.</div>
            )}
      
            {/* Pagination (Example) */}
            <div className="pagination">
                <button onClick={() => fetchTransactions({ page: 1 })}>Prev</button>
                <button onClick={() => fetchTransactions({ page: 1 })}>1</button>
                <button onClick={() => fetchTransactions({ page: 2 })}>2</button>
                <button onClick={() => fetchTransactions({ page: 2 })}>Next</button>
                
            </div>
            {/* Back Option */}
            <Link to="/dashboard"><button className="back-button">Back</button></Link>
          </div>
        );
    };

export default ViewTransactionsPage;