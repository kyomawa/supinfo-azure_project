"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// ==================================================================================================================================

type LogoProps = {
  className?: string;
  textClassName?: string;
  disabledAnimation?: boolean;
  hideText?: boolean;
  strokeColor?: string;
} & ({ isLink?: true; path: string } | { isLink: false; path?: never });

export default function Logo({
  className,
  strokeColor,
  disabledAnimation,
  textClassName,
  isLink = true,
  hideText,
  path = "/",
}: LogoProps) {
  const router = useRouter();
  const isAnimateOnHover = !disabledAnimation;

  useEffect(() => {
    if (isLink && path) {
      router.prefetch(path);
    }
  }, [isLink, path, router]);

  const handleClick = () => {
    if (isLink && path) {
      router.push(path);
    }
  };

  return (
    <motion.div
      className={cn("flex gap-x-2 items-center", isLink && path && "cursor-pointer")}
      whileHover={isAnimateOnHover ? "hover" : ""}
      whileTap={isAnimateOnHover ? "tap" : ""}
      onClick={handleClick}
    >
      <motion.svg
        width="99"
        height="101"
        viewBox="0 0 99 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Logo"
        className={cn("size-8", className)}
        variants={logoHoverAnimation}
      >
        <path
          d="M40.0788 64.7681C42.0788 64.7681 57.5788 67.2681 68.4252 89.6348C75.5788 76.2681 78.0788 66.2681 96.5788 64.7681M31.0788 45.7681C31.5788 47.2681 36.0788 60.2681 18.0698 79.7619C32.9656 82.5826 43.2553 81.972 50.2286 99.1729M62.2048 62.1067C62.703 60.1698 68.9858 45.7814 93.3494 40.8493C82.1864 30.5912 73.1246 25.6786 76.2809 7.38826M65.0397 41.2681C63.3597 40.183 51.6959 29.6732 54.7202 5C41.4588 12.3469 33.9331 19.3906 17.579 10.6131M46.9284 31.5682C45.338 32.7809 31.4966 40.1914 9.30948 28.9824C11.7259 43.9491 15.8015 53.4169 2 65.8273"
          fill="transparent"
          stroke={strokeColor || "#B21E4B"}
          strokeWidth="4.5"
        />
      </motion.svg>
      {!hideText && <p className={cn("text-xl font-semibold", textClassName)}>SAP</p>}
    </motion.div>
  );
}

// ==================================================================================================================================

const logoHoverAnimation = {
  hover: {
    scale: 1.1,
    rotate: 90,
    transition: { type: "spring", stiffness: 400, damping: 10, duration: 0.35 },
  },
  tap: {
    scale: 0.9,
    rotate: -45,
    transition: { type: "spring", stiffness: 400, damping: 10, duration: 0.35 },
  },
};

// ==================================================================================================================================
