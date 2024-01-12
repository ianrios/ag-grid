import { Card, styled } from '@mui/joy';

export type ColorSwatchProps = {
  color: string;
  width?: number;
  height?: number;
};

export const ColorSwatch = (props: ColorSwatchProps) => (
  <ColorSwatchCard
    sx={{
      backgroundColor: props.color,
      width: props.width,
      height: props.height,
      borderRadius: props.width != null && props.width < 50 ? 3 : undefined,
    }}
  >
    <Color
      sx={{
        backgroundColor: props.color,
      }}
    />
  </ColorSwatchCard>
);

const Color = styled('div')`
  width: 100%;
  height: 100%;
`;

const ColorSwatchCard = styled(Card)`
  padding: 0;
  border-width: 2px;
  overflow: hidden;
  background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill-opacity=".05"><path d="M8 0h8v8H8zM0 8h8v8H0z"/></svg>');
`;
