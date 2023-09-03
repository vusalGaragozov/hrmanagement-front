import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar.js';
import Home from './home.js';
import UserRegistration from './registration.js'; // Fixed the import path
import Login from './login.js';
import Tabel from '../Əmək haqqı/Tabel.js'
import SalaryCalculation from '../Əmək haqqı/Hesablama cədvəli.js';
import Trainings from '../Təlimlər/Təlimlər.js';
import KPI from '../KPI/kpi.js';
import Recruitment from '../İşçi cəlbi/İşçi cəlbi.js';
import Əməkdaş_siyahısı from '../İşçi uçotu/Əməkdaş siyahısı.js';
import Yeni_əməkdaş from '../İşçi uçotu/Yeni əməkdaş.js';
import Məzuniyyyət_cədvəli from '../İşçi uçotu/Məzuniyyət cədvəli.js';
import İcazə_forması from '../Müraciətlər/İcazə forması.js';
import Məzuniyyət_müraciəti from '../Müraciətlər/Məzuniyyət müraciəti.js';
import Xəstəlik_vərəqəsi from '../Müraciətlər/Xəstəlik vərəqəsi.js';
import Müraciətlər_siyahısı from '../Müraciətlər/Müraciətlər siyahısı.js';
import { AuthProvider } from './AuthContext.js'; // Use AuthContext instead of AuthProvider
import Məhsul from '../../Visitors/Məhsul.js';
import Qiymətlər from '../../Visitors/Qiymətlər.js';
import Tətbiqetmə from '../../Visitors/Tətbiqetmə.js';
import Əlaqə from '../../Visitors/Əlaqə.js';
import './style.css'; 



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
            <Route path="/vacationtable" element={<Məzuniyyyət_cədvəli />} />
            <Route path="/newstaff" element={<Yeni_əməkdaş/>} />
            <Route path="/tabel" element={<Tabel />} />
            <Route path="/salarycalculation" element={<SalaryCalculation />} />
            <Route path="/trainings" element={<Trainings />} />
            <Route path="/kpi" element={<KPI />} />
            <Route path="/recruitment" element={<Recruitment />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
