import { useState, useEffect, useRef } from 'react';

/**
 * Returns a stable image src that only updates once the new image
 * is fully loaded in the browser cache. Prevents the flash caused
 * by React re-rendering with a new src before the image is ready.
 */
export function useStableImageSrc(src: string): string {
  const [displaySrc, setDisplaySrc] = useState(src);
  const pendingRef = useRef<string | null>(null);

  useEffect(() => {
    if (!src || src === displaySrc) return;
    pendingRef.current = src;
    const img = new window.Image();
    img.onload = () => {
      if (pendingRef.current === src) setDisplaySrc(src);
    };
    img.onerror = () => {
      if (pendingRef.current === src) setDisplaySrc(src);
    };
    img.src = src;
  }, [src]);

  return displaySrc;
}
