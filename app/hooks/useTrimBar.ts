import { MutableRefObject, useCallback, useEffect, useState } from "react";
import { VideoIdType } from "../types/videoTypes";
import { debounce } from "../utils";

interface Params {
  videoId: VideoIdType["videoId"];
}

export function useTrimBar({ videoId }: Params) {
  const [startTrim, setStartTrim] = useState(0);
  const [endTrim, setEndTrim] = useState(100); // Percentage of the total video length

  // Load trim data from localStorage for the specific video
  useEffect(() => {
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

    loadTrimFromStorage();
  }, [videoId]);

  // Create a debounced save function using the custom debounce utility
  const debouncedSaveTrimToStorage = useCallback(
    debounce(() => {
      localStorage.setItem(
        `trim_${videoId}`,
        JSON.stringify({ startTrim, endTrim })
      );
    }), // Adjust delay as needed
    [videoId, startTrim, endTrim]
  );

  useEffect(() => {
    debouncedSaveTrimToStorage();
    // Clean up debounce on unmount
    return () => debouncedSaveTrimToStorage.cancel();
  }, [startTrim, endTrim, debouncedSaveTrimToStorage]);

  const handleDragStart = (
    e: React.MouseEvent | React.TouchEvent,
    isStart: boolean,
    trimContainerRef: MutableRefObject<HTMLDivElement | null>
  ) => {
    const parentRect = trimContainerRef.current?.getBoundingClientRect();

    if (!parentRect) return;

    // Function to calculate position based on mouse or touch event
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
    // Event listeners for mouse and touch
    const onMove = (event: MouseEvent | TouchEvent) => {
      calculatePosition(event);
    };
    const onStop = () => {
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
    handleDragStart,
  };
}
