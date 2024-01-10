import { styled } from '@mui/joy';
import { ReactElement, useEffect, useMemo, useRef, useState } from 'react';

export type AnimateAppearProps = {
  children: ReactElement | null | false;
};

let counter = 0;

export const AnimateAppear = ({ children }: AnimateAppearProps) => {
  const id = useMemo(() => ++counter, []);
  const [lastPresentChildren, setLastPresentChildren] = useState(children);
  const [mounted, setMounted] = useState(!!children);
  const [open, setOpen] = useState(!!children);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentTimeout = useRef<Timeout>();
  useEffect(() => {
    console.log({ children: !!children });
    if (children) {
      setLastPresentChildren(children);
      setMounted(true);
    } else {
      setOpen(false);
    }
  }, [children]);
  useEffect(() => {
    console.log({ mounted });
    if (mounted) {
      const container = containerRef.current;
      if (container) {
        container.style.transition = 'none';
        container.style.height = '0';
        const contentHeight = container.scrollHeight;
        requestAnimationFrame(() => {
          container.style.transition = '';
          container.style.height = contentHeight + 'px';
          clearTimeout(currentTimeout.current);
          currentTimeout.current = setTimeout(() => {
            container.style.height = '';
          }, ANIMATION_MS);
        });
      }
      setOpen(true);
    }
  }, [mounted]);
  useEffect(() => {
    console.log({ open });
    if (!open) {
      const container = containerRef.current;
      if (container) {
        // container.style.transition = 'none';
        // container.style.height = '0';
        container.style.height = container.scrollHeight + 'px';
        requestAnimationFrame(() => {
          container.style.transition = '';
          container.style.height = '0';
          clearTimeout(currentTimeout.current);
          currentTimeout.current = setTimeout(() => {
            container.style.height = '';
            setMounted(false);
          }, ANIMATION_MS);
        });
      }
    }
  }, [open]);
  console.log('rendering', { id, mounted, open });
  return <Container ref={containerRef}>{mounted && lastPresentChildren}</Container>;
};

const ANIMATION_MS = 2000;

const Container = styled('div')`
  transition: height ${ANIMATION_MS}ms ease-in-out;
  overflow: hidden;
`;

type Timeout = ReturnType<typeof setTimeout>;
