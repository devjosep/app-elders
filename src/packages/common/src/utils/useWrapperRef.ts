import { MutableRefObject, useEffect, useRef } from 'react';

const useWrapperRef = <T>(value: T): MutableRefObject<T> => {
  const valueRef = useRef<typeof value>(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  return valueRef;
};

export { useWrapperRef };
