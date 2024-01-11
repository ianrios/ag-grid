import { TableAlias, WarningAltFilled } from '@carbon/icons-react';
import { Button, Card, Checkbox, ListItem, Tooltip, styled } from '@mui/joy';
import { useAtom } from 'jotai';
import { gridConfigBooleanFields } from 'model/grid-options';
import { titleCase } from 'model/utils';
import { useEffect, useRef, useState } from 'react';
import { gridConfigAtom } from './grid-config-atom';

export const GridConfigDropdown = () => {
  const [gridConfig, setGridConfig] = useAtom(gridConfigAtom);
  const [open, setOpen] = useState(false);
  const filtersConflict = gridConfig.advancedFilter && gridConfig.filtersToolPanel;
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        e.target instanceof Node &&
        !containerRef.current?.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.body.addEventListener('click', listener, true);
    return () => document.body.removeEventListener('click', listener, true);
  });
  return (
    <div ref={containerRef}>
      <DropdownTriggerButton
        variant={open ? 'solid' : 'outlined'}
        color="neutral"
        onClick={() => setOpen(!open)}
      >
        <TableAlias />
        Grid setup
      </DropdownTriggerButton>
      {open && (
        <DropdownList ref={dropdownRef} variant="outlined">
          {gridConfigBooleanFields.map((property) => {
            const showFiltersWarning = filtersConflict && property === 'filtersToolPanel';
            const item = (
              <ListItem key={property} sx={{ gap: 1 }}>
                <Checkbox
                  checked={!!gridConfig[property]}
                  onChange={() =>
                    setGridConfig({ ...gridConfig, [property]: !gridConfig[property] })
                  }
                  label={titleCase(String(property))}
                  sx={{
                    opacity: showFiltersWarning ? 0.5 : undefined,
                  }}
                />
                {showFiltersWarning && <WarningAltFilled color="var(--joy-palette-warning-400)" />}
              </ListItem>
            );
            return showFiltersWarning ? (
              <Tooltip
                key={property}
                title={
                  'Advanced Filter does not work with Filters Tool Panel. Filters Tool Panel has been disabled.'
                }
              >
                {item}
              </Tooltip>
            ) : (
              item
            );
          })}
        </DropdownList>
      )}
    </div>
  );
};

const DropdownTriggerButton = styled(Button)`
  gap: 8px;
`;

const DropdownList = styled(Card)`
  position: absolute;
  z-index: 1;
`;
