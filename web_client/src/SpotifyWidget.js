import React from 'react';
import { Grid, svgIcon, IconButton, Icon } from '@mui/material';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import './SpotifyWidget.css';

function SpotifyWidget() {

  var playState = true;

  const handlePlayButtonClick = () => {
    fetch('http://localhost:8080/play', { // Assuming 'play' is for resuming or starting playback
      method: 'PUT', // Ensure this is correct; GET might be more appropriate if not altering server state
      headers: { 'Content-Type': 'application/json' },
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch((error) => {
      console.error('Error:', error);
    });
    playState = !playState;
  };

  const handlePauseButtonClick = () => {
    fetch('http://localhost:8080/pause', { // Assuming 'pause' is for pausing playback
      method: 'POST', // Ensure this is correct; GET might be more appropriate if not altering server state
      headers: { 'Content-Type': 'application/json' },
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch((error) => {
      console.error('Error:', error);
    });
    playState = !playState;
  }

  // Function to handle clicking the "Next" button
  const handleNextButtonClick = () => {
    fetch('http://localhost:8080/next', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  // Function to handle clicking the "Previous" button
  const handlePreviousButtonClick = () => {
    fetch('http://localhost:8080/previous', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  return (
    <Grid container className='spotifyWidgetContainer'>
      <div className='spotifyWidgetTopContainer'>
        <Grid item xs={7} className='spotifyWidgetTitleContainer'>
          <h2>Spotify</h2>
        </Grid>
      </div>
      <div className='spotifyWidgetBottomContainer'>
        <Grid item xs={12} className='spotifyWidgetPlayerContainer'>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handlePreviousButtonClick}
          >
            <SkipPreviousIcon fontSize='large'/>
          </IconButton>
          <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={playState ? handlePauseButtonClick : handlePlayButtonClick}
            >
              <PlayCircleIcon fontSize='large'/>
            </IconButton>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleNextButtonClick}
            >
              <SkipNextIcon fontSize='large'/>
            </IconButton>
          {/* <Grid item xs={5} className='spotifyWidgetImageContainer'>
          </Grid> */}
        </Grid>
      </div>
    </Grid>
  );
}

export default SpotifyWidget;