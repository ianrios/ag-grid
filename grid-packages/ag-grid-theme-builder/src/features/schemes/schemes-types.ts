import { PersistentAtom } from 'model/JSONStorage';

export type SchemeValue<TParams extends object> = TParams | string | null;

export type Scheme<TParams extends object> = {
  label: string;
  valueAtom: PersistentAtom<TParams | string | null>;
  presets: SchemePreset<TParams>[];
  editorComponent: SchemeParamsEditor<TParams>;
  presetPreviewComponent: SchemePresetPreview<TParams>;
};

export type SchemeParamsEditorProps<T extends object> = {
  value: T;
  onPropertyChange: <K extends keyof T>(key: K, value: T[K]) => void;
};

export type SchemeParamsEditor<T extends object> = React.FC<SchemeParamsEditorProps<T>>;

export type SchemePresetPreview<T extends object> = React.FC<SchemePreset<T>>;

export type SchemePreset<T> = {
  id: string;
  isDefault?: boolean;
  params: Required<T>;
};

export const getDefaultPreset = <T extends object>(scheme: Scheme<T>): SchemePreset<T> =>
  scheme.presets.find((p) => p.isDefault) || scheme.presets[0];

export const getParamsForValue = <T extends object>(
  scheme: Scheme<T>,
  value: SchemeValue<T>,
): T | null => {
  if (value == null) return null;
  if (typeof value === 'string') {
    // value is named preset
    const preset = scheme.presets.find((p) => p.isDefault);
    if (!preset) throw new Error(`Could not find preset "${value}" of scheme "${scheme.label}"`);
    return preset.params;
  }
  // value is params
  return value;
};
