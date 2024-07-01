import { Button, TextField, Grid, Typography, Container } from '@mui/material';
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from './AppContext';

function LoginPage() {
  const { isLoggedIn, setIsLoggedIn } = useAppContext();
  const navigate = useNavigate();

  const handleLogin = (event) => {
    console.log('Login submitted');
    // setIsLoggedIn(true);
  };

const handleLogout = () => {
  setIsLoggedIn(false);
  localStorage.removeItem('isLoggedIn'); // Clear persisted state
  // navigate('/login');
};

  const handleSpotifyConnect = () => {
    // window.location.href = 'http://localhost:8080/get-spotify-auth-url';
    fetch('http://localhost:8080/get-spotify-auth-url', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': localStorage.getItem('sessionId')
      },
    })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Failed to fetch the Spotify auth URL');
        })
        .then(data => {
          window.location.href = data.spotifyAuthUrl;
        })
        .catch(error => console.error('Error:', error));
    document.cookie = `sessionId=${localStorage.getItem('sessionId')}; Secure; SameSite=None`;
    console.log('Session ID:', localStorage.getItem('sessionId'));
  };

  return (
      <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h5">Sign in</Typography>
          <form onSubmit={handleLogin} style={{ width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField variant="outlined" required fullWidth id="username" label="Username" name="username" autoComplete="username" />
              </Grid>
              <Grid item xs={12}>
                <TextField variant="outlined" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" fullWidth variant="contained" color="primary">Sign In</Button>
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button onClick={handleSpotifyConnect} variant="outlined" color="secondary" size="large">Connect to Spotify</Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
  );
}

export default LoginPage;
