import { ModuleNames } from "@ag-grid-community/core";
import { EnterpriseCoreModule } from "@ag-grid-enterprise/core";
import { RichSelectCellEditor } from "./richSelect/richSelectCellEditor.mjs";
import { VERSION } from "./version.mjs";
export const RichSelectModule = {
    version: VERSION,
    moduleName: ModuleNames.RichSelectModule,
    beans: [],
    userComponents: [
        { componentName: 'agRichSelect', componentClass: RichSelectCellEditor },
        { componentName: 'agRichSelectCellEditor', componentClass: RichSelectCellEditor }
    ],
    dependantModules: [
        EnterpriseCoreModule
    ]
};
