declare global {
  interface Window {
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

import { VideoItemType } from "@/app/types/videoTypes";
import { MutableRefObject, useCallback, useEffect, useState } from "react";
import { debounce } from "../../utils";
import TrimBar from "./TrimBar";
import VideoControls from "./VideoControls";
import YouTubePlayer from "./YouTubePlayer";

interface Props {
  selectedVideo: VideoItemType;
}

export default function VideoPlayer({ selectedVideo }: Props) {
  const [player, setPlayer] = useState<YT.Player | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [startTrim, setStartTrim] = useState(0);
  const [endTrim, setEndTrim] = useState(100); // Percentage of the total video length
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0); // New state for the current time

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

  useEffect(() => {
    debouncedSaveTrimToStorage();
    // Clean up debounce on unmount
    return () => debouncedSaveTrimToStorage.cancel();
  }, [startTrim, endTrim, debouncedSaveTrimToStorage]);

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
    if (
      player &&
      isPlaying &&
      typeof player.getCurrentTime === "function" && // Ensure getCurrentTime is a function
      player.getCurrentTime() >= (endTrim * duration) / 100
    ) {
      player.pauseVideo();
      setIsPlaying(false);
    }
  }, [endTrim, isPlaying, player, duration]);

  useEffect(() => {
    if (!player || !isPlaying) return;

    // Update the current time indicator
    const interval = setInterval(() => {
      const currentTime = player.getCurrentTime();

      // Check if currentTime exceeds endTrim and stop video if it does
      if (currentTime >= (endTrim / 100) * duration) {
        player.pauseVideo();
        setIsPlaying(false);
        setCurrentTime((endTrim / 100) * duration); // Align indicator to endTrim
      } else {
        setCurrentTime(currentTime);
      }
    }, 500); // Update every 500ms

    return () => clearInterval(interval);
  }, [isPlaying, player, endTrim, duration]);

  const handlePlayerInit = useCallback((player: YT.Player) => {
    setPlayer(player);
  }, []);

  const handlePlayerReady = useCallback(
    (event: YT.PlayerEvent) => {
      setIsPlaying(false);
      setDuration(event.target.getDuration());
      // Set initial current time to `startTrim` when video is ready
      event.target.seekTo((startTrim / 100) * event.target.getDuration(), true);
      event.target.pauseVideo();
      setCurrentTime((startTrim / 100) * event.target.getDuration());
    },
    [startTrim]
  );

  const handlePlayerStateChange = useCallback(
    (event: YT.OnStateChangeEvent) => {
      const { YT } = window;
      if (event.data === YT.PlayerState.PLAYING) {
        setIsPlaying(true);
      } else if (
        event.data === YT.PlayerState.PAUSED ||
        event.data === YT.PlayerState.ENDED
      ) {
        setIsPlaying(false);
      }
    },
    []
  );

  const handlePlayback = useCallback(() => {
    if (player === null) return;
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.seekTo((startTrim * duration) / 100, true);
      player.playVideo();
    }
  }, [duration, isPlaying, player, startTrim]);

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

  return (
    <div className="pb-5">
      <YouTubePlayer
        player={player}
        videoId={selectedVideo.id.videoId}
        onPlayerInit={handlePlayerInit}
        onReady={handlePlayerReady}
        onStateChange={handlePlayerStateChange}
      />

      <div className="px-5">
        <VideoControls isPlaying={isPlaying} onPlaybackClick={handlePlayback} />

        <TrimBar
          startTrim={startTrim}
          endTrim={endTrim}
          currentTime={currentTime}
          duration={duration}
          onDragStart={handleDragStart}
        />
      </div>
    </div>
  );
}
