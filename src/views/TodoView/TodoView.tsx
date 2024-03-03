import { TodoApi } from "@/common/api";
import Button from "@/components/Button";
import { TodoStatusEnum, type Todo } from "@/types/api";
import EditTodoStatus from "@/views/TodoView/EditTodoStatus";
import TodoCreate from "@/views/TodoView/TodoCreate";
import TodoEdit from "@/views/TodoView/TodoEdit";
import TodoItem from "@/views/TodoView/TodoItem";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function TodoView() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const [createTodoOpen, setCreateTodoOpen] = useState<boolean>(false);

  const { register, watch } = useForm({
    defaultValues: {
      filters: [
        TodoStatusEnum.Todo,
        TodoStatusEnum.InProgress,
        TodoStatusEnum.Done,
      ] as TodoStatusEnum[],
    },
  });
  const filters = watch("filters");

  const displayedTodos = todos.filter((todo) =>
    filters.includes(todo.status as unknown as TodoStatusEnum),
  );

  const reloadTodos = useCallback(async function () {
    const resp = await TodoApi.getAll({ sort_by: "modified_at", sort_dir: "desc" });
    setTodos(resp.data);
  }, []);

  useEffect(() => {
    reloadTodos();
  }, [reloadTodos]);

  const onDeleteTodo = useCallback(
    async function (id: number) {
      await TodoApi.delete(id);
      setEditTodo(null);
      reloadTodos();
    },
    [reloadTodos],
  );

  const onCreateTodo = useCallback(() => setCreateTodoOpen(true), []);

  return (
    <main className="flex min-h-screen flex-1 flex-col items-center space-y-4 p-8">
      <div className="flex space-x-8">
        <h1>Todos</h1>
        <Button onClick={onCreateTodo} variant="filled">
          Create
        </Button>
      </div>
      <div className="flex flex-row space-x-4">
        <span>Show / Hide:</span>
        <EditTodoStatus {...register("filters")} type="checkbox" value={TodoStatusEnum.Todo} />
        <EditTodoStatus
          {...register("filters")}
          type="checkbox"
          value={TodoStatusEnum.InProgress}
        />
        <EditTodoStatus {...register("filters")} type="checkbox" value={TodoStatusEnum.Done} />
      </div>
      <ul className="space-y-4">
        {displayedTodos.map((todo) => (
          <TodoItem key={todo.id} onClick={setEditTodo} todo={todo} />
        ))}
      </ul>
      <TodoEdit
        editTodo={editTodo}
        onDelete={onDeleteTodo}
        onSubmitted={reloadTodos}
        setEditTodo={setEditTodo}
      />
      <TodoCreate onSubmitted={reloadTodos} open={createTodoOpen} setOpen={setCreateTodoOpen} />
    </main>
  );
}
