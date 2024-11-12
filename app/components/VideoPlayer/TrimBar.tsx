import { calculatePercentage } from "@/app/utils";
import { MutableRefObject, useEffect, useRef, useState } from "react";

interface Props {
  startTrim: number;
  endTrim: number;
  currentTime: number;
  duration: number;
  isPlayerReady: boolean;
  onDragStart: (
    e: React.MouseEvent | React.TouchEvent,
    isStart: boolean,
    trimContainerRef: MutableRefObject<HTMLDivElement | null>
  ) => void;
}

export default function TrimBar({
  startTrim,
  endTrim,
  currentTime,
  duration,
  isPlayerReady,
  onDragStart,
}: Props) {
  const [containerWidth, setContainerWidth] = useState(0);
  const trimContainerRef = useRef<HTMLDivElement | null>(null);

  // Get and set trim container width for responsive handling
  useEffect(() => {
    if (trimContainerRef.current) {
      setContainerWidth(trimContainerRef.current.getBoundingClientRect().width);
    }
    const handleResize = () => {
      if (trimContainerRef.current) {
        setContainerWidth(
          trimContainerRef.current.getBoundingClientRect().width
        );
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [trimContainerRef]);

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds}`;
    } else {
      return `${minutes}:${seconds}`;
    }
  };

  return (
    <div
      ref={trimContainerRef}
      className="relative w-full bg-gray-200 h-10 rounded-md flex items-center"
    >
      {/* Trimmed background */}
      <div
        className="h-full bg-indigo-700 bg-opacity-30 absolute pointer-events-none"
        style={{
          transform: `translateX(${calculatePercentage(
            startTrim,
            containerWidth
          )}px)`,
          width: `${calculatePercentage(
            endTrim - startTrim,
            containerWidth
          )}px`,
        }}
      ></div>

      {/* Start trim handle */}
      <div
        className="h-11 w-2 bg-indigo-700 rounded-full cursor-pointer absolute"
        style={{
          transform: `translateX(${calculatePercentage(
            startTrim,
            containerWidth
          )}px)`,
        }}
        onMouseDown={(e) => onDragStart(e, true, trimContainerRef)}
        onTouchStart={(e) => onDragStart(e, true, trimContainerRef)}
      ></div>

      {/* End trim handle */}
      <div
        className="h-11 w-2 bg-indigo-700 rounded-full cursor-pointer absolute"
        style={{
          transform: `translateX(${calculatePercentage(
            endTrim,
            containerWidth
          )}px)`,
        }}
        onMouseDown={(e) => onDragStart(e, false, trimContainerRef)}
        onTouchStart={(e) => onDragStart(e, false, trimContainerRef)}
      ></div>
      {/* Current time indicator */}
      {isPlayerReady && (
        <>
          <div
            className="absolute h-11 w-1 bg-red-600 rounded-full pointer-events-none"
            style={{
              transform: `translateX(${
                (currentTime / duration) * containerWidth
              }px)`,
            }}
          >
            <div className="absolute -bottom-[2px] left-0 -translate-x-1/2 translate-y-full bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded shadow-md pointer-events-none">
              {formatTime(currentTime)}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
