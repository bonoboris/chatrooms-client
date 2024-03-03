import { RoomApi } from "@/common/api";
import useUser from "@/common/useUser";
import { type Room } from "@/types/api";
import { memo, useEffect, useState } from "react";
import { Link } from "wouter";

const RoomCard = memo(function RoomCard({ room }: { readonly room: Room }) {
  return (
    <Link href={`/room/${room.id}`}>
      <button
        className="w-64 rounded border border-neutral-500 hover:border-purple-700 hover:ring-2 hover:ring-purple-500/50 focus:ring-2"
        type="button"
      >
        <div className="flex h-64 w-full items-center justify-center rounded-t bg-neutral-100 text-8xl dark:bg-neutral-900">
          {room.name.slice(0, 2)}
        </div>
        <div className="rounded-b p-4 text-lg">{room.name}</div>
      </button>
    </Link>
  );
});

export default function Homepage() {
  const user = useUser();
  const [rooms, setRooms] = useState<Room[]>([]);
  useEffect(() => {
    RoomApi.getAll().then((resp) => setRooms(resp.data));
  }, []);

  return (
    <main className="flex min-h-screen flex-1 flex-col items-center space-y-4 p-8">
      <h1>
        welcome to chatrooms. <strong className="text-purple-500">{user?.username}</strong>
      </h1>
      <nav>
        <ul>
          <li>
            <Link className="text-xl" href="/todos">
              My todos
            </Link>
          </li>
        </ul>
      </nav>
      <section className="space-y-2">
        <h2>Public Rooms</h2>
        <div className="flex flex-row">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </section>
    </main>
  );
}
