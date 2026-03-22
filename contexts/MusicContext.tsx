"use client";

/// <reference path="../types/youtube.d.ts" />

import {
    createContext, useContext, useEffect, useRef, useState, useCallback, ReactNode
} from "react";

interface MusicContextType {
    isPlaying: boolean;
    toggle: () => void;
    volume: number;
    setVolume: (v: number) => void;
    isReady: boolean;
}

const MusicContext = createContext<MusicContextType | null>(null);

export function useMusic() {
    const ctx = useContext(MusicContext);
    if (!ctx) throw new Error("useMusic must be used inside MusicProvider");
    return ctx;
}

/**
 * Utility to extract YouTube video ID from various URL formats
 */
function getYouTubeID(url?: string) {
    if (!url) return null;
    
    // If it's already an ID (alphanumeric, 11 chars)
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
    
    // Handle various URL formats
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[2].length === 11) ? match[2] : null;
}

// YouTube video ID from the user (default fallback)
const DEFAULT_VIDEO_ID = "3jvQpuk-9q4";

export function MusicProvider({ children, musicUrl }: { children: ReactNode; musicUrl?: string }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolumeState] = useState(40);
    const [isReady, setIsReady] = useState(false);
    const playerRef = useRef<YTPlayer | null>(null);
    const hasInteractedRef = useRef(false);
    
    // Extract video ID from prop
    const videoId = getYouTubeID(musicUrl) || DEFAULT_VIDEO_ID;

    const initPlayer = useCallback(() => {
        if (playerRef.current || !window.YT || !window.YT.Player || !videoId) return;
        
        playerRef.current = new window.YT.Player("yt-music-player", {
            videoId: videoId,
            playerVars: {
                autoplay: 0,
                controls: 0,
                disablekb: 1,
                fs: 0,
                iv_load_policy: 3,
                modestbranding: 1,
                rel: 0,
                loop: 1,
                playlist: videoId, // Required for loop to work on single video
                origin: typeof window !== 'undefined' ? window.location.origin : '',
            },
            events: {
                onReady: (event) => {
                    const player = event.target;
                    player.setVolume(volume);
                    setIsReady(true);
                    
                    const saved = localStorage.getItem("cc-music-playing");
                    // Only autoplay if we've had interaction OR it was playing before
                    // Note: Browser might still block this until first click anyway
                    if (saved === "true" && hasInteractedRef.current) {
                        player.playVideo();
                    }
                },
                onStateChange: (event) => {
                    // YT.PlayerState.PLAYING = 1, PAUSED = 2, ENDED = 0
                    if (event.data === 1) {
                        setIsPlaying(true);
                        localStorage.setItem("cc-music-playing", "true");
                    } else if (event.data === 2 || event.data === 0) {
                        setIsPlaying(false);
                        localStorage.setItem("cc-music-playing", "false");
                    }
                },
                onError: (event) => {
                    console.error("YouTube Player Error:", event.data);
                }
            },
        });
    }, [volume, videoId]);

    // Handle video ID changes
    useEffect(() => {
        if (playerRef.current && isReady && videoId) {
            // Check current video ID to avoid redundant reloads
            const currentPlayer = playerRef.current;
            currentPlayer.cueVideoById(videoId);
            if (isPlaying) {
                currentPlayer.playVideo();
            }
        }
    }, [videoId, isReady, isPlaying]);

    useEffect(() => {
        // Load API if not present
        if (!document.getElementById("yt-api-script")) {
            const tag = document.createElement("script");
            tag.id = "yt-api-script";
            tag.src = "https://www.youtube.com/iframe_api";
            document.head.appendChild(tag);
        }

        if (window.YT && window.YT.Player) {
            initPlayer();
        } else {
            window.onYouTubeIframeAPIReady = initPlayer;
        }

        return () => {
            // Optional cleanup if component unmounts
            // window.onYouTubeIframeAPIReady = () => {};
        };
    }, [initPlayer]);

    const toggle = useCallback(() => {
        if (!playerRef.current || !isReady) return;
        hasInteractedRef.current = true;

        if (isPlaying) {
            playerRef.current.pauseVideo();
        } else {
            playerRef.current.playVideo();
        }
    }, [isPlaying, isReady]);

    const setVolume = useCallback((v: number) => {
        setVolumeState(v);
        if (playerRef.current && isReady) {
            playerRef.current.setVolume(v);
        }
    }, [isReady]);

    return (
        <MusicContext.Provider value={{ isPlaying, toggle, volume, setVolume, isReady }}>
            <div
                style={{ position: "fixed", top: "-9999px", left: "-9999px", width: 1, height: 1, pointerEvents: "none", visibility: "hidden", zIndex: -1 }}
                aria-hidden="true"
            >
                <div id="yt-music-player" />
            </div>
            {children}
        </MusicContext.Provider>
    );
}
