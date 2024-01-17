import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import Dashboard from './components/Dashboard/Dashboard';
import ViewTransactionsPage from './components/ViewTransactions/ViewTransactionsPage';
import TransferFundsPage from './components/TransferFund/TransferFundsPage';
import PayBillsPage from './components/Bills/PayBillsPage';

import "./styles.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/view-transactions" element={<ViewTransactionsPage />} />
        <Route path="/transfer-funds" element={<TransferFundsPage />} />
        <Route path="/pay-bill" element={<PayBillsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
