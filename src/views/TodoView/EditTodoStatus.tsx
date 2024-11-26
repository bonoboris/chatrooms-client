import { TodoStatusEnum } from "@/types/api";
import clsx from "clsx";
import { forwardRef, useId } from "react";
import { type UseFormRegisterReturn } from "react-hook-form";

const classNames = {
  base: "cursor-pointer px-2 py-0.5 text-sm font-semibold uppercase focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500/50",
  [TodoStatusEnum.Todo]: "hover:text-blue-700 peer-checked:bg-blue-500 peer-checked:text-white",
  [TodoStatusEnum.InProgress]:
    "hover:text-orange-700 peer-checked:bg-orange-500 peer-checked:text-white",
  [TodoStatusEnum.Done]: "hover:text-green-700 peer-checked:bg-green-500 peer-checked:text-white",
};

export interface EditTodoStatusProps extends UseFormRegisterReturn<string> {
  readonly value: TodoStatusEnum;
  // eslint-disable-next-line react/require-default-props
  readonly type?: "checkbox" | "radio";
}

const EditTodoStatus = forwardRef<HTMLInputElement, EditTodoStatusProps>(function EditTodoStatus(
  { value, type = "radio", ...props },
  ref,
) {
  const inputId = useId();
  return (
    <div>
      <input
        {...props}
        className="peer appearance-none focus:ring-0"
        id={inputId}
        ref={ref}
        type={type}
        value={value}
      />
      <label className={clsx(classNames.base, classNames[value])} htmlFor={inputId}>
        {value}
      </label>
    </div>
  );
});

export default EditTodoStatus;
