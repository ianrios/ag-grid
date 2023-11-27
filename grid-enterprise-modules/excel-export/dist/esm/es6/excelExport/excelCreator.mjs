var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { _, Autowired, Bean, PostConstruct, CssClassApplier } from '@ag-grid-community/core';
import { ExcelXlsxFactory } from './excelXlsxFactory.mjs';
import { BaseCreator, Downloader, RowType, ZipContainer } from "@ag-grid-community/csv-export";
import { ExcelSerializingSession } from './excelSerializingSession.mjs';
export const getMultipleSheetsAsExcel = (params) => {
    const { data, fontSize = 11, author = 'AG Grid' } = params;
    const hasImages = ExcelXlsxFactory.images.size > 0;
    ZipContainer.addFolders([
        '_rels/',
        'docProps/',
        'xl/',
        'xl/theme/',
        'xl/_rels/',
        'xl/worksheets/'
    ]);
    if (hasImages) {
        ZipContainer.addFolders([
            'xl/worksheets/_rels',
            'xl/drawings/',
            'xl/drawings/_rels',
            'xl/media/',
        ]);
        let imgCounter = 0;
        ExcelXlsxFactory.images.forEach(value => {
            const firstImage = value[0].image[0];
            const ext = firstImage.imageType;
            ZipContainer.addFile(`xl/media/image${++imgCounter}.${ext}`, firstImage.base64, true);
        });
    }
    if (!data || data.length === 0) {
        console.warn("AG Grid: Invalid params supplied to getMultipleSheetsAsExcel() - `ExcelExportParams.data` is empty.");
        ExcelXlsxFactory.resetFactory();
        return;
    }
    const sheetLen = data.length;
    let imageRelationCounter = 0;
    data.forEach((value, idx) => {
        ZipContainer.addFile(`xl/worksheets/sheet${idx + 1}.xml`, value);
        if (hasImages && ExcelXlsxFactory.worksheetImages.get(idx)) {
            createImageRelationsForSheet(idx, imageRelationCounter++);
        }
    });
    ZipContainer.addFile('xl/workbook.xml', ExcelXlsxFactory.createWorkbook());
    ZipContainer.addFile('xl/styles.xml', ExcelXlsxFactory.createStylesheet(fontSize));
    ZipContainer.addFile('xl/sharedStrings.xml', ExcelXlsxFactory.createSharedStrings());
    ZipContainer.addFile('xl/theme/theme1.xml', ExcelXlsxFactory.createTheme());
    ZipContainer.addFile('xl/_rels/workbook.xml.rels', ExcelXlsxFactory.createWorkbookRels(sheetLen));
    ZipContainer.addFile('docProps/core.xml', ExcelXlsxFactory.createCore(author));
    ZipContainer.addFile('[Content_Types].xml', ExcelXlsxFactory.createContentTypes(sheetLen));
    ZipContainer.addFile('_rels/.rels', ExcelXlsxFactory.createRels());
    ExcelXlsxFactory.resetFactory();
    const mimeType = params.mimeType || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    return ZipContainer.getContent(mimeType);
};
export const exportMultipleSheetsAsExcel = (params) => {
    const { fileName = 'export.xlsx' } = params;
    const contents = getMultipleSheetsAsExcel(params);
    if (contents) {
        Downloader.download(fileName, contents);
    }
};
const createImageRelationsForSheet = (sheetIndex, currentRelationIndex) => {
    const drawingFolder = 'xl/drawings';
    const drawingFileName = `${drawingFolder}/drawing${currentRelationIndex + 1}.xml`;
    const relFileName = `${drawingFolder}/_rels/drawing${currentRelationIndex + 1}.xml.rels`;
    const worksheetRelFile = `xl/worksheets/_rels/sheet${sheetIndex + 1}.xml.rels`;
    ZipContainer.addFile(relFileName, ExcelXlsxFactory.createDrawingRel(sheetIndex));
    ZipContainer.addFile(drawingFileName, ExcelXlsxFactory.createDrawing(sheetIndex));
    ZipContainer.addFile(worksheetRelFile, ExcelXlsxFactory.createWorksheetDrawingRel(currentRelationIndex));
};
let ExcelCreator = class ExcelCreator extends BaseCreator {
    postConstruct() {
        this.setBeans({
            gridSerializer: this.gridSerializer,
            gridOptionsService: this.gridOptionsService
        });
    }
    getMergedParams(params) {
        const baseParams = this.gridOptionsService.get('defaultExcelExportParams');
        return Object.assign({}, baseParams, params);
    }
    export(userParams) {
        if (this.isExportSuppressed()) {
            console.warn(`AG Grid: Export cancelled. Export is not allowed as per your configuration.`);
            return '';
        }
        const mergedParams = this.getMergedParams(userParams);
        const data = this.getData(mergedParams);
        const exportParams = {
            data: [data],
            fontSize: mergedParams.fontSize,
            author: mergedParams.author,
            mimeType: mergedParams.mimeType
        };
        const packageFile = this.packageFile(exportParams);
        if (packageFile) {
            Downloader.download(this.getFileName(mergedParams.fileName), packageFile);
        }
        return data;
    }
    exportDataAsExcel(params) {
        return this.export(params);
    }
    getDataAsExcel(params) {
        const mergedParams = this.getMergedParams(params);
        const data = this.getData(mergedParams);
        const exportParams = {
            data: [data],
            fontSize: mergedParams.fontSize,
            author: mergedParams.author,
            mimeType: mergedParams.mimeType
        };
        return this.packageFile(exportParams);
    }
    setFactoryMode(factoryMode) {
        ExcelXlsxFactory.factoryMode = factoryMode;
    }
    getFactoryMode() {
        return ExcelXlsxFactory.factoryMode;
    }
    getSheetDataForExcel(params) {
        const mergedParams = this.getMergedParams(params);
        const data = this.getData(mergedParams);
        return data;
    }
    getMultipleSheetsAsExcel(params) {
        return getMultipleSheetsAsExcel(params);
    }
    exportMultipleSheetsAsExcel(params) {
        return exportMultipleSheetsAsExcel(params);
    }
    getDefaultFileExtension() {
        return 'xlsx';
    }
    createSerializingSession(params) {
        const { columnModel, valueService, gridOptionsService, valueFormatterService, valueParserService } = this;
        let sheetName = 'ag-grid';
        if (params.sheetName != null) {
            sheetName = _.utf8_encode(String(params.sheetName).substring(0, 31));
        }
        const config = Object.assign(Object.assign({}, params), { sheetName,
            columnModel,
            valueService,
            gridOptionsService,
            valueFormatterService,
            valueParserService, suppressRowOutline: params.suppressRowOutline || params.skipRowGroups, headerRowHeight: params.headerRowHeight || params.rowHeight, baseExcelStyles: this.gridOptionsService.get('excelStyles') || [], styleLinker: this.styleLinker.bind(this) });
        return new ExcelSerializingSession(config);
    }
    styleLinker(params) {
        const { rowType, rowIndex, value, column, columnGroup, node } = params;
        const isHeader = rowType === RowType.HEADER;
        const isGroupHeader = rowType === RowType.HEADER_GROUPING;
        const col = (isHeader ? column : columnGroup);
        let headerClasses = [];
        if (isHeader || isGroupHeader) {
            headerClasses.push('header');
            if (isGroupHeader) {
                headerClasses.push('headerGroup');
            }
            if (col) {
                headerClasses = headerClasses.concat(CssClassApplier.getHeaderClassesFromColDef(col.getDefinition(), this.gridOptionsService, column || null, columnGroup || null));
            }
            return headerClasses;
        }
        const styles = this.gridOptionsService.get('excelStyles');
        const applicableStyles = ["cell"];
        if (!styles || !styles.length) {
            return applicableStyles;
        }
        const styleIds = styles.map((it) => {
            return it.id;
        });
        this.stylingService.processAllCellClasses(column.getDefinition(), {
            value,
            data: node.data,
            node: node,
            colDef: column.getDefinition(),
            column: column,
            rowIndex: rowIndex,
            api: this.gridOptionsService.api,
            columnApi: this.gridOptionsService.columnApi,
            context: this.gridOptionsService.context
        }, (className) => {
            if (styleIds.indexOf(className) > -1) {
                applicableStyles.push(className);
            }
        });
        return applicableStyles.sort((left, right) => {
            return (styleIds.indexOf(left) < styleIds.indexOf(right)) ? -1 : 1;
        });
    }
    isExportSuppressed() {
        return this.gridOptionsService.get('suppressExcelExport');
    }
    packageFile(params) {
        return getMultipleSheetsAsExcel(params);
    }
};
__decorate([
    Autowired('columnModel')
], ExcelCreator.prototype, "columnModel", void 0);
__decorate([
    Autowired('valueService')
], ExcelCreator.prototype, "valueService", void 0);
__decorate([
    Autowired('stylingService')
], ExcelCreator.prototype, "stylingService", void 0);
__decorate([
    Autowired('gridSerializer')
], ExcelCreator.prototype, "gridSerializer", void 0);
__decorate([
    Autowired('gridOptionsService')
], ExcelCreator.prototype, "gridOptionsService", void 0);
__decorate([
    Autowired('valueFormatterService')
], ExcelCreator.prototype, "valueFormatterService", void 0);
__decorate([
    Autowired('valueParserService')
], ExcelCreator.prototype, "valueParserService", void 0);
__decorate([
    PostConstruct
], ExcelCreator.prototype, "postConstruct", null);
ExcelCreator = __decorate([
    Bean('excelCreator')
], ExcelCreator);
export { ExcelCreator };
