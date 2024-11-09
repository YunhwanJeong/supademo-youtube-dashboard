import type { Snippet } from "@/app/types/videoTypes";
import testImg from "@/public/test-image.png";
import Image from "next/image";

interface Props {
  isSelected?: boolean;
  title: Snippet["title"];
  description: Snippet["description"];
}

export default function VideoItem({
  isSelected = false,
  title,
  description,
}: Props) {
  return (
    <div
      className={`flex gap-x-3 p-3 rounded-xl border hover:border-indigo-500 transition duration-200
          ${
            isSelected ? "bg-indigo-100 border-indigo-500" : "border-indigo-200"
          }`}
    >
      <Image
        src={testImg}
        alt="Supademo logo"
        className="rounded-md"
        width={120}
        height={93}
      />
      <div>
        <h4
          className={`text-base line-clamp-2 ${
            isSelected ? "font-extrabold" : "font-semibold"
          }`}
        >
          {title}
        </h4>
        <p
          className={`text-sm text-gray-600 line-clamp-2 ${
            isSelected ? "font-semibold" : "font-normal"
          }`}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
