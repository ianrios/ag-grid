import { PersistentAtom, atomWithJSONStorage } from 'model/JSONStorage';

export type PartValue<TParams extends object> = TParams | string | null;

export type Part<TParams extends object> = {
  id: string;
  label: string;
  valueAtom: PersistentAtom<PartValue<TParams>>;
  presets: PartPreset<TParams>[];
  paramsEditorComponent: PartParamsEditor<TParams>;
  presetPreviewComponent: PartPresetPreview<TParams>;
  preventRemoval?: boolean;
};

export type PartParamsEditorProps<T extends object> = {
  value: T;
  onPropertyChange: <K extends keyof T>(key: K, value: T[K]) => void;
};

export type PartParamsEditor<T extends object> = React.FC<PartParamsEditorProps<T>>;

export type PartPresetPreview<T extends object> = React.FC<PartPreset<T>>;

export type PartPreset<T> = {
  id: string;
  isDefault?: boolean;
  params: Required<T>;
};

export const definePart = <T extends object>(args: Omit<Part<T>, 'valueAtom'>): Part<T> => {
  const defaults = args.presets.filter((p) => p.isDefault);
  if (defaults.length !== 1) throw new Error('Expected 1 default');
  return {
    ...args,
    valueAtom: atomWithJSONStorage<PartValue<T>>('part.' + args.id, defaults[0].id),
  };
};

export const getDefaultPreset = <T extends object>(part: Part<T>): PartPreset<T> =>
  part.presets.find((p) => p.isDefault) || part.presets[0];

export const getParamsForValue = <T extends object>(
  part: Part<T>,
  value: PartValue<T>,
): T | null => {
  if (value == null) return null;
  if (typeof value === 'string') {
    // value is named preset
    const preset = part.presets.find((p) => p.id === value);
    if (!preset) throw new Error(`Could not find preset "${value}" of part "${part.label}"`);
    return preset.params;
  }
  // value is params
  return value;
};
