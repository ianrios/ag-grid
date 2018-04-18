import {Utils as _} from "../utils";
import {GridOptionsWrapper} from "../gridOptionsWrapper";
import {ColumnController} from "../columnController/columnController";
import {ColumnApi} from "../columnController/columnApi";
import {RowRenderer} from "../rendering/rowRenderer";
import {Logger, LoggerFactory} from "../logger";
import {
    Bean,
    Qualifier,
    Autowired,
    PostConstruct,
    Optional,
    PreDestroy,
    Context,
    PreConstruct
} from "../context/context";
import {EventService} from "../eventService";
import {BodyHeightChangedEvent, BodyScrollEvent, Events} from "../events";
import {DragService, DragListenerParams} from "../dragAndDrop/dragService";
import {IRangeController} from "../interfaces/iRangeController";
import {Constants} from "../constants";
import {SelectionController} from "../selectionController";
import {CsvCreator} from "../csvCreator";
import {MouseEventService} from "./mouseEventService";
import {IClipboardService} from "../interfaces/iClipboardService";
import {FocusedCellController} from "../focusedCellController";
import {IContextMenuFactory} from "../interfaces/iContextMenuFactory";
import {SetScrollsVisibleParams, ScrollVisibleService} from "./scrollVisibleService";
import {BeanStub} from "../context/beanStub";
import {IFrameworkFactory} from "../interfaces/iFrameworkFactory";
import {Column} from "../entities/column";
import {RowContainerComponent} from "../rendering/rowContainerComponent";
import {RowNode} from "../entities/rowNode";
import {PaginationProxy} from "../rowModels/paginationProxy";
import {PopupEditorWrapper} from "../rendering/cellEditors/popupEditorWrapper";
import {AlignedGridsService} from "../alignedGridsService";
import {PinnedRowModel} from "../rowModels/pinnedRowModel";
import {GridApi} from "../gridApi";
import {AnimationFrameService} from "../misc/animationFrameService";
import {RowComp} from "../rendering/rowComp";
import {NavigationService} from "./navigationService";
import {CellComp} from "../rendering/cellComp";
import {ValueService} from "../valueService/valueService";
import {LongTapEvent, TouchListener} from "../widgets/touchListener";
import {ComponentRecipes} from "../components/framework/componentRecipes";
import {DragAndDropService} from "../dragAndDrop/dragAndDropService";
import {RowDragFeature} from "./rowDragFeature";
import {HeightScaler} from "../rendering/heightScaler";
import {IOverlayWrapperComp} from "../rendering/overlays/overlayWrapperComponent";
import {Component} from "../widgets/component";

// in the html below, it is important that there are no white space between some of the divs, as if there is white space,
// it won't render correctly in safari, as safari renders white space as a gap

const HEADER_SNIPPET =
    '<div class="ag-header" role="row">'+
      '<div class="ag-pinned-left-header" role="presentation"></div>' +
      '<div class="ag-pinned-right-header" role="presentation"></div>' +
      '<div class="ag-header-viewport" role="presentation">' +
        '<div class="ag-header-container" role="presentation"></div>' +
      '</div>'+
    '</div>';

const FLOATING_TOP_SNIPPET =
    '<div class="ag-floating-top" role="presentation">'+
      '<div class="ag-pinned-left-floating-top" role="presentation"></div>' +
      '<div class="ag-pinned-right-floating-top" role="presentation"></div>' +
      '<div class="ag-floating-top-viewport" role="presentation">' +
        '<div class="ag-floating-top-container" role="presentation"></div>' +
      '</div>'+
      '<div class="ag-floating-top-full-width-container" role="presentation"></div>'+
    '</div>';

const FLOATING_BOTTOM_SNIPPET =
    '<div class="ag-floating-bottom" role="presentation">'+
      '<div class="ag-pinned-left-floating-bottom" role="presentation"></div>' +
      '<div class="ag-pinned-right-floating-bottom" role="presentation"></div>' +
      '<div class="ag-floating-bottom-viewport" role="presentation">' +
        '<div class="ag-floating-bottom-container" role="presentation"></div>' +
      '</div>'+
      '<div class="ag-floating-bottom-full-width-container" role="presentation"></div>'+
    '</div>';

const BODY_SNIPPET =
    '<div class="ag-body" role="presentation">'+
      '<div class="ag-pinned-left-cols-viewport-wrapper" role="presentation">'+
        '<div class="ag-pinned-left-cols-viewport" role="presentation">'+
          '<div class="ag-pinned-left-cols-container" role="presentation"></div>'+
        '</div>'+
      '</div>'+
      '<div class="ag-body-viewport-wrapper" role="presentation">'+
        '<div class="ag-body-viewport" role="presentation">'+
          '<div class="ag-body-container" role="presentation"></div>'+
        '</div>'+
      '</div>'+
      '<div class="ag-pinned-right-cols-viewport-wrapper" role="presentation">'+
        '<div class="ag-pinned-right-cols-viewport" role="presentation">'+
          '<div class="ag-pinned-right-cols-container" role="presentation"></div>'+
        '</div>'+
      '</div>'+
      '<div class="ag-full-width-viewport-wrapper" role="presentation">'+
        '<div class="ag-full-width-viewport" role="presentation">'+
          '<div class="ag-full-width-container" role="presentation"></div>'+
        '</div>'+
      '</div>'+
    '</div>';

const OVERLAY_TEMPLATE = '<div class="ag-overlay" ref="eOverlay"></div>';

const GRID_PANEL_NORMAL_TEMPLATE =
    '<div class="ag-root ag-font-style" role="grid">'+
        HEADER_SNIPPET + FLOATING_TOP_SNIPPET + BODY_SNIPPET + FLOATING_BOTTOM_SNIPPET + OVERLAY_TEMPLATE +
    '</div>';

export type RowContainerComponentNames =
    'fullWidth' |
    'body' |
    'pinnedLeft' |
    'pinnedRight' |
    'floatingTop' |
    'floatingTopPinnedLeft' |
    'floatingTopPinnedRight' |
    'floatingTopFullWidth' |
    'floatingBottom' |
    'floatingBottomPinnedLeft' |
    'floatingBottomPinnedRight' |
    'floatingBottomFullWith';

export type RowContainerComponents = { [K in RowContainerComponentNames]: RowContainerComponent };

@Bean('gridPanel')
export class GridPanel extends Component {

    @Autowired('alignedGridsService') private alignedGridsService: AlignedGridsService;
    @Autowired('gridOptionsWrapper') private gridOptionsWrapper: GridOptionsWrapper;
    @Autowired('columnController') private columnController: ColumnController;
    @Autowired('rowRenderer') private rowRenderer: RowRenderer;
    @Autowired('pinnedRowModel') private pinnedRowModel: PinnedRowModel;
    @Autowired('eventService') private eventService: EventService;
    @Autowired('context') private context: Context;
    @Autowired('animationFrameService') private animationFrameService: AnimationFrameService;
    @Autowired('navigationService') private navigationService: NavigationService;

    @Autowired('paginationProxy') private paginationProxy: PaginationProxy;
    @Autowired('columnApi') private columnApi: ColumnApi;
    @Autowired('gridApi') private gridApi: GridApi;

    @Optional('rangeController') private rangeController: IRangeController;
    @Autowired('dragService') private dragService: DragService;
    @Autowired('selectionController') private selectionController: SelectionController;
    @Optional('clipboardService') private clipboardService: IClipboardService;
    @Autowired('csvCreator') private csvCreator: CsvCreator;
    @Autowired('mouseEventService') private mouseEventService: MouseEventService;
    @Autowired('focusedCellController') private focusedCellController: FocusedCellController;
    @Autowired('$scope') private $scope: any;
    @Autowired('scrollVisibleService') private scrollVisibleService: ScrollVisibleService;
    @Optional('contextMenuFactory') private contextMenuFactory: IContextMenuFactory;
    @Autowired('frameworkFactory') private frameworkFactory: IFrameworkFactory;
    @Autowired('valueService') private  valueService: ValueService;
    @Autowired('componentRecipes') private componentRecipes: ComponentRecipes;
    @Autowired('dragAndDropService') private dragAndDropService: DragAndDropService;
    @Autowired('heightScaler') private heightScaler: HeightScaler;

