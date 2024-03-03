import clsx from "clsx";
import React from "react";

export interface InputErrorProps {
  error?: { message?: string } | Record<string, { message?: string } | undefined>;
  dense?: boolean;
  className?: string;
}

function isErrorOption(val: unknown): val is { message?: string } {
  return val != null && typeof val === "object" && "message" in val;
}

function getMessages(error: InputErrorProps["error"]): string | [string, string][] | null {
  if (error == null) return null;
  if (isErrorOption(error)) {
    if (error.message != null) return error.message;
    return null;
  }
  const messages: [string, string][] = [];
  for (const key in error) {
    const val = error[key];
    if (val?.message != null) {
      messages.push([key, val.message]);
    }
  }
  return messages;
}

export default function InputError({ error, dense, className }: InputErrorProps) {
  const messages = React.useMemo(() => getMessages(error), [error]);
  if (messages == null) return <></>;

  const child = Array.isArray(messages) ? (
    <ul className="list-inside list-disc">
      {messages.map(([key, val]) => (
        <li>
          <span className="font-semibold">{key}</span>: {val}
        </li>
      ))}
    </ul>
  ) : (
    messages
  );

  return (
    <p
      role="alert"
      className={clsx(
        className,
        "rounded border border-red-500 shadow shadow-red-300/50 before:mr-4 before:font-extrabold before:text-red-500 before:content-['!']",
        dense ? "px-2 py-1" : "px-4 py-2",
      )}
    >
      {child}
    </p>
  );
}
