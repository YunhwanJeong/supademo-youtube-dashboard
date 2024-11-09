"use client";

import { VideoItemType } from "@/app/types/videoTypes";
import { useState } from "react";

interface Props {
  selectedVideo: VideoItemType | null;
}

export default function VideoPlayer({ selectedVideo }: Props) {
  const dividerWidth = 1;
  const spacing = 8;
  const dividerCount = 70;
  const dividerPadding = 8;

  const [start] = useState(0);

  const selectionWidth =
    dividerCount * dividerWidth +
    (dividerCount - 1) * spacing +
    dividerPadding * 2;

  return (
    <div className="pb-5 ">
      <div className="relative">
        <iframe
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          className="w-full h-80 mb-4"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>

        <button className="absolute top-2/4 left-2/4 transform -translate-x-1/2 -translate-y-1/2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="fill-slate-50 size-12"
          >
            <path
              fillRule="evenodd"
              d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div className="px-5">
        <div
          className="relative w-full flex bg-gray-200 overflow-x-auto"
          style={{ padding: `${dividerPadding}px` }}
        >
          <div className="flex items-center" style={{ gap: `${spacing}px` }}>
            {Array.from({ length: dividerCount }).map((_, index) => (
              <div
                key={index}
                className="h-10 bg-gray-400"
                style={{ width: `${dividerWidth}px` }}
              ></div>
            ))}
          </div>

          <div
            className="absolute top-0 left-0 h-full bg-indigo-700 bg-opacity-30 rounded-lg flex"
            style={{
              width: `${selectionWidth}px`,
              transform: `translateX(${start * (dividerWidth + spacing)}px)`,
            }}
          >
            <div className="w-2 h-full bg-indigo-700 bg-opacity-60 cursor-pointer rounded-l-lg"></div>

            <div className="w-2 h-full bg-indigo-700 bg-opacity-60 cursor-pointer rounded-r-lg ml-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
