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
  const { startTrim, endTrim, handleDragStart } = useTrimBar({
    videoId: selectedVideo.id.videoId,
  });

  const {
    player,
    isPlaying,
    isPlayerReady,
    duration,
    currentTime,
    setPlayerInstance,
    setIsPlayerReady,
    handlePlayerReady,
    handlePlayerStateChange,
  } = useYouTubePlayer({ startTrim, endTrim });

  const { handlePlayback } = useVideoControls({
    player,
    isPlaying,
    startTrim,
    duration,
  });

  return (
    <div className="pb-5 lg:flex-1">
      <YouTubePlayer
        player={player}
        videoId={selectedVideo.id.videoId}
        setPlayerInstance={setPlayerInstance}
        setIsPlayerReady={setIsPlayerReady}
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
          isPlayerReady={isPlayerReady}
          onDragStart={handleDragStart}
        />
      </div>
    </div>
  );
}
