import { Checkbox, ListItem } from '@mui/joy';
import { SchemeConfigEditor } from '../schemes-types';
import { BordersConfig } from './borders-scheme';

const booleanFields = [
  'outside',
  'belowHeaders',
  'aboveFooters',
  'betweenRows',
  'betweenColumns',
  'pinnedRows',
  'pinnedColumns',
  'sidePanels',
] as const;

export const BordersConfigEditor: SchemeConfigEditor<BordersConfig> = ({
  value,
  onPropertyChange,
}) => (
  <>
    {booleanFields.map((field) => (
      <ListItem key={field}>
        <CheckboxPropertyEditor<BordersConfig>
          value={value}
          property={field}
          onPropertyChange={onPropertyChange}
        />
      </ListItem>
    ))}
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
