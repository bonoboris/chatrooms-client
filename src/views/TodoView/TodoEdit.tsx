import { TodoApi, setFormErrors } from "@/common/api";
import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import { TodoStatusEnum, type Todo } from "@/types/api";
import EditTodoStatus from "@/views/TodoView/EditTodoStatus";
import { DEFAULT_TODO } from "@/views/TodoView/common";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";

export interface EditTodoProps {
  readonly editTodo: Todo | null;
  readonly setEditTodo: (todo: Todo | null) => void;
  readonly onSubmitted: (values: Todo) => void;
  readonly onDelete: (id: number) => void;
}

export default function TodoEdit({ editTodo, setEditTodo, onSubmitted, onDelete }: EditTodoProps) {
  const open = editTodo != null;
  const setOpen = useCallback((val: boolean) => !val && setEditTodo(null), [setEditTodo]);

  const { reset, register, handleSubmit, setError } = useForm({ defaultValues: DEFAULT_TODO });

  useEffect(() => {
    open &&
      reset({
        description: editTodo.description,
        status: editTodo.status as unknown as TodoStatusEnum,
      });
  }, [open, editTodo, reset]);

  const onSubmit = handleSubmit(async function (values) {
    try {
      const resp = await TodoApi.update(editTodo!.id, values);
      setOpen(false);
      onSubmitted(resp.data);
    } catch (err) {
      setFormErrors(err, setError, "Something went wrong!");
    }
  });

  const handleDelete = useCallback(
    () => editTodo != null && onDelete(editTodo.id),
    [editTodo, onDelete],
  );

  return (
    <Dialog modal open={open} setOpen={setOpen}>
      <h2 className="mb-4">Update Todo</h2>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="flex items-center space-x-2">
          <label>Status</label>
          <EditTodoStatus {...register("status")} value={TodoStatusEnum.Todo} />
          <EditTodoStatus {...register("status")} value={TodoStatusEnum.InProgress} />
          <EditTodoStatus {...register("status")} value={TodoStatusEnum.Done} />
        </div>
        <div className="flex flex-col">
          <label htmlFor="edit-description">Description</label>
          <textarea {...register("description")} cols={60} id="edit-description" rows={10} />
        </div>
        <div className="flex w-full">
          <Button color="error" onClick={handleDelete} variant="outlined">
            Delete
          </Button>
          <Button className="ml-auto" type="submit" variant="filled">
            Save
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
