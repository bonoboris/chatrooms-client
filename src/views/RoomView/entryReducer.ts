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
  console.log("entryReducer: ", action);
  const newId = (state[state.length - 1]?.id ?? 0) + 1;

  switch (action.type) {
    case "pushEvent":
      return [...state, { ...action.payload, id: newId }];
    case "pushEvents":
      return [...state, ...action.payload.map((event, i) => ({ ...event, id: newId + i }))];
    case "pushMessage":
      return [...state, { event: "message", data: action.payload, id: newId }];
    case "pushMessages":
      return [
        ...state,
        ...action.payload.map((message, i) => ({
          event: "message" as const,
          data: message,
          id: newId + i,
        })),
      ];
    case "clear":
      return [];
    default:
      return state;
  }
}
