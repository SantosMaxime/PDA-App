import React, { createContext, useContext, useState } from "react";

const SpotifyContext = createContext();

export const SpotifyProvider = ({ children }) => {
    const [device, setDevice] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState({
        title: null,
        artist: null,
        albumUrl: null,
        albumId: null,
    });
    const [volume, setVolume] = useState(50);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    return (
        <SpotifyContext.Provider
            value={{
                device,
                setDevice,
                isPlaying,
                setIsPlaying,
                currentTrack,
                setCurrentTrack,
                volume, // % 0-100
                setVolume,
                progress, // ms
                setProgress,
                duration,
                setDuration
            }}
        >
            {children}
        </SpotifyContext.Provider>
    );
};

export const useSpotifyContext = () => {
    return useContext(SpotifyContext);
};

export default SpotifyContext;
