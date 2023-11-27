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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridBodyScrollFeature = void 0;
var context_1 = require("../context/context");
var beanStub_1 = require("../context/beanStub");
var eventKeys_1 = require("../eventKeys");
var function_1 = require("../utils/function");
var browser_1 = require("../utils/browser");
var dom_1 = require("../utils/dom");
var ScrollDirection;
(function (ScrollDirection) {
    ScrollDirection[ScrollDirection["Vertical"] = 0] = "Vertical";
    ScrollDirection[ScrollDirection["Horizontal"] = 1] = "Horizontal";
})(ScrollDirection || (ScrollDirection = {}));
;
var ScrollSource;
(function (ScrollSource) {
    ScrollSource[ScrollSource["Container"] = 0] = "Container";
    ScrollSource[ScrollSource["FakeContainer"] = 1] = "FakeContainer";
})(ScrollSource || (ScrollSource = {}));
;
var GridBodyScrollFeature = /** @class */ (function (_super) {
    __extends(GridBodyScrollFeature, _super);
    function GridBodyScrollFeature(eBodyViewport) {
        var _this = _super.call(this) || this;
        _this.lastScrollSource = [null, null];
        _this.scrollLeft = -1;
        _this.nextScrollTop = -1;
        _this.scrollTop = -1;
        _this.eBodyViewport = eBodyViewport;
        _this.resetLastHScrollDebounced = (0, function_1.debounce)(function () { return _this.lastScrollSource[ScrollDirection.Horizontal] = null; }, 500);
        _this.resetLastVScrollDebounced = (0, function_1.debounce)(function () { return _this.lastScrollSource[ScrollDirection.Vertical] = null; }, 500);
        return _this;
    }
    GridBodyScrollFeature.prototype.postConstruct = function () {
        var _this = this;
        this.enableRtl = this.gridOptionsService.get('enableRtl');
        this.addManagedListener(this.eventService, eventKeys_1.Events.EVENT_DISPLAYED_COLUMNS_WIDTH_CHANGED, this.onDisplayedColumnsWidthChanged.bind(this));
        this.ctrlsService.whenReady(function (p) {
            _this.centerRowContainerCtrl = p.centerRowContainerCtrl;
            _this.onDisplayedColumnsWidthChanged();
            _this.addScrollListener();
        });
    };
    GridBodyScrollFeature.prototype.addScrollListener = function () {
        var fakeHScroll = this.ctrlsService.getFakeHScrollComp();
        var fakeVScroll = this.ctrlsService.getFakeVScrollComp();
        this.addManagedListener(this.centerRowContainerCtrl.getViewportElement(), 'scroll', this.onHScroll.bind(this));
        fakeHScroll.onScrollCallback(this.onFakeHScroll.bind(this));
        var isDebounce = this.gridOptionsService.get('debounceVerticalScrollbar');
        var onVScroll = isDebounce ?
            (0, function_1.debounce)(this.onVScroll.bind(this), 100) : this.onVScroll.bind(this);
        var onFakeVScroll = isDebounce ?
            (0, function_1.debounce)(this.onFakeVScroll.bind(this), 100) : this.onFakeVScroll.bind(this);
        this.addManagedListener(this.eBodyViewport, 'scroll', onVScroll);
        fakeVScroll.onScrollCallback(onFakeVScroll);
    };
    GridBodyScrollFeature.prototype.onDisplayedColumnsWidthChanged = function () {
        if (this.enableRtl) {
            // because RTL is all backwards, a change in the width of the row
            // can cause a change in the scroll position, without a scroll event,
            // because the scroll position in RTL is a function that depends on
            // the width. to be convinced of this, take out this line, enable RTL,
            // scroll all the way to the left and then resize a column
            this.horizontallyScrollHeaderCenterAndFloatingCenter();
        }
    };
    GridBodyScrollFeature.prototype.horizontallyScrollHeaderCenterAndFloatingCenter = function (scrollLeft) {
        // when doing RTL, this method gets called once prematurely
        var notYetInitialised = this.centerRowContainerCtrl == null;
        if (notYetInitialised) {
            return;
        }
        if (scrollLeft === undefined) {
            scrollLeft = this.centerRowContainerCtrl.getCenterViewportScrollLeft();
        }
        var offset = this.enableRtl ? scrollLeft : -scrollLeft;
        var topCenterContainer = this.ctrlsService.getTopCenterRowContainerCtrl();
        var stickyTopCenterContainer = this.ctrlsService.getStickyTopCenterRowContainerCtrl();
        var bottomCenterContainer = this.ctrlsService.getBottomCenterRowContainerCtrl();
        var fakeHScroll = this.ctrlsService.getFakeHScrollComp();
        var centerHeaderContainer = this.ctrlsService.getHeaderRowContainerCtrl();
        centerHeaderContainer.setHorizontalScroll(-offset);
        bottomCenterContainer.setContainerTranslateX(offset);
        topCenterContainer.setContainerTranslateX(offset);
        stickyTopCenterContainer.setContainerTranslateX(offset);
        var centerViewport = this.centerRowContainerCtrl.getViewportElement();
        var isCenterViewportLastHorizontal = this.lastScrollSource[ScrollDirection.Horizontal] === ScrollSource.Container;
        scrollLeft = Math.abs(scrollLeft);
        if (isCenterViewportLastHorizontal) {
            fakeHScroll.setScrollPosition(scrollLeft);
        }
        else {
            (0, dom_1.setScrollLeft)(centerViewport, scrollLeft, this.enableRtl);
        }
    };
    GridBodyScrollFeature.prototype.isControllingScroll = function (source, direction) {
        if (this.lastScrollSource[direction] == null) {
            this.lastScrollSource[direction] = source;
            return true;
        }
        return this.lastScrollSource[direction] === source;
    };
    GridBodyScrollFeature.prototype.onFakeHScroll = function () {
        if (!this.isControllingScroll(ScrollSource.FakeContainer, ScrollDirection.Horizontal)) {
            return;
        }
        this.onHScrollCommon(ScrollSource.FakeContainer);
    };
    GridBodyScrollFeature.prototype.onHScroll = function () {
        if (!this.isControllingScroll(ScrollSource.Container, ScrollDirection.Horizontal)) {
            return;
        }
        this.onHScrollCommon(ScrollSource.Container);
    };
    GridBodyScrollFeature.prototype.onHScrollCommon = function (source) {
        var centerContainerViewport = this.centerRowContainerCtrl.getViewportElement();
        var scrollLeft = centerContainerViewport.scrollLeft;
        if (this.shouldBlockScrollUpdate(ScrollDirection.Horizontal, scrollLeft, true)) {
            return;
        }
        var newScrollLeft;
        if (source === ScrollSource.Container) {
            newScrollLeft = (0, dom_1.getScrollLeft)(centerContainerViewport, this.enableRtl);
        }
        else {
            newScrollLeft = this.ctrlsService.getFakeHScrollComp().getScrollPosition();
        }
        // we do Math.round() rather than Math.floor(), to mirror how scroll values are applied.
        // eg if a scale is applied (ie user has zoomed the browser), then applying scroll=200
        // could result in 199.88, which then floor(199.88) = 199, however round(199.88) = 200.
        // initially Math.floor() was used, however this caused (almost) infinite loop with aligned grids,
        // as the scroll would move 1px at at time bouncing from one grid to the next (eg one grid would cause
        // scroll to 200px, the next to 199px, then the first back to 198px and so on).
        this.doHorizontalScroll(Math.round(newScrollLeft));
        this.resetLastHScrollDebounced();
    };
    GridBodyScrollFeature.prototype.onFakeVScroll = function () {
        if (!this.isControllingScroll(ScrollSource.FakeContainer, ScrollDirection.Vertical)) {
            return;
        }
        this.onVScrollCommon(ScrollSource.FakeContainer);
    };
    GridBodyScrollFeature.prototype.onVScroll = function () {
        if (!this.isControllingScroll(ScrollSource.Container, ScrollDirection.Vertical)) {
            return;
        }
        this.onVScrollCommon(ScrollSource.Container);
    };
    GridBodyScrollFeature.prototype.onVScrollCommon = function (source) {
        var scrollTop;
        if (source === ScrollSource.Container) {
            scrollTop = this.eBodyViewport.scrollTop;
        }
        else {
            scrollTop = this.ctrlsService.getFakeVScrollComp().getScrollPosition();
        }
        if (this.shouldBlockScrollUpdate(ScrollDirection.Vertical, scrollTop, true)) {
            return;
        }
        this.animationFrameService.setScrollTop(scrollTop);
        this.nextScrollTop = scrollTop;
        if (source === ScrollSource.Container) {
            this.ctrlsService.getFakeVScrollComp().setScrollPosition(scrollTop);
        }
        else {
            this.eBodyViewport.scrollTop = scrollTop;
        }
        // the `scrollGridIfNeeded` will recalculate the rows to be rendered by the grid
        // so it should only be called after `eBodyViewport` has been scrolled to the correct
        // position, otherwise the `first` and `last` row could be miscalculated.
        if (this.gridOptionsService.get('suppressAnimationFrame')) {
            this.scrollGridIfNeeded();
        }
        else {
            this.animationFrameService.schedule();
        }
        this.resetLastVScrollDebounced();
    };
    GridBodyScrollFeature.prototype.doHorizontalScroll = function (scrollLeft) {
        var fakeScrollLeft = this.ctrlsService.getFakeHScrollComp().getScrollPosition();
        if (this.scrollLeft === scrollLeft && scrollLeft === fakeScrollLeft) {
            return;
        }
        this.scrollLeft = scrollLeft;
        this.fireScrollEvent(ScrollDirection.Horizontal);
        this.horizontallyScrollHeaderCenterAndFloatingCenter(scrollLeft);
        this.centerRowContainerCtrl.onHorizontalViewportChanged(true);
    };
    GridBodyScrollFeature.prototype.fireScrollEvent = function (direction) {
        var _this = this;
        var bodyScrollEvent = {
            type: eventKeys_1.Events.EVENT_BODY_SCROLL,
            direction: direction === ScrollDirection.Horizontal ? 'horizontal' : 'vertical',
            left: this.scrollLeft,
            top: this.scrollTop
        };
        this.eventService.dispatchEvent(bodyScrollEvent);
        window.clearTimeout(this.scrollTimer);
        this.scrollTimer = undefined;
        this.scrollTimer = window.setTimeout(function () {
            var bodyScrollEndEvent = __assign(__assign({}, bodyScrollEvent), { type: eventKeys_1.Events.EVENT_BODY_SCROLL_END });
            _this.eventService.dispatchEvent(bodyScrollEndEvent);
        }, 100);
    };
    GridBodyScrollFeature.prototype.shouldBlockScrollUpdate = function (direction, scrollTo, touchOnly) {
        // touch devices allow elastic scroll - which temporally scrolls the panel outside of the viewport
        // (eg user uses touch to go to the left of the grid, but drags past the left, the rows will actually
        // scroll past the left until the user releases the mouse). when this happens, we want ignore the scroll,
        // as otherwise it was causing the rows and header to flicker.
        if (touchOnly === void 0) { touchOnly = false; }
        // sometimes when scrolling, we got values that extended the maximum scroll allowed. we used to
        // ignore these scrolls. problem is the max scroll position could be skipped (eg the previous scroll event
        // could be 10px before the max position, and then current scroll event could be 20px after the max position).
        // if we just ignored the last event, we would be setting the scroll to 10px before the max position, when in
        // actual fact the user has exceeded the max scroll and thus scroll should be set to the max.
        if (touchOnly && !(0, browser_1.isIOSUserAgent)()) {
            return false;
        }
        if (direction === ScrollDirection.Vertical) {
            return this.shouldBlockVerticalScroll(scrollTo);
        }
        return this.shouldBlockHorizontalScroll(scrollTo);
    };
    GridBodyScrollFeature.prototype.shouldBlockVerticalScroll = function (scrollTo) {
        var clientHeight = (0, dom_1.getInnerHeight)(this.eBodyViewport);
        var scrollHeight = this.eBodyViewport.scrollHeight;
        if (scrollTo < 0 || (scrollTo + clientHeight > scrollHeight)) {
            return true;
        }
        return false;
    };
    GridBodyScrollFeature.prototype.shouldBlockHorizontalScroll = function (scrollTo) {
        var clientWidth = this.centerRowContainerCtrl.getCenterWidth();
        var scrollWidth = this.centerRowContainerCtrl.getViewportElement().scrollWidth;
        if (this.enableRtl && (0, dom_1.isRtlNegativeScroll)()) {
            if (scrollTo > 0) {
                return true;
            }
        }
        else if (scrollTo < 0) {
            return true;
        }
        if (Math.abs(scrollTo) + clientWidth > scrollWidth) {
            return true;
        }
        return false;
    };
    GridBodyScrollFeature.prototype.redrawRowsAfterScroll = function () {
        this.fireScrollEvent(ScrollDirection.Vertical);
    };
    // this is to cater for AG-3274, where grid is removed from the dom and then inserted back in again.
    // (which happens with some implementations of tabbing). this can result in horizontal scroll getting
    // reset back to the left, however no scroll event is fired. so we need to get header to also scroll
    // back to the left to be kept in sync.
    // adding and removing the grid from the DOM both resets the scroll position and
    // triggers a resize event, so notify listeners if the scroll position has changed
    GridBodyScrollFeature.prototype.checkScrollLeft = function () {
        if (this.scrollLeft !== this.centerRowContainerCtrl.getCenterViewportScrollLeft()) {
            this.onHScrollCommon(ScrollSource.Container);
        }
    };
    GridBodyScrollFeature.prototype.scrollGridIfNeeded = function () {
        var frameNeeded = this.scrollTop != this.nextScrollTop;
        if (frameNeeded) {
            this.scrollTop = this.nextScrollTop;
            this.redrawRowsAfterScroll();
        }
        return frameNeeded;
    };
    // called by scrollHorizontally method and alignedGridsService
    GridBodyScrollFeature.prototype.setHorizontalScrollPosition = function (hScrollPosition, fromAlignedGridsService) {
        if (fromAlignedGridsService === void 0) { fromAlignedGridsService = false; }
        var minScrollLeft = 0;
        var maxScrollLeft = this.centerRowContainerCtrl.getViewportElement().scrollWidth - this.centerRowContainerCtrl.getCenterWidth();
        // if this is call is coming from the alignedGridsService, we don't need to validate the
        // scroll, because it has already been validated by the grid firing the scroll event.
        if (!fromAlignedGridsService && this.shouldBlockScrollUpdate(ScrollDirection.Horizontal, hScrollPosition)) {
            if (this.enableRtl && (0, dom_1.isRtlNegativeScroll)()) {
                hScrollPosition = hScrollPosition > 0 ? 0 : maxScrollLeft;
            }
            else {
                hScrollPosition = Math.min(Math.max(hScrollPosition, minScrollLeft), maxScrollLeft);
            }
        }
        (0, dom_1.setScrollLeft)(this.centerRowContainerCtrl.getViewportElement(), Math.abs(hScrollPosition), this.enableRtl);
        // we need to manually do the event handling (rather than wait for the event)
        // for the alignedGridsService, as if we don't, the aligned grid service gets
        // notified async, and then it's 'consuming' flag doesn't get used right, and
        // we can end up with an infinite loop
        this.doHorizontalScroll(hScrollPosition);
    };
    GridBodyScrollFeature.prototype.setVerticalScrollPosition = function (vScrollPosition) {
        this.eBodyViewport.scrollTop = vScrollPosition;
    };
    GridBodyScrollFeature.prototype.getVScrollPosition = function () {
        var result = {
            top: this.eBodyViewport.scrollTop,
            bottom: this.eBodyViewport.scrollTop + this.eBodyViewport.offsetHeight
        };
        return result;
    };
    GridBodyScrollFeature.prototype.getHScrollPosition = function () {
        return this.centerRowContainerCtrl.getHScrollPosition();
    };
    GridBodyScrollFeature.prototype.isHorizontalScrollShowing = function () {
        return this.centerRowContainerCtrl.isHorizontalScrollShowing();
    };
    // called by the headerRootComp and moveColumnController
    GridBodyScrollFeature.prototype.scrollHorizontally = function (pixels) {
        var oldScrollPosition = this.centerRowContainerCtrl.getViewportElement().scrollLeft;
        this.setHorizontalScrollPosition(oldScrollPosition + pixels);
        return this.centerRowContainerCtrl.getViewportElement().scrollLeft - oldScrollPosition;
    };
    // gets called by rowRenderer when new data loaded, as it will want to scroll to the top
    GridBodyScrollFeature.prototype.scrollToTop = function () {
        this.eBodyViewport.scrollTop = 0;
    };
    // Valid values for position are bottom, middle and top
    GridBodyScrollFeature.prototype.ensureNodeVisible = function (comparator, position) {
        if (position === void 0) { position = null; }
        // look for the node index we want to display
        var rowCount = this.rowModel.getRowCount();
        var indexToSelect = -1;
        // go through all the nodes, find the one we want to show
        for (var i = 0; i < rowCount; i++) {
            var node = this.rowModel.getRow(i);
            if (typeof comparator === 'function') {
                // Have to assert type here, as type could be TData & Function
                var predicate = comparator;
                if (node && predicate(node)) {
                    indexToSelect = i;
                    break;
                }
            }
            else {
                // check object equality against node and data
                if (comparator === node || comparator === node.data) {
                    indexToSelect = i;
                    break;
                }
            }
        }
        if (indexToSelect >= 0) {
            this.ensureIndexVisible(indexToSelect, position);
        }
    };
    // Valid values for position are bottom, middle and top
    // position should be {'top','middle','bottom', or undefined/null}.
    // if undefined/null, then the grid will to the minimal amount of scrolling,
    // eg if grid needs to scroll up, it scrolls until row is on top,
    //    if grid needs to scroll down, it scrolls until row is on bottom,
    //    if row is already in view, grid does not scroll
    GridBodyScrollFeature.prototype.ensureIndexVisible = function (index, position) {
        // if for print or auto height, everything is always visible
        if (this.gridOptionsService.isDomLayout('print')) {
            return;
        }
        var rowCount = this.paginationProxy.getRowCount();
        if (typeof index !== 'number' || index < 0 || index >= rowCount) {
            console.warn('AG Grid: Invalid row index for ensureIndexVisible: ' + index);
            return;
        }
        var isPaging = this.gridOptionsService.get('pagination');
        var paginationPanelEnabled = isPaging && !this.gridOptionsService.get('suppressPaginationPanel');
        if (!paginationPanelEnabled) {
            this.paginationProxy.goToPageWithIndex(index);
        }
        var gridBodyCtrl = this.ctrlsService.getGridBodyCtrl();
        var stickyTopHeight = gridBodyCtrl.getStickyTopHeight();
        var rowNode = this.paginationProxy.getRow(index);
        var rowGotShiftedDuringOperation;
        do {
            var startingRowTop = rowNode.rowTop;
            var startingRowHeight = rowNode.rowHeight;
            var paginationOffset = this.paginationProxy.getPixelOffset();
            var rowTopPixel = rowNode.rowTop - paginationOffset;
            var rowBottomPixel = rowTopPixel + rowNode.rowHeight;
            var scrollPosition = this.getVScrollPosition();
            var heightOffset = this.heightScaler.getDivStretchOffset();
            var vScrollTop = scrollPosition.top + heightOffset;
            var vScrollBottom = scrollPosition.bottom + heightOffset;
            var viewportHeight = vScrollBottom - vScrollTop;
            // work out the pixels for top, middle and bottom up front,
            // make the if/else below easier to read
            var pxTop = this.heightScaler.getScrollPositionForPixel(rowTopPixel);
            var pxBottom = this.heightScaler.getScrollPositionForPixel(rowBottomPixel - viewportHeight);
            // make sure if middle, the row is not outside the top of the grid
            var pxMiddle = Math.min((pxTop + pxBottom) / 2, rowTopPixel);
            var rowAboveViewport = (vScrollTop + stickyTopHeight) > rowTopPixel;
            var rowBelowViewport = vScrollBottom < rowBottomPixel;
            var newScrollPosition = null;
            if (position === 'top') {
                newScrollPosition = pxTop;
            }
            else if (position === 'bottom') {
                newScrollPosition = pxBottom;
            }
            else if (position === 'middle') {
                newScrollPosition = pxMiddle;
            }
            else if (rowAboveViewport) {
                // if row is before, scroll up with row at top
                newScrollPosition = pxTop - stickyTopHeight;
            }
            else if (rowBelowViewport) {
                // if row is after, scroll down with row at bottom
                newScrollPosition = pxBottom;
            }
            if (newScrollPosition !== null) {
                this.setVerticalScrollPosition(newScrollPosition);
                this.rowRenderer.redraw({ afterScroll: true });
            }
            // the row can get shifted if during the rendering (during rowRenderer.redraw()),
            // the height of a row changes due to lazy calculation of row heights when using
            // colDef.autoHeight or gridOptions.getRowHeight.
            // if row was shifted, then the position we scrolled to is incorrect.
            rowGotShiftedDuringOperation = (startingRowTop !== rowNode.rowTop)
                || (startingRowHeight !== rowNode.rowHeight);
        } while (rowGotShiftedDuringOperation);
        // so when we return back to user, the cells have rendered
        this.animationFrameService.flushAllFrames();
    };
    GridBodyScrollFeature.prototype.ensureColumnVisible = function (key, position) {
        if (position === void 0) { position = 'auto'; }
        var column = this.columnModel.getGridColumn(key);
        if (!column) {
            return;
        }
        // calling ensureColumnVisible on a pinned column doesn't make sense
        if (column.isPinned()) {
            return;
        }
        // defensive
        if (!this.columnModel.isColumnDisplayed(column)) {
            return;
        }
        var newHorizontalScroll = this.getPositionedHorizontalScroll(column, position);
        if (newHorizontalScroll !== null) {
            this.centerRowContainerCtrl.setCenterViewportScrollLeft(newHorizontalScroll);
        }
        // this will happen anyway, as the move will cause a 'scroll' event on the body, however
        // it is possible that the ensureColumnVisible method is called from within AG Grid and
        // the caller will need to have the columns rendered to continue, which will be before
        // the event has been worked on (which is the case for cell navigation).
        this.centerRowContainerCtrl.onHorizontalViewportChanged();
        // so when we return back to user, the cells have rendered
        this.animationFrameService.flushAllFrames();
    };
    GridBodyScrollFeature.prototype.setScrollPosition = function (top, left) {
        this.centerRowContainerCtrl.setCenterViewportScrollLeft(left);
        this.setVerticalScrollPosition(top);
        this.rowRenderer.redraw({ afterScroll: true });
        this.animationFrameService.flushAllFrames();
    };
    GridBodyScrollFeature.prototype.getPositionedHorizontalScroll = function (column, position) {
        var _a = this.isColumnOutsideViewport(column), columnBeforeStart = _a.columnBeforeStart, columnAfterEnd = _a.columnAfterEnd;
        var viewportTooSmallForColumn = this.centerRowContainerCtrl.getCenterWidth() < column.getActualWidth();
        var viewportWidth = this.centerRowContainerCtrl.getCenterWidth();
        var isRtl = this.enableRtl;
        var alignColToStart = (isRtl ? columnBeforeStart : columnAfterEnd) || viewportTooSmallForColumn;
        var alignColToEnd = isRtl ? columnAfterEnd : columnBeforeStart;
        if (position !== 'auto') {
            alignColToStart = position === 'start';
            alignColToEnd = position === 'end';
        }
        var isMiddle = position === 'middle';
        if (alignColToStart || alignColToEnd || isMiddle) {
            var _b = this.getColumnBounds(column), colLeft = _b.colLeft, colMiddle = _b.colMiddle, colRight = _b.colRight;
            if (isMiddle) {
                return colMiddle - viewportWidth / 2;
            }
            if (alignColToStart) {
                return isRtl ? colRight : colLeft;
            }
            return isRtl ? (colLeft - viewportWidth) : (colRight - viewportWidth);
        }
        return null;
    };
    GridBodyScrollFeature.prototype.isColumnOutsideViewport = function (column) {
        var _a = this.getViewportBounds(), viewportStart = _a.start, viewportEnd = _a.end;
        var _b = this.getColumnBounds(column), colLeft = _b.colLeft, colRight = _b.colRight;
        var isRtl = this.enableRtl;
        var columnBeforeStart = isRtl ? (viewportStart > colRight) : (viewportEnd < colRight);
        var columnAfterEnd = isRtl ? (viewportEnd < colLeft) : (viewportStart > colLeft);
        return { columnBeforeStart: columnBeforeStart, columnAfterEnd: columnAfterEnd };
    };
    GridBodyScrollFeature.prototype.getColumnBounds = function (column) {
        var isRtl = this.enableRtl;
        var bodyWidth = this.columnModel.getBodyContainerWidth();
        var colWidth = column.getActualWidth();
        var colLeft = column.getLeft();
        var multiplier = isRtl ? -1 : 1;
        var colLeftPixel = isRtl ? (bodyWidth - colLeft) : colLeft;
        var colRightPixel = colLeftPixel + colWidth * multiplier;
        var colMidPixel = colLeftPixel + colWidth / 2 * multiplier;
        return { colLeft: colLeftPixel, colMiddle: colMidPixel, colRight: colRightPixel };
    };
    GridBodyScrollFeature.prototype.getViewportBounds = function () {
        var viewportWidth = this.centerRowContainerCtrl.getCenterWidth();
        var scrollPosition = this.centerRowContainerCtrl.getCenterViewportScrollLeft();
        var viewportStartPixel = scrollPosition;
        var viewportEndPixel = viewportWidth + scrollPosition;
        return { start: viewportStartPixel, end: viewportEndPixel, width: viewportWidth };
    };
    __decorate([
        (0, context_1.Autowired)('ctrlsService')
    ], GridBodyScrollFeature.prototype, "ctrlsService", void 0);
    __decorate([
        (0, context_1.Autowired)('animationFrameService')
    ], GridBodyScrollFeature.prototype, "animationFrameService", void 0);
    __decorate([
        (0, context_1.Autowired)('paginationProxy')
    ], GridBodyScrollFeature.prototype, "paginationProxy", void 0);
    __decorate([
        (0, context_1.Autowired)('rowModel')
    ], GridBodyScrollFeature.prototype, "rowModel", void 0);
    __decorate([
        (0, context_1.Autowired)('rowContainerHeightService')
    ], GridBodyScrollFeature.prototype, "heightScaler", void 0);
    __decorate([
        (0, context_1.Autowired)('rowRenderer')
    ], GridBodyScrollFeature.prototype, "rowRenderer", void 0);
    __decorate([
        (0, context_1.Autowired)('columnModel')
    ], GridBodyScrollFeature.prototype, "columnModel", void 0);
    __decorate([
        context_1.PostConstruct
    ], GridBodyScrollFeature.prototype, "postConstruct", null);
    return GridBodyScrollFeature;
}(beanStub_1.BeanStub));
exports.GridBodyScrollFeature = GridBodyScrollFeature;