    private eBodyViewport: HTMLElement;
    private eBody: HTMLElement;

    private rowContainerComponents: RowContainerComponents;

    private eBodyContainer: HTMLElement;
    private eLeftContainer: HTMLElement;
    private eRightContainer: HTMLElement;
    private eFullWidthViewportWrapper: HTMLElement;
    private eFullWidthViewport: HTMLElement;
    private eFullWidthContainer: HTMLElement;
    private eLeftViewport: HTMLElement;
    private eLeftViewportWrapper: HTMLElement;
    private eRightViewport: HTMLElement;
    private eRightViewportWrapper: HTMLElement;
    private eBodyViewportWrapper: HTMLElement;

    private eHeaderContainer: HTMLElement;
    private ePinnedLeftHeader: HTMLElement;
    private ePinnedRightHeader: HTMLElement;
    private eHeader: HTMLElement;
    private eHeaderViewport: HTMLElement;

    private eFloatingTop: HTMLElement;
    private eLeftFloatingTop: HTMLElement;
    private eRightFloatingTop: HTMLElement;
    private eFloatingTopContainer: HTMLElement;
    private eFloatingTopViewport: HTMLElement;
    private eFloatingTopFullWidthContainer: HTMLElement;

    private eFloatingBottom: HTMLElement;
    private eLeftFloatingBottom: HTMLElement;
    private eRightFloatingBottom: HTMLElement;
    private eFloatingBottomContainer: HTMLElement;
    private eFloatingBottomViewport: HTMLElement;
    private eFloatingBottomFullWidthContainer: HTMLElement;

    private eAllCellContainers: HTMLElement[];

    private eOverlay: HTMLElement;

    private scrollLeft = -1;
    private nextScrollLeft = -1;
    private scrollTop = -1;
    private nextScrollTop = -1;
    private verticalRedrawNeeded = false;

    private bodyHeight: number;

    // properties we use a lot, so keep reference
    private enableRtl: boolean;
    private autoHeight: boolean;
    private scrollWidth: number;

    // used to track if pinned panels are showing, so we can turn them off if not
    private pinningRight: boolean;
    private pinningLeft: boolean;

    private useAnimationFrame: boolean;

    private overlayWrapper: IOverlayWrapperComp;

    private lastVScrollElement: HTMLElement;
    private lastVScrollTime: number;

    constructor() {
        super(GRID_PANEL_NORMAL_TEMPLATE);
    }

    @PreConstruct
    public preConstruct() {
        // makes code below more readable if we pull 'forPrint' out
        this.autoHeight = this.gridOptionsWrapper.isAutoHeight();
        this.scrollWidth = this.gridOptionsWrapper.getScrollbarWidth();
        this.enableRtl = this.gridOptionsWrapper.isEnableRtl();
        this.findElements();
    }

    public getVScrollPosition(): {top: number, bottom: number} {
        let result = {
            top: this.eBodyViewport.scrollTop,
            bottom: this.eBodyViewport.scrollTop + this.eBodyViewport.offsetHeight
        };
        return result;
    }

    public getHScrollPosition(): {left: number, right: number} {
        let result = {
            left: this.eBodyViewport.scrollLeft,
            right: this.eBodyViewport.scrollTop + this.eBodyViewport.offsetWidth
        };
        return result;
    }

    // we override this, as the base class is missing the annotation
    @PreDestroy
    public destroy() {
        super.destroy();
    }

    private onRowDataChanged(): void {
        this.showOrHideOverlay();
    }

    private showOrHideOverlay(): void {
        if (this.paginationProxy.isEmpty() && !this.gridOptionsWrapper.isSuppressNoRowsOverlay()) {
            this.showNoRowsOverlay();
        } else {
            this.hideOverlay();
        }
    }

    private onNewColumnsLoaded(): void {
        // hide overlay if columns and rows exist, this can happen if columns are loaded after data.
        // this problem exists before of the race condition between the services (column controller in this case)
        // and the view (grid panel). if the model beans were all initialised first, and then the view beans second,
        // this race condition would not happen.
        if (this.columnController.isReady() && !this.paginationProxy.isEmpty()) {
            this.hideOverlay();
        }
    }

    @PostConstruct
    private init() {

        this.useAnimationFrame = !this.gridOptionsWrapper.isSuppressAnimationFrame();

        this.addEventListeners();
        this.addDragListeners();

        this.addScrollListener();
        this.addPreventHeaderScroll();

        if (this.gridOptionsWrapper.isSuppressHorizontalScroll()) {
            this.eBodyViewport.style.overflowX = 'hidden';
        }

        this.setupOverlay();

        if (this.gridOptionsWrapper.isRowModelDefault() && !this.gridOptionsWrapper.getRowData()) {
            this.showLoadingOverlay();
        }

        this.setPinnedContainersVisible();
        this.setBodyAndHeaderHeights();
        this.disableBrowserDragging();
        this.addShortcutKeyListeners();
        this.addMouseListeners();
        this.addKeyboardEvents();
        this.addBodyViewportListener();
        this.addStopEditingWhenGridLosesFocus();
        this.mockContextMenuForIPad();
        this.addRowDragListener();

        if (this.$scope) {
            this.addAngularApplyCheck();
        }

        this.onDisplayedColumnsWidthChanged();
    }

    private setupOverlay(): void {
        this.overlayWrapper = this.componentRecipes.newOverlayWrapperComponent();
        this.eOverlay = this.queryForHtmlElement('[ref="eOverlay"]');
        this.overlayWrapper.hideOverlay(this.eOverlay);
    }

    private addRowDragListener(): void {

        let rowDragFeature = new RowDragFeature(this.eBody);
        this.context.wireBean(rowDragFeature);

        this.dragAndDropService.addDropTarget(rowDragFeature);
    }

    private addStopEditingWhenGridLosesFocus(): void {
        if (this.gridOptionsWrapper.isStopEditingWhenGridLosesFocus()) {
            this.addDestroyableEventListener(this.eBody, 'focusout', (event: FocusEvent)=> {

                // this is the element the focus is moving to
                let elementWithFocus = event.relatedTarget;

                // see if the element the focus is going to is part of the grid
                let clickInsideGrid = false;
                let pointer: any = elementWithFocus;

                while (_.exists(pointer) && !clickInsideGrid) {

                    let isPopup = !!this.gridOptionsWrapper.getDomData(pointer, PopupEditorWrapper.DOM_KEY_POPUP_EDITOR_WRAPPER);
                    let isBody = this.eBody == pointer;

                    clickInsideGrid = isPopup || isBody;

                    pointer = pointer.parentNode;
                }

                if (!clickInsideGrid) {
                    this.rowRenderer.stopEditing();
                }
            });
        }
    }

    private addAngularApplyCheck(): void {
        // this makes sure if we queue up requests, we only execute oe
        let applyTriggered = false;

        let listener = ()=> {
            // only need to do one apply at a time
            if (applyTriggered) { return; }
            applyTriggered = true; // mark 'need apply' to true
            setTimeout( ()=> {
                applyTriggered = false;
                this.$scope.$apply();
            }, 0);
        };

        // these are the events we need to do an apply after - these are the ones that can end up
        // with columns added or removed
        this.addDestroyableEventListener(this.eventService, Events.EVENT_DISPLAYED_COLUMNS_CHANGED, listener);
        this.addDestroyableEventListener(this.eventService, Events.EVENT_VIRTUAL_COLUMNS_CHANGED, listener);
    }

    // if we do not do this, then the user can select a pic in the grid (eg an image in a custom cell renderer)
    // and then that will start the browser native drag n' drop, which messes up with our own drag and drop.
    private disableBrowserDragging(): void {
        this.getGui().addEventListener('dragstart', (event: MouseEvent)=> {
            if (event.target instanceof HTMLImageElement) {
                event.preventDefault();
                return false;
            }
        });
    }

