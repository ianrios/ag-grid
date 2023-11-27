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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiFloatingFilterComp = void 0;
var core_1 = require("@ag-grid-community/core");
var multiFilter_1 = require("./multiFilter");
var MultiFloatingFilterComp = /** @class */ (function (_super) {
    __extends(MultiFloatingFilterComp, _super);
    function MultiFloatingFilterComp() {
        var _this = _super.call(this, /* html */ "<div class=\"ag-multi-floating-filter ag-floating-filter-input\"></div>") || this;
        _this.floatingFilters = [];
        _this.compDetailsList = [];
        return _this;
    }
    MultiFloatingFilterComp.prototype.init = function (params) {
        this.params = params;
        var compDetailsList = this.getCompDetailsList(params).compDetailsList;
        return this.setParams(compDetailsList);
    };
    MultiFloatingFilterComp.prototype.setParams = function (compDetailsList) {
        var _this = this;
        var floatingFilterPromises = [];
        compDetailsList.forEach(function (compDetails) {
            var floatingFilterPromise = compDetails === null || compDetails === void 0 ? void 0 : compDetails.newAgStackInstance();
            if (floatingFilterPromise != null) {
                _this.compDetailsList.push(compDetails);
                floatingFilterPromises.push(floatingFilterPromise);
            }
        });
        return core_1.AgPromise.all(floatingFilterPromises).then(function (floatingFilters) {
            floatingFilters.forEach(function (floatingFilter, index) {
                _this.floatingFilters.push(floatingFilter);
                var gui = floatingFilter.getGui();
                _this.appendChild(gui);
                if (index > 0) {
                    core_1._.setDisplayed(gui, false);
                }
            });
        });
    };
    MultiFloatingFilterComp.prototype.onParamsUpdated = function (params) {
        var _this = this;
        this.params = params;
        var _a = this.getCompDetailsList(params), newCompDetailsList = _a.compDetailsList, floatingFilterParamsList = _a.floatingFilterParamsList;
        var allFloatingFilterCompsUnchanged = newCompDetailsList.length === this.compDetailsList.length
            && newCompDetailsList.every(function (newCompDetails, index) { return !_this.filterManager.areFilterCompsDifferent(_this.compDetailsList[index], newCompDetails); });
        if (allFloatingFilterCompsUnchanged) {
            floatingFilterParamsList.forEach(function (floatingFilterParams, index) {
                var _a;
                var floatingFilter = _this.floatingFilters[index];
                (_a = floatingFilter.onParamsUpdated) === null || _a === void 0 ? void 0 : _a.call(floatingFilter, floatingFilterParams);
            });
        }
        else {
            core_1._.clearElement(this.getGui());
            this.destroyBeans(this.floatingFilters);
            this.floatingFilters = [];
            this.compDetailsList = [];
            this.setParams(newCompDetailsList);
        }
    };
    MultiFloatingFilterComp.prototype.getCompDetailsList = function (params) {
        var _this = this;
        var compDetailsList = [];
        var floatingFilterParamsList = [];
        var filterParams = params.filterParams;
        multiFilter_1.MultiFilter.getFilterDefs(filterParams).forEach(function (filterDef, index) {
            var floatingFilterParams = __assign(__assign({}, params), { 
                // set the parent filter instance for each floating filter to the relevant child filter instance
                parentFilterInstance: function (callback) {
                    _this.parentMultiFilterInstance(function (parent) {
                        var child = parent.getChildFilterInstance(index);
                        if (child == null) {
                            return;
                        }
                        callback(child);
                    });
                } });
            core_1._.mergeDeep(floatingFilterParams.filterParams, filterDef.filterParams);
            var compDetails = _this.getCompDetails(filterDef, floatingFilterParams);
            if (compDetails) {
                compDetailsList.push(compDetails);
                floatingFilterParamsList.push(floatingFilterParams);
            }
        });
        return { compDetailsList: compDetailsList, floatingFilterParamsList: floatingFilterParamsList };
    };
    MultiFloatingFilterComp.prototype.onParentModelChanged = function (model, event) {
        var _this = this;
        // We don't want to update the floating filter if the floating filter caused the change,
        // because the UI is already in sync. if we didn't do this, the UI would behave strangely
        // as it would be updating as the user is typing
        if (event && event.afterFloatingFilter) {
            return;
        }
        this.parentMultiFilterInstance(function (parent) {
            if (model == null) {
                _this.floatingFilters.forEach(function (filter, i) {
                    filter.onParentModelChanged(null, event);
                    core_1._.setDisplayed(filter.getGui(), i === 0);
                });
            }
            else {
                var lastActiveFloatingFilterIndex_1 = parent.getLastActiveFilterIndex();
                _this.floatingFilters.forEach(function (filter, i) {
                    var filterModel = model.filterModels.length > i ? model.filterModels[i] : null;
                    filter.onParentModelChanged(filterModel, event);
                    var shouldShow = lastActiveFloatingFilterIndex_1 == null ? i === 0 : i === lastActiveFloatingFilterIndex_1;
                    core_1._.setDisplayed(filter.getGui(), shouldShow);
                });
            }
        });
    };
    MultiFloatingFilterComp.prototype.destroy = function () {
        this.destroyBeans(this.floatingFilters);
        this.floatingFilters.length = 0;
        _super.prototype.destroy.call(this);
    };
    MultiFloatingFilterComp.prototype.getCompDetails = function (filterDef, params) {
        var _this = this;
        var _a;
        var defaultComponentName = (_a = this.userComponentFactory.getDefaultFloatingFilterType(filterDef, function () { return _this.filterManager.getDefaultFloatingFilter(_this.params.column); })) !== null && _a !== void 0 ? _a : 'agReadOnlyFloatingFilter';
        return this.userComponentFactory.getFloatingFilterCompDetails(filterDef, params, defaultComponentName);
    };
    MultiFloatingFilterComp.prototype.parentMultiFilterInstance = function (cb) {
        this.params.parentFilterInstance(function (parent) {
            if (!(parent instanceof multiFilter_1.MultiFilter)) {
                throw new Error('AG Grid - MultiFloatingFilterComp expects MultiFilter as its parent');
            }
            cb(parent);
        });
    };
    __decorate([
        (0, core_1.Autowired)('userComponentFactory')
    ], MultiFloatingFilterComp.prototype, "userComponentFactory", void 0);
    __decorate([
        (0, core_1.Autowired)('filterManager')
    ], MultiFloatingFilterComp.prototype, "filterManager", void 0);
    return MultiFloatingFilterComp;
}(core_1.Component));
exports.MultiFloatingFilterComp = MultiFloatingFilterComp;
