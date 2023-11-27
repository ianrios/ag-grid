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
import { _, Autowired, Events, RefSelector, KeyCode, PostConstruct, Component } from "@ag-grid-community/core";
export var ExpandState;
(function (ExpandState) {
    ExpandState[ExpandState["EXPANDED"] = 0] = "EXPANDED";
    ExpandState[ExpandState["COLLAPSED"] = 1] = "COLLAPSED";
    ExpandState[ExpandState["INDETERMINATE"] = 2] = "INDETERMINATE";
})(ExpandState || (ExpandState = {}));
var PrimaryColsHeaderPanel = /** @class */ (function (_super) {
    __extends(PrimaryColsHeaderPanel, _super);
    function PrimaryColsHeaderPanel() {
        return _super.call(this, PrimaryColsHeaderPanel.TEMPLATE) || this;
    }
    PrimaryColsHeaderPanel.prototype.postConstruct = function () {
        var _this = this;
        this.createExpandIcons();
        this.addManagedListener(this.eExpand, 'click', this.onExpandClicked.bind(this));
        this.addManagedListener(this.eExpand, 'keydown', function (e) {
            if (e.key === KeyCode.SPACE) {
                e.preventDefault();
                _this.onExpandClicked();
            }
        });
        this.addManagedListener(this.eSelect.getInputElement(), 'click', this.onSelectClicked.bind(this));
        this.addManagedPropertyListener('functionsReadOnly', function () { return _this.onFunctionsReadOnlyPropChanged(); });
        this.eFilterTextField
            .setAutoComplete(false)
            .onValueChange(function () { return _this.onFilterTextChanged(); });
        this.addManagedListener(this.eFilterTextField.getInputElement(), 'keydown', this.onMiniFilterKeyDown.bind(this));
        this.addManagedListener(this.eventService, Events.EVENT_NEW_COLUMNS_LOADED, this.showOrHideOptions.bind(this));
        var translate = this.localeService.getLocaleTextFunc();
        this.eSelect.setInputAriaLabel(translate('ariaColumnSelectAll', 'Toggle Select All Columns'));
        this.eFilterTextField.setInputAriaLabel(translate('ariaFilterColumnsInput', 'Filter Columns Input'));
        this.activateTabIndex([this.eExpand]);
    };
    PrimaryColsHeaderPanel.prototype.onFunctionsReadOnlyPropChanged = function () {
        var readOnly = this.gridOptionsService.get('functionsReadOnly');
        this.eSelect.setReadOnly(readOnly);
        this.eSelect.addOrRemoveCssClass('ag-column-select-column-readonly', readOnly);
    };
    PrimaryColsHeaderPanel.prototype.init = function (params) {
        this.params = params;
        var readOnly = this.gridOptionsService.get('functionsReadOnly');
        this.eSelect.setReadOnly(readOnly);
        this.eSelect.addOrRemoveCssClass('ag-column-select-column-readonly', readOnly);
        if (this.columnModel.isReady()) {
            this.showOrHideOptions();
        }
    };
    PrimaryColsHeaderPanel.prototype.createExpandIcons = function () {
        this.eExpand.appendChild((this.eExpandChecked = _.createIconNoSpan('columnSelectOpen', this.gridOptionsService)));
        this.eExpand.appendChild((this.eExpandUnchecked = _.createIconNoSpan('columnSelectClosed', this.gridOptionsService)));
        this.eExpand.appendChild((this.eExpandIndeterminate = _.createIconNoSpan('columnSelectIndeterminate', this.gridOptionsService)));
        this.setExpandState(ExpandState.EXPANDED);
    };
    // we only show expand / collapse if we are showing columns
    PrimaryColsHeaderPanel.prototype.showOrHideOptions = function () {
        var showFilter = !this.params.suppressColumnFilter;
        var showSelect = !this.params.suppressColumnSelectAll;
        var showExpand = !this.params.suppressColumnExpandAll;
        var groupsPresent = this.columnModel.isPrimaryColumnGroupsPresent();
        var translate = this.localeService.getLocaleTextFunc();
        this.eFilterTextField.setInputPlaceholder(translate('searchOoo', 'Search...'));
        _.setDisplayed(this.eFilterTextField.getGui(), showFilter);
        _.setDisplayed(this.eSelect.getGui(), showSelect);
        _.setDisplayed(this.eExpand, showExpand && groupsPresent);
    };
    PrimaryColsHeaderPanel.prototype.onFilterTextChanged = function () {
        var _this = this;
        if (!this.onFilterTextChangedDebounced) {
            this.onFilterTextChangedDebounced = _.debounce(function () {
                var filterText = _this.eFilterTextField.getValue();
                _this.dispatchEvent({ type: "filterChanged", filterText: filterText });
            }, PrimaryColsHeaderPanel.DEBOUNCE_DELAY);
        }
        this.onFilterTextChangedDebounced();
    };
    PrimaryColsHeaderPanel.prototype.onMiniFilterKeyDown = function (e) {
        var _this = this;
        if (e.key === KeyCode.ENTER) {
            // we need to add a delay that corresponds to the filter text debounce delay to ensure
            // the text filtering has happened, otherwise all columns will be deselected
            setTimeout(function () { return _this.onSelectClicked(); }, PrimaryColsHeaderPanel.DEBOUNCE_DELAY);
        }
    };
    PrimaryColsHeaderPanel.prototype.onSelectClicked = function () {
        this.dispatchEvent({ type: this.selectState ? 'unselectAll' : 'selectAll' });
    };
    PrimaryColsHeaderPanel.prototype.onExpandClicked = function () {
        this.dispatchEvent({ type: this.expandState === ExpandState.EXPANDED ? 'collapseAll' : 'expandAll' });
    };
    PrimaryColsHeaderPanel.prototype.setExpandState = function (state) {
        this.expandState = state;
        _.setDisplayed(this.eExpandChecked, this.expandState === ExpandState.EXPANDED);
        _.setDisplayed(this.eExpandUnchecked, this.expandState === ExpandState.COLLAPSED);
        _.setDisplayed(this.eExpandIndeterminate, this.expandState === ExpandState.INDETERMINATE);
    };
    PrimaryColsHeaderPanel.prototype.setSelectionState = function (state) {
        this.selectState = state;
        this.eSelect.setValue(this.selectState);
    };
    PrimaryColsHeaderPanel.DEBOUNCE_DELAY = 300;
    PrimaryColsHeaderPanel.TEMPLATE = "<div class=\"ag-column-select-header\" role=\"presentation\">\n            <div ref=\"eExpand\" class=\"ag-column-select-header-icon\"></div>\n            <ag-checkbox ref=\"eSelect\" class=\"ag-column-select-header-checkbox\"></ag-checkbox>\n            <ag-input-text-field class=\"ag-column-select-header-filter-wrapper\" ref=\"eFilterTextField\"></ag-input-text-field>\n        </div>";
    __decorate([
        Autowired('columnModel')
    ], PrimaryColsHeaderPanel.prototype, "columnModel", void 0);
    __decorate([
        RefSelector('eExpand')
    ], PrimaryColsHeaderPanel.prototype, "eExpand", void 0);
    __decorate([
        RefSelector('eSelect')
    ], PrimaryColsHeaderPanel.prototype, "eSelect", void 0);
    __decorate([
        RefSelector('eFilterTextField')
    ], PrimaryColsHeaderPanel.prototype, "eFilterTextField", void 0);
    __decorate([
        PostConstruct
    ], PrimaryColsHeaderPanel.prototype, "postConstruct", null);
    return PrimaryColsHeaderPanel;
}(Component));
export { PrimaryColsHeaderPanel };
