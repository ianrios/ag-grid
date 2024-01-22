import { styled } from '@mui/joy';
import { useAtomValue } from 'jotai';
import { renderedThemeAtom } from 'model/rendered-theme';
import { memo, useLayoutEffect, useState } from 'react';
import { GridConfigDropdownButton } from '../features/grid-options/GridConfigDropdown';
import { DiscardChangesButton } from './DiscardChangesButton';
import { GridPreview } from './GridPreview';
import { PartsEditor } from './PartsEditor';

export const RootContainer = memo(() => {
  const renderedTheme = useAtomValue(renderedThemeAtom);

  const [canRenderApp, setCanRenderApp] = useState(false);
  useLayoutEffect(() => {
    setCanRenderApp(true);
  }, [renderedTheme]);

  return (
    <Container>
      {canRenderApp && (
        <Grid>
          <Header>
            <GridConfigDropdownButton />
            <DiscardChangesButton />
          </Header>
          <Menu>
            <PartsEditor />
          </Menu>
          <Main>
            <GridPreview />
          </Main>
        </Grid>
      )}
    </Container>
  );
});

const Container = styled('div')`
  position: absolute;
  inset: 12px;
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
