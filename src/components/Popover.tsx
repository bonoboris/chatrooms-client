import { useLayoutEffect, useRef, type DialogHTMLAttributes } from "react";

export interface PopoverProps extends DialogHTMLAttributes<HTMLDialogElement> {
  readonly setOpen: (value: boolean) => void;
}

export default function Popover({ open, setOpen, children, className, ...props }: PopoverProps) {
  const ref = useRef<HTMLDialogElement | null>(null);
  const firstEvent = useRef<boolean>(true);
  const element = ref.current;

  useLayoutEffect(() => {
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
    <dialog className={className} open={open} ref={ref} {...props}>
      {children}
    </dialog>
  );
}
