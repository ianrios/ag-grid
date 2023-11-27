"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValuesDropZonePanel = void 0;
var core_1 = require("@ag-grid-community/core");
var baseDropZonePanel_1 = require("./baseDropZonePanel");
var ValuesDropZonePanel = /** @class */ (function (_super) {
    __extends(ValuesDropZonePanel, _super);
    function ValuesDropZonePanel(horizontal) {
        return _super.call(this, horizontal, 'aggregation') || this;
    }
    ValuesDropZonePanel.prototype.passBeansUp = function () {
        _super.prototype.setBeans.call(this, {
            gridOptionsService: this.gridOptionsService,
            eventService: this.eventService,
            context: this.getContext(),
            loggerFactory: this.loggerFactory,
            dragAndDropService: this.dragAndDropService
        });
        var localeTextFunc = this.localeService.getLocaleTextFunc();
        var emptyMessage = localeTextFunc('valueColumnsEmptyMessage', 'Drag here to aggregate');
        var title = localeTextFunc('values', 'Values');
        _super.prototype.init.call(this, {
            dragAndDropIcon: core_1.DragAndDropService.ICON_AGGREGATE,
            icon: core_1._.createIconNoSpan('valuePanel', this.gridOptionsService, null),
            emptyMessage: emptyMessage,
            title: title
        });
        this.addManagedListener(this.eventService, core_1.Events.EVENT_COLUMN_VALUE_CHANGED, this.refreshGui.bind(this));
    };
    ValuesDropZonePanel.prototype.getAriaLabel = function () {
        var translate = this.localeService.getLocaleTextFunc();
        var label = translate('ariaValuesDropZonePanelLabel', 'Values');
        return label;
    };
    ValuesDropZonePanel.prototype.getTooltipParams = function () {
        var res = _super.prototype.getTooltipParams.call(this);
        res.location = 'valueColumnsList';
        return res;
    };
    ValuesDropZonePanel.prototype.getIconName = function () {
        return this.isPotentialDndColumns() ? core_1.DragAndDropService.ICON_AGGREGATE : core_1.DragAndDropService.ICON_NOT_ALLOWED;
    };
    ValuesDropZonePanel.prototype.isColumnDroppable = function (column) {
        // we never allow grouping of secondary columns
        if (this.gridOptionsService.get('functionsReadOnly') || !column.isPrimary()) {
            return false;
        }
        return column.isAllowValue() && !column.isValueActive();
    };
    ValuesDropZonePanel.prototype.updateColumns = function (columns) {
        if (this.gridOptionsService.get('functionsPassive')) {
            var event_1 = {
                type: core_1.Events.EVENT_COLUMN_VALUE_CHANGE_REQUEST,
                columns: columns
            };
            this.eventService.dispatchEvent(event_1);
        }
        else {
            this.columnModel.setValueColumns(columns, "toolPanelUi");
        }
    };
    ValuesDropZonePanel.prototype.getExistingColumns = function () {
        return this.columnModel.getValueColumns();
    };
    __decorate([
        (0, core_1.Autowired)('columnModel')
    ], ValuesDropZonePanel.prototype, "columnModel", void 0);
    __decorate([
        (0, core_1.Autowired)('loggerFactory')
    ], ValuesDropZonePanel.prototype, "loggerFactory", void 0);
    __decorate([
        (0, core_1.Autowired)('dragAndDropService')
    ], ValuesDropZonePanel.prototype, "dragAndDropService", void 0);
    __decorate([
        core_1.PostConstruct
    ], ValuesDropZonePanel.prototype, "passBeansUp", null);
    return ValuesDropZonePanel;
}(baseDropZonePanel_1.BaseDropZonePanel));
exports.ValuesDropZonePanel = ValuesDropZonePanel;
