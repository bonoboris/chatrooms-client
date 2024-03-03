import { MessageApi, RoomApi } from "@/common/api";
import useWebsocket from "@/common/useWebsocket";
import Button from "@/components/Button";
import { type Room, type RoomEventIn } from "@/types/api";
import Entry from "@/views/RoomView/Entry";
import entryReducer from "@/views/RoomView/entryReducer";
import React, { type MouseEvent } from "react";
import { useLocation } from "wouter";

export interface RoomViewProps {
  roomId: number;
}

export default function RoomView({ roomId }: RoomViewProps) {
  const [room, setRoom] = React.useState<Room | null>(null);
  const [entries, dispatch] = React.useReducer(entryReducer, []);
  const [content, setContent] = React.useState("");
  const [users, setUsers] = React.useState([] as number[]);
  const [, setLocation] = useLocation();

  const ws = useWebsocket({
    path: "/rooms/" + roomId,
    onMessage(ev) {
      const frame = JSON.parse(ev.data) as RoomEventIn;
      if (frame.event === "enter" || frame.event === "leave") {
        setUsers(frame.data.users);
      }
      dispatch({ type: "pushEvent", payload: frame });
    },
  });

  function submitMessage(evt: MouseEvent<HTMLButtonElement>) {
    evt.preventDefault();
    evt.stopPropagation();
    ws?.send(JSON.stringify({ event: "message", data: { content, room_id: roomId } }));
    setContent("");
  }

  React.useEffect(() => {
    (async function () {
      dispatch({ type: "clear" });
      try {
        const roomResp = await RoomApi.getById(roomId);
        setRoom(roomResp.data);
        const messagesResp = await MessageApi.getAll({
          room_id: roomId,
          sort_by: "created_at",
          sort_dir: "asc",
        });
        dispatch({ type: "pushMessages", payload: messagesResp.data });
      } catch {
        setLocation("/unknown_room");
      }
    })();
  }, [roomId, setLocation]);

  return (
    <main className="flex h-screen flex-1 flex-col space-y-4 p-8">
      <h1>
        Room <strong className="text-purple-500">{room?.name ?? roomId}</strong>
      </h1>
      <p>
        <span>{users.length}</span> user(s) currently in the room!
      </p>
      <div className="flex-1 overflow-y-auto">
        {entries.map((entry) => (
          <Entry key={entry.id} {...entry} />
        ))}
      </div>
      <form className="flex flex-row flex-nowrap items-stretch space-x-2">
        <textarea
          value={content}
          onChange={(evt) => setContent(evt.target.value)}
          className="flex-1 font-mono text-lg"
        />
        <Button variant="filled" onClick={submitMessage}>
          Send
        </Button>
      </form>
    </main>
  );
}
