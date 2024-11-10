"use client";

declare global {
  interface Window {
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

import { VideoItemType } from "@/app/types/videoTypes";
import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "../utils";

interface Props {
  selectedVideo: VideoItemType;
}

export default function VideoPlayer({ selectedVideo }: Props) {
  const playerRef = useRef<HTMLDivElement | null>(null);
  const [player, setPlayer] = useState<YT.Player | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [startTrim, setStartTrim] = useState(0);
  const [endTrim, setEndTrim] = useState(100); // Percentage of the total video length
  const [duration, setDuration] = useState(0);
  const trimContainerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const initializePlayer = useCallback(() => {
    if (playerRef.current === null || !selectedVideo?.id.videoId) return;
    if (player) player.destroy(); // Destroy existing player if re-rendered

    setPlayer(
      new window.YT.Player(playerRef.current, {
        videoId: selectedVideo.id.videoId,
        playerVars: {
          controls: 0,
          showinfo: 0,
          rel: 0,
          modestbranding: 1,
          enablejsapi: 1,
          iv_load_policy: 3,
          disablekb: 1,
        },
        events: {
          onReady: (event: YT.PlayerEvent) => {
            setIsPlaying(false);
            setDuration(event.target.getDuration());
          },
          onStateChange: handlePlayerStateChange,
        },
      })
    );
  }, [selectedVideo.id.videoId]);

  // Create a debounced save function using the custom debounce utility
  const debouncedSaveTrimToStorage = useCallback(
    debounce(() => {
      localStorage.setItem(
        `trim_${selectedVideo.id.videoId}`,
        JSON.stringify({ startTrim, endTrim })
      );
    }), // Adjust delay as needed
    [selectedVideo.id.videoId, startTrim, endTrim]
  );

  // Load trim data from localStorage for the specific video
  useEffect(() => {
    const loadTrimFromStorage = () => {
      const storedTrim = localStorage.getItem(
        `trim_${selectedVideo.id.videoId}`
      );
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
  }, [selectedVideo.id.videoId]);

  useEffect(() => {
    debouncedSaveTrimToStorage();
    // Clean up debounce on unmount
    return () => debouncedSaveTrimToStorage.cancel();
  }, [startTrim, endTrim, debouncedSaveTrimToStorage]);

  useEffect(() => {
    if (window.YT) {
      initializePlayer();
      return;
    }
    // Load the YouTube Iframe API script if not already loaded
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    const firstScript = document.getElementsByTagName("script")[0];
    firstScript.parentNode?.insertBefore(script, firstScript);
    window.onYouTubeIframeAPIReady = initializePlayer;

    return () => {
      window.onYouTubeIframeAPIReady = undefined;
    };
  }, [initializePlayer]);

  useEffect(() => {
    if (
      player &&
      isPlaying &&
      player.getCurrentTime() >= (endTrim * duration) / 100
    ) {
      player.pauseVideo();
      setIsPlaying(false);
    }
  }, [endTrim, isPlaying, player, duration]);

  useEffect(() => {
    if (trimContainerRef.current) {
      console.log(
        "trimContainerRef.current.getBoundingClientRect().width: ",
        trimContainerRef.current.getBoundingClientRect().width
      );
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

  const handlePlayerStateChange = (event: YT.OnStateChangeEvent) => {
    const { YT } = window;
    if (event.data === YT.PlayerState.PLAYING) {
      setIsPlaying(true);
    } else if (
      event.data === YT.PlayerState.PAUSED ||
      event.data === YT.PlayerState.ENDED
    ) {
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (player === null) return;
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.seekTo((startTrim * duration) / 100, true);
      player.playVideo();
    }
  };

  const handleDragStart = (
    e: React.MouseEvent | React.TouchEvent,
    isStart: boolean
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

  return (
    <div className="pb-5">
      <div
        ref={playerRef}
        className="w-full h-80 pointer-events-none mb-3"
      ></div>

      <div className="px-5">
        <div className="p-1 flex justify-center gap-x-5 bg-slate-300 rounded-xl mb-3">
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="fill-slate-800 size-12"
            >
              <path d="M9.195 18.44c1.25.714 2.805-.189 2.805-1.629v-2.34l6.945 3.968c1.25.715 2.805-.188 2.805-1.628V8.69c0-1.44-1.555-2.343-2.805-1.628L12 11.029v-2.34c0-1.44-1.555-2.343-2.805-1.628l-7.108 4.061c-1.26.72-1.26 2.536 0 3.256l7.108 4.061Z" />
            </svg>
          </button>
          <button onClick={togglePlayPause}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="fill-indigo-600 size-12"
            >
              {isPlaying ? (
                <path
                  fillRule="evenodd"
                  d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z"
                  clipRule="evenodd"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                  clipRule="evenodd"
                />
              )}
            </svg>
          </button>
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="fill-slate-800 size-12"
            >
              <path d="M5.055 7.06C3.805 6.347 2.25 7.25 2.25 8.69v8.122c0 1.44 1.555 2.343 2.805 1.628L12 14.471v2.34c0 1.44 1.555 2.343 2.805 1.628l7.108-4.061c1.26-.72 1.26-2.536 0-3.256l-7.108-4.061C13.555 6.346 12 7.249 12 8.689v2.34L5.055 7.061Z" />
            </svg>
          </button>
        </div>

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
            onMouseDown={(e) => handleDragStart(e, true)}
            onTouchStart={(e) => handleDragStart(e, true)}
          ></div>

          {/* End trim handle */}
          <div
            className="h-6 w-2 bg-indigo-700 rounded-full cursor-pointer absolute"
            style={{
              transform: `translateX(${(endTrim / 100) * containerWidth}px)`,
            }}
            onMouseDown={(e) => handleDragStart(e, false)}
            onTouchStart={(e) => handleDragStart(e, false)}
          ></div>
        </div>
      </div>
    </div>
  );
}
