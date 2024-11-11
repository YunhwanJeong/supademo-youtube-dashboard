import { useCallback, useEffect, useState } from "react";

interface Params {
  startTrim: number;
  endTrim: number;
  isDragging: boolean;
}

export function useYouTubePlayer({ startTrim, endTrim, isDragging }: Params) {
  const [player, setPlayer] = useState<YT.Player | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  // Initializes player states once ready
  const handlePlayerReady = useCallback((event: YT.PlayerEvent) => {
    setIsPlayerReady(true);
    setIsPlaying(false);
    setDuration(event.target.getDuration());
  }, []);
  const handlePlayerStateChange = useCallback(
    (event: YT.OnStateChangeEvent) => {
      const { YT } = window;
      if (event.data === YT.PlayerState.PLAYING) {
        setIsPlaying(true);
        return;
      }

      if (
        event.data === YT.PlayerState.PAUSED ||
        event.data === YT.PlayerState.ENDED
      ) {
        setIsPlaying(false);
      }
    },
    []
  );
  // Sync the player's currentTime with startTrim when the player is ready to play.
  useEffect(() => {
    if (!player || !isPlayerReady) return;
    setIsPlaying(false);
    player.seekTo((startTrim / 100) * duration, true);
    player.pauseVideo();
    setCurrentTime((startTrim / 100) * duration);
  }, [player, isPlayerReady]);
  // Prevent currentTime from going below startTrim when startTrim is dragging.
  useEffect(() => {
    if (!player || !isPlayerReady || !isDragging) return;
    if (currentTime < (startTrim / 100) * duration) {
      setIsPlaying(false);
      player.seekTo((startTrim / 100) * duration, true);
      player.pauseVideo();
      setCurrentTime((startTrim / 100) * duration);
    }
  }, [startTrim, isDragging]);
  // Prevent currentTime from going above endTrim when endTrim is dragging.
  useEffect(() => {
    if (!player || !isPlayerReady || !isDragging) return;
    if (currentTime > (endTrim / 100) * duration) {
      setIsPlaying(false);
      player.seekTo((endTrim / 100) * duration, true);
      player.pauseVideo();
      setCurrentTime((endTrim / 100) * duration);
    }
  }, [endTrim, isDragging]);
  // Pause video when currentTime exceeds endTrim during playback.
  useEffect(() => {
    if (
      player &&
      isPlaying &&
      typeof player.getCurrentTime === "function" &&
      player.getCurrentTime() >= (endTrim * duration) / 100
    ) {
      player.pauseVideo();
      setIsPlaying(false);
    }
  }, [endTrim, isPlaying, player, duration]);
  // Updates currentTime indicator while playing
  useEffect(() => {
    if (!player || !isPlaying) return;

    const interval = setInterval(() => {
      const currentTime = player.getCurrentTime();
      // Check if currentTime exceeds endTrim and stop video if it does
      if (currentTime >= (endTrim / 100) * duration) {
        player.pauseVideo();
        setIsPlaying(false);
        setCurrentTime((endTrim / 100) * duration); // Align indicator to endTrim
      } else {
        setCurrentTime(currentTime);
      }
    }, 500); // Update every 500ms

    return () => clearInterval(interval);
  }, [isPlaying, player, endTrim, duration]);

  return {
    player,
    isPlaying,
    isPlayerReady,
    duration,
    currentTime,
    setPlayer,
    setIsPlayerReady,
    setCurrentTime,
    handlePlayerReady,
    handlePlayerStateChange,
  };
}
