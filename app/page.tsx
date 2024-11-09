import SideBar from "./components/SideBar";
import VideoPlayer from "./components/VideoPlayer";

export default function Home() {
  return (
    <main className="flex flex-col">
      <SideBar />
      <VideoPlayer />
    </main>
  );
}
