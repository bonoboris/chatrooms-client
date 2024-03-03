import { TodoStatusEnum } from "@/types/api";
import clsx from "clsx";
import { forwardRef, useId, type ForwardedRef } from "react";
import { type UseFormRegisterReturn } from "react-hook-form";

export interface EditTodoStatusProps extends UseFormRegisterReturn<string> {
  readonly value: TodoStatusEnum;
  // eslint-disable-next-line react/require-default-props
  readonly type?: "checkbox" | "radio";
}

const EditTodoStatus = forwardRef(function EditTodoStatus(
  { value, type = "radio", ...props }: EditTodoStatusProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const inputId = useId();
  return (
    <div>
      <input
        {...props}
        className="peer appearance-none"
        id={inputId}
        ref={ref}
        type={type}
        value={value}
      />
      <label
        className={clsx(
          "cursor-pointer px-2 py-0.5 text-sm font-semibold uppercase",
          value == TodoStatusEnum.Todo &&
            "hover:text-blue-700 peer-checked:bg-blue-500 peer-checked:text-white",
          value == TodoStatusEnum.InProgress &&
            "hover:text-orange-700 peer-checked:bg-orange-500 peer-checked:text-white",

          value == TodoStatusEnum.Done &&
            "hover:text-green-700 peer-checked:bg-green-500 peer-checked:text-white",
        )}
        htmlFor={inputId}
      >
        {value}
      </label>
    </div>
  );
});

export default EditTodoStatus;