    private addEventListeners(): void {

        this.addDestroyableEventListener(this.eventService, Events.EVENT_DISPLAYED_COLUMNS_CHANGED, this.onDisplayedColumnsChanged.bind(this));
        this.addDestroyableEventListener(this.eventService, Events.EVENT_DISPLAYED_COLUMNS_WIDTH_CHANGED, this.onDisplayedColumnsWidthChanged.bind(this));
        this.addDestroyableEventListener(this.eventService, Events.EVENT_SCROLL_VISIBILITY_CHANGED, this.onScrollVisibilityChanged.bind(this));
        this.addDestroyableEventListener(this.eventService, Events.EVENT_PINNED_ROW_DATA_CHANGED, this.setBodyAndHeaderHeights.bind(this));
        this.addDestroyableEventListener(this.eventService, Events.EVENT_ROW_DATA_CHANGED, this.onRowDataChanged.bind(this));
        this.addDestroyableEventListener(this.eventService, Events.EVENT_ROW_DATA_UPDATED, this.onRowDataChanged.bind(this));

        this.addDestroyableEventListener(this.eventService, Events.EVENT_NEW_COLUMNS_LOADED, this.onNewColumnsLoaded.bind(this));

        this.addDestroyableEventListener(this.gridOptionsWrapper, GridOptionsWrapper.PROP_HEADER_HEIGHT, this.setBodyAndHeaderHeights.bind(this));
        this.addDestroyableEventListener(this.gridOptionsWrapper, GridOptionsWrapper.PROP_PIVOT_HEADER_HEIGHT, this.setBodyAndHeaderHeights.bind(this));

        this.addDestroyableEventListener(this.gridOptionsWrapper, GridOptionsWrapper.PROP_GROUP_HEADER_HEIGHT, this.setBodyAndHeaderHeights.bind(this));
        this.addDestroyableEventListener(this.gridOptionsWrapper, GridOptionsWrapper.PROP_PIVOT_GROUP_HEADER_HEIGHT, this.setBodyAndHeaderHeights.bind(this));

        this.addDestroyableEventListener(this.gridOptionsWrapper, GridOptionsWrapper.PROP_FLOATING_FILTERS_HEIGHT, this.setBodyAndHeaderHeights.bind(this));
    }

    private addDragListeners(): void {
        if (!this.gridOptionsWrapper.isEnableRangeSelection() // no range selection if no property
            || _.missing(this.rangeController)) { // no range selection if not enterprise version
            return;
        }

        let containers = [this.eLeftContainer, this.eRightContainer, this.eBodyContainer,
            this.eFloatingTop, this.eFloatingBottom];

        containers.forEach(container => {
            let params: DragListenerParams = {
                eElement: container,
                onDragStart: this.rangeController.onDragStart.bind(this.rangeController),
                onDragStop: this.rangeController.onDragStop.bind(this.rangeController),
                onDragging: this.rangeController.onDragging.bind(this.rangeController),
                // for range selection by dragging the mouse, we want to ignore the event if shift key is pressed,
                // as shift key click is another type of range selection
                skipMouseEvent: mouseEvent => mouseEvent.shiftKey
            };

            this.dragService.addDragSource(params);

            this.addDestroyFunc( ()=> this.dragService.removeDragSource(params) );
        });
    }

    private addMouseListeners(): void {
        let eventNames = ['click','mousedown','dblclick','contextmenu','mouseover','mouseout'];
        eventNames.forEach( eventName => {
            let listener = this.processMouseEvent.bind(this, eventName);
            this.eAllCellContainers.forEach( container =>
                this.addDestroyableEventListener(container, eventName, listener)
            );
        });
    }

    private addKeyboardEvents(): void {
        let eventNames = ['keydown','keypress'];
        eventNames.forEach( eventName => {
            let listener = this.processKeyboardEvent.bind(this, eventName);
            this.eAllCellContainers.forEach( container => {
                this.addDestroyableEventListener(container, eventName, listener);
            });
        });
    }

    private addBodyViewportListener(): void {
        // we want to listen for clicks directly on the eBodyViewport, so the user has a way of showing
        // the context menu if no rows are displayed, or user simply clicks outside of a cell
        let listener = (mouseEvent: MouseEvent) => {
            let target = _.getTarget(mouseEvent);
            if (target===this.eBodyViewport || target===this.eLeftViewport || target===this.eRightViewport) {
                // show it
                this.onContextMenu(mouseEvent, null, null, null, null);
                this.preventDefaultOnContextMenu(mouseEvent);
            }
        };

        //For some reason listening only to this.eBody doesnt work... Maybe because the event is consumed somewhere else?
        //In any case, not expending much time on this, if anyome comes accross this and knows how to make this work with
        //one listener please go ahead and change it...
        this.addDestroyableEventListener(this.eBodyViewport, 'contextmenu', listener);
        this.addDestroyableEventListener(this.eRightViewport, 'contextmenu', listener);
        this.addDestroyableEventListener(this.eLeftViewport, 'contextmenu', listener);
    }

    public getBodyClientRect(): ClientRect {
        if (this.eBody) {
            return this.eBody.getBoundingClientRect();
        }
    }

    private getRowForEvent(event: Event): RowComp {

        let sourceElement = _.getTarget(event);

        while (sourceElement) {

            let renderedRow = this.gridOptionsWrapper.getDomData(sourceElement, RowComp.DOM_DATA_KEY_RENDERED_ROW);
            if (renderedRow) {
                return renderedRow;
            }

            sourceElement = sourceElement.parentElement;
        }

        return null;
    }

    private processKeyboardEvent(eventName: string, keyboardEvent: KeyboardEvent): void {
        let renderedCell = this.mouseEventService.getRenderedCellForEvent(keyboardEvent);

        if (!renderedCell) { return; }

        switch (eventName) {
            case 'keydown':
                // first see if it's a scroll key, page up / down, home / end etc
                let wasScrollKey = this.navigationService.handlePageScrollingKey(keyboardEvent);

                // if not a scroll key, then we pass onto cell
                if (!wasScrollKey) {
                    renderedCell.onKeyDown(keyboardEvent);
                }

                break;
            case 'keypress':
                renderedCell.onKeyPress(keyboardEvent);
                break;
        }
    }

    // gets called by rowRenderer when new data loaded, as it will want to scroll
    // to the top
    public scrollToTop(): void {
       this.eBodyViewport.scrollTop = 0;
    }

    private processMouseEvent(eventName: string, mouseEvent: MouseEvent): void {
        if (!this.mouseEventService.isEventFromThisGrid(mouseEvent)) { return; }
        if (_.isStopPropagationForAgGrid(mouseEvent)) { return; }

        let rowComp = this.getRowForEvent(mouseEvent);
        let cellComp = this.mouseEventService.getRenderedCellForEvent(mouseEvent);

        if (eventName === "contextmenu") {
            this.handleContextMenuMouseEvent(mouseEvent, null, rowComp, cellComp);
        } else {
            if (cellComp) { cellComp.onMouseEvent(eventName, mouseEvent); }
            if (rowComp) { rowComp.onMouseEvent(eventName, mouseEvent); }
        }

        this.preventDefaultOnContextMenu(mouseEvent);
    }

    private mockContextMenuForIPad(): void {

        // we do NOT want this when not in ipad, otherwise we will be doing
        if (!_.isUserAgentIPad()) {return;}

        this.eAllCellContainers.forEach( container => {
            let touchListener = new TouchListener(container);
            let longTapListener = (event: LongTapEvent)=> {

                let rowComp = this.getRowForEvent(event.touchEvent);
                let cellComp = this.mouseEventService.getRenderedCellForEvent(event.touchEvent);

                this.handleContextMenuMouseEvent(null, event.touchEvent, rowComp, cellComp);
            };
            this.addDestroyableEventListener(touchListener, TouchListener.EVENT_LONG_TAP, longTapListener);
            this.addDestroyFunc( ()=> touchListener.destroy() );
        });

    }

