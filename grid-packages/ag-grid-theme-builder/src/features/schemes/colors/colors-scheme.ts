import { colorsParamsDefaults } from 'design-system/parts';
import { scheme } from 'features/schemes/schemes-types';
import { ColorsParamsEditor } from './ColorsParamsEditor';
import { ColorsPresetPreview } from './ColorsPresetPreview';

export const colorsScheme = scheme({
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
});
