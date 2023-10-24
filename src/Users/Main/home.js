import React, { useContext } from 'react';
import { AuthContext } from '../Main/AuthContext.js';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-light">
      <div className="container py-5">
        <div className="row">
          <div className="col-md-3">
            <h5>About</h5>
            <ul className="list-unstyled">
              <li><a href="#">Team</a></li>
              <li><a href="#">Products</a></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h5>Social</h5>
            <ul className="list-unstyled">
              <li><a href="#">Facebook</a></li>
              <li><a href="#">Instagram</a></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h5>Legislation</h5>
            <ul className="list-unstyled">
              <li><a href="#">Labor Code</a></li>
              <li><a href="#">Civil Code</a></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h5>Address</h5>
            <p>123 Main St, Anytown USA 12345</p>
          </div>
        </div>
        <hr />
        <p className="text-muted text-center">© {currentYear} HR Management</p>
      </div>
    </footer>
  );
};

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="wrapper">
      <div className="container main">
        <h2>IR İdarəetmə Moduluna xoş gəlmisiniz!</h2>
        {user ? (
          <p>Siz {user.firstname} {user.lastname} olaraq daxil olmusuz.</p>
        ) : (
          <p>Öz səhifənizə giriş əldə etmək üçün daxil olun və ya qeydiyyatdan keçin.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Home;