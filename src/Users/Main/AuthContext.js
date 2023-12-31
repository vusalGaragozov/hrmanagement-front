import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from "../Other/config.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_URL}/check-auth`, { withCredentials: true })
      .then((response) => {
        const { user, isAuthenticated } = response.data;
        if (isAuthenticated) {
          setUser(user);
          setAuthenticated(true);
        } else {
          setUser(null);
          setAuthenticated(false);
        }
        setIsLoaded(true);
      })
      .catch((error) => {
        console.error('Error checking authentication status:', error);
        setIsLoaded(true);
      });
  }, []);

  // Set the loggedInUserFullName using user.firstname and user.lastname
  const loggedInUserFullName = user ? `${user.firstname} ${user.lastname}` : 'John Doe';
  const loggedInUserEmail = user ? `${user.email}` : 'John Doe';
  return (
    <AuthContext.Provider
      value={{ user, setUser, isAuthenticated, setAuthenticated, loggedInUserFullName, loggedInUserEmail }}
    >
      {!isLoaded ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
