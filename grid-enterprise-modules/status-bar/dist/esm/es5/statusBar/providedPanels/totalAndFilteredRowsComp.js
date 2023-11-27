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
import { Autowired, Events, PostConstruct, _ } from '@ag-grid-community/core';
import { NameValueComp } from "./nameValueComp";
var TotalAndFilteredRowsComp = /** @class */ (function (_super) {
    __extends(TotalAndFilteredRowsComp, _super);
    function TotalAndFilteredRowsComp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TotalAndFilteredRowsComp.prototype.postConstruct = function () {
        // this component is only really useful with client side row model
        if (this.gridApi.getModel().getType() !== 'clientSide') {
            console.warn("AG Grid: agTotalAndFilteredRowCountComponent should only be used with the client side row model.");
            return;
        }
        this.setLabel('totalAndFilteredRows', 'Rows');
        this.addCssClass('ag-status-panel');
        this.addCssClass('ag-status-panel-total-and-filtered-row-count');
        this.setDisplayed(true);
        this.addManagedListener(this.eventService, Events.EVENT_MODEL_UPDATED, this.onDataChanged.bind(this));
        this.onDataChanged();
    };
    TotalAndFilteredRowsComp.prototype.onDataChanged = function () {
        var localeTextFunc = this.localeService.getLocaleTextFunc();
        var thousandSeparator = localeTextFunc('thousandSeparator', ',');
        var decimalSeparator = localeTextFunc('decimalSeparator', '.');
        var rowCount = _.formatNumberCommas(this.getFilteredRowCountValue(), thousandSeparator, decimalSeparator);
        var totalRowCount = _.formatNumberCommas(this.getTotalRowCount(), thousandSeparator, decimalSeparator);
        if (rowCount === totalRowCount) {
            this.setValue(rowCount);
        }
        else {
            var localeTextFunc_1 = this.localeService.getLocaleTextFunc();
            this.setValue("".concat(rowCount, " ").concat(localeTextFunc_1('of', 'of'), " ").concat(totalRowCount));
        }
    };
    TotalAndFilteredRowsComp.prototype.getFilteredRowCountValue = function () {
        var filteredRowCount = 0;
        this.gridApi.forEachNodeAfterFilter(function (node) {
            if (!node.group) {
                filteredRowCount++;
            }
        });
        return filteredRowCount;
    };
    TotalAndFilteredRowsComp.prototype.getTotalRowCount = function () {
        var totalRowCount = 0;
        this.gridApi.forEachNode(function (node) {
            if (!node.group) {
                totalRowCount++;
            }
        });
        return totalRowCount;
    };
    TotalAndFilteredRowsComp.prototype.init = function () { };
    // this is a user component, and IComponent has "public destroy()" as part of the interface.
    // so we need to override destroy() just to make the method public.
    TotalAndFilteredRowsComp.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
    };
    __decorate([
        Autowired('gridApi')
    ], TotalAndFilteredRowsComp.prototype, "gridApi", void 0);
    __decorate([
        PostConstruct
    ], TotalAndFilteredRowsComp.prototype, "postConstruct", null);
    return TotalAndFilteredRowsComp;
}(NameValueComp));
export { TotalAndFilteredRowsComp };
