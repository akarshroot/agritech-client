import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './date-picker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './interceptors/axios'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  // </React.StrictMode>
    <App />
);