"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Volume2, VolumeOff } from "lucide-react";

// ==============================================================================================================================

export type VideoProps = {
  src: string;
  containerClassName?: string;
  videoClassName?: string;
  isMuted: boolean;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Video({ src, containerClassName, videoClassName, isMuted, setIsMuted }: VideoProps) {
  const currentVideo = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [userStoppedPlaying, setUserStoppedPlaying] = useState(false);
  const isVideoInView = useInView(currentVideo, { margin: "-50%" });

  const handleClick = () => {
    if (currentVideo.current) {
      if (isPlaying) {
        currentVideo.current.pause();
        setUserStoppedPlaying(true);
        setIsPlaying(false);
      } else {
        currentVideo.current.play();
        setUserStoppedPlaying(false);
        setIsPlaying(true);
      }
    }
  };

  useEffect(() => {
    if (isVideoInView) {
      if (!userStoppedPlaying) {
        setIsPlaying(true);
        currentVideo.current?.play();
      }
    } else {
      setIsPlaying(false);
      currentVideo.current?.pause();
    }
  }, [isVideoInView, isPlaying, userStoppedPlaying]);

  return (
    <div className={cn("relative cursor-pointer", containerClassName)}>
      <motion.video
        ref={currentVideo}
        className={cn("absolute inset-0 size-full", videoClassName)}
        preload="metadata"
        playsInline
        onClick={handleClick}
        loop
        muted={isMuted}
        autoPlay={false}
      >
        <source src={src} />
        Your browser does not support the video tag.
      </motion.video>
      <MuteButton isMuted={isMuted} setIsMuted={setIsMuted} />
    </div>
  );
}

// ==================================================================================================================================

type MuteButtonProps = {
  isMuted: boolean;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
};

function MuteButton({ isMuted, setIsMuted }: MuteButtonProps) {
  return (
    <button
      onClick={() => setIsMuted(!isMuted)}
      className="absolute bottom-4 right-4 p-2 rounded-full bg-black/15 dark:bg-white/10 dark:hover:bg-white/15 hover:bg-black/20 backdrop-blur-lg transition-colors duration-200"
    >
      {isMuted ? <VolumeOff className="size-4" /> : <Volume2 className="size-4" />}
    </button>
  );
}

// ==============================================================================================================================
