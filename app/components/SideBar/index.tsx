import rawVideoData from "@/app/data/data.json";
import type { VideoItemType } from "@/app/types/videoTypes";
import { useEffect, useRef, useState } from "react";
import SearchBar from "./SearchBar";
import VideoItem from "./VideoItem";

interface Props {
  selectedVideo: VideoItemType | null;
  onVideoSelect: (video: VideoItemType) => void;
}

const rawVideos = rawVideoData.items as VideoItemType[];

export default function SideBar({ selectedVideo, onVideoSelect }: Props) {
  const [page, setPage] = useState(2);
  const videosPerPage = 10;
  const [videos, setVideos] = useState<VideoItemType[]>(
    rawVideos.slice(0, videosPerPage)
  );
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    onVideoSelect(videos[0]);
  }, []);

  const loadVideos = () => {
    const startIndex = (page - 1) * videosPerPage;
    if (startIndex >= rawVideos.length) return;

    const newVideos = rawVideos.slice(startIndex, startIndex + videosPerPage);
    setVideos((prevVideos) => [...(prevVideos || []), ...newVideos]);
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadVideos();
        }
      },
      { threshold: 1.0 }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [loadVideos]);

  return (
    <aside className="flex flex-col gap-y-6 w-full order-2 p-5 border-t border-gray-100">
      <SearchBar />

      <div className="flex flex-col gap-y-5 ">
        {videos.map((video) => (
          <VideoItem
            key={`${video.id.kind}${video.id.videoId}`}
            isSelected={selectedVideo?.id.videoId === video.id.videoId}
            video={video}
            onClick={() => onVideoSelect(video)}
          />
        ))}
        <div ref={observerRef} className="h-10"></div>
      </div>
    </aside>
  );
}
