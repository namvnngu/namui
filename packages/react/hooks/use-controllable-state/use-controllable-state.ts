import React from "react";

import { useCallbackRef } from "@react/hooks/use-callback-ref";

type Params<T> = {
  prop?: T | undefined;
  initialProp?: T | undefined;
  onChange?: (state: T) => void;
};

type StateSetter<T> = (currentValue?: T) => T;

/**
 * A hook that manages the state of both controlled and uncontrolled component.
 *
 * @param prop - The value for the controlled state.
 * @param initialProp - The initial value for the uncontrolled state.
 * @param onChange - The callback fired when the controlled state is changed.
 * @returns The state, and a state setter.
 */
function useControllableState<T>({ prop, initialProp, onChange }: Params<T>) {
  const [uncontrolledProp, setUncontrolledProp] = useUncontrolledState({
    initialProp,
    onChange,
  });
  const isControlled = prop !== undefined;
  const value = isControlled ? prop : uncontrolledProp;

  const setValue = useCallbackRef(
    (nextValue: T | undefined | StateSetter<T>) => {
      if (isControlled) {
        const setter = nextValue as StateSetter<T>;
        const value =
          typeof nextValue === "function" ? setter(prop) : nextValue;
        if (value !== prop) {
          onChange?.(value as T);
        }
      } else {
        setUncontrolledProp(nextValue);
      }
    },
  );

  return [value, setValue] as const;
}

function useUncontrolledState<T>({
  initialProp,
  onChange,
}: Omit<Params<T>, "prop">) {
  const uncontrolledState = React.useState<T | undefined>(initialProp);
  const [value] = uncontrolledState;
  const prevValueRef = React.useRef(value);
  const onChangeRef = useCallbackRef(onChange);

  React.useEffect(() => {
    if (prevValueRef.current !== value) {
      onChangeRef(value as T);
      prevValueRef.current = value;
    }
  }, [value, onChangeRef]);

  return uncontrolledState;
}

export { useControllableState };
