import { VideoItemType } from "@/app/types/videoTypes";
import { useCallback, useEffect, useState } from "react";

interface Params {
  rawVideos: VideoItemType[];
}

export function useVideoList({ rawVideos }: Params) {
  const videosPerPage = 10;
  const [page, setPage] = useState(2);
  const [searchResults, setSearchResults] =
    useState<VideoItemType[]>(rawVideos);
  const [videos, setVideos] = useState<VideoItemType[]>([]);
  const [loading, setLoading] = useState(false);

  // Update videos when searchResults changes
  useEffect(() => {
    setVideos(searchResults.slice(0, videosPerPage));
  }, [searchResults]);

  const loadMore = useCallback(async () => {
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
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

    setVideos((prevVideos) => [...prevVideos, ...newVideos]);
    setPage((prevPage) => prevPage + 1);
    setLoading(false);
  }, [loading, page, searchResults, videosPerPage]);

  const handleSearch = useCallback(
    (query: string) => {
      if (query.trim() === "") {
        setSearchResults(rawVideos); // Reset to original list when search is cleared
      } else {
        const filteredVideos = rawVideos.filter(
          (video) =>
            video.snippet.title.toLowerCase().includes(query.toLowerCase()) ||
            video.snippet.description
              .toLowerCase()
              .includes(query.toLowerCase())
        );
        setSearchResults(filteredVideos);
      }
      setPage(2); // Reset pagination whenever a new search is made
    },
    [rawVideos]
  );

  return { videos, loading, loadMore, handleSearch };
}
