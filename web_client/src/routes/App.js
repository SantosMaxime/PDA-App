import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import SpotifyPlayer from '../components/SpotifyPlayer';
import "../css/App.css";
import { Grid } from "@mui/material";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import {
    spotifyPlaybackState,
    spotifyPlay,
    spotifyPause,
    spotifySkipToNext,
    spotifySkipToPrevious,
} from "../api/SpotifyPlayer";
import { weatherData } from "../api/Weather";
import { useSpotifyContext } from "../context/SpotifyContext";

axios.defaults.withCredentials = true;

function App() {

    const {
        setDevice,
        setIsPlaying,
        setCurrentTrack,
        setVolume,
        setProgress,
        setDuration,
    } = useSpotifyContext();

    const navigate = useNavigate();

    function fetchUserData() {
        axios.get('http://localhost:8086/api/auth/me')
            .then(response => {
                console.log('User Data:', response.data);
                localStorage.setItem('spotifyToken', JSON.stringify(response.data.spotifyToken));

                // Handle user data, update state, etc.
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                if (error.response.status === 401) {
                    localStorage.removeItem('spotifyToken');
                    navigate('/login');
                    // Handle logout, redirect to login, etc.
                }
            });
    }

    useEffect(() => {
        fetchUserData();
        weatherData().then(response => {
            console.log("Weather data:", response);
        }).catch(error => {
            console.error('Error fetching meteo data:', error);
        });
    }, []);

    // useEffect every seconds
    useEffect(() => {
        const interval = setInterval(() => {
            spotifyPlaybackState().then(response => {
                setDevice(response.device);
                setIsPlaying(response.is_playing);
                setCurrentTrack({
                    title: response.item.name,
                    artist: response.item.artists[0].name,
                    albumUrl: response.item.album.images[0].url,
                    albumId: response.item.album.id,
                })
                setVolume(response.device.volume_percent);
                setProgress(response.progress_ms);
                setDuration(response.item.duration_ms);
                console.log("Spotify Devices:", response);
            }).catch(error => {
                console.error('Error fetching Spotify devices:', error);
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="App">
            <Header />

            <Grid container className={"Main-container"}>
                <SpotifyPlayer />
            </Grid>
        </div>
    );
}

export default App;
