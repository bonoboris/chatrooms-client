import EnterLeaveEntry from "@/views/RoomView/EnterLeaveEntry";
import MessageEntry from "@/views/RoomView/MessageEntry";
import { type IEntry } from "@/views/RoomView/entryReducer";

export default function Entry(props: IEntry) {
  const { event } = props;

  if (event === "message") {
    return <MessageEntry {...props} />;
  }
  if (event === "enter" || event === "leave") {
    return <EnterLeaveEntry {...props} />;
  }
  return null;
}
