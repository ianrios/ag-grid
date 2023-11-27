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
import { serialiseDate } from "../../utils/date";
import { SimpleCellEditor } from "./simpleCellEditor";
import { exists } from "../../utils/generic";
var DateCellEditorInput = /** @class */ (function () {
    function DateCellEditorInput() {
    }
    DateCellEditorInput.prototype.getTemplate = function () {
        return /* html */ "<ag-input-date-field class=\"ag-cell-editor\" ref=\"eInput\"></ag-input-date-field>";
    };
    DateCellEditorInput.prototype.init = function (eInput, params) {
        this.eInput = eInput;
        this.params = params;
        if (params.min != null) {
            eInput.setMin(params.min);
        }
        if (params.max != null) {
            eInput.setMax(params.max);
        }
        if (params.step != null) {
            eInput.setStep(params.step);
        }
    };
    DateCellEditorInput.prototype.getValue = function () {
        var value = this.eInput.getDate();
        if (!exists(value) && !exists(this.params.value)) {
            return this.params.value;
        }
        return value !== null && value !== void 0 ? value : null;
    };
    DateCellEditorInput.prototype.getStartValue = function () {
        var value = this.params.value;
        if (!(value instanceof Date)) {
            return undefined;
        }
        return serialiseDate(value, false);
    };
    return DateCellEditorInput;
}());
var DateCellEditor = /** @class */ (function (_super) {
    __extends(DateCellEditor, _super);
    function DateCellEditor() {
        return _super.call(this, new DateCellEditorInput()) || this;
    }
    return DateCellEditor;
}(SimpleCellEditor));
export { DateCellEditor };
