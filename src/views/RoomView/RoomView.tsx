import { MessageApi, RoomApi } from "@/common/api";
import useWebsocket from "@/common/useWebsocket";
import Button from "@/components/Button";
import { type Room, type RoomEventIn } from "@/types/api";
import Entry from "@/views/RoomView/Entry";
import entryReducer from "@/views/RoomView/entryReducer";
import type { KeyboardEvent, MouseEvent, UIEvent } from "react";
import { useCallback, useEffect, useLayoutEffect, useReducer, useRef, useState } from "react";
import { useLocation } from "wouter";

export interface RoomViewProps {
  readonly roomId: number;
}

export default function RoomView({ roomId }: RoomViewProps) {
  const [room, setRoom] = useState<Room | null>(null);
  const [entries, dispatch] = useReducer(entryReducer, []);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const entriesRef = useRef<HTMLDivElement>(null);
  const [users, setUsers] = useState([] as number[]);
  const [autoScroll, setAutoScroll] = useState(true);
  const [, setLocation] = useLocation();

  // Websocket for events
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

  const doSubmitMessage = useCallback(
    function () {
      if (inputRef.current == null) return;
      const content = inputRef.current.value.trim();
      if (content.length === 0) return;
      ws?.send(JSON.stringify({ event: "message", data: { content, room_id: roomId } }));
      inputRef.current.value = "";
      // auto scroll to bottom
      setAutoScroll(true);
    },
    [roomId, ws],
  );

  // Submit message callback
  const handleSubmit = useCallback(
    function (evt: MouseEvent<HTMLButtonElement>) {
      evt.preventDefault();
      evt.stopPropagation();
      doSubmitMessage();
    },
    [doSubmitMessage],
  );

  const handleKeyDown = useCallback(
    function (evt: KeyboardEvent<HTMLTextAreaElement>) {
      if (evt.ctrlKey && evt.key === "Enter") {
        evt.preventDefault();
        evt.stopPropagation();
        doSubmitMessage();
      } else if (evt.key === "Escape") {
        if (inputRef.current != null) inputRef.current.blur();
      }
    },
    [doSubmitMessage],
  );

  // On load callback
  useEffect(() => {
    (async function () {
      try {
        const roomResp = await RoomApi.getById(roomId);
        setRoom(roomResp.data);
        const messagesResp = await MessageApi.getAll({
          room_id: roomId,
          sort_by: "created_at",
          sort_dir: "asc",
        });
        dispatch({ type: "clear" });
        dispatch({ type: "pushMessages", payload: messagesResp.data });
      } catch {
        setLocation("/unknown_room");
      }
    })();
    return () => dispatch({ type: "clear" });
  }, [roomId, setLocation]);

  // On scroll callback
  const onScroll = useCallback((evt: UIEvent<HTMLDivElement>) => {
    const elt = evt.currentTarget;
    const atBottom = Math.abs(elt.scrollHeight - elt.clientHeight - elt.scrollTop) <= 1;
    setAutoScroll(atBottom);
  }, []);

  // Auto scroll to bottom
  useLayoutEffect(() => {
    if (autoScroll && entriesRef.current != null) {
      entriesRef.current.scrollTop = entriesRef.current.scrollHeight;
    }
  });

  return (
    <main className="flex h-screen flex-1 flex-col space-y-4 p-8">
      <h1>
        Room <strong className="text-purple-500">{room?.name ?? roomId}</strong>
      </h1>
      <p>
        <span>{users.length}</span> user(s) currently in the room!
      </p>
      <div className="flex-1 overflow-y-auto" onScroll={onScroll} ref={entriesRef}>
        {entries.map((entry) => (
          <Entry key={entry.id} {...entry} />
        ))}
      </div>
      <form className="flex flex-row flex-nowrap items-stretch space-x-2">
        <textarea className="flex-1 font-mono text-lg" onKeyDown={handleKeyDown} ref={inputRef} />
        <Button onClick={handleSubmit} variant="filled">
          Send <br />
          <span className="text-sm text-muted">(Ctrl+Enter)</span>
        </Button>
      </form>
    </main>
  );
}
