import './App.css';
import { Grid } from '@mui/material';
import SpotifyWidget from './SpotifyWidget';

function HomePage() {
  return (
    <div>
      <header className="App-header">
        <Grid container className='pageContainerVertical'>
          <Grid item xs={12}>
            <Grid container className='pageContainerHorizontal'>
              <Grid item xs={5} className='widgetBox' borderRadius={5}>
                <SpotifyWidget />
              </Grid>
              <Grid item xs={5} className='widgetBox' borderRadius={5}>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container className='pageContainerHorizontal'>
              <Grid item xs={5} className='widgetBox' borderRadius={5}>
              </Grid>
              <Grid item xs={5} className='widgetBox' borderRadius={5}>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </header>
    </div>
  );
}

export default HomePage;
