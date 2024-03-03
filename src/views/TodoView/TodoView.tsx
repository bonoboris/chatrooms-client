import { TodoApi } from "@/common/api";
import Button from "@/components/Button";
import { TodoStatusEnum, type Todo } from "@/types/api";
import EditTodoStatus from "@/views/TodoView/EditTodoStatus";
import TodoCreate from "@/views/TodoView/TodoCreate";
import TodoEdit from "@/views/TodoView/TodoEdit";
import TodoItem from "@/views/TodoView/TodoItem";
import React from "react";
import { useForm } from "react-hook-form";

export default function TodoView() {
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [editTodo, setEditTodo] = React.useState<Todo | null>(null);
  const [createTodoOpen, setCreateTodoOpen] = React.useState<boolean>(false);

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

  const reloadTodos = React.useCallback(async function () {
    const resp = await TodoApi.getAll({ sort_by: "modified_at", sort_dir: "desc" });
    setTodos(resp.data);
  }, []);

  React.useEffect(() => {
    reloadTodos();
  }, [reloadTodos]);

  async function onDeleteTodo(id: number) {
    await TodoApi.delete(id);
    setEditTodo(null);
    reloadTodos();
  }

  return (
    <main className="flex min-h-screen flex-1 flex-col items-center space-y-4 p-8">
      <div className="flex space-x-8">
        <h1>Todos</h1>
        <Button variant="filled" onClick={() => setCreateTodoOpen(true)}>
          Create
        </Button>
      </div>
      <div className="flex flex-row space-x-4">
        <span>Show / Hide: </span>
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
          <TodoItem key={todo.id} todo={todo} onClick={() => setEditTodo(todo)} />
        ))}
      </ul>
      <TodoEdit
        editTodo={editTodo}
        setEditTodo={setEditTodo}
        onSubmitted={reloadTodos}
        onDelete={onDeleteTodo}
      />
      <TodoCreate open={createTodoOpen} setOpen={setCreateTodoOpen} onSubmitted={reloadTodos} />
    </main>
  );
}
