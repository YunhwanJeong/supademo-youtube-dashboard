import SearchBar from "./SearchBar";
import VideoItem from "./VideoItem";

export default function SideBar() {
  return (
    <aside className="flex flex-col gap-y-6 w-full order-2 p-5 border-t border-gray-100">
      <SearchBar />

      <div className="flex flex-col gap-y-5 ">
        <VideoItem
          isSelected
          title="Selected Video"
          description="Lorem Ipsum Bla Bla Bla"
        />
        <VideoItem
          title="Long Title Long Title Long Title Long Title Long Title Long Title Long Title"
          description="Long Description Long Description Long Description Long Description Long Description Long Description Long Description"
        />
        <VideoItem title="Short Title" description="Short Description" />
        <VideoItem title="Short Title" description="Short Description" />
      </div>
    </aside>
  );
}
