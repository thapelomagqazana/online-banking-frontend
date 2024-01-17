import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faUsers, faShieldAlt } from '@fortawesome/free-solid-svg-icons';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <h1>Welcome to YourBank</h1>
        <p>Your trusted partner in financial management</p>
        
      </section>

      {/* Content Sections */}
      <section className="content-section">
        <h2>Access Your Account</h2>
        <p>Already have an account? Log in below:</p>
        <div className="cta-buttons">
          <Link to="/login">
            <button className="login-button">Log In</button>
          </Link>
        </div>
      </section>

      <section className="content-section">
        <h2>New to YourBank?</h2>
        <p>Create an account to enjoy our services:</p>
        <div className="cta-buttons">
          <Link to="/register">
            <button className="register-button">Register</button>
          </Link>
        </div>
      </section>

      {/* Features and Benefits */}
      <section className="features-section">
        <div className="feature-box">
          <FontAwesomeIcon icon={faCheckCircle} className="feature-icon" />
          <h2>Secure Transactions</h2>
          <p>Your transactions are protected with advanced security measures.</p>
        </div>
        <div className="feature-box">
          <FontAwesomeIcon icon={faUsers} className="feature-icon" />
          <h2>User-Friendly Interface</h2>
          <p>Our easy-to-use interface ensures a smooth banking experience.</p>
        </div>
        <div className="feature-box">
          <FontAwesomeIcon icon={faShieldAlt} className="feature-icon" />
          <h2>Trusted Partner</h2>
          <p>Count on us as your reliable partner in financial management.</p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
