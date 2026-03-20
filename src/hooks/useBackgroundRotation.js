import { useEffect, useState } from "react";

export function useBackgroundRotation(backgrounds, intervalMs = 7000, fadeMs = 1200) {
  const [bgIndex, setBgIndex] = useState(0);
  const [baseBgIndex, setBaseBgIndex] = useState(0);
  const [isBgFading, setIsBgFading] = useState(false);

  useEffect(() => {
    if (!backgrounds?.length) return undefined;
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [backgrounds, intervalMs]);

  useEffect(() => {
    if (bgIndex === baseBgIndex) return undefined;
    setIsBgFading(true);
    const fadeTimer = setTimeout(() => {
      setBaseBgIndex(bgIndex);
      setIsBgFading(false);
    }, fadeMs);
    return () => clearTimeout(fadeTimer);
  }, [bgIndex, baseBgIndex, fadeMs]);

  return { bgIndex, baseBgIndex, isBgFading };
}
