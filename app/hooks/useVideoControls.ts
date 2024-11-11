import { useCallback } from "react";
import { calculatePercentage } from "../utils";

interface Params {
  player: YT.Player | null;
  isPlaying: boolean;
  startTrim: number;
  endTrim: number;
  duration: number;
  currentTime: number;
  seekToTime: (time: number) => void;
  togglePlayBack: () => void;
}

export function useVideoControls({
  startTrim,
  endTrim,
  duration,
  seekToTime,
  togglePlayBack,
}: Params) {
  const handleBackwordClick = useCallback(() => {
    seekToTime(calculatePercentage(startTrim, duration));
  }, [seekToTime, startTrim, duration]);

  const handleForwardClick = useCallback(() => {
    seekToTime(calculatePercentage(endTrim, duration));
  }, [seekToTime, endTrim, duration]);

  const handlePlaybackClick = useCallback(() => {
    togglePlayBack();
  }, [togglePlayBack]);

  return {
    handleBackwordClick,
    handlePlaybackClick,
    handleForwardClick,
  };
}
