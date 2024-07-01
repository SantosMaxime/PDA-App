import React, { useEffect } from 'react';
import './App.css';
import HomePage from './HomePage';
import { useAppContext } from './AppContext';
import {useLocation, useNavigate} from 'react-router-dom';

function App() {
  const { isLoggedIn, setIsLoggedIn } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  if (!localStorage.getItem('sessionId')) {
    localStorage.setItem('sessionId', Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
  }

  function checkLoginState() {
    const success = localStorage.getItem('success isLoggedIn');
    console.log('//Checking Login State//\nResponse:', success);
    if (success) {
      setIsLoggedIn(true);
    }
  }

  function callAuthHandler() {
    fetch('http://localhost:8080/is-authenticated', {
      method: 'GET',
      credentials: 'include', // Ensure cookies are sent with the request
      headers: { 'Content-Type': 'application/json', 'X-Session-ID': localStorage.getItem('sessionId') },
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (data.isAuthenticated) {
        console.log('User is authenticated');
        setIsLoggedIn(true);
        return true;
      } else {
        console.log('User is not authenticated');
        setIsLoggedIn(false);
        return false;
      }
    })
    .catch(error => console.error('Error:', error));
    return false;
  }

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const success = queryParams.get('success');

    if (isLoggedIn) {
        checkLoginState();
    }

    if (success) {
      if (callAuthHandler()) {
        localStorage.setItem('success isLoggedIn', 'true'); // Persist the login state
        navigate('/');
      } else {
        localStorage.removeItem('success isLoggedIn');
        // navigate('/login');
        }
    } else {
      if (!isLoggedIn) {
        navigate('/login');
        console.log('Redirecting to login...');
      }
    }
  }, [location, setIsLoggedIn, navigate]);

  return (
      <div className="App">
        {isLoggedIn ? <HomePage /> : null /* This check might be redundant if using routing for redirection. */}
      </div>
  );
}

export default App;
