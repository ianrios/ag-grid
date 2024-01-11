import { styled } from '@mui/joy';
import { memo, useState } from 'react';
import { GridConfigDropdown } from '../features/grid-options/GridConfigDropdown';
import { DiscardChangesButton } from './DiscardChangesButton';
import { GridPreview } from './GridPreview';
import { PartsEditor } from './PartsEditor';

export const RootContainer = memo(() => {
  const [color, setColor] = useState<string | number>('#8c4a');
  return (
    <>
      <Container>
        <Header>
          <GridConfigDropdown />
          <DiscardChangesButton />
        </Header>
        <Menu>
          <PartsEditor />
        </Menu>
        <Main>
          <GridPreview />
        </Main>
      </Container>
    </>
  );
});

const Container = styled('div')`
  height: 100%;
  display: grid;
  grid-template-areas:
    'header header'
    'menu main';
  grid-template-columns: 300px auto;
  grid-template-rows: min-content auto;
  gap: 20px;

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
