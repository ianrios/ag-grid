import { ModuleNames } from "@ag-grid-community/core";
import { CsvCreator } from "./csvExport/csvCreator";
import { GridSerializer } from "./csvExport/gridSerializer";
import { VERSION } from "./version";
export var CsvExportModule = {
    version: VERSION,
    moduleName: ModuleNames.CsvExportModule,
    beans: [CsvCreator, GridSerializer]
};
