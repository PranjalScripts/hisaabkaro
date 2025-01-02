import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/auth/login/signup";
import Home from "./pages/Home/Home";
import Book from "./pages/books/book";
import Users from "./pages/clientUsers/clientUsers";
import Profile from "./pages/profile/userprofile";
import Landing from "./components/LandingPage/Landing";
import Loans from "./pages/loans/loan";
import Invoice from "./pages/invoice/invoice";
import Layout from "./pages/Layout/Layout";
import CollaborativeBookRecords from "./pages/collaborativeBook/youWereAdded/CollaborativeBookRecords";
import History from "./pages/collaborativeBook/youAdded/history";
import AddTransactions from "./pages/collaborativeBook/youAdded/AddTransactions";
import YourBooks from "./pages/selfRecord/yourBooks";
import SelfRecordByBookID from "./pages/selfRecord/selfrecordbyBookID";
import TransactionHistory from "./pages/selfRecord/history";
import PageNotFound from "./pages/pageNotFound/PageNotFound";
import DashBoard from "./pages/Dashboard/dashboard";
import DevToolsProtection from './components/DevToolsProtection';
import { createGlobalStyle } from 'styled-components';
import GoogleCallback from "./components/auth/GoogleCallback";
import PrivateRoute from "./components/PrivateRoute";
import RedirectIfLoggedIn from "./components/RedirectIfLoggedIn";

const GlobalStyle = createGlobalStyle`
  * {
    scrollbar-width: none !important;
    -ms-overflow-style: none !important;
  }

  *::-webkit-scrollbar {
    display: none !important;
    width: 0 !important;
  }
`;

function App() {
  return (
    <>  
      <Router>
        <GlobalStyle />
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        <Routes>
          {/* Public Routes - will redirect to /home if logged in */}
          <Route path="/" element={
            <RedirectIfLoggedIn>
              <Landing />
            </RedirectIfLoggedIn>
          } />
          <Route path="/login" element={
            <RedirectIfLoggedIn>
              <Landing />
            </RedirectIfLoggedIn>
          } />
          <Route path="/signup" element={
            <RedirectIfLoggedIn>
              <Landing />
            </RedirectIfLoggedIn>
          } />
          
          {/* Auth callback route */}
          <Route path="/auth/callback" element={<GoogleCallback />} />

          {/* Protected Routes */}
          <Route path="/" element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }>
            <Route path="home" element={<Home />} />
            <Route path="dashboard" element={<DashBoard />} />
            <Route path="your-books" element={<YourBooks />} />
            <Route path="/your-books/:bookId" element={<SelfRecordByBookID />} />
            <Route path="transaction-history/:transactionId" element={<TransactionHistory />}/>
            <Route path="users" element={<Users />} />
            <Route path="book" element={<Book />} />
            <Route path="profile" element={<Profile />} />
            <Route path="loans" element={<Loans />} />
            <Route path="invoice" element={<Invoice />} />
            <Route path="/history/:transactionId" element={<History />} />
            <Route path="/addtransaction" element={<AddTransactions />} />
            <Route
              path="/transaction-details/:transactionId"
              element={<CollaborativeBookRecords />}
            />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
