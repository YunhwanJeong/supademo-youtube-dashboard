import { useCallback } from "react";

interface Params {
  player: YT.Player | null;
  isPlaying: boolean;
  startTrim: number;
  endTrim: number;
  duration: number;
  currentTime: number;
  seekToTime: (time: number) => void;
}

export function useVideoControls({
  player,
  isPlaying,
  startTrim,
  endTrim,
  duration,
  currentTime,
  seekToTime,
}: Params) {
  const handleBackwordClick = useCallback(() => {
    if (!player) return;

    seekToTime((startTrim * duration) / 100);
  }, [player, seekToTime, startTrim, duration]);

  const handleForwardClick = useCallback(() => {
    if (!player) return;

    seekToTime((endTrim * duration) / 100);
  }, [player, seekToTime, endTrim, duration]);

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
