import { useCallback, useEffect, useState } from "react";

interface Params {
  startTrim: number;
  endTrim: number;
}

export function useYouTubePlayer({ startTrim, endTrim }: Params) {
  const [player, setPlayer] = useState<YT.Player | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0); // New state for the current time

  const setPlayerInstance = useCallback((player: YT.Player) => {
    setPlayer(player);
  }, []);

  const handlePlayerReady = useCallback(
    (event: YT.PlayerEvent) => {
      setIsPlaying(false);
      setDuration(event.target.getDuration());
      // Set initial current time to `startTrim` when video is ready
      event.target.seekTo((startTrim / 100) * event.target.getDuration(), true);
      event.target.pauseVideo();
      setCurrentTime((startTrim / 100) * event.target.getDuration());
    },
    [startTrim]
  );

  const handlePlayerStateChange = useCallback(
    (event: YT.OnStateChangeEvent) => {
      const { YT } = window;
      if (event.data === YT.PlayerState.PLAYING) {
        setIsPlaying(true);
      } else if (
        event.data === YT.PlayerState.PAUSED ||
        event.data === YT.PlayerState.ENDED
      ) {
        setIsPlaying(false);
      }
    },
    []
  );

  useEffect(() => {
    if (
      player &&
      isPlaying &&
      typeof player.getCurrentTime === "function" && // Ensure getCurrentTime is a function
      player.getCurrentTime() >= (endTrim * duration) / 100
    ) {
      player.pauseVideo();
      setIsPlaying(false);
    }
  }, [endTrim, isPlaying, player, duration]);

  useEffect(() => {
    if (!player || !isPlaying) return;

    // Update the current time indicator
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
    duration,
    currentTime,
    setPlayerInstance,
    handlePlayerReady,
    handlePlayerStateChange,
  };
}