    private handleContextMenuMouseEvent(mouseEvent: MouseEvent, touchEvent: TouchEvent, rowComp: RowComp, cellComp: CellComp) {
        let rowNode = rowComp ? rowComp.getRowNode() : null;
        let column = cellComp ? cellComp.getColumn() : null;
        let value = null;

        if (column) {
            let event = mouseEvent ? mouseEvent : touchEvent;
            cellComp.dispatchCellContextMenuEvent(event);
            value = this.valueService.getValue(column, rowNode);
        }

        this.onContextMenu(mouseEvent, touchEvent, rowNode, column, value);
    }

    private onContextMenu(mouseEvent: MouseEvent, touchEvent: TouchEvent, rowNode: RowNode, column: Column, value: any): void {

        // to allow us to debug in chrome, we ignore the event if ctrl is pressed.
        // not everyone wants this, so first 'if' below allows to turn this hack off.
        if (!this.gridOptionsWrapper.isAllowContextMenuWithControlKey()) {
            // then do the check
            if (mouseEvent && (mouseEvent.ctrlKey || mouseEvent.metaKey)) {
                return;
            }
        }

        if (this.contextMenuFactory && !this.gridOptionsWrapper.isSuppressContextMenu()) {
            let eventOrTouch: (MouseEvent | Touch) = mouseEvent ? mouseEvent : touchEvent.touches[0];
            this.contextMenuFactory.showMenu(rowNode, column, value, eventOrTouch);
            let event = mouseEvent ? mouseEvent : touchEvent;
            event.preventDefault();
        }
    }

    private preventDefaultOnContextMenu(mouseEvent: MouseEvent): void {
        // if we don't do this, then middle click will never result in a 'click' event, as 'mousedown'
        // will be consumed by the browser to mean 'scroll' (as you can scroll with the middle mouse
        // button in the browser). so this property allows the user to receive middle button clicks if
        // they want.
        if (this.gridOptionsWrapper.isSuppressMiddleClickScrolls() && mouseEvent.which === 2) {
            mouseEvent.preventDefault();
        }
    }

    private addShortcutKeyListeners(): void {
        this.eAllCellContainers.forEach( (container)=> {
            container.addEventListener('keydown', (event: KeyboardEvent)=> {

                // if the cell the event came from is editing, then we do not
                // want to do the default shortcut keys, otherwise the editor
                // (eg a text field) would not be able to do the normal cut/copy/paste
                let renderedCell = this.mouseEventService.getRenderedCellForEvent(event);
                if (renderedCell && renderedCell.isEditing()) {
                    return;
                }

                // for copy / paste, we don't want to execute when the event
                // was from a child grid (happens in master detail)
                if (!this.mouseEventService.isEventFromThisGrid(event)) {
                    return;
                }

                if (event.ctrlKey || event.metaKey) {
                    switch (event.which) {
                        case Constants.KEY_A: return this.onCtrlAndA(event);
                        case Constants.KEY_C: return this.onCtrlAndC(event);
                        case Constants.KEY_V: return this.onCtrlAndV(event);
                        case Constants.KEY_D: return this.onCtrlAndD(event);
                    }
                }
            });
        });
    }

    private onCtrlAndA(event: KeyboardEvent): boolean {
        if (this.rangeController && this.paginationProxy.isRowsToRender()) {
            let rowEnd: number;
            let floatingStart: string;
            let floatingEnd: string;

            if (this.pinnedRowModel.isEmpty(Constants.PINNED_TOP)) {
                floatingStart = null;
            } else {
                floatingStart = Constants.PINNED_TOP;
            }

            if (this.pinnedRowModel.isEmpty(Constants.PINNED_BOTTOM)) {
                floatingEnd = null;
                rowEnd = this.paginationProxy.getTotalRowCount() - 1;
            } else {
                floatingEnd = Constants.PINNED_BOTTOM;
                rowEnd = this.pinnedRowModel.getPinnedBottomRowData().length - 1;
            }

            let allDisplayedColumns = this.columnController.getAllDisplayedColumns();
            if (_.missingOrEmpty(allDisplayedColumns)) { return; }
            this.rangeController.setRange({
                rowStart: 0,
                floatingStart: floatingStart,
                rowEnd: rowEnd,
                floatingEnd: floatingEnd,
                columnStart: allDisplayedColumns[0],
                columnEnd: allDisplayedColumns[allDisplayedColumns.length-1]
            });
        }
        event.preventDefault();
        return false;
    }

    private onCtrlAndC(event: KeyboardEvent): boolean {
        if (!this.clipboardService) { return; }

        let focusedCell = this.focusedCellController.getFocusedCell();

        this.clipboardService.copyToClipboard();
        event.preventDefault();

        // the copy operation results in loosing focus on the cell,
        // because of the trickery the copy logic uses with a temporary
        // widget. so we set it back again.
        if (focusedCell) {
            this.focusedCellController.setFocusedCell(focusedCell.rowIndex, focusedCell.column, focusedCell.floating, true);
        }

        return false;
    }

    private onCtrlAndV(event: KeyboardEvent): boolean {
        if (!this.rangeController) { return; }

        this.clipboardService.pasteFromClipboard();
        return false;
    }

    private onCtrlAndD(event: KeyboardEvent): boolean {
        if (!this.clipboardService) { return; }
        this.clipboardService.copyRangeDown();
        event.preventDefault();
        return false;
    }

    // Valid values for position are bottom, middle and top
    // position should be {'top','middle','bottom', or undefined/null}.
    // if undefined/null, then the grid will to the minimal amount of scrolling,
    // eg if grid needs to scroll up, it scrolls until row is on top,
    //    if grid needs to scroll down, it scrolls until row is on bottom,
    //    if row is already in view, grid does not scroll
    public ensureIndexVisible(index: any, position?: string) {
        // if for print or auto height, everything is always visible
        if (this.gridOptionsWrapper.isAutoHeight()) { return; }

        let rowCount = this.paginationProxy.getTotalRowCount();
        if (typeof index !== 'number' || index < 0 || index >= rowCount) {
            console.warn('invalid row index for ensureIndexVisible: ' + index);
            return;
        }

        this.paginationProxy.goToPageWithIndex(index);

        let rowNode = this.paginationProxy.getRow(index);
        let paginationOffset = this.paginationProxy.getPixelOffset();
        let rowTopPixel = rowNode.rowTop - paginationOffset;
        let rowBottomPixel = rowTopPixel + rowNode.rowHeight;

        let scrollPosition = this.getVScrollPosition();
        let heightOffset = this.heightScaler.getOffset();

        let vScrollTop = scrollPosition.top + heightOffset;
        let vScrollBottom = scrollPosition.bottom + heightOffset;

        if (this.isHorizontalScrollShowing()) {
            vScrollBottom -= this.scrollWidth;
        }

        let viewportHeight = vScrollBottom - vScrollTop;

        let newScrollPosition: number = null;

        // work out the pixels for top, middle and bottom up front,
        // make the if/else below easier to read
        let pxTop = this.heightScaler.getScrollPositionForPixel(rowTopPixel);
        let pxBottom = this.heightScaler.getScrollPositionForPixel(rowBottomPixel - viewportHeight);
        let pxMiddle = (pxTop + pxBottom) / 2;

        // make sure if middle, the row is not outside the top of the grid
        if (pxMiddle > rowTopPixel) {
            pxMiddle = rowTopPixel;
        }

        let rowBelowViewport = vScrollTop > rowTopPixel;
        let rowAboveViewport = vScrollBottom < rowBottomPixel;

        if (position==='top') {
            newScrollPosition = pxTop;
        } else if (position==='bottom') {
            newScrollPosition = pxBottom;
        } else if (position==='middle') {
            newScrollPosition = pxMiddle;
        } else if (rowBelowViewport) {
            // if row is before, scroll up with row at top
            newScrollPosition = pxTop;
        } else if (rowAboveViewport) {
            // if row is below, scroll down with row at bottom
            newScrollPosition = pxBottom;
        }

        if (newScrollPosition!==null) {
            this.eBodyViewport.scrollTop = newScrollPosition;
            this.rowRenderer.redrawAfterScroll();
        }
    }

