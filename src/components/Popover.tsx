import React from "react";

export interface PopoverProps extends React.DialogHTMLAttributes<HTMLDialogElement> {
  setOpen: (value: boolean) => void;
}

export default function Popover({ open, setOpen, children, className, ...props }: PopoverProps) {
  const ref = React.useRef<HTMLDialogElement | null>(null);
  const firstEvent = React.useRef<boolean>(true);
  const element = ref.current;

  React.useLayoutEffect(() => {
    function onWindowClick(evt: MouseEvent) {
      if (element == null || !open) return;
      if (firstEvent.current) {
        firstEvent.current = false;
        return;
      }
      const boundingRect = element.getBoundingClientRect();
      const isOutClick =
        evt.clientX < boundingRect.left ||
        evt.clientX > boundingRect.right ||
        evt.clientY < boundingRect.top ||
        evt.clientY > boundingRect.bottom;
      if (isOutClick) setOpen(false);
    }

    window.addEventListener("click", onWindowClick);
    return function () {
      firstEvent.current = true;
      window.removeEventListener("click", onWindowClick);
    };
  }, [setOpen, element, open]);

  console.log({ open, firstEvent: firstEvent.current });

  return (
    <dialog ref={ref} open={open} className={className} {...props}>
      {children}
    </dialog>
  );
}
