import { ReactNode, memo } from 'react';

/**
 * A version of React.memo with types fixed so that it doesn't break generic components
 */
export const memoWithSameType = <T extends (...args: any[]) => ReactNode>(c: T): T =>
  memo(c) as any;
