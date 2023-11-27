"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropZoneColumnComp = void 0;
const core_1 = require("@ag-grid-community/core");
class DropZoneColumnComp extends core_1.Component {
    constructor(column, dragSourceDropTarget, ghost, dropZonePurpose, horizontal) {
        super();
        this.column = column;
        this.dragSourceDropTarget = dragSourceDropTarget;
        this.ghost = ghost;
        this.dropZonePurpose = dropZonePurpose;
        this.horizontal = horizontal;
        this.popupShowing = false;
    }
    init() {
        this.setTemplate(DropZoneColumnComp.TEMPLATE);
        const eGui = this.getGui();
        const isFunctionsReadOnly = this.gridOptionsService.get('functionsReadOnly');
        this.addElementClasses(eGui);
        this.addElementClasses(this.eDragHandle, 'drag-handle');
        this.addElementClasses(this.eText, 'text');
        this.addElementClasses(this.eButton, 'button');
        this.eDragHandle.appendChild(core_1._.createIconNoSpan('columnDrag', this.gridOptionsService));
        this.eButton.appendChild(core_1._.createIconNoSpan('cancel', this.gridOptionsService));
        this.setupSort();
        this.displayName = this.columnModel.getDisplayNameForColumn(this.column, 'columnDrop');
        this.setupComponents();
        if (!this.ghost && !isFunctionsReadOnly) {
            this.addDragSource();
        }
        this.setupAria();
        this.addManagedListener(this.eventService, core_1.Column.EVENT_SORT_CHANGED, () => {
            this.setupAria();
        });
        this.setupTooltip();
        this.activateTabIndex();
        const checkColumnLock = () => {
            const isLocked = this.isGroupingAndLocked();
            core_1._.setDisplayed(this.eButton, !isLocked && !this.gridOptionsService.get('functionsReadOnly'));
            this.eDragHandle.classList.toggle('ag-column-select-column-readonly', isLocked);
            this.setupAria();
        };
        checkColumnLock();
        if (this.isGroupingZone()) {
            this.addManagedPropertyListener('groupLockGroupColumns', () => checkColumnLock());
        }
    }
    setupAria() {
        const translate = this.localeService.getLocaleTextFunc();
        const { name, aggFuncName } = this.getColumnAndAggFuncName();
        const aggSeparator = translate('ariaDropZoneColumnComponentAggFuncSeparator', ' of ');
        const sortDirection = {
            asc: translate('ariaDropZoneColumnComponentSortAscending', 'ascending'),
            desc: translate('ariaDropZoneColumnComponentSortDescending', 'descending'),
        };
        const columnSort = this.column.getSort();
        const isSortSuppressed = this.gridOptionsService.get('rowGroupPanelSuppressSort');
        const ariaInstructions = [
            [
                aggFuncName && `${aggFuncName}${aggSeparator}`,
                name,
                this.isGroupingZone() && !isSortSuppressed && columnSort && `, ${sortDirection[columnSort]}`
            ].filter(part => !!part).join(''),
        ];
        const isFunctionsReadOnly = this.gridOptionsService.get('functionsReadOnly');
        if (this.isAggregationZone() && !isFunctionsReadOnly) {
            const aggregationMenuAria = translate('ariaDropZoneColumnValueItemDescription', 'Press ENTER to change the aggregation type');
            ariaInstructions.push(aggregationMenuAria);
        }
        if (this.isGroupingZone() && this.column.isSortable() && !isSortSuppressed) {
            const sortProgressAria = translate('ariaDropZoneColumnGroupItemDescription', 'Press ENTER to sort');
            ariaInstructions.push(sortProgressAria);
        }
        if (!this.isGroupingAndLocked()) {
            const deleteAria = translate('ariaDropZoneColumnComponentDescription', 'Press DELETE to remove');
            ariaInstructions.push(deleteAria);
        }
        core_1._.setAriaLabel(this.getGui(), ariaInstructions.join('. '));
    }
    setupTooltip() {
        const refresh = () => {
            const newTooltipText = this.column.getColDef().headerTooltip;
            this.setTooltip(newTooltipText);
        };
        refresh();
        this.addManagedListener(this.eventService, core_1.Events.EVENT_NEW_COLUMNS_LOADED, refresh);
    }
    setupSort() {
        const canSort = this.column.isSortable();
        const isGroupingZone = this.isGroupingZone();
        if (!canSort || !isGroupingZone) {
            return;
        }
        if (!this.gridOptionsService.get('rowGroupPanelSuppressSort')) {
            this.eSortIndicator.setupSort(this.column, true);
            const performSort = (event) => {
                event.preventDefault();
                const sortUsingCtrl = this.gridOptionsService.get('multiSortKey') === 'ctrl';
                const multiSort = sortUsingCtrl ? (event.ctrlKey || event.metaKey) : event.shiftKey;
                this.sortController.progressSort(this.column, multiSort, 'uiColumnSorted');
            };
            this.addGuiEventListener('click', performSort);
            this.addGuiEventListener('keydown', (e) => {
                const isEnter = e.key === core_1.KeyCode.ENTER;
                if (isEnter && this.isGroupingZone()) {
                    performSort(e);
                }
            });
        }
    }
    addDragSource() {
        const dragSource = {
            type: core_1.DragSourceType.ToolPanel,
            eElement: this.eDragHandle,
            getDefaultIconName: () => core_1.DragAndDropService.ICON_HIDE,
            getDragItem: () => this.createDragItem(),
            dragItemName: this.displayName,
            dragSourceDropTarget: this.dragSourceDropTarget
        };
        this.dragAndDropService.addDragSource(dragSource, true);
        this.addDestroyFunc(() => this.dragAndDropService.removeDragSource(dragSource));
    }
    createDragItem() {
        const visibleState = {};
        visibleState[this.column.getId()] = this.column.isVisible();
        return {
            columns: [this.column],
            visibleState: visibleState
        };
    }
    setupComponents() {
        this.setTextValue();
        this.setupRemove();
        if (this.ghost) {
            this.addCssClass('ag-column-drop-cell-ghost');
        }
        if (this.isAggregationZone() && !this.gridOptionsService.get('functionsReadOnly')) {
            this.addGuiEventListener('click', this.onShowAggFuncSelection.bind(this));
        }
    }
    isGroupingAndLocked() {
        return this.isGroupingZone() && this.columnModel.isColumnGroupingLocked(this.column);
    }
    setupRemove() {
        core_1._.setDisplayed(this.eButton, !this.isGroupingAndLocked() && !this.gridOptionsService.get('functionsReadOnly'));
        const agEvent = { type: DropZoneColumnComp.EVENT_COLUMN_REMOVE };
        this.addGuiEventListener('keydown', (e) => {
            const isEnter = e.key === core_1.KeyCode.ENTER;
            const isDelete = e.key === core_1.KeyCode.DELETE;
            if (isDelete) {
                if (!this.isGroupingAndLocked()) {
                    e.preventDefault();
                    this.dispatchEvent(agEvent);
                }
            }
            if (isEnter && this.isAggregationZone() && !this.gridOptionsService.get('functionsReadOnly')) {
                e.preventDefault();
                this.onShowAggFuncSelection();
            }
        });
        this.addManagedListener(this.eButton, 'click', (mouseEvent) => {
            this.dispatchEvent(agEvent);
            mouseEvent.stopPropagation();
        });
        const touchListener = new core_1.TouchListener(this.eButton);
        this.addManagedListener(touchListener, core_1.TouchListener.EVENT_TAP, () => {
            this.dispatchEvent(agEvent);
        });
        this.addDestroyFunc(touchListener.destroy.bind(touchListener));
    }
    getColumnAndAggFuncName() {
        const name = this.displayName;
        let aggFuncName = '';
        if (this.isAggregationZone()) {
            const aggFunc = this.column.getAggFunc();
            // if aggFunc is a string, we can use it, but if it's a function, then we swap with 'func'
            const aggFuncString = typeof aggFunc === 'string' ? aggFunc : 'agg';
            const localeTextFunc = this.localeService.getLocaleTextFunc();
            aggFuncName = localeTextFunc(aggFuncString, aggFuncString);
        }
        return { name, aggFuncName };
    }
    setTextValue() {
        const { name, aggFuncName } = this.getColumnAndAggFuncName();
        const displayValue = this.isAggregationZone() ? `${aggFuncName}(${name})` : name;
        const displayValueSanitised = core_1._.escapeString(displayValue);
        this.eText.innerHTML = displayValueSanitised;
    }
    onShowAggFuncSelection() {
        if (this.popupShowing) {
            return;
        }
        this.popupShowing = true;
        const virtualList = new core_1.VirtualList({ cssIdentifier: 'select-agg-func' });
        const rows = this.aggFuncService.getFuncNames(this.column);
        const eGui = this.getGui();
        const virtualListGui = virtualList.getGui();
        virtualList.setModel({
            getRow: function (index) { return rows[index]; },
            getRowCount: function () { return rows.length; }
        });
        this.getContext().createBean(virtualList);
        const ePopup = core_1._.loadTemplate(/* html*/ `<div class="ag-select-agg-func-popup"></div>`);
        ePopup.style.top = '0px';
        ePopup.style.left = '0px';
        ePopup.appendChild(virtualListGui);
        ePopup.style.width = `${eGui.clientWidth}px`;
        const focusoutListener = this.addManagedListener(ePopup, 'focusout', (e) => {
            if (!ePopup.contains(e.relatedTarget) && addPopupRes) {
                addPopupRes.hideFunc();
            }
        });
        const popupHiddenFunc = (callbackEvent) => {
            this.destroyBean(virtualList);
            this.popupShowing = false;
            if ((callbackEvent === null || callbackEvent === void 0 ? void 0 : callbackEvent.key) === 'Escape') {
                eGui.focus();
            }
            if (focusoutListener) {
                focusoutListener();
            }
        };
        const translate = this.localeService.getLocaleTextFunc();
        const addPopupRes = this.popupService.addPopup({
            modal: true,
            eChild: ePopup,
            closeOnEsc: true,
            closedCallback: popupHiddenFunc,
            ariaLabel: translate('ariaLabelAggregationFunction', 'Aggregation Function')
        });
        if (addPopupRes) {
            virtualList.setComponentCreator(this.createAggSelect.bind(this, addPopupRes.hideFunc));
        }
        virtualList.addGuiEventListener('keydown', (e) => {
            if (e.key === core_1.KeyCode.ENTER || e.key === core_1.KeyCode.SPACE) {
                const row = virtualList.getLastFocusedRow();
                if (row == null) {
                    return;
                }
                const comp = virtualList.getComponentAt(row);
                if (comp) {
                    comp.selectItem();
                }
            }
        });
        this.popupService.positionPopupByComponent({
            type: 'aggFuncSelect',
            eventSource: eGui,
            ePopup: ePopup,
            keepWithinBounds: true,
            column: this.column,
            position: 'under'
        });
        virtualList.refresh();
        let rowToFocus = rows.findIndex(r => r === this.column.getAggFunc());
        if (rowToFocus === -1) {
            rowToFocus = 0;
        }
        virtualList.focusRow(rowToFocus);
    }
    createAggSelect(hidePopup, value) {
        const itemSelected = () => {
            hidePopup();
            if (this.gridOptionsService.get('functionsPassive')) {
                const event = {
                    type: core_1.Events.EVENT_COLUMN_AGG_FUNC_CHANGE_REQUEST,
                    columns: [this.column],
                    aggFunc: value
                };
                this.eventService.dispatchEvent(event);
            }
            else {
                this.columnModel.setColumnAggFunc(this.column, value, "toolPanelDragAndDrop");
            }
        };
        const localeTextFunc = this.localeService.getLocaleTextFunc();
        const aggFuncString = value.toString();
        const aggFuncStringTranslated = localeTextFunc(aggFuncString, aggFuncString);
        const comp = new AggItemComp(itemSelected, aggFuncStringTranslated);
        return comp;
    }
    addElementClasses(el, suffix) {
        suffix = suffix ? `-${suffix}` : '';
        const direction = this.horizontal ? 'horizontal' : 'vertical';
        el.classList.add(`ag-column-drop-cell${suffix}`, `ag-column-drop-${direction}-cell${suffix}`);
    }
    isAggregationZone() {
        return this.dropZonePurpose === 'aggregation';
    }
    isGroupingZone() {
        return this.dropZonePurpose === 'rowGroup';
    }
}
DropZoneColumnComp.EVENT_COLUMN_REMOVE = 'columnRemove';
DropZoneColumnComp.TEMPLATE = `<span role="option">
          <span ref="eDragHandle" class="ag-drag-handle ag-column-drop-cell-drag-handle" role="presentation"></span>
          <span ref="eText" class="ag-column-drop-cell-text" aria-hidden="true"></span>
          <ag-sort-indicator ref="eSortIndicator"></ag-sort-indicator>
          <span ref="eButton" class="ag-column-drop-cell-button" role="presentation"></span>
        </span>`;
