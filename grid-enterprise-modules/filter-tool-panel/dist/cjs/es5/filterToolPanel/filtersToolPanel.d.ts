import { ColDef, ColGroupDef, Component, FiltersToolPanelState, IFiltersToolPanel, IToolPanelComp, IToolPanelParams } from "@ag-grid-community/core";
export interface ToolPanelFiltersCompParams extends IToolPanelParams {
    /** To suppress Expand / Collapse All */
    suppressExpandAll: boolean;
    /** To suppress the Filter Search */
    suppressFilterSearch: boolean;
    /** Suppress updating the layout of columns as they are rearranged in the grid */
    suppressSyncLayoutWithGrid: boolean;
}
export declare class FiltersToolPanel extends Component implements IFiltersToolPanel, IToolPanelComp {
    private static TEMPLATE;
    private filtersToolPanelHeaderPanel;
    private filtersToolPanelListPanel;
    private initialised;
    private params;
    private listenerDestroyFuncs;
    constructor();
    init(params: ToolPanelFiltersCompParams): void;
    setVisible(visible: boolean): void;
    onExpandAll(): void;
    onCollapseAll(): void;
    private onSearchChanged;
    setFilterLayout(colDefs: (ColDef | ColGroupDef)[]): void;
    private onFilterExpanded;
    private onGroupExpanded;
    expandFilterGroups(groupIds?: string[]): void;
    collapseFilterGroups(groupIds?: string[]): void;
    expandFilters(colIds?: string[]): void;
    collapseFilters(colIds?: string[]): void;
    syncLayoutWithGrid(): void;
    refresh(): void;
    getState(): FiltersToolPanelState;
    destroy(): void;
}
