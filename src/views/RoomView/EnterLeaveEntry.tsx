import { prettyRelativeDate } from "@/common/date";
import useOtherUser from "@/common/useOtherUser";
import { type IEntry } from "@/views/RoomView/entryReducer";

export type EnterLeaveEntryProps = IEntry & { readonly event: "enter" | "leave" };

export default function EnterLeaveEntry(props: EnterLeaveEntryProps) {
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
