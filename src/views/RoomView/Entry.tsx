import { prettyRelativeDate } from "@/common/date";
import useOtherUser from "@/common/useOtherUser";
import useUser from "@/common/useUser";
import UserAvatar from "@/components/UserAvatar";
import { type IEntry } from "@/views/RoomView/entryReducer";
import clsx from "clsx";

function MessageEntry(props: IEntry & { event: "message" }) {
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
      <UserAvatar user={user} className="h-10 w-10 rounded-full" />
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

function EnterLeaveEntry(props: IEntry & { event: "enter" | "leave" }) {
  const { data, event } = props;
  const user = useOtherUser(data.user_id);
  const msg = event === "enter" ? "has entered the room." : "has left the room.";
  return (
    <div className="space-y-1 border-t border-neutral-500/50 py-1">
      <p className="space-x-2 text-sm text-muted">
        <span className="font-bold">{user?.username ?? data.user_id}</span>
        <span>{msg}</span>
        <span>{prettyRelativeDate(data.time)}</span>
      </p>
    </div>
  );
}

export default function Entry(props: IEntry) {
  const { event } = props;

  if (event === "message") {
    return <MessageEntry {...props} />;
  }
  if (event === "enter" || event === "leave") {
    return <EnterLeaveEntry {...props} />;
  }
  return <></>;
}
