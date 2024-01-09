import { ChevronSort, Close, Reset, SettingsAdjust } from '@carbon/icons-react';
import { Dropdown, ListItemButton, Menu, MenuButton, MenuItem } from '@mui/joy';
import { Part, getDefaultPreset } from 'features/parts/parts-types';
import { useAtom } from 'jotai';

type PartEditorProps<T extends object> = {
  part: Part<T>;
};

export const PartEditor = <C extends object>({ part }: PartEditorProps<C>) => {
  const [value, setValue] = useAtom(part.valueAtom);
  const selectedPreset = part.presets.find((p) => p.id === value);
  const customParams = typeof value === 'object' ? value : null;
  const EditorComponent = part.paramsEditorComponent;
  const PresetPreviewComponent = part.presetPreviewComponent;
  return (
    <Dropdown>
      <MenuButton sx={{ gap: 1 }}>
        {selectedPreset ? (
          <>
            <PresetPreviewComponent {...selectedPreset} />
          </>
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
            <ListItemButton onClick={() => setValue(getDefaultPreset(part).id)}>
              <Reset /> Reset to defaults
            </ListItemButton>
          </>
        ) : (
          <>
            {part.presets.map((preset) => (
              <MenuItem
                key={preset.id}
                onClick={() => setValue(preset.id)}
                selected={preset.id === value}
              >
                <PresetPreviewComponent {...preset} />
              </MenuItem>
            ))}
            <ListItemButton
              onClick={() => setValue((selectedPreset || getDefaultPreset(part)).params)}
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
