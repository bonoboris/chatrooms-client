import { baseURL } from "@/common/api";
import { type User } from "@/types/api";
import clsx from "clsx";

export interface UserAvatarProps {
  user?: User | null;
  className?: string;
}

export default function UserAvatar({ user, className }: UserAvatarProps) {
  if (user?.avatar_id == null)
    return (
      <div
        className={clsx(
          "flex items-center justify-center bg-neutral-700 text-2xl font-bold leading-none text-white dark:bg-neutral-300 dark:text-black",
          className,
        )}
      >
        {user?.username[0]?.toUpperCase?.() ?? "&nbsp;"}
      </div>
    );
  return (
    <img
      className={className}
      alt={`${user?.username} avatar`}
      src={`${baseURL}/files/avatars/${user.avatar_id}`}
    />
  );
}
