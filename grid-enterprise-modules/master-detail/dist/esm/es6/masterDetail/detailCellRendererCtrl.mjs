var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Autowired, BeanStub, Events, _ } from "@ag-grid-community/core";
export class DetailCellRendererCtrl extends BeanStub {
    constructor() {
        super(...arguments);
        this.loadRowDataVersion = 0;
    }
    init(comp, params) {
        this.params = params;
        this.comp = comp;
        const doNothingBecauseInsidePinnedSection = params.pinned != null;
        if (doNothingBecauseInsidePinnedSection) {
            return;
        }
        this.setAutoHeightClasses();
        this.setupRefreshStrategy();
        this.addThemeToDetailGrid();
        this.createDetailGrid();
        this.loadRowData();
        this.addManagedListener(this.eventService, Events.EVENT_FULL_WIDTH_ROW_FOCUSED, this.onFullWidthRowFocused.bind(this));
    }
    onFullWidthRowFocused(e) {
        const params = this.params;
        const row = { rowIndex: params.node.rowIndex, rowPinned: params.node.rowPinned };
        const eventRow = { rowIndex: e.rowIndex, rowPinned: e.rowPinned };
        const isSameRow = this.rowPositionUtils.sameRow(row, eventRow);
        if (!isSameRow) {
            return;
        }
        this.focusService.focusInto(this.comp.getGui(), e.fromBelow);
    }
    setAutoHeightClasses() {
        const autoHeight = this.gridOptionsService.get('detailRowAutoHeight');
        const parentClass = autoHeight ? 'ag-details-row-auto-height' : 'ag-details-row-fixed-height';
        const detailClass = autoHeight ? 'ag-details-grid-auto-height' : 'ag-details-grid-fixed-height';
        this.comp.addOrRemoveCssClass(parentClass, true);
        this.comp.addOrRemoveDetailGridCssClass(detailClass, true);
    }
    setupRefreshStrategy() {
        const providedStrategy = this.params.refreshStrategy;
        const validSelection = providedStrategy == 'everything' || providedStrategy == 'nothing' || providedStrategy == 'rows';
        if (validSelection) {
            this.refreshStrategy = providedStrategy;
            return;
        }
        if (providedStrategy != null) {
            console.warn("AG Grid: invalid cellRendererParams.refreshStrategy = '" + providedStrategy +
                "' supplied, defaulting to refreshStrategy = 'rows'.");
        }
        this.refreshStrategy = 'rows';
    }
    addThemeToDetailGrid() {
        // this is needed by environment service of the child grid, the class needs to be on
        // the grid div itself - the browser's CSS on the other hand just inherits from the parent grid theme.
        const { theme } = this.environment.getTheme();
        if (theme) {
            this.comp.addOrRemoveDetailGridCssClass(theme, true);
        }
    }
    createDetailGrid() {
        if (_.missing(this.params.detailGridOptions)) {
            console.warn('AG Grid: could not find detail grid options for master detail, ' +
                'please set gridOptions.detailCellRendererParams.detailGridOptions');
            return;
        }
        const autoHeight = this.gridOptionsService.get('detailRowAutoHeight');
        // we clone the detail grid options, as otherwise it would be shared
        // across many instances, and that would be a problem because we set
        // api and columnApi into gridOptions
        const gridOptions = Object.assign({}, this.params.detailGridOptions);
        if (autoHeight) {
            gridOptions.domLayout = 'autoHeight';
        }
        this.comp.setDetailGrid(gridOptions);
    }
    registerDetailWithMaster(api, columnApi) {
        const rowId = this.params.node.id;
        const masterGridApi = this.params.api;
        const gridInfo = {
            id: rowId,
            api: api,
            columnApi: columnApi
        };
        const rowNode = this.params.node;
        // register with api
        masterGridApi.addDetailGridInfo(rowId, gridInfo);
        // register with node
        rowNode.detailGridInfo = gridInfo;
        this.addDestroyFunc(() => {
            // the gridInfo can be stale if a refresh happens and
            // a new row is created before the old one is destroyed.
            if (rowNode.detailGridInfo !== gridInfo) {
                return;
            }
            masterGridApi.removeDetailGridInfo(rowId); // unregister from api
            rowNode.detailGridInfo = null; // unregister from node
        });
    }
    loadRowData() {
        // in case a refresh happens before the last refresh completes (as we depend on async
        // application logic) we keep track on what the latest call was.
        this.loadRowDataVersion++;
        const versionThisCall = this.loadRowDataVersion;
        const userFunc = this.params.getDetailRowData;
        if (!userFunc) {
            console.warn('AG Grid: could not find getDetailRowData for master / detail, ' +
                'please set gridOptions.detailCellRendererParams.getDetailRowData');
            return;
        }
        const successCallback = (rowData) => {
            const mostRecentCall = this.loadRowDataVersion === versionThisCall;
            if (mostRecentCall) {
                this.comp.setRowData(rowData);
            }
        };
        const funcParams = {
            node: this.params.node,
            // we take data from node, rather than params.data
            // as the data could have been updated with new instance
            data: this.params.node.data,
            successCallback: successCallback,
            context: this.gridOptionsService.context
        };
        userFunc(funcParams);
    }
    refresh() {
        const GET_GRID_TO_REFRESH = false;
        const GET_GRID_TO_DO_NOTHING = true;
        switch (this.refreshStrategy) {
            // ignore this refresh, make grid think we've refreshed but do nothing
            case 'nothing': return GET_GRID_TO_DO_NOTHING;
            // grid will destroy and recreate the cell
            case 'everything': return GET_GRID_TO_REFRESH;
        }
        // do the refresh here, and tell the grid to do nothing
        this.loadRowData();
        return GET_GRID_TO_DO_NOTHING;
    }
}
__decorate([
    Autowired('rowPositionUtils')
], DetailCellRendererCtrl.prototype, "rowPositionUtils", void 0);
__decorate([
    Autowired('focusService')
], DetailCellRendererCtrl.prototype, "focusService", void 0);
