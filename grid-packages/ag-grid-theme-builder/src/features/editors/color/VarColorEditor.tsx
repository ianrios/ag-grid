import { Information } from '@carbon/icons-react';
import {
  Autocomplete,
  AutocompleteOption,
  Box,
  Button,
  List,
  ListItem,
  Slider,
  Stack,
  Tooltip,
  Typography,
  styled,
} from '@mui/joy';
import { Cell, TwoColumnTable } from 'components/Table';
import { useChangeHandler } from 'components/component-utils';
import { singleOrFirst, titleCase } from 'model/utils';
import { useEffect, useState } from 'react';
import { ColorSwatch } from './ColorSwatch';
import { RGBAColor } from './RGBAColor';
import { VarColor } from './VarColor';
import { UncontrolledColorEditorProps, formatProportionAs3dpPercent } from './color-editor-utils';

export const VarColorEditor = ({ initialValue, onChange }: UncontrolledColorEditorProps) => {
  const [value, setValue] = useState(() => initialValue);
  const [editorState, setEditorState] = useState(() => getInitialEditorState(initialValue));
  const enableChangeEvents = useChangeHandler(value, onChange, true);

  useEffect(() => {
    if (editorState) {
      setValue(new VarColor(editorState.variable.name, editorState.alpha).toColorValue());
    }
  }, [editorState]);

  if (!editorState) {
    return (
      <Stack>
        <Typography level="body-sm">
          Specify colours as semi-transparent versions of other colours
          <InfoTooltip />
        </Typography>
        <Button
          onClick={() => {
            enableChangeEvents();
            const rgba = RGBAColor.reinterpretCss(value);
            setEditorState({
              alpha: rgba?.a ?? 1,
              variable: defaultVariable,
            });
          }}
          variant="soft"
        >
          Enable % colours
        </Button>
      </Stack>
    );
  }

  const feedback =
    titleCase(formatVariable(editorState.variable.name)) +
    ' with ' +
    formatProportionAs3dpPercent(editorState.alpha) +
    ' alpha';

  return (
    <Stack>
      <ColorSwatch color={value} />
      <Box>
        {feedback}
        <InfoTooltip />
      </Box>
      <TwoColumnTable rowSpacing={1}>
        <Cell>Color</Cell>
        <Autocomplete<VariableOrHeader>
          options={allVariables}
          value={editorState.variable}
          onChange={(_, variable) => {
            enableChangeEvents();
            if (variable && variable.type === 'variable') {
              setEditorState({ ...editorState, variable });
            }
          }}
          placeholder="Choose a color"
          getOptionLabel={({ label }) => label}
          renderOption={(props, option) => (
            <VariableOption autocompleteProps={props} info={option} />
          )}
          slotProps={{ listbox: { sx: { minWidth: '400px' } } }}
        />
        <Cell>Alpha</Cell>
        <Slider
          value={editorState.alpha}
          min={0}
          max={1}
          step={0.001}
          size="sm"
          onChange={(_, newAlpha) => {
            enableChangeEvents();
            setEditorState({ ...editorState, alpha: singleOrFirst(newAlpha) });
          }}
          valueLabelDisplay="auto"
          sx={{ '--Slider-size': '15px' }}
          valueLabelFormat={formatProportionAs3dpPercent}
        />
      </TwoColumnTable>
    </Stack>
  );
};

const InformationIcon = styled(Information)`
  color: var(--joy-palette-primary-400);
  vertical-align: middle;
  display: inline-block;
  margin-left: 8px;
`;

type EditorState = {
  variable: VariableInfo;
  alpha: number;
};

const getInitialEditorState = (initialValue: string | number): EditorState | null => {
  const color = VarColor.parseCss(initialValue);
  if (!color) return null;
  const info = allVariables.find((v) => v.type === 'variable' && v.name === color.variable);
  if (!info || info.type != 'variable') return null;
  return {
    variable: info,
    alpha: color.alpha,
  };
};

const formatVariable = (variable: string) =>
  titleCase(variable.replace(/^--ag-/i, '').replace(/-color/i, ''));

const VariableOption = ({
  info,
  autocompleteProps,
}: {
  info: VariableOrHeader;
  autocompleteProps: any;
}) => {
  if (info.type === 'header') {
    return <ListItem key={info.id}>{info.label}</ListItem>;
  }
  const variable = info.name;
  return (
    <AutocompleteOption key={info.id} {...autocompleteProps}>
      <Stack direction="row" alignItems="center" className="ag-theme-custom">
        <VarColorSwatch color={`var(${variable})`} />
        <Stack gap={0}>
          {formatVariable(variable)}
          <VariableNameHint>var({variable})</VariableNameHint>
        </Stack>
      </Stack>
    </AutocompleteOption>
  );
};

const VariableNameHint = styled('span')`
  font-size: 0.8em;
  color: var(--joy-palette-neutral-400);
`;

const VarColorSwatch = styled(ColorSwatch)`
  width: 40px;
  height: 40px;
  border-radius: 6px;
`;

const InfoTooltip = () => (
  <Tooltip
    title={
      <InfoBox padding={1}>
        Tips:
        <InfoList marker="disc">
          <InfoListItem>
            Specify related colours as semi-transparent versions of each other where possible
          </InfoListItem>
          <InfoListItem>
            Use a semi-transparent version of the foreground colour for elements that require a
            neutral colour such as borders
          </InfoListItem>
        </InfoList>
        This makes your theme more maintainable and ensures that colors look good against any
        background, even if the background is changed later.
      </InfoBox>
    }
  >
    <InformationIcon />
  </Tooltip>
);

const InfoBox = styled(Box)`
  color: inherit;
  font-size: inherit;
  margin: 0;
  line-height: inherit;
`;

