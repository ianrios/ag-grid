import { styled } from '@mui/joy';

export const TwoColumnTable = styled('div')`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-column-gap: 20px;
`;

export const Cell = styled('div')`
  display: flex;
  align-items: center;
`;
