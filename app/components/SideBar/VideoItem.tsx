import type { VideoItemType } from "@/app/types/videoTypes";
import fallbackImage from "@/public/fallback-image.jpg";
import Image from "next/image";
import { useState } from "react";

interface Props {
  isSelected?: boolean;
  video: VideoItemType;
  onClick?: () => void;
}

export default function VideoItem({
  isSelected = false,
  video,
  onClick,
}: Props) {
  const [imageSrc, setImageSrc] = useState(video.snippet.thumbnails.medium.url);

  const handleImageError = () => {
    setImageSrc(fallbackImage.src);
  };

  return (
    <div
      className={`flex gap-x-3 p-3 rounded-xl border hover:border-indigo-500 transition duration-200
          ${
            isSelected ? "bg-indigo-100 border-indigo-500" : "border-indigo-200"
          }`}
      onClick={onClick}
    >
      <div className="w-36">
        <Image
          src={imageSrc}
          alt={`YouTube Video Thumbnail for ${video.snippet.title}`}
          className="rounded-md w-full h-auto object-cover"
          width={0}
          height={0}
          sizes="100vw"
          onError={handleImageError}
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4
          className={`text-base line-clamp-2 ${
            isSelected ? "font-extrabold" : "font-semibold"
          }`}
        >
          {video.snippet.title}
        </h4>
        <p
          className={`text-sm text-gray-600 line-clamp-2 ${
            isSelected ? "font-semibold" : "font-normal"
          }`}
        >
          {video.snippet.description}
        </p>
      </div>
    </div>
  );
}
