import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Main/AuthContext.js';
import { API_URL } from '../Other/config.js';

const Login = () => {
  const navigate = useNavigate();
  const { setUser, setAuthenticated } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/login`, {
        email: email,
        password: password,
      }, { withCredentials: true });

      setUser(response.data.user);
      setAuthenticated(true);

      // Store user info and authenticated status in localStorage
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('authenticated', 'true');

      setEmail('');
      setPassword('');
      navigate('/');
    } catch (error) {
      setError('Yanlış şifrə');
    }
  };

  return (
    <div className="container" style={{ marginTop: '4rem' }}>
      <div className="row">
        <div className="col-7 mx-auto border border-success rounded p-4">
          {/* Add border and border-success classes */}
          <form>
            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Email</label>
              <div className="col-sm-10">
                <input
                  type="email"
                  className="form-control"
                  id="inputEmail3"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Şifrə</label>
              <div className="col-sm-10">
                <input
                  type="password"
                  className="form-control"
                  id="inputPassword3"
                  placeholder="Şifrə"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group row">
              <div className="col-sm-10">
                <button type="submit" className="btn btn-primary" onClick={handleLogin}>
                  Giriş et
                </button>
              </div>
            </div>
          </form>
          {error && <div className="alert alert-danger">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default Login;
