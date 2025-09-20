import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import AppDemo from './AppDemo';
import reportWebVitals from './reportWebVitals';

// Use AppDemo if Firebase is not configured (for testing/demo)
const isFirebaseConfigured = process.env.REACT_APP_FIREBASE_API_KEY && 
                            process.env.REACT_APP_FIREBASE_API_KEY !== 'your_api_key_here';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {isFirebaseConfigured ? <App /> : <AppDemo />}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
