import { styled } from '@mui/joy';
import { installTheme } from 'design-system/theme';
import { TabbedColorEditor } from 'features/editors/color/TabbedColorEditor';
import { cssInterpretationElementId } from 'features/editors/color/color-editor-utils';
import { useAtomValue } from 'jotai';
import { renderedThemeAtom } from 'model/rendered-theme';
import { memo, useLayoutEffect, useState } from 'react';
import { GridConfigDropdownButton } from '../features/grid-options/GridConfigDropdown';
import { DiscardChangesButton } from './DiscardChangesButton';
import { GridPreview } from './GridPreview';
import { PartsEditor } from './PartsEditor';

export const RootContainer = memo(() => {
  const [color, setColor] = useState<string | number>(
    'color-mix(in srgb, transparent, var(--ag-foreground-color) 42%)',
    // 'hsla(0, 35%, 70%, 0.5)',
  );

  const renderedTheme = useAtomValue(renderedThemeAtom);

  const [canRenderApp, setCanRenderApp] = useState(false);
  useLayoutEffect(() => {
    installTheme('custom', [renderedTheme]);
    setCanRenderApp(true);
  }, [renderedTheme]);

  return (
    <Container className="ag-theme-custom">
      {canRenderApp && (
        <Grid>
          <Header>
            <GridConfigDropdownButton />
            <DiscardChangesButton />
          </Header>
          <Menu>
            <PartsEditor />
            <TabbedColorEditor initialValue={color} onChange={setColor} />
          </Menu>
          <Main>
            <GridPreview />
          </Main>
        </Grid>
      )}
      <ReinterpretationElement id={cssInterpretationElementId} />
    </Container>
  );
});

const Container = styled('div')`
  height: 100%;
`;

const ReinterpretationElement = styled('span')`
  position: absolute;
  left: -10000px;
`;

const Grid = styled('div')`
  height: 100%;
  display: grid;
  grid-template-areas:
    'header header'
    'menu main';
  grid-template-columns: 300px auto;
  grid-template-rows: min-content auto;
  gap: 20px;

  font-family: 'IBM Plex Sans', sans-serif;

  .tooltip {
    max-width: 400px;
  }
`;

const Header = styled('div')`
  grid-area: header;
  display: flex;
  justify-content: space-between;
`;

const Menu = styled('div')`
  grid-area: menu;
  overflow: auto;
`;

const Main = styled('div')`
  grid-area: main;
`;
