"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaddingPanel = void 0;
const core_1 = require("@ag-grid-community/core");
const formatPanel_1 = require("../formatPanel");
class PaddingPanel extends core_1.Component {
    constructor(chartOptionsService, chartController) {
        super();
        this.chartOptionsService = chartOptionsService;
        this.chartController = chartController;
    }
    init() {
        const groupParams = {
            cssIdentifier: 'charts-format-sub-level',
            direction: 'vertical',
            suppressOpenCloseIcons: true
        };
        this.setTemplate(PaddingPanel.TEMPLATE, { chartPaddingGroup: groupParams });
        this.addManagedListener(this.eventService, core_1.Events.EVENT_CHART_OPTIONS_CHANGED, (e) => {
            this.updateTopPadding(e.chartOptions);
        });
        this.initGroup();
        this.initChartPaddingItems();
    }
    initGroup() {
        this.chartPaddingGroup
            .setTitle(this.chartTranslationService.translate("padding"))
            .hideOpenCloseIcons(true)
            .hideEnabledCheckbox(true);
    }
    initChartPaddingItems() {
        const initInput = (property, input) => {
            const currentValue = this.chartOptionsService.getChartOption('padding.' + property);
            input.setLabel(this.chartTranslationService.translate(property))
                .setMaxValue((0, formatPanel_1.getMaxValue)(currentValue, 200))
                .setValue(`${currentValue}`)
                .setTextFieldWidth(45)
                .onValueChange(newValue => this.chartOptionsService.setChartOption('padding.' + property, newValue));
        };
        initInput('top', this.paddingTopSlider);
        initInput('right', this.paddingRightSlider);
        initInput('bottom', this.paddingBottomSlider);
        initInput('left', this.paddingLeftSlider);
    }
    updateTopPadding(chartOptions) {
        var _a, _b;
        // keep 'top' padding in sync with chart as toggling chart title on / off change the 'top' padding
        const seriesType = this.chartController.getChartSeriesTypes()[0];
        const topPadding = (_b = (_a = chartOptions[seriesType]) === null || _a === void 0 ? void 0 : _a.padding) === null || _b === void 0 ? void 0 : _b.top;
        if (topPadding != null) {
            this.paddingTopSlider.setValue(topPadding);
        }
    }
}
PaddingPanel.TEMPLATE = `<div>
            <ag-group-component ref="chartPaddingGroup">
                <ag-slider ref="paddingTopSlider"></ag-slider>
                <ag-slider ref="paddingRightSlider"></ag-slider>
                <ag-slider ref="paddingBottomSlider"></ag-slider>
                <ag-slider ref="paddingLeftSlider"></ag-slider>
            </ag-group-component>
        <div>`;
__decorate([
    (0, core_1.RefSelector)('chartPaddingGroup')
], PaddingPanel.prototype, "chartPaddingGroup", void 0);
__decorate([
    (0, core_1.RefSelector)('paddingTopSlider')
], PaddingPanel.prototype, "paddingTopSlider", void 0);
__decorate([
    (0, core_1.RefSelector)('paddingRightSlider')
], PaddingPanel.prototype, "paddingRightSlider", void 0);
__decorate([
    (0, core_1.RefSelector)('paddingBottomSlider')
], PaddingPanel.prototype, "paddingBottomSlider", void 0);
__decorate([
    (0, core_1.RefSelector)('paddingLeftSlider')
], PaddingPanel.prototype, "paddingLeftSlider", void 0);
__decorate([
    (0, core_1.Autowired)('chartTranslationService')
], PaddingPanel.prototype, "chartTranslationService", void 0);
__decorate([
    core_1.PostConstruct
], PaddingPanel.prototype, "init", null);
exports.PaddingPanel = PaddingPanel;
