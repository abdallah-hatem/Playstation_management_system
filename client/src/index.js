import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { DevicesProvider } from './context/DevicesContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <AuthProvider>
      <DevicesProvider>
        <App />
      </DevicesProvider>
    </AuthProvider>
  </BrowserRouter>
  // </React.StrictMode>
);


