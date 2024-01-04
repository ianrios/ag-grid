import styled from '@emotion/styled';
import { titleCase } from 'model/utils';
import { SchemePreset } from '../schemes-types';
import { BordersConfig } from './borders-scheme';

export const BordersPresetPreview = ({ id, value }: SchemePreset<BordersConfig>) => (
  <>
    <Grid style={showIf(value.outside)}>
      <Row style={showIf(value.outside || value.belowHeaders)} />
      <Row style={showIf(value.belowHeaders)} />
      <Row style={showIf(value.betweenRows)} />
      <Row style={showIf(value.betweenRows)} />
      <Row style={showIf(value.betweenRows)} />
      <Columns style={showIf(value.betweenColumns)}>
        <Column />
        <Column />
      </Columns>
    </Grid>
    {titleCase(id)}
  </>
);

const Grid = styled('div')`
  position: relative;
  width: 16px;
  height: 13px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: center;
  border-left: solid 1px;
  border-right: solid 1px;
`;

const Row = styled('span')`
  width: 100%;
  border-bottom: solid 1px;
`;

const Columns = styled('div')`
  position: absolute;
  inset: 0 0 0 4px;
  display: flex;
  flex-direction: row;
  gap: 4px;
`;

const Column = styled('span')`
  height: 13px;
  border-left: solid 1px;
`;

// const Grid = styled('div')`
//   width: 16px;
//   height: 16px;
// `;

const showIf = (value: boolean) => ({ color: value ? 'black' : 'transparent' });
