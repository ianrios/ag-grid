import { InformationFilled } from '@carbon/icons-react';
import { Slider, Stack, Tooltip } from '@mui/joy';
import { useChangeHandler } from 'components/component-utils';
import { singleOrFirst } from 'model/utils';
import { useState } from 'react';
import { ColorSwatch } from './ColorSwatch';
import {
  UncontrolledColorEditorProps,
  colorValueToCssExpression,
  formatProportionAsPercentPoint5,
} from './color-editor-utils';

export const PercentColorEditor = ({ initialValue, onChange }: UncontrolledColorEditorProps) => {
  const [value, setValue] = useState(typeof initialValue === 'number' ? initialValue : 1);

  useChangeHandler(value, onChange);

  return (
    <Stack>
      <ColorSwatch color={colorValueToCssExpression(value)} height={60} />
      <Stack direction="row" gap={1} alignItems="center">
        Foreground with {formatProportionAsPercentPoint5(value)} opacity
        <Tooltip title="Specifying colours as semi-transparent versions of the foreground colour where possible ensures that the color looks good against any background, even if the background is changed later.">
          <InformationFilled color="var(--joy-palette-primary-400)" />
        </Tooltip>
      </Stack>
      <Slider
        value={value}
        min={0}
        max={1}
        step={0.005}
        size="sm"
        onChange={(_, newValue) => setValue(singleOrFirst(newValue))}
        valueLabelDisplay="auto"
        sx={{ '--Slider-size': '15px' }}
        valueLabelFormat={formatProportionAsPercentPoint5}
      />
    </Stack>
  );
};
