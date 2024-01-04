import { PersistentAtom } from 'model/JSONStorage';

export type Scheme<TConfig extends object> = {
  label: string;
  atom: PersistentAtom<TConfig | string | null>;
  presets: SchemePreset<TConfig>[];
  editorComponent: SchemeConfigEditor<TConfig>;
};

export type SchemeConfigEditorProps<T extends object> = {
  value: T;
  onPropertyChange: <K extends keyof T>(key: K, value: T[K]) => void;
};

export type SchemeConfigEditor<T extends object> = React.FC<SchemeConfigEditorProps<T>>;

export type SchemePreset<T> = {
  id: string;
  preview: React.ReactNode;
  default?: boolean;
  value: T;
};
