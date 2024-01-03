import { TrashCan } from '@carbon/icons-react';
import styled from '@emotion/styled';
import { Button } from '@mui/joy';
import { memo } from 'react';
import { GridPreview } from './GridPreview';
import { SchemesEditor } from './SchemeEditor';

export const RootContainer = memo(() => {
  return (
    <>
      <Container>
        <Header>
          <Button
            startDecorator={<TrashCan />}
            onClick={() => {
              if (confirm('Discard all of your theme customisations?')) {
                localStorage.clear();
                location.reload();
              }
            }}
          >
            Discard changes
          </Button>
        </Header>
        <Menu>
          <SchemesEditor />
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
