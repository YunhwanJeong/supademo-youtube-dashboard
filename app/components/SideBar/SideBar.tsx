import { useInfiniteScroll } from "@/app/hooks/useInfiniteScroll";
import { useVideoList } from "@/app/hooks/useVideoList";
import type { VideoItemType } from "@/app/types/videoTypes";
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
  const { videos, loading, loadMore, handleSearch } = useVideoList({
    rawVideos,
  });

  const { observerRef } = useInfiniteScroll({ onIntersect: loadMore });

  return (
    <aside className="flex flex-col gap-y-6 w-full order-2 p-5 border-t border-gray-100 lg:-order-none lg:w-96 lg:border-t-0 lg:border-r lg:overflow-y-auto lg:max-h-sidebar">
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
          <div ref={observerRef} className="h-10 lg:min-h-10"></div>
        )}
      </div>
    </aside>
  );
}
