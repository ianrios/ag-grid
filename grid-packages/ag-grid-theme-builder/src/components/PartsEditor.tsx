import { Add, ChevronSort, Reset, SettingsAdjust, TrashCan } from '@carbon/icons-react';
import {
  Dropdown,
  IconButton,
  ListItemButton,
  Menu,
  MenuButton,
  MenuItem,
  Stack,
  styled,
} from '@mui/joy';
import { allParts } from 'features/parts/all-parts';
import { Part, getDefaultPreset } from 'features/parts/parts-types';
import { useAtom } from 'jotai';
import { FC, ReactNode, memo, useState } from 'react';
import { AnimateAppear } from './AnimateAppear';

export const PartsEditor = () => (
  <PartsTable>
    {allParts().map((part, i) => (
      <PartEditor key={i} part={part} />
    ))}
  </PartsTable>
);

type PartEditorProps<T extends object> = {
  part: Part<T>;
};

const PartEditor = <T extends object>({ part }: PartEditorProps<T>) => {
  const [value, setValue] = useAtom(part.valueAtom);
  const selectedPreset = part.presets.find((p) => p.id === value);
  const customParams = typeof value === 'object' ? value : null;
  const [showEditor, setShowEditor] = useState(false);
  const PresetPreviewComponent = part.presetPreviewComponent;

  return (
    <>
      <LabelCell>{part.label}</LabelCell>
      <EditorCell>
        {selectedPreset ? (
          <Dropdown>
            <MenuButton sx={{ gap: 1 }}>
              <PresetPreviewComponent {...selectedPreset} />
              <ChevronSort />
            </MenuButton>
            <Menu placement="top-start">
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
                <SettingsAdjust /> Customise
              </ListItemButton>
              <MenuItem onClick={() => setValue(null)} selected={value == null}>
                <TrashCan /> Remove
              </MenuItem>
            </Menu>
          </Dropdown>
        ) : customParams ? (
          <StateAndIconButton
            label="custom"
            icon={<SettingsAdjust />}
            onClick={() => setShowEditor(!showEditor)}
          />
        ) : (
          <StateAndIconButton
            label="none"
            icon={<Add />}
            onClick={() => setValue(getDefaultPreset(part).id)}
          />
        )}
      </EditorCell>
      <FullWidthCell>
        <PartParamsEditor part={part} show={showEditor} />
      </FullWidthCell>
    </>
  );
};

const PartsTable = styled('div')`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-column-gap: 20px;
`;

const LabelCell = styled('div')`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const EditorCell = styled('div')`
  min-height: 36px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const FullWidthCell = styled('div')`
  grid-column-end: span 2;
`;

const StateAndIconButton: FC<{ label: string; icon: ReactNode; onClick: () => void }> = (props) => (
  <Stack>
    <Stack direction="row" alignItems="center" fontStyle="italic">
      {props.label}
      <IconButton
        size="sm"
        variant="outlined"
        sx={{
          '--IconButton-size': '20px',
        }}
        onClick={props.onClick}
      >
        {props.icon}
      </IconButton>
    </Stack>
  </Stack>
);

type PartParamsEditorProps<T extends object> = {
  show: boolean;
  part: Part<T>;
};

let PartParamsEditor = <T extends object>({ part, show }: PartParamsEditorProps<T>) => {
  const [value, setValue] = useAtom(part.valueAtom);
  const customParams = typeof value === 'object' ? value : null;
  const EditorComponent = part.paramsEditorComponent;
  return (
    <AnimateAppear>
      {show && customParams && (
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
      )}
    </AnimateAppear>
  );
};
PartParamsEditor = memo(PartParamsEditor) as any;
