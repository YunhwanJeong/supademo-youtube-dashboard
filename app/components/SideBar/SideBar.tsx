import type { VideoItemType } from "@/app/types/videoTypes";
import { useCallback, useEffect, useRef, useState } from "react";
import LoadingSpinner from "../LoadingSpinner";
import SearchBar from "./SearchBar";
import VideoItem from "./VideoItem";

interface Props {
  rawVideos: VideoItemType[];
  selectedVideo: VideoItemType | null;
  onVideoSelect: (video: VideoItemType) => void;
}

export default function SideBar({
  rawVideos,
  selectedVideo,
  onVideoSelect,
}: Props) {
  const [page, setPage] = useState(2);
  const videosPerPage = 10;
  const [videos, setVideos] = useState<VideoItemType[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] =
    useState<VideoItemType[]>(rawVideos);
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setVideos(searchResults.slice(0, videosPerPage));
  }, [searchResults]);

  const loadVideos = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    const startIndex = (page - 1) * videosPerPage;
    if (startIndex >= searchResults.length) {
      setLoading(false);
      return;
    }

    const newVideos = searchResults.slice(
      startIndex,
      startIndex + videosPerPage
    );
    // Simulate a network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    setVideos((prevVideos) => [...(prevVideos || []), ...newVideos]);
    setPage((prevPage) => prevPage + 1);
    setLoading(false);
  }, [loading, page, searchResults]);

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

  const handleSearch = (query: string) => {
    if (query.trim() === "") {
      setSearchResults(rawVideos); // Reset to original list when search is cleared
    } else {
      const filteredVideos = rawVideos.filter(
        (video) =>
          video.snippet.title.toLowerCase().includes(query.toLowerCase()) ||
          video.snippet.description.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filteredVideos);
      setPage(2); // Reset pagination
    }
  };

  return (
    <aside className="flex flex-col gap-y-6 w-full order-2 p-5 border-t border-gray-100">
      <SearchBar onSearch={handleSearch} />

      <div className="flex flex-col gap-y-5 ">
        {videos.map((video) => (
          <VideoItem
            key={`${video.id.kind}${video.id.videoId}`}
            isSelected={selectedVideo?.id.videoId === video.id.videoId}
            video={video}
            onClick={() => onVideoSelect(video)}
          />
        ))}

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div ref={observerRef} className="h-10"></div>
        )}
      </div>
    </aside>
  );
}
