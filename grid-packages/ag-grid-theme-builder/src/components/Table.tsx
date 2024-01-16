import { styled } from '@mui/joy';

type TwoColumnTableProps = {
  rowSpacing?: number;
};

export const TwoColumnTable = styled('div')`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-column-gap: 20px;
  grid-row-gap: ${(props: TwoColumnTableProps) => `${(props.rowSpacing ?? 0) * 8}px`};
`;

export const Cell = styled('div')`
  display: flex;
  align-items: center;
`;
