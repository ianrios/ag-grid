import { ChevronSort, Close, SettingsAdjust, TrashCan } from '@carbon/icons-react';
import { Dropdown, ListItemButton, Menu, MenuButton, MenuItem } from '@mui/joy';
import {
  LucideIconsConfig,
  lucideIconsScheme,
} from 'features/schemes/lucide-icons/lucide-icons-scheme';
import { Scheme, SchemePreset } from 'features/schemes/schemes-types';
import { useState } from 'react';

export const SchemesEditor = () => {
  const [value, setValue] = useState<string | LucideIconsConfig | null>(null);
  const [value2, setValue2] = useState<string | LucideIconsConfig | null>(null);
  return (
    <>
      <SchemesEditorRenderer value={value} onChange={setValue} scheme={lucideIconsScheme} />
      <SchemesEditorRenderer value={value} onChange={setValue} scheme={lucideIconsScheme} />
    </>
  );
};

type SchemesEditorProps<T extends object> = {
  value: string | T | null;
  onChange: (value: string | T | null) => void;
  scheme: Scheme<T>;
};

export const SchemesEditorRenderer = <C extends object>({
  value,
  onChange,
  scheme,
}: SchemesEditorProps<C>) => {
  const selectedPreset = scheme.presets.find((p) => p.id === value);
  const customConfig = typeof value === 'object' ? value : null;
  const EditorComponent = scheme.editorComponent;
  return (
    <Dropdown>
      <MenuButton sx={{ gap: 1 }}>
        {selectedPreset?.preview || (customConfig != null ? customFragment : noneFragment)}
        <ChevronSort />
      </MenuButton>
      <Menu placement="top-start">
        {customConfig ? (
          <>
            <EditorComponent
              value={customConfig}
              onPropertyChange={(property, propertyValue) =>
                onChange({ ...customConfig, [property]: propertyValue })
              }
            />
            <ListItemButton onClick={() => onChange(defaultPreset(scheme).id)}>
              <TrashCan /> Remove customisations
            </ListItemButton>
          </>
        ) : (
          <>
            {scheme.presets.map((preset) => (
              <MenuItem
                key={preset.id}
                onClick={() => onChange(preset.id)}
                selected={preset.id === value}
              >
                {preset.preview}
              </MenuItem>
            ))}
            <ListItemButton
              onClick={() => onChange((selectedPreset || defaultPreset(scheme)).value)}
            >
              {customFragment}
            </ListItemButton>
            <MenuItem onClick={() => onChange(null)} selected={value == null}>
              {noneFragment}
            </MenuItem>
          </>
        )}
      </Menu>
    </Dropdown>
  );
};

function defaultPreset<T extends object>(scheme: Scheme<T>): SchemePreset<T> {
  return scheme.presets.find((p) => p.default) || scheme.presets[0];
}

const customFragment = (
  <>
    <SettingsAdjust /> Custom
  </>
);
const noneFragment = (
  <>
    <Close /> None
  </>
);
