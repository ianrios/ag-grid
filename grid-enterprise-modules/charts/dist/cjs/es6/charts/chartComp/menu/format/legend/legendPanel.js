"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LegendPanel = void 0;
const core_1 = require("@ag-grid-community/core");
// import { AgChartLegendPosition } from "ag-charts-enterprise";
const fontPanel_1 = require("../fontPanel");
const formatPanel_1 = require("../formatPanel");
class LegendPanel extends core_1.Component {
    constructor({ chartOptionsService, isExpandedOnInit = false }) {
        super();
        this.activePanels = [];
        this.chartOptionsService = chartOptionsService;
        this.isExpandedOnInit = isExpandedOnInit;
    }
    init() {
        const groupParams = {
            cssIdentifier: 'charts-format-top-level',
            direction: 'vertical'
        };
        this.setTemplate(LegendPanel.TEMPLATE, { legendGroup: groupParams });
        this.initLegendGroup();
        this.initLegendPosition();
        this.initLegendPadding();
        this.initLegendItems();
        this.initLabelPanel();
    }
    initLegendGroup() {
        this.legendGroup
            .setTitle(this.chartTranslationService.translate("legend"))
            .hideEnabledCheckbox(false)
            .setEnabled(this.chartOptionsService.getChartOption("legend.enabled") || false)
            .toggleGroupExpand(this.isExpandedOnInit)
            .onEnableChange(enabled => {
            this.chartOptionsService.setChartOption("legend.enabled", enabled);
            this.legendGroup.toggleGroupExpand(true);
        });
    }
    initLegendPosition() {
        const positions = ['top', 'right', 'bottom', 'left'];
        this.legendPositionSelect
            .setLabel(this.chartTranslationService.translate("position"))
            .setLabelWidth("flex")
            .setInputWidth('flex')
            .addOptions(positions.map(position => ({
            value: position,
            text: this.chartTranslationService.translate(position)
        })))
            .setValue(this.chartOptionsService.getChartOption("legend.position"))
            .onValueChange(newValue => this.chartOptionsService.setChartOption("legend.position", newValue));
    }
    initLegendPadding() {
        const currentValue = this.chartOptionsService.getChartOption("legend.spacing");
        this.legendPaddingSlider
            .setLabel(this.chartTranslationService.translate("spacing"))
            .setMaxValue((0, formatPanel_1.getMaxValue)(currentValue, 200))
            .setValue(`${currentValue}`)
            .setTextFieldWidth(45)
            .onValueChange(newValue => this.chartOptionsService.setChartOption("legend.spacing", newValue));
    }
    initLegendItems() {
        const initSlider = (expression, labelKey, input, defaultMaxValue) => {
            const currentValue = this.chartOptionsService.getChartOption(`legend.${expression}`);
            input.setLabel(this.chartTranslationService.translate(labelKey))
                .setMaxValue((0, formatPanel_1.getMaxValue)(currentValue, defaultMaxValue))
                .setValue(`${currentValue}`)
                .setTextFieldWidth(45)
                .onValueChange(newValue => {
                this.chartOptionsService.setChartOption(`legend.${expression}`, newValue);
            });
        };
        initSlider("item.marker.size", "markerSize", this.markerSizeSlider, 40);
        initSlider("item.marker.strokeWidth", "markerStroke", this.markerStrokeSlider, 10);
        initSlider("item.marker.padding", "itemSpacing", this.markerPaddingSlider, 20);
        initSlider("item.paddingX", "layoutHorizontalSpacing", this.itemPaddingXSlider, 50);
        initSlider("item.paddingY", "layoutVerticalSpacing", this.itemPaddingYSlider, 50);
    }
    initLabelPanel() {
        const chartProxy = this.chartOptionsService;
        const initialFont = {
            family: chartProxy.getChartOption("legend.item.label.fontFamily"),
            style: chartProxy.getChartOption("legend.item.label.fontStyle"),
            weight: chartProxy.getChartOption("legend.item.label.fontWeight"),
            size: chartProxy.getChartOption("legend.item.label.fontSize"),
            color: chartProxy.getChartOption("legend.item.label.color")
        };
        const setFont = (font) => {
            const proxy = this.chartOptionsService;
            if (font.family) {
                proxy.setChartOption("legend.item.label.fontFamily", font.family);
            }
            if (font.weight) {
                proxy.setChartOption("legend.item.label.fontWeight", font.weight);
            }
            if (font.style) {
                proxy.setChartOption("legend.item.label.fontStyle", font.style);
            }
            if (font.size) {
                proxy.setChartOption("legend.item.label.fontSize", font.size);
            }
            if (font.color) {
                proxy.setChartOption("legend.item.label.color", font.color);
            }
        };
        const params = {
            enabled: true,
            suppressEnabledCheckbox: true,
            initialFont: initialFont,
            setFont: setFont
        };
        const fontPanelComp = this.createBean(new fontPanel_1.FontPanel(params));
        this.legendGroup.addItem(fontPanelComp);
        this.activePanels.push(fontPanelComp);
    }
    destroyActivePanels() {
        this.activePanels.forEach(panel => {
            core_1._.removeFromParent(panel.getGui());
            this.destroyBean(panel);
        });
    }
    destroy() {
        this.destroyActivePanels();
        super.destroy();
    }
}
LegendPanel.TEMPLATE = `<div>
            <ag-group-component ref="legendGroup">
                <ag-select ref="legendPositionSelect"></ag-select>
                <ag-slider ref="legendPaddingSlider"></ag-slider>
                <ag-slider ref="markerSizeSlider"></ag-slider>
                <ag-slider ref="markerStrokeSlider"></ag-slider>
                <ag-slider ref="markerPaddingSlider"></ag-slider>
                <ag-slider ref="itemPaddingXSlider"></ag-slider>
                <ag-slider ref="itemPaddingYSlider"></ag-slider>
            </ag-group-component>
        </div>`;
__decorate([
    (0, core_1.RefSelector)('legendGroup')
], LegendPanel.prototype, "legendGroup", void 0);
__decorate([
    (0, core_1.RefSelector)('legendPositionSelect')
], LegendPanel.prototype, "legendPositionSelect", void 0);
__decorate([
    (0, core_1.RefSelector)('legendPaddingSlider')
], LegendPanel.prototype, "legendPaddingSlider", void 0);
__decorate([
    (0, core_1.RefSelector)('markerSizeSlider')
], LegendPanel.prototype, "markerSizeSlider", void 0);
__decorate([
    (0, core_1.RefSelector)('markerStrokeSlider')
], LegendPanel.prototype, "markerStrokeSlider", void 0);
__decorate([
    (0, core_1.RefSelector)('markerPaddingSlider')
], LegendPanel.prototype, "markerPaddingSlider", void 0);
__decorate([
    (0, core_1.RefSelector)('itemPaddingXSlider')
], LegendPanel.prototype, "itemPaddingXSlider", void 0);
__decorate([
    (0, core_1.RefSelector)('itemPaddingYSlider')
], LegendPanel.prototype, "itemPaddingYSlider", void 0);
__decorate([
    (0, core_1.Autowired)('chartTranslationService')
], LegendPanel.prototype, "chartTranslationService", void 0);
__decorate([
    core_1.PostConstruct
], LegendPanel.prototype, "init", null);
exports.LegendPanel = LegendPanel;
