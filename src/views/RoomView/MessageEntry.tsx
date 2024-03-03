import { prettyRelativeDate } from "@/common/date";
import useOtherUser from "@/common/useOtherUser";
import useUser from "@/common/useUser";
import UserAvatar from "@/components/UserAvatar";
import { type IEntry } from "@/views/RoomView/entryReducer";
import clsx from "clsx";

// eslint-disable-next-line react/no-unused-prop-types
export type MessageEntryProps = IEntry & { readonly event: "message" };

export default function MessageEntry(props: MessageEntryProps) {
  const { data } = props;
  const user = useOtherUser(data.created_by);
  const currentUser = useUser();
  const isCurrentUser = currentUser?.id === user?.id;
  return (
    <div
      className={clsx(
        "flex items-center space-x-2 border-t border-neutral-500/50 py-1",
        isCurrentUser && "bg-neutral-100 dark:bg-neutral-700/30",
      )}
    >
      <UserAvatar className="h-10 w-10 rounded-full" user={user} />
      <div className="flex-1 space-y-1">
        <p className="space-x-2 text-sm">
          <span className="font-bold">{user?.username ?? data.created_by}</span>
          <span className="text-sm text-muted">{prettyRelativeDate(data.created_at)}</span>
        </p>
        <pre className="text-lg">{data.content}</pre>
      </div>
    </div>
  );
}
