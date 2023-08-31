import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import '../style.css';
import { API_URL } from '../Other/config';
import { AuthContext } from '../Main/AuthContext';

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
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" href="/">
        HR Management
      </a>
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
          <li className="nav-item ">
            <a
              className="nav-link"
              href="#"
              id="navbarDropdown1"
              role="button"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Müraciət et
            </a>
            <div >
              <Link className="dropdown-item" to="/vacation">
             
              </Link>
            </div>
          </li>
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
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
              <Link className="dropdown-item" to="vacationtable">
                Məzuniyyət cədvəli
              </Link>
              <Link className="dropdown-item" to="stafflist">
                Əməkdaş siyahısı
              </Link>
              <Link className="dropdown-item" to="staffrequests">
                Müraciətlər
              </Link>
            </div>
          </li>
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
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
              KPİ sistemləri
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/recruitment">
              İşçi cəlbi
            </Link>
          </li>
        </ul>
        <ul className="navbar-nav">
          {user ? (
            <>
              <li className="nav-item">
                <span className="nav-link">
                  {user.firstname} {user.lastname}
                </span>
              </li>
              <li className="nav-item">
              <button
  className="nav-link btn custom-logout-btn"
  onClick={handleLogout}
  style={{ backgroundColor: 'red', color: 'white' }}
>
  Logout
</button>


              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link underline-hover" to="/register">
                  Register
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link underline-hover" to="/login">
                  Login
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
