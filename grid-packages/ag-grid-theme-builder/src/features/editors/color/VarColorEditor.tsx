import { Information } from '@carbon/icons-react';
import {
  Autocomplete,
  AutocompleteOption,
  Box,
  Button,
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
      setValue(new VarColor(editorState.variable, editorState.alpha).toColorValue());
    }
  }, [editorState]);

  if (!editorState) {
    return (
      <Stack>
        <Typography level="body-sm">
          Specify colours as semi-transparent versions of other colours
          <Tooltip title={whyChooseVar}>
            <InformationIcon />
          </Tooltip>
        </Typography>
        <Button
          onClick={() => {
            enableChangeEvents();
            const rgba = RGBAColor.reinterpretCss(value);
            setEditorState({
              alpha: rgba?.a ?? 1,
              variable: '--ag-foreground-color',
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
    titleCase(formatVariable(editorState.variable)) +
    ' with ' +
    formatProportionAs3dpPercent(editorState.alpha) +
    ' alpha';

  return (
    <Stack>
      <ColorSwatch color={value} />
      <Box>
        {feedback}
        <Tooltip title={whyChooseVar}>
          <InformationIcon />
        </Tooltip>
      </Box>
      <TwoColumnTable rowSpacing={1}>
        <Cell>Color</Cell>
        <Autocomplete
          value={editorState.variable}
          onChange={(_, variable) => {
            enableChangeEvents();
            if (variable) {
              setEditorState({ ...editorState, variable });
            }
          }}
          placeholder="Choose a color"
          options={['--ag-foreground-color', '--ag-background-color', '--ag-accent-color']}
          getOptionLabel={formatVariable}
          renderOption={(props, option) => (
            <AutocompleteOption {...props}>
              <VariableOption key={option} variable={option} />
            </AutocompleteOption>
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

const whyChooseVar =
  'We recommend specifying related colours as semi-transparent versions of each other where possible. This makes your theme more maintainable and ensures that the color looks good against any background, even if the background is changed later. Any elements that require a neutral colour, such as borders, can be specified as a semi-transparent version of the foreground colour.';

type EditorState = {
  variable: string;
  alpha: number;
};

const getInitialEditorState = (initialValue: string | number): EditorState | null => {
  const color = VarColor.parseCss(initialValue);
  if (!color) return null;
  return {
    variable: color.variable,
    alpha: color.alpha,
  };
};

const formatVariable = (variable: string) =>
  titleCase(variable.replace(/^--ag-/i, '').replace(/-color$/i, ''));

const VariableOption = ({ variable }: { variable: string }) => (
  <Stack direction="row" alignItems="center" className="ag-theme-custom">
    <VarColorSwatch color={`var(${variable})`} />
    <Stack gap={0}>
      {formatVariable(variable)}
      <VariableNameHint>var({variable})</VariableNameHint>
    </Stack>
  </Stack>
);

const VariableNameHint = styled('span')`
  font-size: 0.8em;
  color: var(--joy-palette-neutral-400);
`;

const VarColorSwatch = styled(ColorSwatch)`
  width: 40px;
  height: 40px;
  border-radius: 6px;
`;
