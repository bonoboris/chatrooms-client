import Button, { type ButtonProps } from "@/components/Button";
import {
  useCallback,
  useRef,
  type InputHTMLAttributes,
  type MouseEvent,
  type RefObject,
} from "react";

export interface FileInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onClick"> {
  readonly buttonProps?: Omit<ButtonProps, "className">;
  readonly inputRef?: RefObject<HTMLInputElement>;
}

export default function FileInput({
  className,
  buttonProps = undefined,
  inputRef = undefined,
  children,
  ...props
}: FileInputProps) {
  const internalRef = useRef<HTMLInputElement>(null);
  const ref = inputRef ?? internalRef;
  const onClick = buttonProps?.onClick;
  const handleClick = useCallback(
    function (evt: MouseEvent<HTMLButtonElement>) {
      if (ref != null) {
        onClick?.(evt);
        ref?.current?.click();
      }
    },
    [ref, onClick],
  );

  return (
    <>
      <Button {...buttonProps} className={className} onClick={handleClick}>
        {children}
      </Button>
      <input {...props} className="hidden" ref={ref} type="file" />
    </>
  );
}
