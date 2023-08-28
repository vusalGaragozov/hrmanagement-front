import React from 'react';


const Navbar = () => {
  return (
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
      </div>
    </nav>
  );
};

export default Navbar;
