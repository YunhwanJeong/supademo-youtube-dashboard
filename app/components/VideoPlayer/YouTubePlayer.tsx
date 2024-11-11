import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from "react";

interface Props {
  player: YT.Player | null;
  videoId: string;
  setPlayer: Dispatch<SetStateAction<YT.Player | null>>;
  setIsPlayerReady: Dispatch<SetStateAction<boolean>>;
  loadTrimFromStorage: () => void;
  onReady: (event: YT.PlayerEvent) => void;
  onStateChange: (event: YT.OnStateChangeEvent) => void;
}

export default function YouTubePlayer({
  player,
  videoId,
  setPlayer,
  setIsPlayerReady,
  loadTrimFromStorage,
  onReady,
  onStateChange,
}: Props) {
  const playerRef = useRef<HTMLDivElement | null>(null);
  const initializePlayer = useCallback(() => {
    if (playerRef.current === null) return;
    if (player) player.destroy(); // Destroy existing player if re-rendered

    loadTrimFromStorage();
    setIsPlayerReady(false);
    setPlayer(
      new window.YT.Player(playerRef.current, {
        videoId,
        playerVars: {
          controls: 0,
          showinfo: 0,
          rel: 0,
          modestbranding: 1,
          enablejsapi: 1,
          iv_load_policy: 3,
          disablekb: 1,
        },
        events: {
          onReady,
          onStateChange,
        },
      })
    );
  }, [videoId]);

  useEffect(() => {
    if (window.YT) {
      initializePlayer();
      return;
    }
    // Load the YouTube Iframe API script if not already loaded
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    const firstScript = document.getElementsByTagName("script")[0];
    firstScript.parentNode?.insertBefore(script, firstScript);
    window.onYouTubeIframeAPIReady = initializePlayer;

    return () => {
      window.onYouTubeIframeAPIReady = undefined;
    };
  }, [initializePlayer]);

  return (
    <div
      ref={playerRef}
      className="w-full h-80 pointer-events-none mb-3 md:min-h-[400px] lg:min-h-[540px] lg:rounded-xl"
    ></div>
  );
}
