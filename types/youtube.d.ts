interface Window {
  YT: {
    Player: new (
      elementId: string,
      options: {
        videoId: string;
        playerVars?: Record<string, number | string>;
        events?: {
          onReady?: (event: { target: YTPlayer }) => void;
          onStateChange?: (event: { data: number }) => void;
          onError?: (event: { data: number }) => void;
        };
      }
    ) => YTPlayer;
    PlayerState: {
      PLAYING: number;
      PAUSED: number;
      ENDED: number;
    };
  };
  onYouTubeIframeAPIReady: () => void;
}

interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  destroy: () => void;
  getPlayerState: () => number;
  setVolume: (volume: number) => void;
  cueVideoById: (videoId: string) => void;
}
