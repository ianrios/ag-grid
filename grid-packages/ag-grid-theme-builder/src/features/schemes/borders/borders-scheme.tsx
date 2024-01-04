import { BordersParams } from 'design-system/styles';
import { Scheme } from 'features/schemes/schemes-types';
import { atomWithJSONStorage } from 'model/JSONStorage';
import { BordersConfigEditor } from './BordersConfigEditor';
import { BordersPresetPreview } from './BordersPresetPreview';

export type BordersConfig = Required<BordersParams>;

export const bordersScheme = (): Scheme<BordersConfig> => ({
  label: 'Borders',
  atom: atomWithJSONStorage<BordersConfig | string | null>('scheme.borders', 'regular'),
  presets: [
    {
      id: 'horizontal',
      value: {
        outside: false,
        belowHeaders: true,
        aboveFooters: true,
        betweenRows: true,
        betweenColumns: false,
        pinnedRows: true,
        pinnedColumns: true,
        sidePanels: false,
      },
    },
    {
      id: 'default',
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
  presetPreviewComponent: BordersPresetPreview,
});
