import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import '@astrology-css/theme.css';
import '@astrology-css/base.css';
import '@astrology-css/home.css';
import '@astrology-css/work.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
