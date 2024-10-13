import React from "react";

/**
 * A hook that creates a ref on a passed callback function
 * to avoid re-renders triggered by props or re-executing
 * effects triggered by dependency differences.
 *
 * @param callback - A callback function.
 * @returns A ref to the passed callback function.
 */
// biome-ignore lint/suspicious/noExplicitAny: accept any types of function.
function useCallbackRef<T extends (...args: any[]) => any>(
  callback: T | undefined,
): T {
  const callbackRef = React.useRef(callback);

  React.useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return React.useMemo(
    () => ((...args) => callbackRef.current?.(...args)) as T,
    [],
  );
}

export { useCallbackRef };
