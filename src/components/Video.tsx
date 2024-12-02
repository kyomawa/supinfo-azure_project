"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Play, Volume2, VolumeOff } from "lucide-react";
import TooltipComponent from "./TooltipComponent";

// ==============================================================================================================================

export type VideoProps = {
  src: string;
  containerClassName?: string;
  className?: string;
  isMuted: boolean;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Video({ src, containerClassName, className, isMuted, setIsMuted }: VideoProps) {
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

  const handleClickOnButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    handleClick();
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
        className={cn("absolute inset-0 size-full", className)}
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
      {!isPlaying && (
        <button
          onClick={handleClickOnButton}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/15 hover:bg-white/20 backdrop-blur-3xl transition-colors duration-200"
        >
          <div className="p-4 bg-black/10 hover:bg-black/5 rounded-full backdrop-blur-3xl transition-colors duration-200">
            <Play className="size-6" />
          </div>
        </button>
      )}
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
  const label = isMuted ? "Activer le son" : "Désactiver le son";

  return (
    <TooltipComponent label={label} side="top" delayDuration={250}>
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="absolute bottom-4 right-4 rounded-full bg-white/15 hover:bg-white/20 backdrop-blur-3xl transition-colors duration-200"
      >
        {isMuted ? (
          <div className="bg-black/15 hover:bg-black/10 p-2 rounded-full backdrop-blur-3xl transition-colors duration-200">
            <VolumeOff className="size-4 text-white" />
          </div>
        ) : (
          <div className=" bg-black/15 hover:bg-black/10 p-2 rounded-full backdrop-blur-3xl transition-colors duration-200">
            <Volume2 className="size-4 text-white" />
          </div>
        )}
      </button>
    </TooltipComponent>
  );
}

// ==============================================================================================================================
