import { ChevronSort, Close, SettingsAdjust, TrashCan } from '@carbon/icons-react';
import { Dropdown, ListItemButton, Menu, MenuButton, MenuItem } from '@mui/joy';
import { Scheme, SchemePreset } from 'features/schemes/schemes-types';
import { useAtom } from 'jotai';

type SchemeEditorProps<T extends object> = {
  scheme: Scheme<T>;
};

export const SchemeEditor = <C extends object>({ scheme }: SchemeEditorProps<C>) => {
  const [value, setValue] = useAtom(scheme.atom);
  const selectedPreset = scheme.presets.find((p) => p.id === value);
  const customConfig = typeof value === 'object' ? value : null;
  const EditorComponent = scheme.editorComponent;
  const PresetPreviewComponent = scheme.presetPreviewComponent;
  return (
    <Dropdown>
      <MenuButton sx={{ gap: 1 }}>
        {selectedPreset ? (
          <PresetPreviewComponent {...selectedPreset} />
        ) : customConfig != null ? (
          customFragment
        ) : (
          noneFragment
        )}
        <ChevronSort />
      </MenuButton>
      <Menu placement="top-start">
        {customConfig ? (
          <>
            <EditorComponent
              value={customConfig}
              onPropertyChange={(property, propertyValue) =>
                setValue({ ...customConfig, [property]: propertyValue })
              }
            />
            <ListItemButton onClick={() => setValue(defaultPreset(scheme).id)}>
              <TrashCan /> Remove customisations
            </ListItemButton>
          </>
        ) : (
          <>
            {scheme.presets.map((preset) => (
              <MenuItem
                key={preset.id}
                onClick={() => setValue(preset.id)}
                selected={preset.id === value}
              >
                <PresetPreviewComponent {...preset} />
              </MenuItem>
            ))}
            <ListItemButton
              onClick={() => setValue((selectedPreset || defaultPreset(scheme)).value)}
            >
              {customFragment}
            </ListItemButton>
            <MenuItem onClick={() => setValue(null)} selected={value == null}>
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
