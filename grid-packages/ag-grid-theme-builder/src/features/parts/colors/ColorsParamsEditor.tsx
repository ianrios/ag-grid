import { Cell, TwoColumnTable } from 'components/Table';
import { ColorsParams, colorsParamsDefaults } from 'design-system/parts';
import { ColorEditor } from 'features/editors/color/ColorEditor';
import { titleCase } from 'model/utils';
import { Fragment } from 'react';
import { PartParamsEditor } from '../parts-types';

type ColorMeta = {
  property: keyof ColorsParams;
  preventTransparency?: boolean;
};

const colours: ColorMeta[] = [
  { property: 'background', preventTransparency: true },
  { property: 'foreground', preventTransparency: true },
  { property: 'accent', preventTransparency: true },
  { property: 'border' },
  { property: 'chromeBackground' },
];

export const ColorsParamsEditor: PartParamsEditor<ColorsParams> = (props) => {
  const params = colorsParamsDefaults(props.value);
  return (
    <TwoColumnTable rowGap={1}>
      {colours.map(({ property, preventTransparency }) => (
        <Fragment key={property}>
          <Cell>{titleCase(property)}:</Cell>
          <Cell>
            <ColorEditor
              value={params[property]}
              onChange={(v) => props.onPropertyChange(property, v)}
              preventTransparency={preventTransparency}
            />
          </Cell>
        </Fragment>
      ))}
    </TwoColumnTable>
  );
};
