import { Checkbox, ListItem } from '@mui/joy';
import { BordersParams } from 'design-system/styles';
import { titleCase } from 'model/utils';
import { SchemeParamsEditor } from '../schemes-types';

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

export const BordersConfigEditor: SchemeParamsEditor<BordersParams> = ({
  value,
  onPropertyChange,
}) => (
  <>
    {booleanFields.map((field) => (
      <ListItem key={field}>
        <CheckboxPropertyEditor<BordersParams>
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
        label={titleCase(String(property))}
      />
    </ListItem>
  );
}
