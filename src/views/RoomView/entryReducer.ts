import { type Message, type RoomEventIn } from "@/types/api";

export type IEntry = RoomEventIn & {
  id: number;
};

export type Action =
  | { type: "pushEvent"; payload: RoomEventIn }
  | { type: "pushEvents"; payload: RoomEventIn[] }
  | { type: "pushMessage"; payload: Message }
  | { type: "pushMessages"; payload: Message[] }
  | { type: "clear" };

export default function entryReducer(state: IEntry[], action: Action): IEntry[] {
  const newId = (state[state.length - 1]?.id ?? 0) + 1;

  console.log("entryReducer: ", action);

  if (action.type === "pushEvent") {
    return [...state, { ...action.payload, id: newId }];
  }
  if (action.type === "pushEvents") {
    return [...state, ...action.payload.map((event, i) => ({ ...event, id: newId + i }))];
  }
  if (action.type === "pushMessage") {
    return [...state, { event: "message", data: action.payload, id: newId }];
  }
  if (action.type === "pushMessages") {
    return [
      ...state,
      ...action.payload.map((message, i) => ({
        event: "message" as const,
        data: message,
        id: newId + i,
      })),
    ];
  }

  if (action.type === "clear") {
    return [];
  }
  return state;
}
