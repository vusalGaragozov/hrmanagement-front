import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar.js';
import Home from './home.js';
import UserRegistration from './registration.js'; // Fixed the import path
import Login from './login.js';
import Tabel from '../Emek_haqqi/Tabel.js'
import SalaryCalculation from '../Emek_haqqi/Hesablama_cedveli.js';
import Telimler from '../Telimler/Telimler.js';
import KPI from '../KPI/kpi.js';
import Recruitment from '../Ishci_celbi/Ishci_celbi.js';
import Əməkdaş_siyahısı from '../Ishci_ucotu/Emekdash_siyahisi.js';
import Yeni_emekdash from '../Ishci_ucotu/Yeni_emekdash.js';
import Mezuniyyet_cedveli from '../Ishci_ucotu/Mezuniyyet_cedveli.js';
import İcazə_forması from '../Muracietler/Icaze_formasi.js';
import Məzuniyyət_müraciəti from '../Muracietler/Mezuniyyet_muracieti.js';
import Xəstəlik_vərəqəsi from '../Muracietler/Xestelik_vereqesi.js';
import Müraciətlər_siyahısı from '../Muracietler/Muracietler_siyahisi.js';
import { AuthProvider } from './AuthContext.js'; // Use AuthContext instead of AuthProvider
import Məhsul from '../../Visitors/Mehsul.js';
import Qiymətlər from '../../Visitors/Qiymetler.js';
import Tətbiqetmə from '../../Visitors/Tetbiqetme.js';
import Əlaqə from '../../Visitors/Elaqe.js';
import './style.css'; 
import İstifadəçi from './Istifadechi.js'
import Ezamiyyetler from '../Muracietler/Ezamiyyetler.js';
import Struktur from '../Struktur/Struktur.js';
import Emek_haqqi from '../Kalkulyatorlar/Emek_haqqi.js';
import Mezuniyyet from '../Kalkulyatorlar/Mezuniyyet.js';
import Ezamiyyet from '../Kalkulyatorlar/Ezamiyyet.js';
import Xestelik_vereqesi from '../Kalkulyatorlar/Xestelik_vereqesi.js';
import StaffRegister from './StaffRegister.js';
import User from './user.js';
import UploadData from '../../data_modelling/Excel_upload.js';
import EBITDAChart from '../../data_modelling/EBITDA_chart.js';

window.google.charts.load('current', { packages: ['corechart'] });

function App() {
  return (
    <AuthProvider>
      
      <Router>
      <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Home />} /> 
            <Route path="/login" element={<Login />} />
            <Route path="/product" element={<Məhsul />} />
            <Route path="/pricing" element={<Qiymətlər />} />
            <Route path="/guidance" element={<Tətbiqetmə />} />
            <Route path="/contact" element={<Əlaqə />} />
            <Route path="/register" element={<UserRegistration />} />
            <Route path="/vacation" element={<Məzuniyyət_müraciəti />} />
            <Route path="/away" element={<İcazə_forması />} />
            <Route path="/sick" element={<Xəstəlik_vərəqəsi />} />
            <Route path="/requestList" element={<Müraciətlər_siyahısı />} />
            <Route path="/stafflist" element={<Əməkdaş_siyahısı />} />
            <Route path="/vacationtable" element={<Mezuniyyet_cedveli />} />
            <Route path="/newstaff" element={<Yeni_emekdash/>} />
            <Route path="/tabel" element={<Tabel />} />
            <Route path="/salarycalculation" element={<SalaryCalculation />} />
            <Route path="/trainings" element={<Telimler />} />
            <Route path="/kpi" element={<KPI />} />
            <Route path="/recruitment" element={<Recruitment />} />
            <Route path="/userpage" element={<İstifadəçi />} />
            <Route path="/business_trips" element={<Ezamiyyetler />} />
            <Route path="/structure" element={<Struktur />} />
            <Route path="/calculator" element={<Emek_haqqi />} />
            <Route path="/vacation_calculator" element={<Mezuniyyet />} />
            <Route path="/trip_payment" element={<Mezuniyyet />} />
            <Route path="/sick_leave_calculator" element={<Xestelik_vereqesi />} />
            <Route path="/staffRegister" element={<StaffRegister />} />
            <Route path="/personal" element={<User />} />
            <Route path="/upload" element={<UploadData />} />
            <Route path="/ebitda" element={<EBITDAChart />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
