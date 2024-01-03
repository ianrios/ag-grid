import { Checkbox, ListItem, Slider } from '@mui/joy';
import { ColorEditor } from 'features/editors/ColorEditor';
import { SchemeConfigEditor } from '../schemes-types';
import { BordersConfig } from './borders-scheme';

Next up: get this working

export const BordersConfigEditor: SchemeConfigEditor<BordersConfig> = ({
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

type CheckboxPropertyEditorProps<T> = {
  value: T;
  property: keyof T;
  onPropertyChange: <K extends keyof T>(key: K, value: T[K]) => void;
};

function CheckboxPropertyEditor<T>({
  value,
  property,
  onPropertyChange,
}: CheckboxPropertyEditorProps<T>) {
  return (
    <ListItem>
      <Checkbox
        checked={!!value[property]}
        onChange={() => onPropertyChange(property, !value[property] as T[typeof property])}
      />
    </ListItem>
  );
}
