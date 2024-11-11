import { useCallback, useEffect, useState } from "react";

interface Params {
  startTrim: number;
  endTrim: number;
  isDragging: boolean;
  loadTrimFromStorage: () => void;
}

export function useYouTubePlayer({
  startTrim,
  endTrim,
  isDragging,
  loadTrimFromStorage,
}: Params) {
  const [player, setPlayer] = useState<YT.Player | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const seekToTime = useCallback(
    (time: number) => {
      if (!player || !isPlayerReady) return;
      setIsPlaying(false);
      player.seekTo(time, true);
      player.pauseVideo();
      setCurrentTime(time);
    },
    [player, isPlayerReady]
  );

  const togglePlayBack = useCallback(() => {
    if (!player) return;
    if (isPlaying) {
      player.pauseVideo();
      return;
    }

    player.seekTo(currentTime, true);
    player.playVideo();
  }, [currentTime, isPlaying, player]);

  // Sync the player's currentTime with startTrim when the player is ready to play.
  useEffect(() => {
    seekToTime((startTrim / 100) * duration);
  }, [seekToTime]);

  // Prevent currentTime from going below startTrim when startTrim is dragging.
  useEffect(() => {
    if (!isDragging) return;
    if (currentTime < (startTrim / 100) * duration) {
      seekToTime((startTrim / 100) * duration);
    }
  }, [startTrim, isDragging, seekToTime]);

  // Prevent currentTime from going above endTrim when endTrim is dragging.
  useEffect(() => {
    if (!isDragging) return;
    if (currentTime > (endTrim / 100) * duration) {
      seekToTime((endTrim / 100) * duration);
    }
  }, [endTrim, isDragging, seekToTime]);

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
        seekToTime((endTrim / 100) * duration);
      } else {
        setCurrentTime(currentTime);
      }
    }, 500); // Update every 500ms

    return () => clearInterval(interval);
  }, [isPlaying, seekToTime, endTrim, duration]);

  const handlePlayerInitialize = useCallback(
    (player: YT.Player) => {
      loadTrimFromStorage();
      setPlayer(player);
      setIsPlayerReady(false);
    },
    [loadTrimFromStorage]
  );

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

  return {
    player,
    isPlaying,
    isPlayerReady,
    duration,
    currentTime,
    seekToTime,
    togglePlayBack,
    handlePlayerInitialize,
    handlePlayerReady,
    handlePlayerStateChange,
  };
}
