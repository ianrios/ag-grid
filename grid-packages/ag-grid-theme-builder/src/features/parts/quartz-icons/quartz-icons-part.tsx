import { quartzIconsParamsDefaults } from 'design-system/parts';
import { definePart } from 'features/parts/parts-types';
import { QuartzIconsParamsEditor } from './QuartzIconsParamsEditor';
import { QuartzIconsPresetPreview } from './QuartzIconsPresetPreview';

export const quartzIconsPart = definePart({
  id: 'quartz-icons',
  label: 'Icons',
  presets: [
    {
      id: 'light',
      params: quartzIconsParamsDefaults({ strokeWidth: 1 }),
    },
    {
      id: 'regular',
      isDefault: true,
      params: quartzIconsParamsDefaults(),
    },
    {
      id: 'bold',
      params: quartzIconsParamsDefaults({ strokeWidth: 2 }),
    },
  ],
  paramsEditorComponent: QuartzIconsParamsEditor,
  presetPreviewComponent: QuartzIconsPresetPreview,
});
