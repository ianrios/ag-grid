import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ModuleRegistry } from '@ag-grid-community/core';
import { AgGridReact } from '@ag-grid-community/react';
import { AdvancedFilterModule } from '@ag-grid-enterprise/advanced-filter';
import { ClipboardModule } from '@ag-grid-enterprise/clipboard';
import { ColumnsToolPanelModule } from '@ag-grid-enterprise/column-tool-panel';
import { FiltersToolPanelModule } from '@ag-grid-enterprise/filter-tool-panel';
import { MenuModule } from '@ag-grid-enterprise/menu';
import { RangeSelectionModule } from '@ag-grid-enterprise/range-selection';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
import { styled } from '@mui/joy';
import { withErrorBoundary } from 'components/ErrorBoundary';
import { installTheme } from 'design-system/theme';
import { gridConfigAtom } from 'features/grid-options/grid-config-atom';
import { useAtomValue } from 'jotai';
import { buildGridOptions } from 'model/grid-options';
import { renderedThemeAtom } from 'model/rendered-theme';
import { memo, useEffect, useMemo, useState } from 'react';

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
  const gridConfig = useAtomValue(gridConfigAtom);
  const options = useMemo(() => buildGridOptions(gridConfig), [gridConfig]);
  const [internalState] = useState({ id: 1, prevConfig: gridConfig });

  if (gridConfig !== internalState.prevConfig) {
    internalState.id += 1;
  }

  const renderedTheme = useAtomValue(renderedThemeAtom);

  useEffect(() => {
    installTheme({ name: 'custom' }, [renderedTheme]);
  }, [renderedTheme]);

  return (
    <Wrapper>
      <AgGridReact key={internalState.id} {...options} />
    </Wrapper>
  );
};

const GridPreviewWrapped = memo(withErrorBoundary(GridPreview));

export { GridPreviewWrapped as GridPreview };

const Wrapper = styled('div')`
  width: 100%;
  height: 100%;
`;
