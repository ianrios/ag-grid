import { BordersParams } from 'design-system/styles';
import { Scheme, SchemeValue } from 'features/schemes/schemes-types';
import { atomWithJSONStorage } from 'model/JSONStorage';
import { BordersConfigEditor } from './BordersParamsEditor';
import { BordersPresetPreview } from './BordersPresetPreview';

export const bordersScheme: Scheme<BordersParams> = {
  label: 'Borders',
  valueAtom: atomWithJSONStorage<SchemeValue<BordersParams>>('scheme.borders', 'regular'),
  presets: [
    {
      id: 'horizontal',
      params: {
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
      isDefault: true,
      params: {
        outside: true,
        belowHeaders: true,
        aboveFooters: true,
        betweenRows: true,
        betweenColumns: false,
        pinnedRows: true,
        pinnedColumns: true,
        sidePanels: true,
      },
    },
    {
      id: 'full',
      params: {
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
};
