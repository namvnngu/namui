import React from "react";

import { useCallbackRef } from "@react/hooks/use-callback-ref";

// The timeout callback function will be executed immediately
// when the timoue delay is larger than 2,147,483,647 ms (about 24.8 days).
const MAXIMUM_DELAY_IN_MS = 2147483647;

/**
 * A hook that calls a callback function in the given timeout.
 *
 * @param callback - The callback function executed after the timer has elapsed.
 * @param delayInMs - The timer's duration in milliseconds to wait before executing the callback.
 * @param startOnMount - The flag to determine if the timer should be started on mount, defaults to `true`.
 * @returns A `start` function and a `cancel` function to start and cancel the timer respectively.
 */
// biome-ignore lint/suspicious/noExplicitAny: accept any function arguments
function useTimeout<T extends (...args: any[]) => void>(
  callback: T,
  delayInMs: number,
  startOnMount = true,
) {
  const timeoutRef = React.useRef<number | undefined>(undefined);
  const delayInMsRef = React.useRef(delayInMs);
  const startOnMountRef = React.useRef(startOnMount);

  const start = useCallbackRef((...args) => {
    if (timeoutRef.current !== undefined) {
      return;
    }
    timeoutRef.current = window.setTimeout(
      () => {
        delayInMsRef.current -= MAXIMUM_DELAY_IN_MS;
        timeoutRef.current = undefined;
        if (delayInMsRef.current <= 0) {
          callback(...args);
        } else {
          start(...args);
        }
      },
      Math.min(MAXIMUM_DELAY_IN_MS, delayInMsRef.current),
    );
  }) as unknown as T;

  const cancel = useCallbackRef(() => {
    if (timeoutRef.current === undefined) {
      return;
    }
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = undefined;
  });

  React.useEffect(() => {
    if (startOnMountRef.current) {
      start();
    }
    return cancel;
  }, [start, cancel]);

  return { start, cancel };
}

export { useTimeout };
