import { Button, Card, styled } from '@mui/joy';
import { ReactNode, useEffect, useRef, useState } from 'react';

export type WidgetDropdownProps = {
  renderUI: () => ReactNode;
  children: ReactNode;
  startDecorator?: React.ReactNode;
  endDecorator?: React.ReactNode;
};

/**
 * A version of MUI's menu component that can contain interactive UI in the dropdown. It doesn't close until you click outside the dropdown.
 */
export const UIDropdownButton = (props: WidgetDropdownProps) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Close dropdown when clicking outside
    const listener = (e: MouseEvent) => {
      if (!clickContainedBy(e, buttonRef.current) && !clickContainedBy(e, dropdownRef.current)) {
        setOpen(false);
      }
    };
    document.body.addEventListener('click', listener, true);
    return () => document.body.removeEventListener('click', listener, true);
  });
  return (
    <Container>
      <DropdownTriggerButton
        ref={buttonRef}
        variant="outlined"
        color="neutral"
        onClick={() => setOpen(!open)}
        startDecorator={props.startDecorator}
        endDecorator={props.endDecorator}
      >
        {props.children}
      </DropdownTriggerButton>
      {open && <DropdownArea ref={dropdownRef}>{props.renderUI()}</DropdownArea>}
    </Container>
  );
};

const Container = styled('div')`
  pointer-events: none;
`;

const DropdownTriggerButton = styled(Button)`
  pointer-events: all;
  gap: 8px;
`;

const DropdownArea = styled(Card)`
  pointer-events: all;
  position: absolute;
  z-index: 1;
  margin-top: 4px;
  box-shadow: var(--joy-shadow-lg);
`;

const clickContainedBy = (e: MouseEvent, el: HTMLElement | null) =>
  el && e.target instanceof Node && el.contains(e.target);
