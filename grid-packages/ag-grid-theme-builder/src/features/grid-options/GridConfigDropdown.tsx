import { TableAlias, WarningAltFilled } from '@carbon/icons-react';
import { Checkbox, Dropdown, ListItem, Menu, MenuButton, Tooltip } from '@mui/joy';
import { useAtom } from 'jotai';
import { gridConfigBooleanFields } from 'model/grid-options';
import { titleCase } from 'model/utils';
import { gridConfigAtom } from './grid-config-atom';

export const GridConfigDropdown = () => {
  const [gridConfig, setGridConfig] = useAtom(gridConfigAtom);
  const filtersConflict = gridConfig.advancedFilter && gridConfig.filtersToolPanel;
  return (
    <Dropdown>
      <MenuButton>
        <TableAlias />
        Grid setup
      </MenuButton>
      <Menu>
        {gridConfigBooleanFields.map((property) => {
          const checkbox = (
            <Checkbox
              checked={!!gridConfig[property]}
              onChange={() => setGridConfig({ ...gridConfig, [property]: !gridConfig[property] })}
              label={titleCase(String(property))}
              sx={
                {
                  // opacity: filtersConflict && property === 'filtersToolPanel' ? 0.5 : undefined,
                }
              }
            />
          );
          return false && filtersConflict && property === 'filtersToolPanel' ? (
            <Tooltip
              key={property}
              title={
                'Advanced Filter does not work with Filters Tool Panel. Filters Tool Panel has been disabled.'
              }
            >
              <ListItem>
                {checkbox}
                <WarningAltFilled color="var(--joy-palette-warning-400, #FDF0E1)" />
              </ListItem>
            </Tooltip>
          ) : (
            <ListItem key={property}>{checkbox}</ListItem>
          );
        })}
      </Menu>
    </Dropdown>
  );
};
