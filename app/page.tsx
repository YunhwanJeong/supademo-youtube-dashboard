"use client";
import rawVideoData from "@/app/data/data.json";
import { useState } from "react";
import SideBar from "./components/SideBar/SideBar";
import VideoPlayer from "./components/VideoPlayer/VideoPlayer";
import { VideoItemType } from "./types/videoTypes";

const rawVideos = rawVideoData.items as VideoItemType[];

export default function Home() {
  const [selectedVideo, setSelectedVideo] = useState<VideoItemType>(
    rawVideos[0]
  );

  const handleVideoSelect = (video: VideoItemType) => {
    setSelectedVideo(video);
  };

  return (
    <main className="flex flex-col">
      <SideBar
        rawVideos={rawVideos}
        selectedVideo={selectedVideo}
        onVideoSelect={handleVideoSelect}
      />
      <VideoPlayer selectedVideo={selectedVideo} />
    </main>
  );
}
