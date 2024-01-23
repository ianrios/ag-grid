import { colorsParamsDefaults } from 'design-system/parts';
import { definePart } from 'features/parts/parts-types';
import { ColorsParamsEditor } from './ColorsParamsEditor';
import { ColorsPresetPreview } from './ColorsPresetPreview';

export const colorsPart = definePart({
  id: 'colors-icons',
  label: 'Colours',
  presets: [
    {
      id: 'light',
      isDefault: true,
      params: colorsParamsDefaults({ background: '#FFF', foreground: '#000' }),
    },
    {
      id: 'dark',
      params: colorsParamsDefaults({ background: '#000', foreground: '#FFF' }),
    },
  ],
  paramsEditorComponent: ColorsParamsEditor,
  presetPreviewComponent: ColorsPresetPreview,
  preventRemoval: true,
});
