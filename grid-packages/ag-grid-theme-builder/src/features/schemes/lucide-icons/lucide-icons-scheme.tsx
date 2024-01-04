import { Scheme } from 'features/schemes/schemes-types';
import { atomWithJSONStorage } from 'model/JSONStorage';
import { LucideIconsConfigEditor } from './LucideIconsConfigEditor';
import { LucideIconsPresetPreview } from './LucideIconsPresetPreview';

export type LucideIconsConfig = {
  strokeWidth: number;
  color: string | number;
  size: number;
};

export const lucideIconsScheme = (): Scheme<LucideIconsConfig> => ({
  label: 'Icons',
  atom: atomWithJSONStorage<LucideIconsConfig | string | null>('scheme.lucide-icons', 'regular'),
  presets: [
    {
      id: 'skinny',
      value: { color: 0.9, strokeWidth: 1, size: 16 },
    },
    {
      id: 'regular',
      value: { color: 0.9, strokeWidth: 1.5, size: 16 },
      default: true,
    },
    {
      id: 'heavy',
      value: { color: 0.9, strokeWidth: 2, size: 16 },
    },
  ],
  editorComponent: LucideIconsConfigEditor,
  presetPreviewComponent: LucideIconsPresetPreview,
});
