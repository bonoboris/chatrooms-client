import { type TodoIn, TodoStatusEnum } from "@/types/api";

export const DEFAULT_TODO: TodoIn = {
  description: "",
  status: TodoStatusEnum.Todo,
};
