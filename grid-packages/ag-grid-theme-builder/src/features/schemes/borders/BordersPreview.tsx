import styled from '@emotion/styled';

export const BordersPreview = (props: { gaps: number[] }) => (
  <>
    {props.gaps.map((gap, i) => (
      <Line key={i} style={{ marginBottom: gap }} />
    ))}
  </>
);

const Line = styled('span')`
  width: 16px;
  border-bottom: solid 1px currentColor;
`;
