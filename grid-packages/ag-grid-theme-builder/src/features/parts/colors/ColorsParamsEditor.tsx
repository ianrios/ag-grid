import { Cell, TwoColumnTable } from 'components/Table';
import { ColorsParams, colorsParamsDefaults } from 'design-system/parts';
import { ColorEditor } from 'features/editors/color/ColorEditor';
import { titleCase } from 'model/utils';
import { Fragment } from 'react';
import { PartParamsEditor } from '../parts-types';

type ColorMeta = {
  property: keyof ColorsParams;
  doc: string;
  preventVariables?: boolean;
  preventTransparency?: boolean;
};

const colours: ColorMeta[] = [
  {
    property: 'background',
    doc: 'Background colour of the grid. The default is white - if you override this, ensure that there is enough contrast between the foreground and background.',
    preventTransparency: true,
    preventVariables: true,
  },
  {
    property: 'foreground',
    doc: 'Foreground colour of the grid, and default text colour. The default is black - if you override this, ensure that there is enough contrast between the foreground and background.',
    preventVariables: true,
  },
  {
    property: 'accent',
    doc: 'The "brand colour" for the grid, used wherever a non-neutral colour is required. Selections, focus outlines and checkboxes use the accent colour by default.',
    preventVariables: true,
  },
  {
    property: 'border',
    doc: 'Default colour for borders. The default is black - if you override this, ensure that there is enough contrast between the foreground and background.',
  },
  {
    property: 'chromeBackground',
    doc: 'Background colour for non-data areas of the grid. Headers, tool panels and menus use this colour by default.',
  },
];

export const ColorsParamsEditor: PartParamsEditor<ColorsParams> = (props) => {
  const params = colorsParamsDefaults(props.value);
  return (
    <TwoColumnTable rowGap={1}>
      {colours.map(({ property, preventTransparency, preventVariables }) => (
        <Fragment key={property}>
          <Cell>{titleCase(property)}:</Cell>
          <Cell>
            <ColorEditor
              value={params[property]}
              onChange={(v) => props.onPropertyChange(property, v)}
              preventTransparency={!!preventTransparency}
              preventVariables={!!preventVariables}
            />
          </Cell>
        </Fragment>
      ))}
    </TwoColumnTable>
  );
};
