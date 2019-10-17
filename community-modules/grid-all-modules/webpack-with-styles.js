var ClientSideRowModelModule = require('../../community-modules/client-side-row-model');
var CsvExportModule = require('../../community-modules/csv-export');
var GridCoreModule = require('../../community-modules/grid-core');
var InfiniteRowModelModule = require('../../community-modules/infinite-row-model');
var agGrid = require('./dist/es6/main');
Object.keys(agGrid).forEach(function(key) {
    exports[key] = agGrid[key];
});
agGrid.ModuleRegistry.register(ClientSideRowModelModule.ClientSideRowModelModule);
agGrid.ModuleRegistry.register(CsvExportModule.CsvExportModule);
agGrid.ModuleRegistry.register(InfiniteRowModelModule.InfiniteRowModelModule);
require('./dist/styles/ag-grid.css');
require('./dist/styles/ag-theme-balham-dark.css');
require('./dist/styles/ag-theme-balham.css');
require('./dist/styles/ag-theme-blue.css');
require('./dist/styles/ag-theme-bootstrap.css');
require('./dist/styles/ag-theme-dark.css');
require('./dist/styles/ag-theme-fresh.css');
require('./dist/styles/ag-theme-material.css');