    // + moveColumnController
    public getCenterWidth(): number {
        return this.eBodyViewport.clientWidth;
    }

    public isHorizontalScrollShowing(): boolean {
        return _.isHorizontalScrollShowing(this.eBodyViewport);
    }

    private isVerticalScrollShowing(): boolean {
        return _.isVerticalScrollShowing(this.eBodyViewport);
    }

    // gets called every 500 ms. we use this to check visibility of scrollbars in the grid panel,
    // and also to check size and position of viewport for row and column virtualisation.
    public checkViewportSize(): void {

        // results in updating anything that depends on scroll showing
        this.updateScrollVisibleService();

        // fires event if height changes, used by PaginationService, HeightScalerService, RowRenderer
        this.checkBodyHeight();

        // check for virtual columns for ColumnController
        this.onHorizontalViewportChanged();
    }

    private updateScrollVisibleService(): void {

        let params: SetScrollsVisibleParams = {
            vBody: false,
            hBody: false,
            vLeft: false,
            vRight: false
        };

        if (this.enableRtl) {
            if (this.columnController.isPinningLeft()) {
                params.vLeft = _.isVerticalScrollShowing(this.eLeftViewport);
            } else {
                params.vBody = _.isVerticalScrollShowing(this.eBodyViewport);
            }
        } else {
            if (this.columnController.isPinningRight()) {
                params.vRight = _.isVerticalScrollShowing(this.eRightViewport);
            } else {
                params.vBody = _.isVerticalScrollShowing(this.eBodyViewport);
            }
        }

        params.hBody = this.isHorizontalScrollShowing();

        this.scrollVisibleService.setScrollsVisible(params);
    }

    // the pinned container needs extra space at the bottom, some blank space, otherwise when
    // vertically scrolled all the way down, the last row will be hidden behind the scrolls.
    // this extra padding allows the last row to be lifted above the bottom scrollbar.
    private setBottomPaddingOnPinned(): void {

        // no need for padding if the scrollbars are not taking up any space
        if (this.scrollWidth<=0) { return; }

        if (this.isHorizontalScrollShowing()) {
            this.eRightContainer.style.marginBottom = this.scrollWidth + 'px';
            this.eLeftContainer.style.marginBottom = this.scrollWidth + 'px';
        } else {
            this.eRightContainer.style.marginBottom = '';
            this.eLeftContainer.style.marginBottom = '';
        }
    }

    private hideFullWidthViewportScrollbars(): void {

        // if browser does not have scrollbars that take up space (eg iOS) then we don't need
        // to adjust the sizes of the container for scrollbars
        if (this.scrollWidth <= 0) { return; }

        let scrollWidthPx = this.scrollWidth > 0 ? this.scrollWidth + 'px' : '';

        // if horizontal scroll is showing, we add padding to bottom so
        // fullWidth container is not spreading over the scroll
        this.eFullWidthViewportWrapper.style.paddingBottom = this.isHorizontalScrollShowing() ? scrollWidthPx : '';

        // if vertical scroll is showing on full width viewport, then we clip it away, otherwise
        // it competes with the main vertical scroll. this is done by getting the viewport to be
        // bigger than the wrapper, the wrapper then ends up clipping the viewport.
        let takeOutVScroll = this.isVerticalScrollShowing();
        if (this.enableRtl) {
            this.eFullWidthViewportWrapper.style.marginLeft = takeOutVScroll ? scrollWidthPx : '';
            this.eFullWidthViewport.style.marginLeft = takeOutVScroll ? ('-' + scrollWidthPx) : '';
        } else {
            this.eFullWidthViewportWrapper.style.width = takeOutVScroll ? `calc(100% - ${scrollWidthPx})` : '';
            this.eFullWidthViewport.style.width = takeOutVScroll ? `calc(100% + ${scrollWidthPx})` : '';
        }
    }

    public ensureColumnVisible(key: any) {
        let column = this.columnController.getGridColumn(key);

        if (!column) { return; }

        if (column.isPinned()) {
            console.warn('calling ensureIndexVisible on a '+column.getPinned()+' pinned column doesn\'t make sense for column ' + column.getColId());
            return;
        }

        if (!this.columnController.isColumnDisplayed(column)) {
            console.warn('column is not currently visible');
            return;
        }

        let colLeftPixel = column.getLeft();
        let colRightPixel = colLeftPixel + column.getActualWidth();

        let viewportWidth = this.eBodyViewport.clientWidth;
        let scrollPosition = this.getBodyViewportScrollLeft();

        let bodyWidth = this.columnController.getBodyContainerWidth();

        let viewportLeftPixel: number;
        let viewportRightPixel: number;

        // the logic of working out left and right viewport px is both here and in the ColumnController,
        // need to refactor it out to one place
        if (this.enableRtl) {
            viewportLeftPixel = bodyWidth - scrollPosition - viewportWidth;
            viewportRightPixel = bodyWidth - scrollPosition;
        } else {
            viewportLeftPixel = scrollPosition;
            viewportRightPixel = viewportWidth + scrollPosition;
        }

        let viewportScrolledPastCol = viewportLeftPixel > colLeftPixel;
        let viewportScrolledBeforeCol = viewportRightPixel < colRightPixel;
        let colToSmallForViewport = viewportWidth < column.getActualWidth();

        let alignColToLeft = viewportScrolledPastCol || colToSmallForViewport;
        let alignColToRight = viewportScrolledBeforeCol;

        if (alignColToLeft) {
            // if viewport's left side is after col's left side, scroll left to pull col into viewport at left
            if (this.enableRtl) {
                let newScrollPosition = bodyWidth - viewportWidth - colLeftPixel;
                this.setBodyViewportScrollLeft(newScrollPosition);
            } else {
                this.setBodyViewportScrollLeft(colLeftPixel);
            }
        } else if (alignColToRight) {
            // if viewport's right side is before col's right side, scroll right to pull col into viewport at right
            if (this.enableRtl) {
                let newScrollPosition = bodyWidth - colRightPixel;
                this.setBodyViewportScrollLeft(newScrollPosition);
            } else {
                let newScrollPosition = colRightPixel - viewportWidth;
                this.setBodyViewportScrollLeft(newScrollPosition);
            }
        } else {
            // otherwise, col is already in view, so do nothing
        }

        // this will happen anyway, as the move will cause a 'scroll' event on the body, however
        // it is possible that the ensureColumnVisible method is called from within ag-Grid and
        // the caller will need to have the columns rendered to continue, which will be before
        // the event has been worked on (which is the case for cell navigation).
        this.onHorizontalViewportChanged();
    }

    public showLoadingOverlay() {
        this.overlayWrapper.showLoadingOverlay(this.eOverlay);
    }

    public showNoRowsOverlay() {
        this.overlayWrapper.showNoRowsOverlay(this.eOverlay);
    }

    public hideOverlay() {
        this.overlayWrapper.hideOverlay(this.eOverlay);
    }

    private getWidthForSizeColsToFit() {
        let availableWidth = this.eBody.clientWidth;
        // if pinning right, then the scroll bar can show, however for some reason
        // it overlays the grid and doesn't take space. so we are only interested
        // in the body scroll showing.
        let removeVerticalScrollWidth = this.isVerticalScrollShowing();
        if (removeVerticalScrollWidth) {
            availableWidth -= this.scrollWidth;
        }
        return availableWidth;
    }

    // method will call itself if no available width. this covers if the grid
    // isn't visible, but is just about to be visible.
    public sizeColumnsToFit(nextTimeout?: number) {
        let availableWidth = this.getWidthForSizeColsToFit();
        if (availableWidth>0) {
            this.columnController.sizeColumnsToFit(availableWidth, "sizeColumnsToFit");
        } else {
            if (nextTimeout===undefined) {
                setTimeout( ()=> {
                    this.sizeColumnsToFit(100);
                }, 0);
            } else if (nextTimeout===100) {
                setTimeout( ()=> {
                    this.sizeColumnsToFit(500);
                }, 100);
            } else if (nextTimeout===500) {
                setTimeout( ()=> {
                    this.sizeColumnsToFit(-1);
                }, 500);
            } else {
                console.log('ag-Grid: tried to call sizeColumnsToFit() but the grid is coming back with ' +
                    'zero width, maybe the grid is not visible yet on the screen?');
            }
        }
    }

