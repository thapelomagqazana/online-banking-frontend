import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const ViewProfilePage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [userAccounts, setUserAccounts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("https://online-banking-app-production.up.railway.app/profile/view", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${Cookies.get('authToken') || ''}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const userData = await response.json();
          // console.log(userData.user);
          setUserData(userData);

          // Fetch user accounts based on the userId
          // const userId = userData._id; // Assuming the userId is available in the user data
          const accountsResponse = await fetch("https://online-banking-app-production-0b9c.up.railway.app/account/accounts", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${Cookies.get('authToken') || ''}`,
              "Content-Type": "application/json",
            },
          });

          if (accountsResponse.ok) {
            const accountsData = await accountsResponse.json();
            setUserAccounts(accountsData.accounts || []);
          } else if (accountsResponse.status === 401) {
            Cookies.remove('authToken');
            navigate('/login');
          } else {
            const errorData = await accountsResponse.json();
            setError("Failed to fetch user accounts: " + errorData.message);
          }
        } else if (response.status === 403) {
          Cookies.remove('authToken');
          navigate('/login');
        } else {
          const errorData = await response.json();
          setError("Failed to fetch user profile: " + errorData.message);
        }
      } catch (error) {
        setError("Error during user profile fetch: " + error.message);
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <div className="view-profile-page">
      <h1>My Profile</h1>
      {error && <p className="error-message">{error}</p>}
      {userData && (
        <div className="user-profile-section">
          {/* <img
            className="user-profile-image"
            src={userData.user.profileImage} // Replace with the actual profile image source
            alt="User Profile"
          /> */}
          <p><strong>Username:</strong> {userData.user.username}</p>
          <p><strong>Email:</strong> {userData.user.email}</p>
          {/* Add other user details as needed */}

          <h2>My Accounts</h2>
          {userAccounts.length > 0 ? (
            <ul className="account-summary-section">
              {userAccounts.map((account) => (
                <li key={account._id} className="account-card">
                  <p><strong>Account Name:</strong> {account.title}</p>
                  <p><strong>Account Number:</strong> {account.accountNumber}</p>
                  <p><strong>Balance:</strong> R {account.balance}</p>
                  {/* Add other account details as needed */}
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-state">No accounts found.</p>
          )}
        </div>
      )}
      <Link to="/update-profile"><button className="update-profile-button">Edit Profile</button></Link>
      <Link to="/create-account"><button className="update-profile-button">Add Account</button></Link>
      <Link to="/dashboard"><button className="back-button">View DashBoard</button></Link>
      
    </div>
  );
};

export default ViewProfilePage;
