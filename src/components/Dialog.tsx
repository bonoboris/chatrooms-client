import React from "react";

export interface DialogProps extends React.DialogHTMLAttributes<HTMLDialogElement> {
  setOpen: (value: boolean) => void;
  modal?: boolean;
  disableBackdropClick?: boolean;
}

export default function Dialog({
  open,
  modal,
  onClick,
  setOpen,
  disableBackdropClick,
  children,
  ...props
}: DialogProps) {
  const ref = React.useRef<HTMLDialogElement | null>(null);
  const element = ref.current;
  React.useEffect(() => {
    if (element != null) {
      if (open) modal ? element.showModal() : element.show();
      else element.close();
    }
  }, [open, modal, element]);

  const handleClick: DialogProps["onClick"] =
    !disableBackdropClick && element != null
      ? function (event) {
          const boundingRect = element.getBoundingClientRect();
          const isBackdropClick =
            event.clientX < boundingRect.left ||
            event.clientX > boundingRect.right ||
            event.clientY < boundingRect.top ||
            event.clientY > boundingRect.bottom;
          if (isBackdropClick) setOpen(false);
          else onClick?.(event);
        }
      : onClick;

  return (
    <dialog ref={ref} onClick={handleClick} {...props}>
      {children}
    </dialog>
  );
}
