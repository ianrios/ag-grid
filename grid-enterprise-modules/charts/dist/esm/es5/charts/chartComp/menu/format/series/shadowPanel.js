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
import { Autowired, Component, PostConstruct, RefSelector, } from "@ag-grid-community/core";
import { getMaxValue } from "../formatPanel";
var ShadowPanel = /** @class */ (function (_super) {
    __extends(ShadowPanel, _super);
    function ShadowPanel(chartOptionsService, getSelectedSeries) {
        var _this = _super.call(this) || this;
        _this.chartOptionsService = chartOptionsService;
        _this.getSelectedSeries = getSelectedSeries;
        return _this;
    }
    ShadowPanel.prototype.init = function () {
        var groupParams = {
            cssIdentifier: 'charts-format-sub-level',
            direction: 'vertical',
            suppressOpenCloseIcons: true
        };
        this.setTemplate(ShadowPanel.TEMPLATE, { shadowGroup: groupParams });
        this.shadowBlurSlider.setTextFieldWidth(45);
        this.shadowXOffsetSlider.setTextFieldWidth(45);
        this.shadowYOffsetSlider.setTextFieldWidth(45);
        this.initSeriesShadow();
    };
    ShadowPanel.prototype.initSeriesShadow = function () {
        var _this = this;
        this.shadowGroup
            .setTitle(this.chartTranslationService.translate("shadow"))
            .setEnabled(this.chartOptionsService.getSeriesOption("shadow.enabled", this.getSelectedSeries()))
            .hideOpenCloseIcons(true)
            .hideEnabledCheckbox(false)
            .onEnableChange(function (newValue) { return _this.chartOptionsService.setSeriesOption("shadow.enabled", newValue, _this.getSelectedSeries()); });
        this.shadowColorPicker
            .setLabel(this.chartTranslationService.translate("color"))
            .setLabelWidth("flex")
            .setInputWidth('flex')
            .setValue(this.chartOptionsService.getSeriesOption("shadow.color", this.getSelectedSeries()))
            .onValueChange(function (newValue) { return _this.chartOptionsService.setSeriesOption("shadow.color", newValue, _this.getSelectedSeries()); });
        var initInput = function (input, property, minValue, defaultMaxValue) {
            var currentValue = _this.chartOptionsService.getSeriesOption("shadow.".concat(property), _this.getSelectedSeries());
            input.setLabel(_this.chartTranslationService.translate(property))
                .setMinValue(minValue)
                .setMaxValue(getMaxValue(currentValue, defaultMaxValue))
                .setValue("".concat(currentValue))
                .onValueChange(function (newValue) { return _this.chartOptionsService.setSeriesOption("shadow.".concat(property), newValue, _this.getSelectedSeries()); });
        };
        initInput(this.shadowBlurSlider, "blur", 0, 20);
        initInput(this.shadowXOffsetSlider, "xOffset", -10, 10);
        initInput(this.shadowYOffsetSlider, "yOffset", -10, 10);
    };
    ShadowPanel.TEMPLATE = "<div>\n            <ag-group-component ref=\"shadowGroup\">\n                <ag-color-picker ref=\"shadowColorPicker\"></ag-color-picker>\n                <ag-slider ref=\"shadowBlurSlider\"></ag-slider>\n                <ag-slider ref=\"shadowXOffsetSlider\"></ag-slider>\n                <ag-slider ref=\"shadowYOffsetSlider\"></ag-slider>\n            </ag-group-component>\n        </div>";
    __decorate([
        RefSelector('shadowGroup')
    ], ShadowPanel.prototype, "shadowGroup", void 0);
    __decorate([
        RefSelector('shadowColorPicker')
    ], ShadowPanel.prototype, "shadowColorPicker", void 0);
    __decorate([
        RefSelector('shadowBlurSlider')
    ], ShadowPanel.prototype, "shadowBlurSlider", void 0);
    __decorate([
        RefSelector('shadowXOffsetSlider')
    ], ShadowPanel.prototype, "shadowXOffsetSlider", void 0);
    __decorate([
        RefSelector('shadowYOffsetSlider')
    ], ShadowPanel.prototype, "shadowYOffsetSlider", void 0);
    __decorate([
        Autowired('chartTranslationService')
    ], ShadowPanel.prototype, "chartTranslationService", void 0);
    __decorate([
        PostConstruct
    ], ShadowPanel.prototype, "init", null);
    return ShadowPanel;
}(Component));
export { ShadowPanel };
