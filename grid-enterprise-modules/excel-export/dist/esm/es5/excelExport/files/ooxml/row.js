var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { getExcelColumnName } from '../../assets/excelUtils';
import cellFactory from './cell';
var addEmptyCells = function (cells, rowIdx) {
    var mergeMap = [];
    var posCounter = 0;
    for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];
        if (cell.mergeAcross) {
            mergeMap.push({
                pos: i,
                excelPos: posCounter
            });
            posCounter += cell.mergeAcross;
        }
        posCounter++;
    }
    if (mergeMap.length) {
        for (var i = mergeMap.length - 1; i >= 0; i--) {
            var mergedCells = [];
            var cell = cells[mergeMap[i].pos];
            for (var j = 1; j <= cell.mergeAcross; j++) {
                mergedCells.push({
                    ref: "".concat(getExcelColumnName(mergeMap[i].excelPos + 1 + j)).concat(rowIdx + 1),
                    styleId: cell.styleId,
                    data: { type: 'empty', value: null }
                });
            }
            if (mergedCells.length) {
                cells.splice.apply(cells, __spreadArray([mergeMap[i].pos + 1, 0], __read(mergedCells), false));
            }
        }
    }
};
var shouldDisplayCell = function (cell) { var _a; return ((_a = cell.data) === null || _a === void 0 ? void 0 : _a.value) !== '' || cell.styleId !== undefined; };
var rowFactory = {
    getTemplate: function (config, idx, currentSheet) {
        var collapsed = config.collapsed, hidden = config.hidden, height = config.height, outlineLevel = config.outlineLevel, _a = config.cells, cells = _a === void 0 ? [] : _a;
        addEmptyCells(cells, idx);
        var children = cells.filter(shouldDisplayCell).map(function (cell, idx) { return cellFactory.getTemplate(cell, idx, currentSheet); });
        return {
            name: "row",
            properties: {
                rawMap: {
                    r: idx + 1,
                    collapsed: collapsed ? '1' : '0',
                    hidden: hidden ? '1' : '0',
                    ht: height,
                    customHeight: height != null ? '1' : '0',
                    spans: '1:1',
                    outlineLevel: outlineLevel || undefined
                }
            },
            children: children
        };
    }
};
export default rowFactory;
