"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SideBarButtonComp = void 0;
var core_1 = require("@ag-grid-community/core");
var SideBarButtonComp = /** @class */ (function (_super) {
    __extends(SideBarButtonComp, _super);
    function SideBarButtonComp(toolPanelDef) {
        var _this = _super.call(this) || this;
        _this.toolPanelDef = toolPanelDef;
        return _this;
    }
    SideBarButtonComp.prototype.getToolPanelId = function () {
        return this.toolPanelDef.id;
    };
    SideBarButtonComp.prototype.postConstruct = function () {
        var template = this.createTemplate();
        this.setTemplate(template);
        this.setLabel();
        this.setIcon();
        this.addManagedListener(this.eToggleButton, 'click', this.onButtonPressed.bind(this));
        this.eToggleButton.setAttribute('id', "ag-".concat(this.getCompId(), "-button"));
    };
    SideBarButtonComp.prototype.createTemplate = function () {
        var res = /* html */ "<div class=\"ag-side-button\" role=\"presentation\">\n                <button type=\"button\" ref=\"eToggleButton\" tabindex=\"-1\" role=\"tab\" aria-expanded=\"false\" class=\"ag-button ag-side-button-button\">\n                    <div ref=\"eIconWrapper\" class=\"ag-side-button-icon-wrapper\" aria-hidden=\"true\"></div>\n                    <span ref =\"eLabel\" class=\"ag-side-button-label\"></span>\n                </button>\n            </div>";
        return res;
    };
    SideBarButtonComp.prototype.setLabel = function () {
        var translate = this.localeService.getLocaleTextFunc();
        var def = this.toolPanelDef;
        var label = translate(def.labelKey, def.labelDefault);
        this.eLabel.innerText = label;
    };
    SideBarButtonComp.prototype.setIcon = function () {
        this.eIconWrapper.insertAdjacentElement('afterbegin', core_1._.createIconNoSpan(this.toolPanelDef.iconKey, this.gridOptionsService));
    };
    SideBarButtonComp.prototype.onButtonPressed = function () {
        this.dispatchEvent({ type: SideBarButtonComp.EVENT_TOGGLE_BUTTON_CLICKED });
    };
    SideBarButtonComp.prototype.setSelected = function (selected) {
        this.addOrRemoveCssClass('ag-selected', selected);
        core_1._.setAriaExpanded(this.eToggleButton, selected);
    };
    SideBarButtonComp.prototype.getButtonElement = function () {
        return this.eToggleButton;
    };
    SideBarButtonComp.EVENT_TOGGLE_BUTTON_CLICKED = 'toggleButtonClicked';
    __decorate([
        (0, core_1.RefSelector)('eToggleButton')
    ], SideBarButtonComp.prototype, "eToggleButton", void 0);
    __decorate([
        (0, core_1.RefSelector)('eIconWrapper')
    ], SideBarButtonComp.prototype, "eIconWrapper", void 0);
    __decorate([
        (0, core_1.RefSelector)('eLabel')
    ], SideBarButtonComp.prototype, "eLabel", void 0);
    __decorate([
        core_1.PostConstruct
    ], SideBarButtonComp.prototype, "postConstruct", null);
    return SideBarButtonComp;
}(core_1.Component));
exports.SideBarButtonComp = SideBarButtonComp;
