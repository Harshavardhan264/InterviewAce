import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    // Intercept response errors globally
    const interceptorId = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // If it's a network error (server is offline or CORS issue)
        if (!error.response) {
          setApiError({
            message: 'Network disruption. The backend server seems to be unreachable.',
            url: error.config?.url || 'N/A',
            method: error.config?.method?.toUpperCase() || 'N/A',
            status: 'OFFLINE',
            details: error.message || 'Server Connection Offline',
            timestamp: new Date().toLocaleString()
          });
        } else {
          const status = error.response.status;
          
          // Skip 401s on login routes to let the local UI display wrong password alerts
          const isAuthPage = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');
          
          if (!isAuthPage) {
            setApiError({
              message: error.response.data?.message || 'A server-side operation failed.',
              url: error.config?.url || 'N/A',
              method: error.config?.method?.toUpperCase() || 'N/A',
              status: status,
              details: typeof error.response.data === 'object' ? JSON.stringify(error.response.data) : error.response.data,
              timestamp: new Date().toLocaleString()
            });
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptorId);
    };
  }, []);

  const clearApiError = () => {
    setApiError(null);
  };

  return (
    <ErrorContext.Provider value={{ apiError, setApiError, clearApiError }}>
      {children}
    </ErrorContext.Provider>
  );
};
