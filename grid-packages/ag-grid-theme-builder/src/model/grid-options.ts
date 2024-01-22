import { ColDef, ColGroupDef, GridOptions } from '@ag-grid-community/core';
import { agIconNameToSvgFragment } from 'design-system/parts/quartz-icons/lucide-fragments';

export const gridConfigBooleanFields = [
  'advancedFilter',
  'filtersToolPanel',
  'columnsToolPanel',
  'columnGroups',
  'columnHover',
  'rowGrouping',
  'columnResizing',
  'rowDrag',
  'rowSelection',
  'integratedCharts',
  'inlineIcons',
] as const;

type GridConfigBooleanField = (typeof gridConfigBooleanFields)[number];

export type GridConfig = {
  [K in GridConfigBooleanField]?: boolean;
};

export const buildGridOptions = (config: GridConfig): GridOptions => {
  const defaultColDef: ColDef = {
    sortable: true,
    resizable: config.columnResizing,
    enableRowGroup: true,
  };
  const columnDefs = buildSimpleColumnDefs();
  const sideBar: string[] = [];
  const options: GridOptions = {
    defaultColDef,
    sideBar,
    enableCharts: config.integratedCharts,
    columnHoverHighlight: config.columnHover,
    enableRangeSelection: true,
    rowData: defaultRowData(),
    columnDefs: config.columnGroups ? buildGroupColumnDefs(columnDefs) : columnDefs,
  };

  if (config.advancedFilter) {
    options.enableAdvancedFilter = true;
    defaultColDef.filter = true;
  }

  if (config.columnsToolPanel) {
    sideBar.push('columns');
  }

  if (config.filtersToolPanel) {
    sideBar.push('filters');
    defaultColDef.filter = true;
  }

  if (config.rowDrag) {
    columnDefs[0].rowDrag = true;
  }

  if (config.rowGrouping) {
    columnDefs[0].rowGroup = true;
    columnDefs[1].rowGroup = true;
    options.rowGroupPanelShow = 'always';
  }

  if (config.rowSelection) {
    options.rowSelection = 'multiple';
    options.autoGroupColumnDef = {
      headerName: 'Group',
      field: 'name',
      headerCheckboxSelection: true,
      cellRendererParams: {
        checkbox: true,
      },
    };
  }

  if (false && config.inlineIcons) {
    options.icons = {
      columnGroupOpened: svg('expanded'),
      columnGroupClosed: svg('contracted'),
      columnSelectClosed: svg('tree-closed'),
      columnSelectOpen: svg('tree-open'),
      columnSelectIndeterminate: svg('tree-indeterminate'),
      columnMovePin: svg('pin'),
      columnMoveHide: svg('eye-slash'),
      columnMoveMove: svg('arrows'),
      columnMoveLeft: svg('left'),
      columnMoveRight: svg('right'),
      columnMoveGroup: svg('group'),
      columnMoveValue: svg('aggregation'),
      columnMovePivot: svg('pivot'),
      dropNotAllowed: svg('not-allowed'),
      groupContracted: svg('tree-closed'),
      groupExpanded: svg('tree-open'),
      setFilterGroupClosed: svg('tree-closed'),
      setFilterGroupOpen: svg('tree-open'),
      setFilterGroupIndeterminate: svg('tree-indeterminate'),
      chart: svg('chart'),
      close: svg('cross'),
      cancel: svg('cancel'),
      check: svg('tick'),
      first: svg('first'),
      previous: svg('previous'),
      next: svg('next'),
      last: svg('last'),
      linked: svg('linked'),
      unlinked: svg('unlinked'),
      colorPicker: svg('color-picker'),
      groupLoading: svg('loading'),
      menu: svg('menu'),
      filter: svg('filter'),
      columns: svg('columns'),
      maximize: svg('maximize'),
      minimize: svg('minimize'),
      menuPin: svg('pin'),
      menuValue: svg('aggregation'),
      menuAddRowGroup: svg('group'),
      menuRemoveRowGroup: svg('group'),
      clipboardCopy: svg('copy'),
      clipboardCut: svg('cut'),
      clipboardPaste: svg('paste'),
      pivotPanel: svg('pivot'),
      rowGroupPanel: svg('group'),
      valuePanel: svg('aggregation'),
      columnDrag: svg('grip'),
      rowDrag: svg('grip'),
      save: svg('save'),
      csvExport: svg('csv'),
      excelExport: svg('excel'),
      smallDown: svg('small-down'),
      smallLeft: svg('small-left'),
      smallRight: svg('small-right'),
      smallUp: svg('small-up'),
      sortAscending: svg('asc'),
      sortDescending: svg('desc'),
      sortUnSort: svg('none'),
      advancedFilterBuilder: svg('group'),
      advancedFilterBuilderDrag: svg('grip'),
      advancedFilterBuilderInvalid: svg('not-allowed'),
      advancedFilterBuilderMoveUp: svg('up'),
      advancedFilterBuilderMoveDown: svg('down'),
      advancedFilterBuilderAdd: svg('plus'),
      advancedFilterBuilderRemove: svg('minus'),
    };
  }

  return options;
};

const svg = (name: string): string => {
  const svgFragment = agIconNameToSvgFragment[name];
  if (!svgFragment) {
    throw new Error(`Invalid icon name ${JSON.stringify(name)}`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" class="ag-quartz-icon-svg" viewBox="0 0 24 24">${svgFragment}</svg>`;
};

const buildSimpleColumnDefs = (): ColDef[] => [
  { field: 'make', flex: 1, suppressMovable: true, lockPosition: true },
  {
    field: 'model',
    flex: 1,
    filter: 'agSetColumnFilter',
    filterParams: {
      buttons: ['reset', 'apply'],
    },
  },
  { field: 'year', flex: 1 },
  { field: 'price', flex: 1 },
];

const buildGroupColumnDefs = (columns: ColDef[]): ColGroupDef[] => [
  {
    headerName: 'Car',
    children: columns.filter((c) => c.field === 'make' || c.field === 'model'),
  },
  {
    headerName: 'Data',
    children: columns.filter((c) => c.field !== 'make' && c.field !== 'model'),
  },
];

const defaultRowData = () => [
  { make: 'Toyota', model: 'Celica', year: 2001, price: 35000 },
  { make: 'Toyota', model: 'Celica', year: 2002, price: 36000 },
  { make: 'Toyota', model: 'Celica', year: 2003, price: 37000 },
  { make: 'Toyota', model: 'Celica', year: 2004, price: 38000 },
  { make: 'Toyota', model: 'Celica', year: 2005, price: 39000 },
  { make: 'Ford', model: 'Mondeo', year: 2001, price: 32000 },
  { make: 'Ford', model: 'Mondeo', year: 2002, price: 33000 },
  { make: 'Ford', model: 'Mondeo', year: 2003, price: 34000 },
  { make: 'Ford', model: 'Mondeo', year: 2004, price: 35000 },
  { make: 'Ford', model: 'Mondeo', year: 2005, price: 36000 },
  { make: 'Porsche', model: 'Boxster', year: 2001, price: 73000 },
  { make: 'Porsche', model: 'Boxster', year: 2002, price: 74000 },
  { make: 'Porsche', model: 'Boxster', year: 2003, price: 75000 },
  { make: 'Porsche', model: 'Boxster', year: 2004, price: 76000 },
  { make: 'Porsche', model: 'Boxster', year: 2005, price: 77000 },
];