    public getBodyContainer(): HTMLElement {
        return this.eBodyContainer;
    }

    public getDropTargetBodyContainers(): HTMLElement[] {
        return [this.eBodyContainer, this.eFloatingTopContainer, this.eFloatingBottomContainer];
    }

    public getBodyViewport() {
        return this.eBodyViewport;
    }

    public getDropTargetLeftContainers(): HTMLElement[] {
        return [this.eLeftViewport, this.eLeftFloatingBottom, this.eLeftFloatingTop];
    }

    public getDropTargetPinnedRightContainers(): HTMLElement[] {
        return [this.eRightViewport, this.eRightFloatingBottom, this.eRightFloatingTop];
    }

    public getHeaderContainer() {
        return this.eHeaderContainer;
    }

    public getPinnedLeftHeader() {
        return this.ePinnedLeftHeader;
    }

    public getPinnedRightHeader() {
        return this.ePinnedRightHeader;
    }

    private findElements() {

        this.eBody = this.queryForHtmlElement('.ag-body');
        this.eBodyContainer = this.queryForHtmlElement('.ag-body-container');
        this.eBodyViewport = this.queryForHtmlElement('.ag-body-viewport');
        this.eBodyViewportWrapper = this.queryForHtmlElement('.ag-body-viewport-wrapper');
        this.eFullWidthContainer = this.queryForHtmlElement('.ag-full-width-container');
        this.eFullWidthViewport = this.queryForHtmlElement('.ag-full-width-viewport');
        this.eFullWidthViewportWrapper = this.queryForHtmlElement('.ag-full-width-viewport-wrapper');
        this.eLeftContainer = this.queryForHtmlElement('.ag-pinned-left-cols-container');
        this.eRightContainer = this.queryForHtmlElement('.ag-pinned-right-cols-container');
        this.eLeftViewport = this.queryForHtmlElement('.ag-pinned-left-cols-viewport');
        this.eLeftViewportWrapper = this.queryForHtmlElement('.ag-pinned-left-cols-viewport-wrapper');
        this.eRightViewport = this.queryForHtmlElement('.ag-pinned-right-cols-viewport');
        this.eRightViewportWrapper = this.queryForHtmlElement('.ag-pinned-right-cols-viewport-wrapper');
        this.ePinnedLeftHeader = this.queryForHtmlElement('.ag-pinned-left-header');
        this.ePinnedRightHeader = this.queryForHtmlElement('.ag-pinned-right-header');
        this.eHeader = this.queryForHtmlElement('.ag-header');
        this.eHeaderContainer = this.queryForHtmlElement('.ag-header-container');
        this.eHeaderViewport = this.queryForHtmlElement('.ag-header-viewport');

        this.eFloatingTop = this.queryForHtmlElement('.ag-floating-top');
        this.eLeftFloatingTop = this.queryForHtmlElement('.ag-pinned-left-floating-top');
        this.eRightFloatingTop = this.queryForHtmlElement('.ag-pinned-right-floating-top');
        this.eFloatingTopContainer = this.queryForHtmlElement('.ag-floating-top-container');
        this.eFloatingTopViewport = this.queryForHtmlElement('.ag-floating-top-viewport');
        this.eFloatingTopFullWidthContainer = this.queryForHtmlElement('.ag-floating-top-full-width-container');

        this.eFloatingBottom = this.queryForHtmlElement('.ag-floating-bottom');
        this.eLeftFloatingBottom = this.queryForHtmlElement('.ag-pinned-left-floating-bottom');
        this.eRightFloatingBottom = this.queryForHtmlElement('.ag-pinned-right-floating-bottom');
        this.eFloatingBottomContainer = this.queryForHtmlElement('.ag-floating-bottom-container');
        this.eFloatingBottomViewport = this.queryForHtmlElement('.ag-floating-bottom-viewport');
        this.eFloatingBottomFullWidthContainer = this.queryForHtmlElement('.ag-floating-bottom-full-width-container');

        this.eAllCellContainers = [
            this.eLeftContainer, this.eRightContainer, this.eBodyContainer,
            this.eFloatingTop, this.eFloatingBottom, this.eFullWidthContainer];

        this.rowContainerComponents = {
            body: new RowContainerComponent({eContainer: this.eBodyContainer, eViewport: this.eBodyViewport}),
            fullWidth: new RowContainerComponent({eContainer: this.eFullWidthContainer, hideWhenNoChildren: true, eViewport: this.eFullWidthViewport}),
            pinnedLeft: new RowContainerComponent({eContainer: this.eLeftContainer, eViewport: this.eLeftViewport}),
            pinnedRight: new RowContainerComponent({eContainer: this.eRightContainer, eViewport: this.eRightViewport}),

            floatingTop: new RowContainerComponent({eContainer: this.eFloatingTopContainer}),
            floatingTopPinnedLeft: new RowContainerComponent({eContainer: this.eLeftFloatingTop}),
            floatingTopPinnedRight: new RowContainerComponent({eContainer: this.eRightFloatingTop}),
            floatingTopFullWidth: new RowContainerComponent({eContainer: this.eFloatingTopFullWidthContainer, hideWhenNoChildren: true}),

            floatingBottom: new RowContainerComponent({eContainer: this.eFloatingBottomContainer}),
            floatingBottomPinnedLeft: new RowContainerComponent({eContainer: this.eLeftFloatingBottom}),
            floatingBottomPinnedRight: new RowContainerComponent({eContainer: this.eRightFloatingBottom}),
            floatingBottomFullWith: new RowContainerComponent({eContainer: this.eFloatingBottomFullWidthContainer, hideWhenNoChildren: true}),
        };

        this.suppressScrollOnFloatingRow();
        this.setupRowAnimationCssClass();

        _.iterateObject(this.rowContainerComponents, (key: string, container: RowContainerComponent)=> {
            if (container) {
                this.context.wireBean(container);
            }
        });
    }

    private setupRowAnimationCssClass(): void {

        let listener = () => {
            // we don't want to use row animation if scaling, as rows jump strangely as you scroll,
            // when scaling and doing row animation.
            let animateRows = this.gridOptionsWrapper.isAnimateRows() && !this.heightScaler.isScaling();
            _.addOrRemoveCssClass(this.eBody, 'ag-row-animation', animateRows);
            _.addOrRemoveCssClass(this.eBody, 'ag-row-no-animation', !animateRows);
        };

        listener();

        this.addDestroyableEventListener(this.eventService, Events.EVENT_HEIGHT_SCALE_CHANGED, listener);
    }

    // when editing a pinned row, if the cell is half outside the scrollable area, the browser can
    // scroll the column into view. we do not want this, the pinned sections should never scroll.
    // so we listen to scrolls on these containers and reset the scroll if we find one.
    private suppressScrollOnFloatingRow(): void {
        let resetTopScroll = () => this.eFloatingTopViewport.scrollLeft = 0;
        let resetBottomScroll = () => this.eFloatingTopViewport.scrollLeft = 0;

        this.addDestroyableEventListener(this.eFloatingTopViewport, 'scroll', resetTopScroll);
        this.addDestroyableEventListener(this.eFloatingBottomViewport, 'scroll', resetBottomScroll);
    }

    public getRowContainers(): RowContainerComponents {
        return this.rowContainerComponents;
    }

    public getHeaderViewport(): HTMLElement {
        return this.eHeaderViewport;
    }

    public onDisplayedColumnsChanged(): void {
        this.setPinnedContainersVisible();
        this.setBodyAndHeaderHeights();
        this.onHorizontalViewportChanged();
    }

