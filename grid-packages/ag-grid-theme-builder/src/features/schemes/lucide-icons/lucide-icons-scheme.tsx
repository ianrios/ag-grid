import { LucideIconsParams } from 'design-system/styles';
import { Scheme, SchemeValue } from 'features/schemes/schemes-types';
import { atomWithJSONStorage } from 'model/JSONStorage';
import { LucideIconsParamsEditor } from './LucideIconsParamsEditor';
import { LucideIconsPresetPreview } from './LucideIconsPresetPreview';

export const lucideIconsScheme: Scheme<LucideIconsParams> = {
  label: 'Icons',
  valueAtom: atomWithJSONStorage<SchemeValue<LucideIconsParams>>('scheme.lucide-icons', 'regular'),
  presets: [
    {
      id: 'skinny',
      params: { color: 0.9, strokeWidth: 1, iconSize: 16 },
    },
    {
      id: 'regular',
      isDefault: true,
      params: { color: 0.9, strokeWidth: 1.5, iconSize: 16 },
    },
    {
      id: 'heavy',
      params: { color: 0.9, strokeWidth: 2, iconSize: 16 },
    },
  ],
  editorComponent: LucideIconsParamsEditor,
  presetPreviewComponent: LucideIconsPresetPreview,
};
