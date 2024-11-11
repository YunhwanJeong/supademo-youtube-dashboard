import { MutableRefObject, useEffect, useRef, useState } from "react";

interface Props {
  startTrim: number;
  endTrim: number;
  currentTime: number;
  duration: number;
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
  onDragStart,
}: Props) {
  const [containerWidth, setContainerWidth] = useState(0);
  const trimContainerRef = useRef<HTMLDivElement | null>(null);

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

  return (
    <div
      ref={trimContainerRef}
      className="relative w-full bg-gray-200 h-4 rounded-md flex items-center"
    >
      {/* Trimmed background */}
      <div
        className="h-full bg-indigo-700 bg-opacity-30 absolute"
        style={{
          transform: `translateX(${(startTrim / 100) * containerWidth}px)`,
          width: `${((endTrim - startTrim) / 100) * containerWidth}px`,
        }}
      ></div>

      {/* Start trim handle */}
      <div
        className="h-6 w-2 bg-indigo-700 rounded-full cursor-pointer absolute"
        style={{
          transform: `translateX(${(startTrim / 100) * containerWidth}px)`,
        }}
        onMouseDown={(e) => onDragStart(e, true, trimContainerRef)}
        onTouchStart={(e) => onDragStart(e, true, trimContainerRef)}
      ></div>

      {/* End trim handle */}
      <div
        className="h-6 w-2 bg-indigo-700 rounded-full cursor-pointer absolute"
        style={{
          transform: `translateX(${(endTrim / 100) * containerWidth}px)`,
        }}
        onMouseDown={(e) => onDragStart(e, false, trimContainerRef)}
        onTouchStart={(e) => onDragStart(e, false, trimContainerRef)}
      ></div>
      {/* Current time indicator */}
      <div
        className="absolute h-6 w-1 bg-red-600 rounded-full pointer-events-none"
        style={{
          transform: `translateX(${
            (currentTime / duration) * containerWidth
          }px)`,
        }}
      ></div>
    </div>
  );
}
