import { ListItem, Slider } from '@mui/joy';
import { QuartzIconsParams, quartzIconsParamsDefaults } from 'design-system/parts';
import { ColorEditor } from 'features/editors/ColorEditor';
import { PartParamsEditor } from '../parts-types';

export const QuartzIconsParamsEditor: PartParamsEditor<QuartzIconsParams> = (props) => {
  const { color, iconSize, strokeWidth } = quartzIconsParamsDefaults(props.value);
  return (
    <>
      <ListItem>
        Size:
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
      </ListItem>
      <ListItem>
        Weight:
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
      </ListItem>
      <ListItem>
        <ColorEditor value={color} onChange={(v) => props.onPropertyChange('color', v)} />
      </ListItem>
    </>
  );
};
