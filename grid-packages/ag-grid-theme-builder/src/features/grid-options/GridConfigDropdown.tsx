import { TableAlias, WarningAltFilled } from '@carbon/icons-react';
import { Checkbox, ListItem, Tooltip } from '@mui/joy';
import { UIDropdownButton } from 'components/UIDropdownButton';
import { useAtom } from 'jotai';
import { gridConfigBooleanFields } from 'model/grid-options';
import { titleCase } from 'model/utils';
import { gridConfigAtom } from './grid-config-atom';

export const GridConfigDropdown = () => {
  const [gridConfig, setGridConfig] = useAtom(gridConfigAtom);
  const filtersConflict = gridConfig.advancedFilter && gridConfig.filtersToolPanel;

  return (
    <UIDropdownButton
      renderUI={() =>
        gridConfigBooleanFields.map((property) => {
          const showFiltersWarning = filtersConflict && property === 'filtersToolPanel';
          const item = (
            <ListItem key={property} sx={{ gap: 1 }}>
              <Checkbox
                checked={!!gridConfig[property]}
                onChange={() => setGridConfig({ ...gridConfig, [property]: !gridConfig[property] })}
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
        })
      }
    >
      <TableAlias /> Grid setup
    </UIDropdownButton>
  );
};
