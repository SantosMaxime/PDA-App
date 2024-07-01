import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route, Navigate  } from 'react-router-dom';
import { AppProvider } from './AppContext';
import LoginPage from './LoginPage'; // Import LoginPage

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <AppProvider>
            <Router>
                <Routes>
                    <Route path="/*" element={<App />} />
                    <Route path="/login" element={<LoginPage />} />
                    {/* Add more routes as needed */}
                </Routes>
            </Router>
        </AppProvider>
    </React.StrictMode>
);

reportWebVitals();