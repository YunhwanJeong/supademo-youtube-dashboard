declare global {
  interface Window {
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

import { useTrimBar } from "@/app/hooks/useTrimBar";
import { useVideoControls } from "@/app/hooks/useVideoControls";
import { useYouTubePlayer } from "@/app/hooks/useYouTubePlayer";
import { VideoItemType } from "@/app/types/videoTypes";
import TrimBar from "./TrimBar";
import VideoControls from "./VideoControls";
import YouTubePlayer from "./YouTubePlayer";

interface Props {
  selectedVideo: VideoItemType;
}

export default function VideoPlayer({ selectedVideo }: Props) {
  const {
    startTrim,
    endTrim,
    isDragging,
    loadTrimFromStorage,
    handleDragStart,
  } = useTrimBar({
    videoId: selectedVideo.id.videoId,
  });

  const {
    player,
    isPlaying,
    isPlayerReady,
    duration,
    currentTime,
    seekToTime,
    handlePlayerInitialize,
    handlePlayerReady,
    handlePlayerStateChange,
  } = useYouTubePlayer({ startTrim, endTrim, isDragging, loadTrimFromStorage });

  const { handleBackwordClick, handlePlaybackClick, handleForwardClick } =
    useVideoControls({
      player,
      isPlaying,
      startTrim,
      endTrim,
      duration,
      currentTime,
      seekToTime,
    });

  return (
    <div className="pb-9 lg:self-center lg:w-7/12 lg:max-w-screen-lg lg:my-0 lg:mx-auto lg:pt-9">
      <YouTubePlayer
        player={player}
        videoId={selectedVideo.id.videoId}
        onPlayerInitialize={handlePlayerInitialize}
        onReady={handlePlayerReady}
        onStateChange={handlePlayerStateChange}
      />

      <div className="px-7 lg:p-0">
        <VideoControls
          isPlaying={isPlaying}
          onBackwordClick={handleBackwordClick}
          onPlaybackClick={handlePlaybackClick}
          onForwardClick={handleForwardClick}
        />

        <TrimBar
          startTrim={startTrim}
          endTrim={endTrim}
          currentTime={currentTime}
          duration={duration}
          isPlayerReady={isPlayerReady}
          onDragStart={handleDragStart}
        />
      </div>
    </div>
  );
}
