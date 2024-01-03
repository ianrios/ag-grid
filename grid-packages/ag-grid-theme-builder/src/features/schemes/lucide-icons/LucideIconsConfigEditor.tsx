import { ListItem, Slider } from '@mui/joy';
import { ColorEditor } from 'features/editors/ColorEditor';
import { SchemeConfigEditor } from '../schemes-types';
import { LucideIconsConfig } from './lucide-icons-scheme';

export const LucideIconsConfigEditor: SchemeConfigEditor<LucideIconsConfig> = ({
  value,
  onPropertyChange,
}) => (
  <>
    <ListItem>
      Size:
      <Slider
        value={value.size}
        min={8}
        max={32}
        step={1}
        onChange={(_, value) => onPropertyChange('size', Array.isArray(value) ? value[0] : value)}
        valueLabelDisplay="auto"
        valueLabelFormat={(v) => `${v}px`}
      />
      {/* <Checkbox value={props.value.color} /> */}
    </ListItem>
    <ListItem>
      Weight:
      <Slider
        value={value.strokeWidth}
        min={0.1}
        max={4}
        step={0.1}
        onChange={(_, value) =>
          onPropertyChange('strokeWidth', Array.isArray(value) ? value[0] : value)
        }
        valueLabelDisplay="auto"
        valueLabelFormat={(v) => `${v}px`}
      />
      {/* <Checkbox value={props.value.color} /> */}
    </ListItem>
    <ListItem>
      <ColorEditor value={value.color} onChange={(v) => onPropertyChange('color', v)} />
    </ListItem>
  </>
);
