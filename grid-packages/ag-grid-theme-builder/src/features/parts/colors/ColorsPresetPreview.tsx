import styled from '@emotion/styled';
import { ColorsParams } from 'design-system/parts';
import { titleCase } from 'model/utils';
import { PartPreset } from '../parts-types';

export const ColorsPresetPreview = (props: PartPreset<ColorsParams>) => (
  <>
    <Background style={{ backgroundColor: props.params.background }}>
      <Foreground style={{ color: props.params.foreground }} />
    </Background>
    {titleCase(props.id)}
  </>
);

const Background = styled('div')`
  width: 16px;
  height: 16px;
  position: relative;
  border-radius: 2px;
  box-shadow: 0 0 8px #999;
`;

const Foreground = styled('div')`
  position: absolute;
  inset: 2px;
  border: solid 1.5px;
  border-radius: 100%;
`;
