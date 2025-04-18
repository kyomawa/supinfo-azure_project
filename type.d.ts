import { Prisma, User } from "@prisma/client";

declare global {
  type ApiResponse<T> = { success: true; message: string; data: T } | { success: false; message: string; data: null };
  type PostEndpointProps = Prisma.PostGetPayload<{
    include: { comments: true; likes: true; creator: true };
  }>;
  type NotificationByUserIdEndpointProps = Prisma.NotificationGetPayload<{
    select: {
      id: true;
      actor: true;
      content: true;
      createdAt: true;
      type: true;
      isRead: true;
    };
  }>;
  type PostsByUserIdEndpointProps = Prisma.PostGetPayload<{
    select: {
      id: true;
      mediaUrl: true;
      createdAt: true;
      likes: true;
      comments: true;
      description: true;
      tags: true;
      updatedAt: true;
    };
  }> & {
    videoThumbnail?: string;
  };
  type CommentsWithUsersByPostIdEndpointProps = Prisma.CommentGetPayload<{
    select: {
      content: true;
      createdAt: true;
      id: true;
      user: true;
    };
  }>;
  type LikesWithUsersByPostIdEndpointProps = Prisma.LikeGetPayload<{
    select: {
      id: true;
      user: true;
    };
  }>;
  type PostWithCreatorByPostIdEndpointProps = Prisma.PostGetPayload<{
    select: {
      id: true;
      mediaUrl: true;
      createdAt: true;
      description: true;
      tags: true;
      creator: true;
    };
  }>;
  type FollowerByUserIdEndpointProps = User & {
    status: FollowStatus;
  };
  type FollowingByUserIdEndpointProps = User & {
    status: FollowStatus;
  };
}
