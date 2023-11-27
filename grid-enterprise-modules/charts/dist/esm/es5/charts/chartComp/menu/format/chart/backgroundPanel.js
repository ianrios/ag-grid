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
import { Autowired, Component, PostConstruct, RefSelector } from "@ag-grid-community/core";
var BackgroundPanel = /** @class */ (function (_super) {
    __extends(BackgroundPanel, _super);
    function BackgroundPanel(chartOptionsService) {
        var _this = _super.call(this) || this;
        _this.chartOptionsService = chartOptionsService;
        return _this;
    }
    BackgroundPanel.prototype.init = function () {
        var groupParams = {
            cssIdentifier: 'charts-format-sub-level',
            direction: 'vertical',
            suppressOpenCloseIcons: true
        };
        this.setTemplate(BackgroundPanel.TEMPLATE, { chartBackgroundGroup: groupParams });
        this.initGroup();
        this.initColorPicker();
    };
    BackgroundPanel.prototype.initGroup = function () {
        var _this = this;
        this.group
            .setTitle(this.chartTranslationService.translate('background'))
            .setEnabled(this.chartOptionsService.getChartOption('background.visible'))
            .hideOpenCloseIcons(true)
            .hideEnabledCheckbox(false)
            .onEnableChange(function (enabled) { return _this.chartOptionsService.setChartOption('background.visible', enabled); });
    };
    BackgroundPanel.prototype.initColorPicker = function () {
        var _this = this;
        this.colorPicker
            .setLabel(this.chartTranslationService.translate('color'))
            .setLabelWidth('flex')
            .setInputWidth('flex')
            .setValue(this.chartOptionsService.getChartOption('background.fill'))
            .onValueChange(function (newColor) { return _this.chartOptionsService.setChartOption('background.fill', newColor); });
    };
    BackgroundPanel.TEMPLATE = "<div>\n            <ag-group-component ref=\"chartBackgroundGroup\">\n                <ag-color-picker ref=\"colorPicker\"></ag-color-picker>\n            </ag-group-component>\n        <div>";
    __decorate([
        RefSelector('chartBackgroundGroup')
    ], BackgroundPanel.prototype, "group", void 0);
    __decorate([
        RefSelector('colorPicker')
    ], BackgroundPanel.prototype, "colorPicker", void 0);
    __decorate([
        Autowired('chartTranslationService')
    ], BackgroundPanel.prototype, "chartTranslationService", void 0);
    __decorate([
        PostConstruct
    ], BackgroundPanel.prototype, "init", null);
    return BackgroundPanel;
}(Component));
export { BackgroundPanel };