    private onDisplayedColumnsWidthChanged(): void {
        this.setWidthsOfContainers();
        this.onHorizontalViewportChanged();
        if (this.enableRtl) {
            // because RTL is all backwards, a change in the width of the row
            // can cause a change in the scroll position, without a scroll event,
            // because the scroll position in RTL is a function that depends on
            // the width. to be convinced of this, take out this line, enable RTL,
            // scroll all the way to the left and then resize a column
            this.horizontallyScrollHeaderCenterAndFloatingCenter();
        }
    }

    private onScrollVisibilityChanged(): void {
        this.setPinnedLeftWidth();
        this.setPinnedRightWidth();
        this.setBottomPaddingOnPinned();
        this.hideVerticalScrollOnCenter();
        this.hideFullWidthViewportScrollbars();
    }

    private setWidthsOfContainers(): void {
        this.setCenterWidth();
        this.setPinnedLeftWidth();
        this.setPinnedRightWidth();
    }

    private setCenterWidth(): void {
        let widthPx = this.columnController.getBodyContainerWidth() + 'px';
        this.eBodyContainer.style.width = widthPx;
        this.eFloatingBottomContainer.style.width = widthPx;
        this.eFloatingTopContainer.style.width = widthPx;
    }

    private setPinnedLeftWidth(): void {

        let widthOfCols = this.columnController.getPinnedLeftContainerWidth();
        let widthOfColsAndScroll = widthOfCols + this.scrollWidth;

        let viewportWidth: number;
        let wrapperWidth: number;

        if (_.isVerticalScrollShowing(this.eLeftViewport)) {
            if (this.enableRtl) {
                // show the scroll
                viewportWidth = widthOfColsAndScroll;
                wrapperWidth = widthOfColsAndScroll;
            } else {
                // hide the scroll
                viewportWidth = widthOfColsAndScroll;
                wrapperWidth = widthOfCols;
            }
        } else {
            // no scroll
            viewportWidth = widthOfCols;
            wrapperWidth = widthOfCols;
        }

        this.setElementWidth(this.eLeftViewportWrapper, wrapperWidth);
        this.setElementWidth(this.eLeftViewport, viewportWidth);
        this.setElementWidth(this.eLeftContainer, widthOfCols);

        this.setElementWidth(this.eLeftFloatingBottom, wrapperWidth);
        this.setElementWidth(this.eLeftFloatingTop, wrapperWidth);
    }

    private setPinnedRightWidth(): void {

        let pinnedRightWidth = this.columnController.getPinnedRightContainerWidth();
        let pinnedRightWidthWithScroll = pinnedRightWidth + this.scrollWidth;

        let viewportWidth: number;
        let wrapperWidth: number;

        if (_.isVerticalScrollShowing(this.eRightViewport)) {
            if (!this.enableRtl) {
                // show the scroll
                viewportWidth = pinnedRightWidthWithScroll;
                wrapperWidth = pinnedRightWidthWithScroll;
            } else {
                // hide the scroll
                viewportWidth = pinnedRightWidthWithScroll;
                wrapperWidth = pinnedRightWidth;
            }
        } else {
            // no scroll
            viewportWidth = pinnedRightWidth;
            wrapperWidth = pinnedRightWidth;
        }

        this.setElementWidth(this.eRightViewportWrapper, wrapperWidth);
        this.setElementWidth(this.eRightViewport, viewportWidth);
        this.setElementWidth(this.eRightContainer, pinnedRightWidth);

        this.setElementWidth(this.eRightFloatingBottom, wrapperWidth);
        this.setElementWidth(this.eRightFloatingTop, wrapperWidth);
    }

    private setElementWidth(element: HTMLElement, width: number): void {
        // .width didn't do the trick in firefox, so needed .minWidth also
        element.style.width = width + 'px';
        element.style.minWidth = width + 'px';
    }

    private setPinnedContainersVisible() {

        let changeDetected = false;

        let showLeftPinned = this.columnController.isPinningLeft();
        if (showLeftPinned !== this.pinningLeft) {
            this.pinningLeft = showLeftPinned;
            _.setVisible(this.ePinnedLeftHeader, showLeftPinned);
            _.setVisible(this.eLeftViewportWrapper, showLeftPinned);
            changeDetected = true;
            if (showLeftPinned) {
                // because the viewport was not visible, it was not keeping previous scrollTop values
                this.eLeftViewport.scrollTop = this.eBodyViewport.scrollTop;
            }
        }

        let showRightPinned = this.columnController.isPinningRight();
        if (showRightPinned !== this.pinningRight) {
            this.pinningRight = showRightPinned;
            _.setVisible(this.ePinnedRightHeader, showRightPinned);
            _.setVisible(this.eRightViewportWrapper, showRightPinned);
            if (showRightPinned) {
                // because the viewport was not visible, it was not keeping previous scrollTop values
                this.eRightViewport.scrollTop = this.eBodyViewport.scrollTop;
            }
            changeDetected = true;
        }

        if (changeDetected) {
            this.hideVerticalScrollOnCenter();
            this.setPinnedLeftWidth();
            this.setPinnedRightWidth();
        }
    }

    private hideVerticalScrollOnCenter(): void {

        let neverShowScroll = this.enableRtl ?
            this.columnController.isPinningLeft()
            : this.columnController.isPinningRight();

        let scrollActive = _.isVerticalScrollShowing(this.eBodyViewport);

        let hideScroll = neverShowScroll && scrollActive;

        let margin = hideScroll ? '-' + this.scrollWidth + 'px' : '';

        if (this.enableRtl) {
            this.eBodyViewport.style.marginLeft = margin;
        } else {
            this.eBodyViewport.style.marginRight = margin;
        }
    }

    private checkBodyHeight(): void {
        let bodyHeight = this.eBody.clientHeight;
        if (this.bodyHeight !== bodyHeight) {
            this.bodyHeight = bodyHeight;
            let event: BodyHeightChangedEvent = {
                type: Events.EVENT_BODY_HEIGHT_CHANGED,
                api: this.gridApi,
                columnApi: this.columnApi
            };
            this.eventService.dispatchEvent(event);
        }
    }

    public setBodyAndHeaderHeights(): void {

        let headerRowCount = this.columnController.getHeaderRowCount();

        let totalHeaderHeight: number;
        let numberOfFloating = 0;
        let groupHeight: number;
        let headerHeight: number;
        if (!this.columnController.isPivotMode()) {
            _.removeCssClass(this.eHeader, 'ag-pivot-on');
            _.addCssClass(this.eHeader, 'ag-pivot-off');
            if (this.gridOptionsWrapper.isFloatingFilter()) {
                headerRowCount ++;
            }
            numberOfFloating = (this.gridOptionsWrapper.isFloatingFilter()) ? 1 : 0;
            groupHeight = this.gridOptionsWrapper.getGroupHeaderHeight();
            headerHeight = this.gridOptionsWrapper.getHeaderHeight();
        } else {
            _.removeCssClass(this.eHeader, 'ag-pivot-off');
            _.addCssClass(this.eHeader, 'ag-pivot-on');
            numberOfFloating = 0;
            groupHeight = this.gridOptionsWrapper.getPivotGroupHeaderHeight();
            headerHeight = this.gridOptionsWrapper.getPivotHeaderHeight();
        }
        let numberOfNonGroups = 1 + numberOfFloating;
        let numberOfGroups = headerRowCount - numberOfNonGroups;

        totalHeaderHeight = numberOfFloating * this.gridOptionsWrapper.getFloatingFiltersHeight();
        totalHeaderHeight += numberOfGroups * groupHeight;
        totalHeaderHeight += headerHeight;

        this.eHeader.style.height = totalHeaderHeight + 'px';
        this.eHeader.style.minHeight = totalHeaderHeight + 'px';

        // if we are doing auto-height, we only size the header, we don't size the
        // other parts as we use the normal browser layout for that
        if (this.autoHeight) {
            return;
        }

        let floatingTopHeight = this.pinnedRowModel.getPinnedTopTotalHeight();
        let floatingBottomHeight = this.pinnedRowModel.getPinnedBottomTotalHeight();

        this.eFloatingTop.style.minHeight = floatingTopHeight + 'px';
        this.eFloatingTop.style.height = floatingTopHeight + 'px';
        this.eFloatingBottom.style.minHeight = floatingBottomHeight + 'px';
        this.eFloatingBottom.style.height = floatingBottomHeight + 'px';

        this.checkBodyHeight();
    }

