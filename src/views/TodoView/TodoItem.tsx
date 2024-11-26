import { type Todo } from "@/types/api";
import clsx from "clsx";
import { memo, useCallback } from "react";

export interface TodoItemProps {
  readonly todo: Todo;
  readonly onClick: (todo: Todo) => void;
}

const TodoItem = memo(function TodoShow({ todo, onClick }: TodoItemProps) {
  const handleClick = useCallback(() => onClick(todo), [onClick, todo]);
  return (
    <li
      className="cursor-pointer rounded-lg border p-2 border-normal hover:bg-neutral-100 dark:hover:bg-neutral-900"
      key={todo.id}
      onClick={handleClick}
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
