import clsx from "clsx";
import type React from "react";

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  variant?: "default" | "outlined" | "filled";
  color?: "default" | "error";
  htmlColor?: string;
}

const classNames = {
  base: "rounded-md border font-semibold tracking-wide px-4 py-1",
  variants: {
    default: "text-neutral-900 dark:text-neutral-100 border-transparent",
    outlined:
      "hover:ring-2 bg-transparent focus:ring-2 border-neutral-500 text-neutral-700 active:bg-neutral-200 dark:text-neutral-300 dark:active:bg-neutral-800",
    filled: "text-white hover:ring-2 focus:ring-2 border-transparent",
  },
  colors: {
    default: {
      default: "bg-purple-500/10 hover:text-purple-500 dark:hover:text-purple-500",
      error: "bg-red-500/10 hover:text-red-500 dark:hover:text-red-500",
    },
    outlined: {
      default:
        "hover:border-purple-700  hover:text-purple-500 dark:hover:text-purple-500 hover:ring-purple-500/50",
      error:
        "hover:border-red-700  hover:text-red-500 dark:hover:text-red-500 hover:ring-red-500/50",
    },
    filled: {
      default: "bg-purple-700 hover:bg-purple-800 hover:ring-purple-500/50 active:bg-purple-900",
      error: "bg-red-700 hover:bg-red-800 hover:ring-red-500/50 active:bg-red-900",
    },
  },
};

export default function Button({
  variant = "default",
  color = "default",
  htmlColor,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        classNames.base,
        classNames.variants[variant],
        classNames.colors[variant][color],
        className,
      )}
      color={htmlColor}
      {...props}
    >
      {children}
    </button>
  );
}
