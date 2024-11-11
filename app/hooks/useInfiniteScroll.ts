import { useEffect, useRef } from "react";

interface Params {
  onIntersect: () => void;
  threshold?: number;
}

export function useInfiniteScroll({ onIntersect, threshold = 1.0 }: Params) {
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onIntersect();
        }
      },
      { threshold }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [onIntersect]);

  return {
    observerRef,
  };
}
