import { BordersParams } from 'design-system/styles';
import { Scheme } from 'features/schemes/schemes-types';
import { atomWithJSONStorage } from 'model/JSONStorage';
import { BordersConfigEditor } from './BordersConfigEditor';
import { BordersPreview } from './BordersPreview';

export type BordersConfig = Required<BordersParams>;

export const bordersScheme = (): Scheme<BordersConfig> => ({
  label: 'Borders',
  atom: atomWithJSONStorage<BordersConfig | string | null>('scheme.borders', 'regular'),
  presets: [
    {
      id: 'minimal',
      preview: <BordersPreview gaps={[1, 2, 3]} />,
      value: {
        outside: false,
        belowHeaders: true,
        aboveFooters: true,
        betweenRows: false,
        betweenColumns: false,
        pinnedRows: true,
        pinnedColumns: true,
        sidePanels: false,
      },
    },
    {
      id: 'regular',
      preview: <BordersPreview gaps={[1, 2, 3]} />,
      value: {
        outside: true,
        belowHeaders: true,
        aboveFooters: true,
        betweenRows: true,
        betweenColumns: false,
        pinnedRows: true,
        pinnedColumns: true,
        sidePanels: true,
      },
      default: true,
    },
    {
      id: 'full',
      preview: <BordersPreview gaps={[1, 2, 3]} />,
      value: {
        outside: true,
        belowHeaders: true,
        aboveFooters: true,
        betweenRows: true,
        betweenColumns: true,
        pinnedRows: true,
        pinnedColumns: true,
        sidePanels: true,
      },
    },
  ],
  editorComponent: BordersConfigEditor,
});
