import { AgGridReact } from '@ag-grid-community/react'; // React Grid Logic
import styled from '@emotion/styled';
import { withErrorBoundary } from 'components/ErrorBoundary';
import { installTheme } from 'design-system/theme';
import { getColumnDefs, getRowData } from 'model/exampleData';
import { memo, useEffect, useMemo } from 'react';

import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { AdvancedFilterModule } from '@ag-grid-enterprise/advanced-filter';
import { ClipboardModule } from '@ag-grid-enterprise/clipboard';
import { ColumnsToolPanelModule } from '@ag-grid-enterprise/column-tool-panel';
import { FiltersToolPanelModule } from '@ag-grid-enterprise/filter-tool-panel';
import { MenuModule } from '@ag-grid-enterprise/menu';
import { RangeSelectionModule } from '@ag-grid-enterprise/range-selection';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';

import { ModuleRegistry } from '@ag-grid-community/core';
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  AdvancedFilterModule,
  ClipboardModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  MenuModule,
  RangeSelectionModule,
  RowGroupingModule,
]);

const GridPreview = () => {
  const columnDefs = useMemo(getColumnDefs, []);
  const rowData = useMemo(getRowData, []);

  useEffect(() => {
    installTheme({ name: 'custom' });
  });

  return (
    <Wrapper className="ag-theme-custom">
      <AgGridReact columnDefs={columnDefs} rowData={rowData} />
    </Wrapper>
  );
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
