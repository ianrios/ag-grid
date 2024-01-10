import { Checkbox, ListItem } from '@mui/joy';
import { BordersParams } from 'design-system/parts';
import { titleCase } from 'model/utils';
import { PartParamsEditor } from '../parts-types';

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

export const BordersConfigEditor: PartParamsEditor<BordersParams> = ({
  value,
  onPropertyChange,
}) => (
  <>
    {booleanFields.map((field) => (
      <ListItem key={field}>
        <CheckboxPropertyEditor
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
    <Checkbox
      checked={!!value[property]}
      onChange={() => onPropertyChange(property, !value[property] as T[typeof property])}
      label={titleCase(String(property))}
    />
  );
}
