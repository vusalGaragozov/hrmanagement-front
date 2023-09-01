import React, { useState } from 'react';
import './Müraciətlər.css';
import Müraciət_forması from './Məzuniyyət müraciəti';
import Müraciətlər_siyahısı from './Müraciətlər siyahısı';
import İcazə from './İcazə forması'
import Xəstəlik_vərəqəsi from './Xəstəlik vərəqəsi';

const Müraciət_et = () => {
  const [activeSection, setActiveSection] = useState('form'); // Default to 'form'

  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="container-fluid">
      <br />
      <div className="row no-gutters">
        <nav className="col-md-2 d-none d-md-block sidebar">
          <div className="position-fixed">
            <ul className="nav flex-column">
              <li className="nav-item">
                <a
                  className={`nav-link ${activeSection === 'form' ? 'active' : ''}`}
                  href="#"
                  onClick={() => handleSectionClick('form')}
                >
                  <i className="bi bi-file-earmark-text"></i> Məzuniyyət müraciəti
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${activeSection === 'list' ? 'active' : ''}`}
                  href="#"
                  onClick={() => handleSectionClick('list')}
                >
                  <i className="bi bi-file-earmark-text"></i> İcazə forması
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${activeSection === 'sickness' ? 'active' : ''}`}
                  href="#"
                  onClick={() => handleSectionClick('sickness')}
                >
                  <i className="bi bi-file-earmark-text"></i> Xəstəlik vərəqəsi
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${activeSection === 'applicationList' ? 'active' : ''}`}
                  href="#"
                  onClick={() => handleSectionClick('applicationList')}
                >
                  <i className="bi bi-file-earmark-text"></i> Müraciətlər siyahısı
                </a>
              </li>
            </ul>
          </div>
        </nav>
        <div className="col-md-9 ms-sm-auto col-lg-10 px-md-4 content">
          {activeSection === 'form' && (
            <div className="container mt-5">
              <Müraciət_forması />
            </div>
          )}
          {activeSection === 'list' && (
            <div className="container mt-5">
              <İcazə/>
            </div>
          )}
          {activeSection === 'sickness' && (
            <div className="container mt-5">
              <Xəstəlik_vərəqəsi/>
            </div>
          )}
          {activeSection === 'applicationList' && (
            <div className="container mt-5">
              <Müraciətlər_siyahısı />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Müraciət_et;
