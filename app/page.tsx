"use client";

import { useState } from "react";
import SideBar from "./components/SideBar";
import VideoPlayer from "./components/VideoPlayer";
import { VideoItemType } from "./types/videoTypes";

export default function Home() {
  const [selectedVideo, setSelectedVideo] = useState<VideoItemType | null>(
    null
  );

  const handleVideoSelect = (video: VideoItemType) => {
    setSelectedVideo(video);
  };

  return (
    <main className="flex flex-col">
      <SideBar
        selectedVideo={selectedVideo}
        onVideoSelect={handleVideoSelect}
      />
      <VideoPlayer selectedVideo={selectedVideo} />
    </main>
  );
}
