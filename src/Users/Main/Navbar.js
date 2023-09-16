import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './style.css';
import { API_URL } from '../Other/config';
import { AuthContext } from '../Main/AuthContext';

const LoggedInNavbar = ({ user, handleLogout }) => (
  <nav className="navbar navbar-expand-lg navbar-light bg-light">
    <button
      className="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav ml-auto">
        <li className="nav-item dropdown">
          <a
            className="nav-link dropdown-toggle"
            id="navbarDropdown1"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Müraciətlər
          </a>
          <div className="dropdown-menu" aria-labelledby="navbarDropdown1">
            <Link className="dropdown-item" to="/vacation">
              Məzuniyyət müraciəti
            </Link>
            <Link className="dropdown-item" to="/business_trips">
              Ezamiyyətlər
            </Link>
            <Link className="dropdown-item" to="/away">
              İcazə forması
            </Link>
            <Link className="dropdown-item" to="/sick">
              Xəstəlik vərəqəsi
            </Link>
            <Link className="dropdown-item" to="/requestList">
              Müraciətlər siyahısı
            </Link>
          </div>
        </li>
        <li className="nav-item dropdown">
          <a
            className="nav-link dropdown-toggle"
            id="navbarDropdown2"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            İşçi uçotu
          </a>
          <div className="dropdown-menu" aria-labelledby="navbarDropdown2">
            <Link className="dropdown-item" to="/newstaff">
              Yeni əməkdaş
            </Link>
            <Link className="dropdown-item" to="/stafflist">
              Əməkdaş siyahısı
            </Link>
            <Link className="dropdown-item" to="/vacationtable">
              Məzuniyyyət cədvəli
            </Link>
          </div>
        </li>
        <li className="nav-item dropdown">
          <a
            className="nav-link dropdown-toggle"
            id="navbarDropdown3"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Əmək haqqı
          </a>
          <div className="dropdown-menu" aria-labelledby="navbarDropdown3">
            <Link className="dropdown-item" to="/tabel">
              Tabel
            </Link>
            <Link className="dropdown-item" to="/salarycalculation">
              Hesablama cədvəli
            </Link>
          </div>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/trainings">
            Təlimlər
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/kpi">
            KPİ
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/trainings">
            İşçi cəlbi
          </Link>
        </li>
        <li className="nav-item dropdown">
          <a
            className="nav-link dropdown-toggle"
            id="navbarDropdown3"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Kalkulyator
          </a>
          <div className="dropdown-menu" aria-labelledby="navbarDropdown3">
            <Link className="dropdown-item" to="/calculator">
              Əmək haqqı
            </Link>
            <Link className="dropdown-item" to="/vacation_calculator">
              Məzuniyyət
            </Link>
            <Link className="dropdown-item" to="/trip_payment">
              Ezamiyyət
            </Link>
            <Link className="dropdown-item" to="/sick_leave_calculator">
              Xəstəlik vərəqəsi
            </Link>
          
          </div>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/structure">
            Struktur
          </Link>
        </li>
        <li className="nav-item ml-3">
          <span className="nav-link">
            <span className="material-symbols-outlined">&#xe7fd;</span> {user.firstname} {user.lastname}
          </span>
        </li>
        <li className="nav-item">
          <button
            className="nav-link btn custom-logout-btn"
            onClick={handleLogout}
            style={{ backgroundColor: 'red', color: 'white' }}
          >
            <span className="material-symbols-outlined">&#xe9ba;</span>Çıxış
          </button>
        </li>
      </ul>
    </div>
  </nav>
);

const VisitorNavbar = () => (
  <nav className="navbar navbar-expand-lg navbar-light bg-light">
    <button
      className="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link className="nav-link" to="/product">
            Məhsul
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/pricing">
            Qiymətlər
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/guidance">
            Tətbiqetmə
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/contact">
            Əlaqə
          </Link>
        </li>
      </ul>
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link underline-hover" to="/register">
            <span className="material-symbols-outlined">&#xe174;</span> Qeydiyyat
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link underline-hover" to="/login">
            <span className="material-symbols-outlined">&#xea77;</span> Daxil ol
          </Link>
        </li>
      </ul>
    </div>
  </nav>
);

const Navbar = () => {
  const { user, setAuthenticated } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      const response = await fetch(API_URL + '/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        setAuthenticated(false);
        window.location.href = '/login';
      } else {
        throw new Error('Error logging out');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center main">
      <div className="row">
        <div className="col-md-12">
          {user ? (
            <LoggedInNavbar user={user} handleLogout={handleLogout} />
          ) : (
            <VisitorNavbar />
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
