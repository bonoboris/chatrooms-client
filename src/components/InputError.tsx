import clsx from "clsx";
import { useMemo } from "react";

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

export interface InputErrorProps {
  readonly error:
    | { message?: string }
    | Record<string, { message?: string } | undefined>
    | undefined;
  readonly dense?: boolean;
  readonly className?: string;
}

export default function InputError({
  error,
  dense = false,
  className = undefined,
}: InputErrorProps) {
  const messages = useMemo(() => getMessages(error), [error]);
  if (messages == null) return null;

  const child = Array.isArray(messages) ? (
    <ul className="list-inside list-disc">
      {messages.map(([key, val]) => (
        <li key={`${key}-${val}`}>
          <span className="font-semibold">{key}</span>:{val}
        </li>
      ))}
    </ul>
  ) : (
    messages
  );

  return (
    <p
      className={clsx(
        className,
        "rounded border border-red-500 shadow shadow-red-300/50 before:mr-4 before:font-extrabold before:text-red-500 before:content-['!']",
        dense ? "px-2 py-1" : "px-4 py-2",
      )}
      role="alert"
    >
      {child}
    </p>
  );
}
