import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar.js';
import Home from './home.js';
import Apply from '../Müraciətlər/Müraciətlər.js';
import UserRegistration from './registration.js'; // Fixed the import path
import Login from './login.js';
import Tabel from '../Əmək haqqı/Tabel.js'
import SalaryCalculation from '../Əmək haqqı/Hesablama cədvəli.js';
import Trainings from '../Təlimlər/Təlimlər.js';
import KPI from '../KPI/kpi.js';
import Recruitment from '../İşçi cəlbi/İşçi cəlbi.js';
import İşçi_uçotu from '../İşçi uçotu/İşçi uçotu.js';
import { AuthProvider } from './AuthContext.js'; // Use AuthContext instead of AuthProvider


function App() {
  return (
    <AuthProvider>
      
      <Router>
      <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Home />} /> 
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<UserRegistration />} />
            <Route path="/staff_accounting" element={<İşçi_uçotu />} />
            <Route path="/tabel" element={<Tabel />} />
            <Route path="/salarycalculation" element={<SalaryCalculation />} />
            <Route path="/trainings" element={<Trainings />} />
            <Route path="/kpi" element={<KPI />} />
            <Route path="/recruitment" element={<Recruitment />} />
            <Route path="/apply" element={<Apply />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
