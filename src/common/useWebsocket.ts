import { getWebSocketBaseUrl } from "@/common/api";
import React from "react";

/** UseWebsocket parameters */
export interface UseWebsocket {
  /** Websocket path */
  path: string;
  /** Websocket protocol(s) */
  protocols?: string | string[];
  /** Websocket.onopen callback */
  onOpen?: ((this: WebSocket, ev: Event) => void) | null;
  /** Websocket.onmessage callback */
  onMessage?: ((this: WebSocket, ev: MessageEvent) => void) | null;
  /** Websocket.onerror callback */
  onError?: ((this: WebSocket, ev: Event) => void) | null;
  /** Websocket.onclose callback */
  onClose?: ((this: WebSocket, ev: CloseEvent) => void) | null;
}

/**
 * Wrap a function to log message on call and the arguments its called with.
 *
 * @param message - Message to log
 * @param func - Function to wrap
 * @returns - Wrapped function
 */
function withLog<Args extends readonly unknown[] = readonly unknown[], RT = unknown>(
  message: string,
  func: (...args: Args) => RT,
): (...args: Args) => RT {
  return function (...args) {
    console.log(message, ...args);
    return func(...args);
  };
}

/** Wrapper around Websocket API; Automatically call `.close()` on unmount. */
export default function useWebsocket({
  path,
  protocols,
  onClose = null,
  onError = null,
  onMessage = null,
  onOpen = null,
}: UseWebsocket) {
  const url = path.startsWith("/") ? getWebSocketBaseUrl() + path : path;
  const wsRef = React.useRef<WebSocket | null>(null);
  React.useEffect(() => {
    wsRef.current = new WebSocket(url, protocols);
    return withLog("ws cleanup", () => wsRef.current?.close());
  }, [url, protocols]);

  React.useEffect(() => {
    if (wsRef.current != null) {
      wsRef.current.onopen = onOpen != null ? withLog("ws open", onOpen) : onOpen;
      wsRef.current.onmessage = onMessage != null ? withLog("ws message", onMessage) : onMessage;
      wsRef.current.onerror = onError != null ? withLog("ws error", onError) : onError;
      wsRef.current.onclose = onClose != null ? withLog("ws close", onClose) : onClose;
    }
  });
  return wsRef.current;
}
