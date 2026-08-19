import React from 'react';
import ReactDOM from 'react-dom/client';
import LogRocket from 'logrocket';
import App from './App';
import './index.css';

LogRocket.init('vss79i/mini-fpl');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

