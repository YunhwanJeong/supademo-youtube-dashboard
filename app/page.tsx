"use client";
import rawVideoData from "@/app/data/data.json";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    document.body.classList.add("lg:overflow-hidden");
    return () => {
      document.body.classList.remove("lg:overflow-hidden");
    };
  }, []);

  return (
    <main className="flex flex-col lg:flex-row lg:border-b">
      <SideBar
        rawVideos={rawVideos}
        selectedVideo={selectedVideo}
        onVideoSelect={handleVideoSelect}
      />
      <VideoPlayer selectedVideo={selectedVideo} />
    </main>
  );
}
