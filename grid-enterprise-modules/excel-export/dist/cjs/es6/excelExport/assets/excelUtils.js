"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExcelColumnName = exports.createXmlPart = exports.setExcelImageTotalHeight = exports.setExcelImageTotalWidth = exports.getHeightFromProperty = exports.getFontFamilyId = exports.pixelsToEMU = exports.pointsToPixel = exports.pixelsToPoint = void 0;
const csv_export_1 = require("@ag-grid-community/csv-export");
const excelConstants_1 = require("./excelConstants");
const pixelsToPoint = (pixels) => {
    return Math.round(pixels * 72 / 96);
};
exports.pixelsToPoint = pixelsToPoint;
const pointsToPixel = (points) => {
    return Math.round(points * 96 / 72);
};
exports.pointsToPixel = pointsToPixel;
const pixelsToEMU = (value) => {
    return Math.ceil(value * excelConstants_1.INCH_TO_EMU);
};
exports.pixelsToEMU = pixelsToEMU;
const getFontFamilyId = (name) => {
    if (name === undefined) {
        return;
    }
    const families = ['Automatic', 'Roman', 'Swiss', 'Modern', 'Script', 'Decorative'];
    const pos = families.indexOf(name || 'Automatic');
    return Math.max(pos, 0);
};
exports.getFontFamilyId = getFontFamilyId;
const getHeightFromProperty = (rowIndex, height) => {
    if (!height) {
        return;
    }
    let finalHeight;
    if (typeof height === 'number') {
        finalHeight = height;
    }
    else {
        const heightFunc = height;
        finalHeight = heightFunc({ rowIndex });
    }
    return (0, exports.pixelsToPoint)(finalHeight);
};
exports.getHeightFromProperty = getHeightFromProperty;
const setExcelImageTotalWidth = (image, columnsToExport) => {
    const { colSpan, column } = image.position;
    if (image.width) {
        if (colSpan) {
            const columnsInSpan = columnsToExport.slice(column - 1, column + colSpan - 1);
            let totalWidth = 0;
            for (let i = 0; i < columnsInSpan.length; i++) {
                const colWidth = columnsInSpan[i].getActualWidth();
                if (image.width < totalWidth + colWidth) {
                    image.position.colSpan = i + 1;
                    image.totalWidth = image.width;
                    image.width = image.totalWidth - totalWidth;
                    break;
                }
                totalWidth += colWidth;
            }
        }
        else {
            image.totalWidth = image.width;
        }
    }
};
exports.setExcelImageTotalWidth = setExcelImageTotalWidth;
const setExcelImageTotalHeight = (image, rowHeight) => {
    const { rowSpan, row } = image.position;
    if (image.height) {
        if (rowSpan) {
            let totalHeight = 0;
            let counter = 0;
            for (let i = row; i < row + rowSpan; i++) {
                const nextRowHeight = (0, exports.pointsToPixel)((0, exports.getHeightFromProperty)(i, rowHeight) || 20);
                if (image.height < totalHeight + nextRowHeight) {
                    image.position.rowSpan = counter + 1;
                    image.totalHeight = image.height;
                    image.height = image.totalHeight - totalHeight;
                    break;
                }
                totalHeight += nextRowHeight;
                counter++;
            }
        }
        else {
            image.totalHeight = image.height;
        }
    }
};
exports.setExcelImageTotalHeight = setExcelImageTotalHeight;
const createXmlPart = (body) => {
    const header = csv_export_1.XmlFactory.createHeader({
        encoding: 'UTF-8',
        standalone: 'yes'
    });
    const xmlBody = csv_export_1.XmlFactory.createXml(body);
    return `${header}${xmlBody}`;
};
exports.createXmlPart = createXmlPart;
const getExcelColumnName = (colIdx) => {
    const startCode = 65;
    const tableWidth = 26;
    const fromCharCode = String.fromCharCode;
    const pos = Math.floor(colIdx / tableWidth);
    const tableIdx = colIdx % tableWidth;
    if (!pos || colIdx === tableWidth) {
        return fromCharCode(startCode + colIdx - 1);
    }
    if (!tableIdx) {
        return (0, exports.getExcelColumnName)(pos - 1) + 'Z';
    }
    if (pos < tableWidth) {
        return fromCharCode(startCode + pos - 1) + fromCharCode(startCode + tableIdx - 1);
    }
    return (0, exports.getExcelColumnName)(pos) + fromCharCode(startCode + tableIdx - 1);
};
exports.getExcelColumnName = getExcelColumnName;
