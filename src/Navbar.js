import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './style.css';
import { API_URL } from './config';
import { AuthContext } from './AuthContext.js';

const Navbar = () => {
  const { user, setAuthenticated } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      const response = await fetch(API_URL + '/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        localStorage.removeItem('authToken'); // Remove token
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
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown1"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Müraciət et
            </a>
            <div className="dropdown-menu" aria-labelledby="navbarDropdown1">
              <a className="dropdown-item" href="#">
                Məzuniyyət
              </a>
              <a className="dropdown-item" href="#">
                İcazə
              </a>
              <a className="dropdown-item" href="#">
                Xəstəlik vərəqəsi
              </a>
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
              <a className="dropdown-item" href="#">
                Yeni əməkdaş
              </a>
              <a className="dropdown-item" href="#">
                Məzuniyyət cədvəli
              </a>
              <a className="dropdown-item" href="#">
                Əməkdaş siyahısı
              </a>
              <a className="dropdown-item" href="#">
                Müraciətlər
              </a>
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
              <a className="dropdown-item" href="#">
                Tabel
              </a>
              <a className="dropdown-item" href="#">
                Hesablama cədvəli
              </a>
            </div>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Təlimlər
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              KPİ sistemləri
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              İşçi cəlbi
            </a>
          </li>
        </ul>
        <ul className="navbar-nav">
          {user ? (
            <>
              <li className="nav-item">
                <span className="nav-link">
                  Welcome, {user.firstname} {user.lastname}
                </span>
              </li>
              <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={handleLogout}>
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
