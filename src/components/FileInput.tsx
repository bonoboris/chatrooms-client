import Button, { type ButtonProps } from "@/components/Button";
import React from "react";

export interface FileInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onClick"> {
  buttonProps?: Omit<ButtonProps, "className">;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export default function FileInput({
  className,
  buttonProps,
  inputRef,
  children,
  ...props
}: FileInputProps) {
  const internalRef = React.useRef<HTMLInputElement>(null);
  const ref = inputRef ?? internalRef;
  const onClick = buttonProps?.onClick;
  const handleClick = React.useCallback(
    function (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
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
      <input {...props} ref={ref} type="file" className="hidden" />
    </>
  );
}
