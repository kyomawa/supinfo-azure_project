import { Visibility } from "@prisma/client";
import { LucideIcon } from "lucide-react";

// ==========================================================================================================

export type SidebarLinkProps = {
  label: string;
  icon: LucideIcon;
  path?: string;
  onClick?: () => void;
};

// ==========================================================================================================

export type SearchPostsProps = {
  mediaUrl: string;
  videoThumbnail: string;
  creator: {
    image: string | null;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    username: string;
    bio: string | null;
    visibility: Visibility;
  };
  likes: {
    id: string;
    createdAt: Date;
    postId: string;
    userId: string;
  }[];
  comments: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    postId: string;
    userId: string;
    content: string;
  }[];
  id: string;
  description: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  creatorId: string;
};

// ==========================================================================================================
