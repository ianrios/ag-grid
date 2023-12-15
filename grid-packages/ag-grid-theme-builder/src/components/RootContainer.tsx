import styled from '@emotion/styled';
import { Delete } from '@mui/icons-material';
import { Button } from '@mui/joy';
import { memo } from 'react';
import { Tooltip } from 'react-tooltip';
import { GridPreview } from './GridPreview';

export const RootContainer = memo(() => {
  return (
    <>
      <Container>
        <Header>
          <Button
            startDecorator={<Delete />}
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
          <div>MENU</div>
        </Menu>
        <Main>
          <GridPreview />
        </Main>
        <Tooltip
          id="theme-builder-tooltip"
          className="tooltip"
          place="top"
          anchorSelect="[data-tooltip-content]"
        />
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

const DefaultsElement = styled('div')`
  position: absolute;
  transform: translateY(-10);
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
