import { bordersParamsDefaults } from 'design-system/parts';
import { scheme as defineScheme } from 'features/schemes/schemes-types';
import { BordersConfigEditor } from './BordersParamsEditor';
import { BordersPresetPreview } from './BordersPresetPreview';

export const bordersScheme = defineScheme({
  id: 'borders',
  label: 'Borders',
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
      params: bordersParamsDefaults(),
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
  paramsEditorComponent: BordersConfigEditor,
  presetPreviewComponent: BordersPresetPreview,
});
