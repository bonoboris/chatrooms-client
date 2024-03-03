import { TodoApi, setFormErrors } from "@/common/api";
import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import { TodoStatusEnum, type Todo } from "@/types/api";
import EditTodoStatus from "@/views/TodoView/EditTodoStatus";
import { DEFAULT_TODO } from "@/views/TodoView/common";
import React from "react";
import { useForm } from "react-hook-form";

export interface EditTodoProps {
  editTodo: Todo | null;
  setEditTodo: (todo: Todo | null) => void;
  onSubmitted: (values: Todo) => void;
  onDelete: (id: number) => void;
}

export default function TodoEdit({ editTodo, setEditTodo, onSubmitted, onDelete }: EditTodoProps) {
  const open = editTodo != null;
  const setOpen = (val: boolean) => !val && setEditTodo(null);

  const { reset, register, handleSubmit, setError } = useForm({ defaultValues: DEFAULT_TODO });

  React.useEffect(() => {
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

  function handleDelete() {
    return editTodo != null && onDelete(editTodo.id);
  }

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
          <textarea {...register("description")} id="edit-description" rows={10} cols={60} />
        </div>
        <div className="flex w-full">
          <Button variant="outlined" color="error" onClick={handleDelete}>
            Delete
          </Button>

          <Button type="submit" variant="filled" className="ml-auto">
            Save
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
