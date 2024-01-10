import { GridApi, createGrid, GridOptions } from '@ag-grid-community/core';

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
 columnDefs: [
    { field: 'country', rowGroup: true, enableRowGroup: true },
    { field: 'athlete', enablePivot: true },
    { field: 'year', enablePivot: true },
    { field: 'sport', enablePivot: true },
    { field: 'gold', aggFunc: 'sum' },
    { field: 'silver', aggFunc: 'sum' },
    { field: 'bronze', aggFunc: 'sum' },
  ],
  defaultColDef: {
    maxWidth: 140,
  },
  pivotMode: true,
  sideBar: true,
  pivotMaximumGeneratedColumns: 1000,
  onPivotLimitExceeded: () => {
    console.error('The limit of 1000 generated columns has been exceeded. Either remove pivot or aggregations from some columns or increase the limit.');
  }
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
  var gridDiv = document.querySelector<HTMLElement>('#myGrid')!
  gridApi = createGrid(gridDiv, gridOptions);

  fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
    .then(response => response.json())
    .then((data: IOlympicData[]) => gridApi!.setGridOption('rowData', data))
})
