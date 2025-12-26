import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { DailyGoalProvider } from './context/DailyGoalContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DailyGoalProvider defaultTarget={15}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </DailyGoalProvider>
  </React.StrictMode>
);