const InfoList = styled(List)`
  color: inherit;
  font-size: inherit;
  line-height: inherit;
  margin: 0;
`;

const InfoListItem = styled(ListItem)`
  color: inherit;
  font-size: inherit;
  line-height: inherit;
  margin: 0;
`;

type VariableInfo = {
  type: 'variable';
  label: string;
  name: string;
  id: number;
};
type HeaderInfo = {
  type: 'header';
  label: string;
  id: number;
};

type VariableOrHeader = VariableInfo | HeaderInfo;

// TODO this list should be computed from the variables actually defined by the application
const allVariables: VariableOrHeader[] = [
  'Common colours',
  '--ag-foreground-color',
  '--ag-background-color',
  '--ag-accent-color',
  'All colours',
  '--ag-accent-color',
  '--ag-advanced-filter-builder-indent-size',
  '--ag-advanced-filter-column-pill-color',
  '--ag-advanced-filter-join-pill-color',
  '--ag-advanced-filter-option-pill-color',
  '--ag-advanced-filter-value-pill-color',
  '--ag-background-color',
  '--ag-border-color',
  '--ag-border-radius',
  '--ag-borders',
  '--ag-borders-critical',
  '--ag-borders-input',
  '--ag-borders-input-invalid',
  '--ag-borders-secondary',
  '--ag-borders-side-button',
  '--ag-card-radius',
  '--ag-card-shadow',
  '--ag-cell-horizontal-border',
  '--ag-cell-horizontal-padding',
  '--ag-cell-widget-spacing',
  '--ag-checkbox-background-color',
  '--ag-checkbox-border-radius',
  '--ag-checkbox-checked-color',
  '--ag-checkbox-indeterminate-color',
  '--ag-checkbox-unchecked-color',
  '--ag-chip-background-color',
  '--ag-chip-border-color',
  '--ag-column-hover-color',
  '--ag-column-select-indent-size',
  '--ag-control-panel-background-color',
  '--ag-data-color',
  '--ag-disabled-foreground-color',
  '--ag-filter-tool-panel-group-indent',
  '--ag-font-family',
  '--ag-font-size',
  '--ag-foreground-color',
  '--ag-grid-size',
  '--ag-header-background-color',
  '--ag-header-cell-hover-background-color',
  '--ag-header-cell-moving-background-color',
  '--ag-header-column-resize-handle-color',
  '--ag-header-column-resize-handle-display',
  '--ag-header-column-resize-handle-height',
  '--ag-header-column-resize-handle-width',
  '--ag-header-column-separator-color',
  '--ag-header-column-separator-display',
  '--ag-header-column-separator-height',
  '--ag-header-column-separator-width',
  '--ag-header-foreground-color',
  '--ag-header-height',
  '--ag-icon-font-color',
  '--ag-icon-font-family',
  '--ag-icon-font-weight',
  '--ag-icon-image-display',
  '--ag-icon-size',
  '--ag-input-border-color',
  '--ag-input-border-color-invalid',
  '--ag-input-disabled-background-color',
  '--ag-input-disabled-border-color',
  '--ag-input-focus-border-color',
  '--ag-input-focus-box-shadow',
  '--ag-invalid-color',
  '--ag-list-item-height',
  '--ag-menu-min-width',
  '--ag-minichart-selected-chart-color',
  '--ag-minichart-selected-page-color',
  '--ag-modal-overlay-background-color',
  '--ag-odd-row-background-color',
  '--ag-popup-shadow',
  '--ag-range-selection-background-color',
  '--ag-range-selection-background-color-2',
  '--ag-range-selection-background-color-3',
  '--ag-range-selection-background-color-4',
  '--ag-range-selection-border-color',
  '--ag-range-selection-border-style',
  '--ag-range-selection-chart-background-color',
  '--ag-range-selection-chart-category-background-color',
  '--ag-range-selection-highlight-color',
  '--ag-row-border-color',
  '--ag-row-border-style',
  '--ag-row-border-width',
  '--ag-row-group-indent-size',
  '--ag-row-height',
  '--ag-row-hover-color',
  '--ag-secondary-border-color',
  '--ag-secondary-foreground-color',
  '--ag-selected-row-background-color',
  '--ag-selected-tab-underline-color',
  '--ag-selected-tab-underline-transition-speed',
  '--ag-selected-tab-underline-width',
  '--ag-set-filter-indent-size',
  '--ag-side-bar-panel-width',
  '--ag-side-button-selected-background-color',
  '--ag-subheader-background-color',
  '--ag-subheader-toolbar-background-color',
  '--ag-tab-min-width',
  '--ag-toggle-button-border-width',
  '--ag-toggle-button-height',
  '--ag-toggle-button-off-background-color',
  '--ag-toggle-button-off-border-color',
  '--ag-toggle-button-on-background-color',
  '--ag-toggle-button-on-border-color',
  '--ag-toggle-button-switch-background-color',
  '--ag-toggle-button-switch-border-color',
  '--ag-toggle-button-width',
  '--ag-tooltip-background-color',
  '--ag-value-change-delta-down-color',
  '--ag-value-change-delta-up-color',
  '--ag-value-change-value-highlight-background-color',
  '--ag-widget-container-horizontal-padding',
  '--ag-widget-container-vertical-padding',
  '--ag-widget-horizontal-spacing',
  '--ag-widget-vertical-spacing',
  '--ag-wrapper-border-radius  ',
].map(
  (str, id): VariableOrHeader =>
    str.startsWith('--')
      ? { type: 'variable', label: formatVariable(str), name: str, id }
      : { type: 'header', label: str, id },
);

const defaultVariable = allVariables.find(
  (v) => v.type === 'variable' && v.name === '--ag-foreground-color',
) as VariableInfo;
