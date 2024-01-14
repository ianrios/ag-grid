import { ReactNode, memo, useEffect, useRef } from 'react';

/**
 * A version of React.memo with types fixed so that it doesn't break generic components
 */
export const memoWithSameType = <T extends (...args: any[]) => ReactNode>(c: T): T =>
  memo(c) as any;

const notCalled: unique symbol = Symbol('notCalled');
type NotCalled = typeof notCalled;

export const useChangeHandler = <T>(value: T, handler: (value: T) => void, suppress?: boolean) => {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;
  const lastValueRef = useRef<T | NotCalled>(notCalled);

  useEffect(() => {
    if (lastValueRef.current !== value && lastValueRef.current !== notCalled && !suppress) {
      console.log('change from', lastValueRef.current, 'to', value);
      handlerRef.current(value);
    }
    lastValueRef.current = value;
  }, [value]);
};
