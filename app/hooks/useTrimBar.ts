import { MutableRefObject, useCallback, useEffect, useState } from "react";
import { VideoIdType } from "../types/videoTypes";
import { debounce } from "../utils";

interface Params {
  videoId: VideoIdType["videoId"];
}

export function useTrimBar({ videoId }: Params) {
  const [startTrim, setStartTrim] = useState(0);
  const [endTrim, setEndTrim] = useState(100); // Percentage of the total video length
  const [isDragging, setIsDragging] = useState(false);

  // Loads saved trim data from localStorage for the specific video
  const loadTrimFromStorage = () => {
    const storedTrim = localStorage.getItem(`trim_${videoId}`);
    if (storedTrim) {
      const { startTrim, endTrim } = JSON.parse(storedTrim);
      setStartTrim(startTrim);
      setEndTrim(endTrim);
    } else {
      // Default values if no saved trim data exists for this video
      setStartTrim(0);
      setEndTrim(100);
    }
  };

  // Debounced function to save trim values to localStorage
  const debouncedSaveTrimToStorage = useCallback(
    debounce(() => {
      localStorage.setItem(
        `trim_${videoId}`,
        JSON.stringify({ startTrim, endTrim })
      );
    }),
    [videoId, startTrim, endTrim]
  );

  // Saves trim values on change
  useEffect(() => {
    debouncedSaveTrimToStorage();
    // Clean up debounce on unmount
    return () => debouncedSaveTrimToStorage.cancel();
  }, [debouncedSaveTrimToStorage]);

  const handleDragStart = (
    e: React.MouseEvent | React.TouchEvent,
    isStart: boolean,
    trimContainerRef: MutableRefObject<HTMLDivElement | null>
  ) => {
    const parentRect = trimContainerRef.current?.getBoundingClientRect();
    if (!parentRect) return;

    const calculatePosition = (event: MouseEvent | TouchEvent) => {
      const clientX =
        event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
      const position =
        Math.min(
          Math.max(0, (clientX - parentRect.left) / parentRect.width),
          1
        ) * 100;

      if (isStart) {
        setStartTrim(Math.min(position, endTrim - 1));
      } else {
        setEndTrim(Math.max(position, startTrim + 1));
      }
    };

    const onMove = (event: MouseEvent | TouchEvent) => {
      setIsDragging(true);
      calculatePosition(event);
    };

    const onStop = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onStop);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onStop);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onStop);
    document.addEventListener("touchmove", onMove);
    document.addEventListener("touchend", onStop);
  };

  return {
    startTrim,
    endTrim,
    isDragging,
    loadTrimFromStorage,
    handleDragStart,
  };
}
