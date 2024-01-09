import { styled } from '@mui/joy';
import { allParts } from 'features/parts/all-parts';
import { PartEditor } from './PartEditor';

export const PartsEditor = () => (
  <Container>
    {allParts().map((part, i) => (
      <Row key={i}>
        <LabelCell>{part.label}</LabelCell>
        <EditorCell>
          <PartEditor part={part} />
        </EditorCell>
      </Row>
    ))}
  </Container>
);

const Container = styled('div')`
  display: table;
`;

const Row = styled('div')`
  display: table-row;
`;

const LabelCell = styled('div')`
  display: table-cell;
  vertical-align: middle;
  padding-right: 10px;
  padding-bottom: 10px;
`;

const EditorCell = styled('div')`
  display: table-cell;
  vertical-align: middle;
  padding-bottom: 10px;

  > * {
    vertical-align: top;
  }
`;
