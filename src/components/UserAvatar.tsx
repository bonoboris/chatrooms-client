import { baseURL } from "@/common/api";
import { type User } from "@/types/api";
import clsx from "clsx";

export interface UserAvatarProps {
  readonly user: User | null | undefined;
  readonly className?: string;
}

export default function UserAvatar({ user, className = undefined }: UserAvatarProps) {
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
      alt={`${user?.username} avatar`}
      className={className}
      src={`${baseURL}/files/avatars/${user.avatar_id}`}
    />
  );
}
