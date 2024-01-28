import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";

const UpdateProfilePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    profileImage: '',
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
            // Assuming you have a backend route for creating an account
            const response = await fetch("https://online-banking-app-production-0b9c.up.railway.app/profile/update", {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${Cookies.get('authToken') || ''}`,
                },
                body: JSON.stringify({
                    username : formData.username,
                    password: formData.password,
                    email: formData.email,
                    profileImage: formData.profileImage,
                }),
              });
        
              if (response.ok) {
                console.log("Profile updated successfully!");
                // setFormData({
                //     title: "",
                //     accountNumber: "",
                //   });
                // Redirect to the dashboard after creating an account
                navigate("/view-profile");
              } else {
                const errorData = await response.json();
                setError("Profile Update failed: " + errorData.message);
              }
    } catch (error) {
      console.error('Error updating profile:', error);
      // Handle error, show a message, etc.
      setError('Error updating profile:', error);
    }
  };

  return (
    <div className="update-profile-page">
        <h1>Update Profile</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>

            <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
            />
            </div>

            <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
            />
            <div className="password-strength"> {/* Password strength indicator can be added here */}</div>
            </div>

            <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
            />
            </div>

            {/* <div className="form-group">
            <label htmlFor="profileImage">Profile Image URL:</label>
            <input
                type="text"
                id="profileImage"
                name="profileImage"
                value={formData.profileImage}
                onChange={handleChange}
            />
            {formData.profileImage && (
                <img
                src={formData.profileImage}
                alt="Profile Preview"
                className="user-profile-preview"
                />
            )}
            </div> */}

            <button type="submit" className="update-profile-button">Update Profile</button>

        </form>
        <Link to="/view-profile"><button className="back-button">Back</button></Link>
    </div>
  );
};

export default UpdateProfilePage;
