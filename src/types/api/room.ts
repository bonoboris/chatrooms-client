import { type Message } from "@/types/api";

/** Schema for room request body */
export interface RoomIn {
  /** Room name */
  name: string;
}

/** Schema for room response body */
export interface Room extends RoomIn {
  /** ID of the room */
  id: number;
  /** ID of the user who created the room */
  created_by: number;
  /** Date of creation of the message, iso format */
  created_at: string;
}

/** Schema for room WebSocket "enter" & "leave" incoming event's data */
export interface EventEnterLeaveData {
  /** ID of User responsible for the event */
  user_id: number;
  /** List of users in the room */
  users: number[];
  /** Date of the event emission */
  time: string;
}

/** Schema for room WebSocket incoming frames " */
export type RoomEventIn =
  | {
      event: "enter";
      data: EventEnterLeaveData;
    }
  | {
      event: "leave";
      data: EventEnterLeaveData;
    }
  | {
      event: "message";
      data: Message;
    };