    public getBodyHeight(): number {
        return this.bodyHeight;
    }

    public setHorizontalScrollPosition(hScrollPosition: number): void {
        this.eBodyViewport.scrollLeft = hScrollPosition;

        // we need to manually do the event handling (rather than wait for the event)
        // for the alignedGridsService, as if we don't, the aligned grid service gets
        // notified async, and then it's 'consuming' flag doesn't get used right, and
        // we can end up with an infinite loop
        if (this.nextScrollLeft !== hScrollPosition) {
            this.nextScrollLeft = hScrollPosition;
            this.doHorizontalScroll();
        }
    }

    public setVerticalScrollPosition(vScrollPosition: number): void {
        this.eBodyViewport.scrollTop = vScrollPosition;
    }

    // tries to scroll by pixels, but returns what the result actually was
    public scrollHorizontally(pixels: number): number {
        let oldScrollPosition = this.eBodyViewport.scrollLeft;
        this.setHorizontalScrollPosition(oldScrollPosition + pixels);
        let newScrollPosition = this.eBodyViewport.scrollLeft;
        return newScrollPosition - oldScrollPosition;
    }

    // tries to scroll by pixels, but returns what the result actually was
    public scrollVertically(pixels: number): number {
        let oldScrollPosition = this.eBodyViewport.scrollTop;
        this.setVerticalScrollPosition(oldScrollPosition + pixels);
        let newScrollPosition = this.eBodyViewport.scrollTop;
        return newScrollPosition - oldScrollPosition;
    }

    // if the user is in floating filter and hits tab a few times, the header can
    // end up scrolling to show items off the screen, leaving the grid and header
    // and the grid columns no longer in sync.
    private addPreventHeaderScroll() {
        this.addDestroyableEventListener(this.eHeaderViewport, 'scroll', ()=> {
            // if the header scrolls, the header will be out of sync. so we reset the
            // header scroll, and then scroll the body, which will in turn set the offset
            // on the header, giving the impression that the header scrolled as expected.
            let scrollLeft = this.eHeaderViewport.scrollLeft;
            if (scrollLeft!==0) {
                this.scrollHorizontally(scrollLeft);
                this.eHeaderViewport.scrollLeft = 0;
            }
        });

    }

    private addScrollListener() {
        this.addDestroyableEventListener(this.eBodyViewport, 'scroll', ()=> {
            this.onBodyHorizontalScroll();
            this.onAnyBodyScroll(this.eBodyViewport);
        });

        this.addDestroyableEventListener(this.eRightViewport, 'scroll',
            this.onAnyBodyScroll.bind(this, this.eRightViewport));
        this.addDestroyableEventListener(this.eLeftViewport, 'scroll',
            this.onAnyBodyScroll.bind(this, this.eLeftViewport));
        this.addDestroyableEventListener(this.eFullWidthViewport, 'scroll',
            this.onAnyBodyScroll.bind(this, this.eFullWidthViewport));
    }

    private onAnyBodyScroll(source: HTMLElement): void {

        let now = new Date().getTime();
        let diff = now - this.lastVScrollTime;
        let elementIsNotControllingTheScroll = source!==this.lastVScrollElement && diff < 100;
        if (elementIsNotControllingTheScroll) { return; }

        this.lastVScrollElement = source;
        this.lastVScrollTime = now;

        let scrollTop: number = source.scrollTop;

        if (this.useAnimationFrame) {
            if (this.nextScrollTop !== scrollTop) {
                this.nextScrollTop = scrollTop;
                this.animationFrameService.schedule();
            }
        } else {
            if (scrollTop !== this.scrollTop) {
                this.scrollTop = scrollTop;
                this.synchroniseVerticalScrollPositions(scrollTop);
                this.redrawRowsAfterScroll();
            }
        }

    }

    private onBodyHorizontalScroll(): void {

        let scrollLeft = this.eBodyViewport.scrollLeft;

        if (this.nextScrollLeft !== scrollLeft) {
            this.nextScrollLeft = scrollLeft;
            if (this.useAnimationFrame) {
                this.animationFrameService.schedule();
            } else {
                this.doHorizontalScroll();
            }
        }
    }

    private doHorizontalScroll(): void {
        this.scrollLeft = this.nextScrollLeft;
        let event: BodyScrollEvent = {
            type: Events.EVENT_BODY_SCROLL,
            api: this.gridApi,
            columnApi: this.columnApi,
            direction: 'horizontal',
            left: this.scrollLeft,
            top: this.scrollTop
        };
        this.eventService.dispatchEvent(event);
        this.horizontallyScrollHeaderCenterAndFloatingCenter();
        this.onHorizontalViewportChanged();
    }

    public executeFrame(): boolean {
        if (this.scrollLeft !== this.nextScrollLeft) {
            this.doHorizontalScroll();
            return true;
        } else if (this.scrollTop !== this.nextScrollTop) {
            this.scrollTop = this.nextScrollTop;
            this.synchroniseVerticalScrollPositions(this.scrollTop);
            this.verticalRedrawNeeded = true;
            return true;
        } else if (this.verticalRedrawNeeded) {
            this.redrawRowsAfterScroll();
            this.verticalRedrawNeeded = false;
            return true;
        } else {
            return false;
        }
    }

    private redrawRowsAfterScroll(): void {
        let event: BodyScrollEvent = {
            type: Events.EVENT_BODY_SCROLL,
            direction: 'vertical',
            api: this.gridApi,
            columnApi: this.columnApi,
            left: this.scrollLeft,
            top: this.scrollTop
        };
        this.eventService.dispatchEvent(event);
    }

    // this gets called whenever a change in the viewport, so we can inform column controller it has to work
    // out the virtual columns again. gets called from following locations:
    // + ensureColVisible, scroll, init, layoutChanged, displayedColumnsChanged, API (doLayout)
    private onHorizontalViewportChanged(): void {
        let scrollWidth = this.eBodyViewport.clientWidth;
        let scrollPosition = this.getBodyViewportScrollLeft();
        this.columnController.setVirtualViewportPosition(scrollWidth, scrollPosition);
    }

    public getBodyViewportScrollLeft(): number {
        // we defer to a util, as how you calculated scrollLeft when doing RTL depends on the browser
        return _.getScrollLeft(this.eBodyViewport, this.enableRtl);
    }

    public setBodyViewportScrollLeft(value: number): void {
        // we defer to a util, as how you calculated scrollLeft when doing RTL depends on the browser
        _.setScrollLeft(this.eBodyViewport, value, this.enableRtl);
    }

    public horizontallyScrollHeaderCenterAndFloatingCenter(): void {
        let scrollLeft = this.getBodyViewportScrollLeft();
        let offset = this.enableRtl ? scrollLeft : -scrollLeft;

        this.eHeaderContainer.style.left = offset + 'px';
        this.eFloatingBottomContainer.style.left = offset + 'px';
        this.eFloatingTopContainer.style.left = offset + 'px';
    }

    private synchroniseVerticalScrollPositions(position: number): void {

        if (this.lastVScrollElement !== this.eBodyViewport) {
            this.eBodyViewport.scrollTop = position;
        }

        if (this.lastVScrollElement !== this.eLeftViewport && this.pinningLeft) {
            this.eLeftViewport.scrollTop = position;
        }

        if (this.lastVScrollElement !== this.eRightViewport && this.pinningRight) {
            this.eRightViewport.scrollTop = position;
        }

        if (this.lastVScrollElement !== this.eFullWidthViewport) {
            this.eFullWidthViewport.scrollTop = position;
        }

        this.redrawRowsAfterScroll();
    }

    public addScrollEventListener(listener: ()=>void): void {
        this.eBodyViewport.addEventListener('scroll', listener);
    }

    public removeScrollEventListener(listener: ()=>void): void {
        this.eBodyViewport.removeEventListener('scroll', listener);
    }
}
