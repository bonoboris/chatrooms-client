import { type Todo } from "@/types/api";
import clsx from "clsx";
import React from "react";

export interface TodoItemProps {
  todo: Todo;
  onClick: () => void;
}

const TodoItem: React.FC<TodoItemProps> = React.memo(function TodoShow({ todo, onClick }) {
  return (
    <li
      key={todo.id}
      className="cursor-pointer rounded-lg border p-2 hover:bg-neutral-100 dark:hover:bg-neutral-900"
      onClick={onClick}
    >
      <small
        className={clsx(
          "rounded-full px-2 font-semibold uppercase text-white",
          todo.status === "todo" && "bg-blue-500",
          todo.status === "in progress" && "bg-orange-500",
          todo.status === "done" && "bg-green-500",
        )}
      >
        {todo.status}
      </small>
      <p className="whitespace-pre-wrap">{todo.description}</p>
    </li>
  );
});

export default TodoItem;
