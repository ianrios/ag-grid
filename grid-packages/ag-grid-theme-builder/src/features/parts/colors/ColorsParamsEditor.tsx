import { ListItem } from '@mui/joy';
import { ColorsParams, colorsParamsDefaults } from 'design-system/parts';
import { ColorEditor } from 'features/editors/ColorEditor';
import { PartParamsEditor } from '../parts-types';

export const ColorsParamsEditor: PartParamsEditor<ColorsParams> = (props) => {
  const { foreground, background } = colorsParamsDefaults(props.value);
  return (
    <>
      <ListItem>
        Background:
        <ColorEditor value={background} onChange={(v) => props.onPropertyChange('background', v)} />
      </ListItem>
      <ListItem>
        Foreground:
        <ColorEditor value={foreground} onChange={(v) => props.onPropertyChange('foreground', v)} />
      </ListItem>
    </>
  );
};
