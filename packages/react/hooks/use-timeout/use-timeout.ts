import React from "react";

import { useCallbackRef } from "@react/hooks/use-callback-ref";

/**
 * A hook that calls a callback function in the given timeout.
 *
 * @param callback - The callback function executed after the timer has elapsed.
 * @param delayInMs - The timer's duration in milliseconds to wait before executing the callback.
 * @param startOnMount - The flag to determine if the timer should be started on mount, defaults to `true`.
 * @returns A `start` function and a `cancel` function to start and cancel the timer respectively.
 */
// biome-ignore lint/suspicious/noExplicitAny: accept any function arguments
function useTimeout<TCallback extends (...args: any[]) => void>(
  callback: TCallback,
  delayInMs: number,
  startOnMount = true,
) {
  const timeoutRef = React.useRef(-1);
  const startOnMountRef = React.useRef(startOnMount);

  const start = useCallbackRef((...args) => {
    if (timeoutRef.current > 0) return;
    timeoutRef.current = window.setTimeout(() => {
      callback(...args);
      timeoutRef.current = -1;
    }, delayInMs);
  }) as unknown as TCallback;

  const cancel = useCallbackRef(() => {
    if (timeoutRef.current < 0) return;
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = -1;
  });

  React.useEffect(() => {
    if (startOnMountRef.current) start();
    return cancel;
  }, [start, cancel]);

  return { start, cancel };
}

export { useTimeout };
