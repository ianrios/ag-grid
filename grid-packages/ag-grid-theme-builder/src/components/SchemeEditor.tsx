import { ChevronSort, Close, Reset, SettingsAdjust } from '@carbon/icons-react';
import { Dropdown, ListItemButton, Menu, MenuButton, MenuItem } from '@mui/joy';
import { Scheme, getDefaultPreset } from 'features/schemes/schemes-types';
import { useAtom } from 'jotai';

type SchemeEditorProps<T extends object> = {
  scheme: Scheme<T>;
};

export const SchemeEditor = <C extends object>({ scheme }: SchemeEditorProps<C>) => {
  const [value, setValue] = useAtom(scheme.valueAtom);
  const selectedPreset = scheme.presets.find((p) => p.id === value);
  const customParams = typeof value === 'object' ? value : null;
  const EditorComponent = scheme.editorComponent;
  const PresetPreviewComponent = scheme.presetPreviewComponent;
  return (
    <Dropdown>
      <MenuButton sx={{ gap: 1 }}>
        {selectedPreset ? (
          <PresetPreviewComponent {...selectedPreset} />
        ) : customParams != null ? (
          customFragment
        ) : (
          noneFragment
        )}
        <ChevronSort />
      </MenuButton>
      <Menu placement="top-start">
        {customParams ? (
          <>
            <EditorComponent
              value={customParams}
              onPropertyChange={(property, propertyValue) =>
                setValue({ ...customParams, [property]: propertyValue })
              }
            />
            <ListItemButton onClick={() => setValue(getDefaultPreset(scheme).id)}>
              <Reset /> Reset to defaults
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
              onClick={() => setValue((selectedPreset || getDefaultPreset(scheme)).params)}
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
