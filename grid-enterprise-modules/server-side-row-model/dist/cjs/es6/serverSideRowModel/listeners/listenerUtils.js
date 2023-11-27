"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListenerUtils = void 0;
const core_1 = require("@ag-grid-community/core");
let ListenerUtils = class ListenerUtils {
    isSortingWithValueColumn(changedColumnsInSort) {
        const valueColIds = this.columnModel.getValueColumns().map(col => col.getColId());
        for (let i = 0; i < changedColumnsInSort.length; i++) {
            if (valueColIds.indexOf(changedColumnsInSort[i]) > -1) {
                return true;
            }
        }
        return false;
    }
    isSortingWithSecondaryColumn(changedColumnsInSort) {
        if (!this.columnModel.getSecondaryColumns()) {
            return false;
        }
        const secondaryColIds = this.columnModel.getSecondaryColumns().map(col => col.getColId());
        for (let i = 0; i < changedColumnsInSort.length; i++) {
            if (secondaryColIds.indexOf(changedColumnsInSort[i]) > -1) {
                return true;
            }
        }
        return false;
    }
};
__decorate([
    (0, core_1.Autowired)('columnModel')
], ListenerUtils.prototype, "columnModel", void 0);
ListenerUtils = __decorate([
    (0, core_1.Bean)('ssrmListenerUtils')
], ListenerUtils);
exports.ListenerUtils = ListenerUtils;
