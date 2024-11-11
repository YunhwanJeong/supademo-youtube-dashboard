import { debounce } from "@/app/utils";
import { useState } from "react";

interface Props {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: Props) {
  const [query, setQuery] = useState("");

  const handleSearch = debounce((query: string) => {
    onSearch(query);
  }, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    handleSearch(newQuery);
  };

  return (
    <div className="sticky top-0 p-5 bg-white shadow-sm">
      <div className="flex items-center w-full bg-white border border-gray-300 rounded-full shadow-sm overflow-hidden focus-within:border-indigo-500">
        <div className="pl-4 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.9 14.32a8 8 0 111.42-1.42l4.38 4.38a1 1 0 01-1.42 1.42l-4.38-4.38zM8 14a6 6 0 100-12 6 6 0 000 12z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <input
          type="text"
          placeholder="Search"
          className="w-full py-2 pl-2 pr-4 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 text-sm"
          value={query}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
}
