"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HorizontalResizeComp = void 0;
const core_1 = require("@ag-grid-community/core");
class HorizontalResizeComp extends core_1.Component {
    constructor() {
        super(/* html */ `<div class="ag-tool-panel-horizontal-resize"></div>`);
        this.minWidth = 100;
        this.maxWidth = null;
    }
    setElementToResize(elementToResize) {
        this.elementToResize = elementToResize;
    }
    postConstruct() {
        const finishedWithResizeFunc = this.horizontalResizeService.addResizeBar({
            eResizeBar: this.getGui(),
            dragStartPixels: 1,
            onResizeStart: this.onResizeStart.bind(this),
            onResizing: this.onResizing.bind(this),
            onResizeEnd: this.onResizeEnd.bind(this)
        });
        this.addDestroyFunc(finishedWithResizeFunc);
        this.setInverted(this.gridOptionsService.get('enableRtl'));
    }
    dispatchResizeEvent(start, end, width) {
        const event = {
            type: core_1.Events.EVENT_TOOL_PANEL_SIZE_CHANGED,
            width: width,
            started: start,
            ended: end,
        };
        this.eventService.dispatchEvent(event);
    }
    onResizeStart() {
        this.startingWidth = this.elementToResize.offsetWidth;
        this.dispatchResizeEvent(true, false, this.startingWidth);
    }
    onResizeEnd(delta) {
        return this.onResizing(delta, true);
    }
    onResizing(delta, isEnd = false) {
        const direction = this.inverted ? -1 : 1;
        let newWidth = Math.max(this.minWidth, Math.floor(this.startingWidth - (delta * direction)));
        if (this.maxWidth != null) {
            newWidth = Math.min(this.maxWidth, newWidth);
        }
        this.elementToResize.style.width = `${newWidth}px`;
        this.dispatchResizeEvent(false, isEnd, newWidth);
    }
    setInverted(inverted) {
        this.inverted = inverted;
    }
    setMaxWidth(value) {
        this.maxWidth = value;
    }
    setMinWidth(value) {
        if (value != null) {
            this.minWidth = value;
        }
        else {
            this.minWidth = 100;
        }
    }
}
__decorate([
    (0, core_1.Autowired)('horizontalResizeService')
], HorizontalResizeComp.prototype, "horizontalResizeService", void 0);
__decorate([
    core_1.PostConstruct
], HorizontalResizeComp.prototype, "postConstruct", null);
exports.HorizontalResizeComp = HorizontalResizeComp;
