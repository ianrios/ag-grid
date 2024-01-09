import { quartzIconsParamsDefaults } from 'design-system/parts';
import { scheme } from 'features/schemes/schemes-types';
import { QuartzIconsParamsEditor } from './QuartzIconsParamsEditor';
import { QuartzIconsPresetPreview } from './QuartzIconsPresetPreview';

export const quartzIconsScheme = scheme({
  id: 'quartz-icons',
  label: 'Icons',
  presets: [
    {
      id: 'skinny',
      params: quartzIconsParamsDefaults({ strokeWidth: 1 }),
    },
    {
      id: 'regular',
      isDefault: true,
      params: quartzIconsParamsDefaults(),
    },
    {
      id: 'heavy',
      params: quartzIconsParamsDefaults({ strokeWidth: 2 }),
    },
  ],
  paramsEditorComponent: QuartzIconsParamsEditor,
  presetPreviewComponent: QuartzIconsPresetPreview,
});
