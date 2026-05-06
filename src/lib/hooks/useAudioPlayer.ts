"use client";

import { useRef, useState } from "react";

export const useAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setPlaying] = useState(false);

  const toggle = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      void audioRef.current.play();
      setPlaying(true);
    } else {
      audioRef.current.pause();
      setPlaying(false);
    }
  };

  return { audioRef, isPlaying, toggle, setPlaying };
};
