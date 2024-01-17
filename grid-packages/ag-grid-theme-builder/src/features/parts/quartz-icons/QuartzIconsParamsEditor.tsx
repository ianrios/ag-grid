import { Slider } from '@mui/joy';
import { Cell, TwoColumnTable } from 'components/Table';
import { QuartzIconsParams, quartzIconsParamsDefaults } from 'design-system/parts';
import { ColorEditor } from 'features/editors/color/ColorEditor';
import { PartParamsEditor } from '../parts-types';

export const QuartzIconsParamsEditor: PartParamsEditor<QuartzIconsParams> = (props) => {
  const { color, iconSize, strokeWidth } = quartzIconsParamsDefaults(props.value);
  return (
    <TwoColumnTable>
      <Cell>Size:</Cell>
      <Slider
        value={iconSize}
        min={8}
        max={32}
        step={1}
        onChange={(_, value) =>
          props.onPropertyChange('iconSize', Array.isArray(value) ? value[0] : value)
        }
        valueLabelDisplay="auto"
        valueLabelFormat={(v) => `${v}px`}
      />
      <Cell>Weight:</Cell>
      <Slider
        value={strokeWidth}
        min={0.1}
        max={4}
        step={0.1}
        onChange={(_, value) =>
          props.onPropertyChange('strokeWidth', Array.isArray(value) ? value[0] : value)
        }
        valueLabelDisplay="auto"
        valueLabelFormat={(v) => `${v}px`}
      />
      <Cell>Color:</Cell>
      <ColorEditor
        value={color}
        onChange={(v) => props.onPropertyChange('color', v)}
        preventTransparency={false}
      />
    </TwoColumnTable>
  );
};
