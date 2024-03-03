/** Todo status enum */
export enum TodoStatusEnum {
  Todo = "todo",
  InProgress = "in progress",
  Done = "done",
}

/** Schema for todo request body */
export interface TodoIn {
  /** Todo status */
  status: TodoStatusEnum;
  /** Todo description */
  description: string;
}

/** Schema for todo response body */
export interface Todo extends TodoIn {
  /** Todo ID */
  id: number;
  /** Todo creator user ID */
  created_by: number;
  /** Todo created date, ISO format */
  created_at: string;
  /** Todo last modification date, ISO format */
  modified_at: string;
}
