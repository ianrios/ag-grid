import { styled } from '@mui/joy';
import { allSchemes } from 'features/schemes/all-schemes';
import { SchemeEditor } from './SchemeEditor';

export const SchemesEditor = () => (
  <Container>
    {allSchemes.map((scheme, i) => (
      <Row key={i}>
        <LabelCell>{scheme.label}</LabelCell>
        <EditorCell>
          <SchemeEditor scheme={scheme} />
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
