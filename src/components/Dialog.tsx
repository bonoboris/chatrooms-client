import { useCallback, useEffect, useRef, type MouseEvent } from "react";

export interface DialogProps extends React.DialogHTMLAttributes<HTMLDialogElement> {
  readonly setOpen: (value: boolean) => void;
  readonly modal?: boolean;
  readonly disableBackdropClick?: boolean;
}

export default function Dialog({
  open,
  modal = false,
  onClick,
  setOpen,
  disableBackdropClick = false,
  children,
  ...props
}: DialogProps) {
  const ref = useRef<HTMLDialogElement | null>(null);
  const element = ref.current;
  useEffect(() => {
    if (element != null) {
      if (open) modal ? element.showModal() : element.show();
      else element.close();
    }
  }, [open, modal, element]);

  const handleClick: DialogProps["onClick"] = useCallback(
    function (event: MouseEvent<HTMLDialogElement>) {
      if (!disableBackdropClick && element != null) {
        const boundingRect = element.getBoundingClientRect();
        const isBackdropClick =
          event.clientX < boundingRect.left ||
          event.clientX > boundingRect.right ||
          event.clientY < boundingRect.top ||
          event.clientY > boundingRect.bottom;
        if (isBackdropClick) setOpen(false);
        else onClick?.(event);
      } else onClick?.(event);
    },
    [disableBackdropClick, element, onClick, setOpen],
  );
  return (
    <dialog onClick={handleClick} ref={ref} {...props}>
      {children}
    </dialog>
  );
}
