import { useCallback } from "react";

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
    seekToTime((startTrim * duration) / 100);
  }, [seekToTime, startTrim, duration]);

  const handleForwardClick = useCallback(() => {
    seekToTime((endTrim * duration) / 100);
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
