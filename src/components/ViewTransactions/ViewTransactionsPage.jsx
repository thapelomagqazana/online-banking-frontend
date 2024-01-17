import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const ViewTransactionsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user's transactions from the server
        const fetchTransactions = async () => {
            try
            {
                const response = await fetch("http://localhost:5000/transaction/history", {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('authToken') || ''}`,
                    },
                });
    
                if (response.ok)
                {
                    const data = await response.json();
                    setTransactions(data.transactions);
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
                    console.log('Transfer funds failed: ' + errorData.message);
                }
            }
            catch (error)
            {
                console.error("Error fetching transactions: "+ error);
            }
        };
    
        fetchTransactions();
    }, []);

        return (
            <div>
                <h1>View Transactions</h1>
                {transactions.length === 0 ? (
                    <p>No transactions history</p>
                ) : (
                    <ul>
                    {transactions.map((transaction) => (
                        <li key={transaction.id}>
                        {transaction.description} - ${transaction.amount}
                        </li>
                    ))}
                    </ul>
                )}
            </div>
        );
    };

export default ViewTransactionsPage;