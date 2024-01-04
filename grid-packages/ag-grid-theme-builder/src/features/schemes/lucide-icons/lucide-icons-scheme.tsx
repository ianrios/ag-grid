import { Scheme } from 'features/schemes/schemes-types';
import { atomWithJSONStorage } from 'model/JSONStorage';
import { LucideIconsConfigEditor } from './LucideIconsConfigEditor';
import { LucideIconsPreview } from './LucideIconsPreview';

export type LucideIconsConfig = {
  strokeWidth: number;
  color: string | number;
  size: number;
};

export const lucideIconsDefaultStrokeWeight = 1.5;

export const lucideIconsScheme = (): Scheme<LucideIconsConfig> => ({
  label: 'Lucide Icons',
  atom: atomWithJSONStorage<LucideIconsConfig | string | null>('scheme.lucide-icons', 'regular'),
  presets: [
    {
      id: 'skinny',
      preview: <LucideIconsPreview label="Skinny" strokeWidth={1} />,
      value: { color: 0.9, strokeWidth: 1, size: 16 },
    },
    {
      id: 'regular',
      preview: <LucideIconsPreview label="Regular" strokeWidth={lucideIconsDefaultStrokeWeight} />,
      value: { color: 0.9, strokeWidth: lucideIconsDefaultStrokeWeight, size: 16 },
      default: true,
    },
    {
      id: 'heavy',
      preview: <LucideIconsPreview label="Heavy" strokeWidth={2} />,
      value: { color: 0.9, strokeWidth: 2, size: 16 },
    },
  ],
  editorComponent: LucideIconsConfigEditor,
});
