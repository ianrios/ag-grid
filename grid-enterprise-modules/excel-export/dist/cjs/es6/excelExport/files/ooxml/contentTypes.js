"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const excelXlsxFactory_1 = require("../../excelXlsxFactory");
const contentType_1 = require("./contentType");
const contentTypesFactory = {
    getTemplate(sheetLen) {
        const worksheets = new Array(sheetLen).fill(undefined).map((v, i) => ({
            name: 'Override',
            ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml',
            PartName: `/xl/worksheets/sheet${i + 1}.xml`
        }));
        const sheetsWithImages = excelXlsxFactory_1.ExcelXlsxFactory.worksheetImages.size;
        const imageTypesObject = {};
        excelXlsxFactory_1.ExcelXlsxFactory.workbookImageIds.forEach((v) => {
            imageTypesObject[v.type] = true;
        });
        const imageDocs = new Array(sheetsWithImages).fill(undefined).map((v, i) => ({
            name: 'Override',
            ContentType: 'application/vnd.openxmlformats-officedocument.drawing+xml',
            PartName: `/xl/drawings/drawing${i + 1}.xml`
        }));
        const imageTypes = Object.keys(imageTypesObject).map(ext => ({
            name: 'Default',
            ContentType: `image/${ext}`,
            Extension: ext
        }));
        const children = [
            ...imageTypes,
            {
                name: 'Default',
                Extension: 'rels',
                ContentType: 'application/vnd.openxmlformats-package.relationships+xml'
            }, {
                name: 'Default',
                ContentType: 'application/xml',
                Extension: 'xml'
            }, {
                name: 'Override',
                ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml',
                PartName: "/xl/workbook.xml"
            },
            ...worksheets,
            {
                name: 'Override',
                ContentType: 'application/vnd.openxmlformats-officedocument.theme+xml',
                PartName: '/xl/theme/theme1.xml'
            }, {
                name: 'Override',
                ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml',
                PartName: '/xl/styles.xml'
            }, {
                name: 'Override',
                ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml',
                PartName: '/xl/sharedStrings.xml'
            },
            ...imageDocs,
            {
                name: 'Override',
                ContentType: 'application/vnd.openxmlformats-package.core-properties+xml',
                PartName: '/docProps/core.xml'
            }
        ].map(contentType => contentType_1.default.getTemplate(contentType));
        return {
            name: "Types",
            properties: {
                rawMap: {
                    xmlns: "http://schemas.openxmlformats.org/package/2006/content-types"
                }
            },
            children
        };
    }
};
exports.default = contentTypesFactory;
