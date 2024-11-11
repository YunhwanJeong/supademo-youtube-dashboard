import { useCallback } from "react";

interface Params {
  player: YT.Player | null;
  isPlaying: boolean;
  startTrim: number;
  endTrim: number;
  duration: number;
  currentTime: number;
  setCurrentTime: (time: number) => void;
}

export function useVideoControls({
  player,
  isPlaying,
  startTrim,
  endTrim,
  duration,
  currentTime,
  setCurrentTime,
}: Params) {
  const handleBackwordClick = useCallback(() => {
    if (!player) return;

    player.seekTo((startTrim * duration) / 100, true);
    player.pauseVideo();
    setCurrentTime((startTrim * duration) / 100);
  }, [player, startTrim, duration, setCurrentTime]);

  const handleForwardClick = useCallback(() => {
    if (!player) return;

    player.seekTo((endTrim / 100) * duration, true);
    player.pauseVideo();
    setCurrentTime((endTrim * duration) / 100);
  }, [player, duration, endTrim, setCurrentTime]);

  const handlePlaybackClick = useCallback(() => {
    if (!player) return;
    if (isPlaying) {
      player.pauseVideo();
      return;
    }

    player.seekTo(currentTime, true);
    player.playVideo();
  }, [isPlaying, player, currentTime]);

  return {
    handleBackwordClick,
    handlePlaybackClick,
    handleForwardClick,
  };
}
