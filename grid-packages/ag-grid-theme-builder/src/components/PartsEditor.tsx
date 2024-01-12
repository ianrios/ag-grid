import { Add, ChevronSort, Reset, SettingsAdjust, TrashCan } from '@carbon/icons-react';
import {
  Card,
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
import { FC, ReactNode, useState } from 'react';
import { AnimateAppear } from './AnimateAppear';
import { Cell } from './Table';
import { memoWithSameType } from './component-utils';

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
      <Cell>{part.label}</Cell>
      <Cell>
        {selectedPreset ? (
          <Dropdown>
            <MenuButton endDecorator={<ChevronSort />}>
              <PresetPreviewComponent {...selectedPreset} />
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
                onClick={() => {
                  setValue((selectedPreset || getDefaultPreset(part)).params);
                  setShowEditor(true);
                }}
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
            active={showEditor}
          />
        ) : (
          <StateAndIconButton
            label="none"
            icon={<Add />}
            onClick={() => setValue(getDefaultPreset(part).id)}
          />
        )}
      </Cell>
      <PartParamsEditor part={part} show={showEditor} />
    </>
  );
};

const PartsTable = styled('div')`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-column-gap: 20px;
`;

const StateAndIconButton: FC<{
  label: string;
  icon: ReactNode;
  onClick: () => void;
  active?: boolean;
}> = (props) => (
  <Stack minHeight={36} direction="row" alignItems="center" fontStyle="italic">
    {props.label}
    <IconButton
      size="sm"
      variant={props.active ? 'solid' : 'outlined'}
      sx={{
        '--IconButton-size': '20px',
      }}
      onClick={props.onClick}
    >
      {props.icon}
    </IconButton>
  </Stack>
);

type PartParamsEditorProps<T extends object> = {
  show: boolean;
  part: Part<T>;
};

const PartParamsEditor = memoWithSameType(
  <T extends object>({ part, show }: PartParamsEditorProps<T>) => {
    const [value, setValue] = useAtom(part.valueAtom);
    const customParams = typeof value === 'object' ? value : null;
    const EditorComponent = part.paramsEditorComponent;
    return (
      <PartParamsEditorCell>
        <AnimateAppear>
          {show && customParams && (
            <Card>
              <EditorComponent
                value={customParams}
                onPropertyChange={(property, propertyValue) =>
                  setValue({ ...customParams, [property]: propertyValue })
                }
              />
              <ListItemButton onClick={() => setValue(getDefaultPreset(part).id)}>
                <Reset /> Reset to defaults
              </ListItemButton>
            </Card>
          )}
        </AnimateAppear>
      </PartParamsEditorCell>
    );
  },
);

export const PartParamsEditorCell = styled('div')`
  grid-column-end: span 2;
  margin-bottom: 10px;
`;
