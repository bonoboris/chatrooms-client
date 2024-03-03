import { TodoApi, setFormErrors } from "@/common/api";
import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import { type Todo, TodoStatusEnum } from "@/types/api";
import EditTodoStatus from "@/views/TodoView/EditTodoStatus";
import { DEFAULT_TODO } from "@/views/TodoView/common";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export interface TodoCreateProps {
  readonly open: boolean;
  readonly setOpen: (value: boolean) => void;
  readonly onSubmitted: (todo: Todo) => void;
}

export default function TodoCreate({ open, setOpen, onSubmitted }: TodoCreateProps) {
  const { register, handleSubmit, setError, setFocus, watch } = useForm({
    defaultValues: DEFAULT_TODO,
  });
  const values = watch();
  console.log(values);

  const onSubmit = handleSubmit(async function (values) {
    try {
      const resp = await TodoApi.create(values);
      setOpen(false);
      return onSubmitted(resp.data);
    } catch (err) {
      setFormErrors(err, setError, "Something went wrong!");
    }
  });

  useEffect(() => {
    open && setFocus("description");
  }, [open, setFocus]);

  return (
    <Dialog modal open={open} setOpen={setOpen}>
      <h2 className="mb-4">Create Todo</h2>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="flex items-center space-x-2">
          <label>Status</label>
          <EditTodoStatus {...register("status")} value={TodoStatusEnum.Todo} />
          <EditTodoStatus {...register("status")} value={TodoStatusEnum.InProgress} />
          <EditTodoStatus {...register("status")} value={TodoStatusEnum.Done} />
        </div>
        <div className="flex flex-col">
          <label htmlFor="edit-description">Description</label>
          <textarea
            {...register("description")}
            autoFocus
            cols={60}
            id="edit-description"
            rows={10}
          />
        </div>
        <Button className="text-lg" type="submit" variant="filled">
          Create
        </Button>
      </form>
    </Dialog>
  );
}
