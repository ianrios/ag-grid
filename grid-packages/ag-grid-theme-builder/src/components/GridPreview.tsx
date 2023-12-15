import styled from '@emotion/styled';
import { withErrorBoundary } from 'components/ErrorBoundary';
import { memo } from 'react';

const GridPreview = () => {
  return <Wrapper>TODO: restore me</Wrapper>;
};

const GridPreviewWrapped = memo(withErrorBoundary(GridPreview));

export { GridPreviewWrapped as GridPreview };

const Wrapper = styled('div')`
  width: 100%;
  height: 100%;
`;

// const buildGridOptions = (features: readonly Feature[]): GridOptions => {
//   const defaultColDef: ColDef = {
//     sortable: true,
//   };
//   const columnDefs = getColumnDefs();
//   const options: GridOptions = { defaultColDef, columnDefs };
//   for (const feature of features) {
//     assignOptions(defaultColDef, feature.defaultColDef);
//     feature.columnDefs?.forEach((def, i) => assignOptions(columnDefs[i], def));
//     assignOptions(options, feature.gridOptions);
//   }

//   if (features.find((f) => f.addColumnGroups)) {
//     options.columnDefs = getGroupColumnDefs(columnDefs);
//   }

//   return { ...options, rowData: getRowData() };
// };

// const assignOptions = <T extends object>(a: T, b: T | null | undefined): void => {
//   if (!b) return;
//   const aRecord = a as Record<string, unknown>;
//   const bRecord = b as Record<string, unknown>;
//   for (const key of Object.keys(bRecord)) {
//     if (Array.isArray(aRecord[key]) && Array.isArray(bRecord[key])) {
//       aRecord[key] = [...(aRecord[key] as unknown[]), ...(bRecord[key] as unknown[])];
//     } else {
//       aRecord[key] = bRecord[key];
//     }
//   }
// };
