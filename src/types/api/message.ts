/** Schema for message request body */
export interface MessageIn {
  /** ID of the room the message is sent in */
  room_id: number;
  /** Content of the message */
  content: string;
}

/** Schema for message response body */
export interface Message extends MessageIn {
  /** ID of the message */
  id: number;
  /** ID of the user who created the message */
  created_by: number;
  /** Date of creation of the message, iso format */
  created_at: string;
}
