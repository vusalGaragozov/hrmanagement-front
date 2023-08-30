import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar.js';
import Home from './home.js';
import UserRegistration from './registration.js'; // Fixed the import path
import Login from './login.js';
import { AuthProvider } from './AuthContext.js'; // Use AuthContext instead of AuthProvider


function App() {
  return (
    <AuthProvider>
      
      <Router>
      <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Home />} /> 
            <Route path="/register" element={<UserRegistration />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
