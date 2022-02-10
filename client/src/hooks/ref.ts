import { useRef, useEffect, MutableRefObject } from "react";

export const useAsRef = <T>(value: T): MutableRefObject<T> => {
  const ref = useRef<T>(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref;
};