__decorate([
    (0, core_1.Autowired)('dragAndDropService')
], DropZoneColumnComp.prototype, "dragAndDropService", void 0);
__decorate([
    (0, core_1.Autowired)('columnModel')
], DropZoneColumnComp.prototype, "columnModel", void 0);
__decorate([
    (0, core_1.Autowired)('popupService')
], DropZoneColumnComp.prototype, "popupService", void 0);
__decorate([
    (0, core_1.Optional)('aggFuncService')
], DropZoneColumnComp.prototype, "aggFuncService", void 0);
__decorate([
    (0, core_1.Autowired)('sortController')
], DropZoneColumnComp.prototype, "sortController", void 0);
__decorate([
    (0, core_1.RefSelector)('eText')
], DropZoneColumnComp.prototype, "eText", void 0);
__decorate([
    (0, core_1.RefSelector)('eDragHandle')
], DropZoneColumnComp.prototype, "eDragHandle", void 0);
__decorate([
    (0, core_1.RefSelector)('eButton')
], DropZoneColumnComp.prototype, "eButton", void 0);
__decorate([
    (0, core_1.RefSelector)('eSortIndicator')
], DropZoneColumnComp.prototype, "eSortIndicator", void 0);
__decorate([
    core_1.PostConstruct
], DropZoneColumnComp.prototype, "init", null);
exports.DropZoneColumnComp = DropZoneColumnComp;
class AggItemComp extends core_1.Component {
    constructor(itemSelected, value) {
        super(/* html */ `<div class="ag-select-agg-func-item"/>`);
        this.selectItem = itemSelected;
        this.getGui().innerText = value;
        this.addGuiEventListener('click', this.selectItem);
    }
}
