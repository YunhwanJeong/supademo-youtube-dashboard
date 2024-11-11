import { useCallback } from "react";

interface Params {
  player: YT.Player | null;
  isPlaying: boolean;
  startTrim: number;
  duration: number;
}

export function useVideoControls({
  player,
  isPlaying,
  startTrim,
  duration,
}: Params) {
  const handlePlayback = useCallback(() => {
    if (player === null) return;
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.seekTo((startTrim * duration) / 100, true);
      player.playVideo();
    }
  }, [duration, isPlaying, player, startTrim]);

  return {
    handlePlayback,
  };
}
