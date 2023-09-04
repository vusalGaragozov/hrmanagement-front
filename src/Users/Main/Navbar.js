import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './style.css';
import { API_URL } from '../Other/config';
import { AuthContext } from '../Main/AuthContext';
import workerIcon from '../Icons/İşçi cəlbi icon.png';


const navLinkStyle = {
  whiteSpace: 'nowrap', // Prevent text from wrapping to the next line
  overflow: 'hidden',   // Hide any overflow text
  textOverflow: 'ellipsis', // Show ellipsis for long text
};

const iconDimensions = {
  width: '22px',   // Adjust width to match the size of Google Fonts icons
  height: '22px',  // Adjust height to match the size of Google Fonts icons
};

const LoggedInNavbar = ({ user, handleLogout }) => (
  <nav className="navbar navbar-expand-lg navbar-light bg-light ">
  
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
      <ul className="navbar-nav ">
        <li className="nav-item dropdown">
          <a
            className="nav-link dropdown-toggle"
            
            id="navbarDropdown1"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <span className="material-symbols-outlined">&#xe745;</span>Müraciətlər
          </a>
          <div className="dropdown-menu" aria-labelledby="navbarDropdown1">
            <Link className="dropdown-item" to="/vacation">
              Məzuniyyət müraciəti
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
            <span className="material-symbols-outlined">&#xea4f;</span>İşçi uçotu
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
            <span className="material-symbols-outlined">&#xe57d;</span>Əmək haqqı
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
          <span className="material-symbols-outlined">&#xe80c;</span>Təlimlər
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/kpi">
          <span className="material-symbols-outlined">&#xf6ee;</span>KPİ
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/trainings">
          <span className="material-symbols-outlined">&#xf772;</span>İşçi cəlbi
          </Link>
        </li>
      </ul>
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
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
  <nav className="navbar navbar-expand-lg navbar-light bg-light ">
   
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
          <span className="material-symbols-outlined">&#xe1a1;</span>Məhsul
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/pricing">
          <span className="material-symbols-outlined">&#xe57d;</span>Qiymətlər
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/guidance">
          <span className="material-symbols-outlined">&#xe99e;</span>Tətbiqetmə
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/contact">
          <span className="material-symbols-outlined">&#xe61b;</span>Əlaqə
          </Link>
        </li>
      </ul>
      <ul className="navbar-nav style={{ textAlign: 'right' }}">
        <li className="nav-item ">
          <Link className="nav-link underline-hover " to="/register">
          <span className="material-symbols-outlined">&#xe174;</span> Qeydiyyat
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link underline-hover" to="/login">
          <span className="material-symbols-outlined">&#xea77;</span>Daxil ol
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
    <div className="container-fluid">
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
