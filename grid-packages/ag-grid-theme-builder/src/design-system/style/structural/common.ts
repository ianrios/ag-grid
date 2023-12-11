// import {
//   absolute,
//   auto,
//   block,
//   bold,
//   center,
//   column,
//   flex,
//   flexEnd,
//   flexStart,
//   hidden,
//   inlineBlock,
//   inlineFlex,
//   literal,
//   none,
//   normal,
//   nowrap,
//   one,
//   percent,
//   px,
//   relative,
//   rem,
//   row,
//   rowReverse,
//   rules,
//   scroll,
//   seconds,
//   selectors,
//   spaceBetween,
//   sticky,
//   stretch,
//   table,
//   tableCell,
//   tableRow,
//   text,
//   unitless,
//   untypedSelectors,
//   visible,
//   wrap,
//   zero,
// } from 'design-system/css-in-js';

// export default rules({
//   // /**
//   //  ****************************
//   //  * Generic Styles
//   //    ****************************
//   // */

//   // if we don't do this, then the width and height of the grid would be
//   // ignored, as there is no default display for the these custom elements
//   [untypedSelectors('ag-grid', 'ag-grid-angular')]: {
//     display: block,
//   },

//   hidden: {
//     display: none.important,
//   },

//   invisible: {
//     visibility: hidden.important,
//   },

//   noTransition: {
//     transition: literal('none'),
//   },

//   dragHandle: {
//     cursor: literal('grab'),
//   },

//   columnDropWrapper: {
//     display: flex,
//   },

//   columnDropHorizontalHalfWidth: {
//     display: inlineBlock,
//     width: percent(50).important,
//   },

//   unselectable: {
//     userSelect: none,
//   },

//   selectable: {
//     userSelect: text,
//   },

//   tab: {
//     position: relative,
//   },

//   tabGuard: {
//     position: absolute,
//     width: zero,
//     height: zero,
//     display: block,
//   },

//   selectAggFuncPopup: {
//     position: absolute,
//   },

//   [selectors('inputWrapper', 'pickerFieldWrapper')]: {
//     display: flex,
//     flex: [one, one, auto],
//     alignItems: center,
//     lineHeight: normal,
//     position: relative,
//   },

//   // setting shake class to an item will give it a left ot right animation
//   // used for the 'left' and 'right' arrows when dragging columns and scrolling
//   shakeLeftToRight: {
//     animationDirection: literal('alternate'),
//     animationDuration: seconds(0.2),
//     animationIterationCount: literal('infinite'),
//     animationName: literal('ag-shake-left-to-right'),
//   },

//   '@keyframes': {
//     id: 'ag-shake-left-to-right',

//     from: {
//       paddingAlwaysLeft: px(6),
//       paddingAlwaysRight: px(2),
//     },

//     to: {
//       paddingAlwaysLeft: px(2),
//       paddingAlwaysRight: px(6),
//     },
//   },

//   rootWrapper: {
//     cursor: literal('default'),
//     position: relative, // set to relative, so absolute popups appear relative to this
//     display: flex,
//     flexDirection: column,
//     overflow: hidden,
//     whiteSpace: normal,

//     '&layoutNormal': {
//       height: percent(100),
//     },
//   },

//   watermark: {
//     position: absolute,
//     bottom: px(20),
//     alwaysRight: px(25),
//     opacity: unitless(0.5),
//     transition: literal('opacity 1s ease-out 3s'),
//     '&::before': {
//       content: literal("''"),
//       backgroundImage: literal(
//         'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbDpzcGFjZT0icHJlc2VydmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLW1pdGVybGltaXQ9IjIiIGNsaXAtcnVsZT0iZXZlbm9kZCIgdmlld0JveD0iMCAwIDIzNSA0MCI+PGcgZmlsbD0iIzE4MWQxZiI+PHBhdGggZmlsbC1ydWxlPSJub256ZXJvIiBkPSJNMjA2IDI1Ljd2LThoLTEzLjVsLTggOEgyMDZaTTIyMS4zIDZoLTE3bC04IDcuOWgyNXYtOFpNMTc2LjYgMzMuNmw0LTRoMTMuOHY3LjloLTE3Ljh2LTMuOVoiLz48cGF0aCBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0xNzkuNiAyMS44aDguOGw4LThoLTE2Ljh2OFpNMTcwIDMzLjZoNi42bDgtOEgxNzB2OFpNMjA0LjMgNmwtNCA0aC0yNlYyaDMwdjRaTTMzLjggMzIuMkgyMS40bC0yLjIgNS4zaC01LjRsMTEuNS0yN0gzMGwxMS41IDI3SDM2bC0yLjItNS4zWk0zMi4xIDI4bC00LjUtMTEtNC41IDExaDlaTTExNy40IDIwLjVjMS42LTIuMyA1LjYtMi42IDcuMy0yLjZ2NC42Yy0yIDAtNCAwLTUuMyAxYTQuMyA0LjMgMCAwIDAtMS44IDMuNXYxMC41aC01VjE4aDQuOHYyLjZaIi8+PHBhdGggZD0iTTEyNy40IDE3LjloNXYxOS42aC01ek0xMjcuNCA5LjFoNVYxNWgtNXoiLz48cGF0aCBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0xNTcgOS4xdjI4LjRoLTQuOGwtLjEtM2MtLjcgMS0xLjYgMS45LTIuNyAyLjUtMSAuNi0yLjQgMS00IDEtMS4zIDAtMi41LS4zLTMuNi0uOGE4LjkgOC45IDAgMCAxLTUtNS4yIDEyLjYgMTIuNiAwIDAgMSAwLTguMyA5IDkgMCAwIDEgOC42LTYuMWMxLjYgMCAyLjkuMiA0IC44YTcgNyAwIDAgMSAyLjYgMi40VjkuMmg1Wm0tMTAuNCAyNC42YzEuNiAwIDIuOS0uNiAzLjktMS43YTYgNiAwIDAgMCAxLjUtNC4zYzAtMS44LS41LTMuMi0xLjUtNC4zLTEtMS4xLTIuMy0xLjctNC0xLjdhNSA1IDAgMCAwLTMuOCAxLjcgNiA2IDAgMCAwLTEuNiA0LjMgNiA2IDAgMCAwIDEuNiA0LjMgNSA1IDAgMCAwIDMuOSAxLjdNNzAuMiAyMi40SDU3Ljl2NC4yaDdjLS4yIDIuMi0xIDMuOC0yLjQgNS4yYTcuNyA3LjcgMCAwIDEtNS41IDEuOWMtMS4yIDAtMi40LS4zLTMuNS0uNy0xLS41LTItMS4xLTIuNy0yYTkgOSAwIDAgMS0xLjgtM2MtLjQtMS4zLS42LTIuNS0uNi00cy4yLTIuNy42LTRhOC42IDguNiAwIDAgMSA0LjUtNWMxLjEtLjQgMi4zLS43IDMuNi0uNyAyLjcgMCA0LjcuNyA2LjEgMmwzLjMtMy40QzY0IDExIDYxIDEwIDU3LjEgMTBjLTIgMC00IC4zLTUuNyAxYTEyIDEyIDAgMCAwLTcuMiA3LjIgMTYuMyAxNi4zIDAgMCAwIDAgMTEuMyAxMiAxMiAwIDAgMCA3LjIgNy4yYzEuOC43IDMuNyAxIDUuNyAxczMuOS0uMyA1LjUtMWMxLjctLjcgMy0xLjYgNC4yLTIuOCAxLjItMS4yIDItMi42IDIuNy00LjQuNi0xLjcgMS0zLjYgMS01LjZWMjNjLS4yLS4yLS4zLS41LS4zLS43TTEwOSAyMi40SDk2Ljd2NC4yaDdjLS4yIDIuMi0xIDMuOC0yLjQgNS4yYTcuNyA3LjcgMCAwIDEtNS41IDEuOWMtMS4yIDAtMi41LS4zLTMuNS0uNy0xLS41LTItMS4xLTIuNy0yYTkgOSAwIDAgMS0xLjgtM2MtLjQtMS4zLS42LTIuNS0uNi00cy4yLTIuNy42LTRhOC42IDguNiAwIDAgMSA0LjUtNWMxLjEtLjQgMi4zLS43IDMuNi0uNyAyLjcgMCA0LjcuNyA2IDJsMy40LTMuNGMtMi41LTEuOS01LjctMi45LTkuNC0yLjktMi4xIDAtNCAuMy01LjcgMWExMiAxMiAwIDAgMC03LjIgNy4yIDE2LjMgMTYuMyAwIDAgMCAwIDExLjMgMTIgMTIgMCAwIDAgNy4yIDcuMmMxLjcuNyAzLjcgMSA1LjcgMXMzLjktLjMgNS41LTFjMS43LS43IDMtMS42IDQuMi0yLjggMS4yLTEuMiAyLTIuNiAyLjctNC40LjYtMS43IDEtMy42IDEtNS42VjIzYy0uMy0uMi0uMy0uNS0uMy0uNyIvPjwvZz48L3N2Zz4=)',
//       ),
//       backgroundRepeat: literal('no-repeat'),
//       backgroundSize: [px(170), px(40)],
//       display: block,
//       height: px(40),
//       width: px(170),
//       opacity: unitless(0.5),
//     },
//   },

//   watermarkText: {
//     opacity: unitless(0.5),
//     fontWeight: bold,
//     fontFamily: literal('Impact, sans-serif'),
//     fontSize: px(19),
//     padding: [zero, px(11)],
//   },

//   rootWrapperBody: {
//     display: flex,
//     flexDirection: row,

//     '&layoutNormal': {
//       flex: [one, one, auto],
//       height: zero,
//       minHeight: zero,
//     },
//   },

//   root: {
//     position: relative, // set to relative, so absolute popups appear relative to this
//     display: flex,
//     flexDirection: column,

//     [selectors('&layoutNormal', '&layoutAutoHeight')]: {
//       overflow: hidden, // was getting some 'shouldn't be there' scrolls, this sorts it out
//       flex: [one, one, auto],
//       width: zero,
//     },

//     '&layoutNormal': {
//       height: percent(100),
//     },
//   },

//   // /**
//   //  ****************************
//   //  * Viewports
//   //  ****************************
//   // */
//   [selectors(
//     'headerViewport',
//     'floatingTopViewport',
//     'bodyViewport',
//     'centerColsViewport',
//     'floatingBottomViewport',
//     'bodyHorizontalScrollViewport',
//     'bodyVerticalScrollViewport',
//     'virtualListViewport',
//     'stickyTopViewport',
//   )]: {
//     position: relative,
//     height: percent(100),
//     minWidth: px(0),
//     overflow: hidden,
//     flex: [one, one, auto],
//   },

//   [selectors('bodyViewport', 'centerColsViewport')]: {
//     '&::-webkit-scrollbar': {
//       display: none,
//     },
//     msOverflowStyle: none,
//     scrollbarWidth: none,
//   },

//   bodyViewport: {
//     display: flex,

//     '&layoutNormal': {
//       overflowY: auto,
//       WebkitOverflowScrolling: literal('touch'),
//     },
//   },

//   centerColsViewport: {
//     minHeight: percent(100),
//     width: percent(100),
//     overflowX: auto,
//   },

//   bodyHorizontalScrollViewport: {
//     overflowX: scroll,
//   },

//   bodyVerticalScrollViewport: {
//     overflowY: scroll,
//   },

//   virtualListViewport: {
//     overflow: auto,
//     width: percent(100),
//   },

//   // /**
//   //  ****************************
//   //  * Containers
//   //  ****************************
//   // */
//   [selectors(
//     'headerContainer',
//     'floatingTopContainer',
//     'pinnedRightColsContainer',
//     'centerColsContainer',
//     'pinnedLeftColsContainer',
//     'floatingBottomContainer',
//     'bodyHorizontalScrollContainer',
//     'bodyVerticalScrollContainer',
//     'fullWidthContainer',
//     'floatingBottomFullWidthContainer',
//     'virtualListContainer',
//     'stickyTopContainer',
//   )]: {
//     position: relative,
//   },

//   // for when auto height is used but there is no row data
//   [selectors(
//     'headerContainer',
//     'floatingTopContainer',
//     'floatingBottomContainer',
//     'stickyTopContainer',
//   )]: {
//     height: percent(100),
//     whiteSpace: nowrap,
//   },

//   centerColsContainer: {
//     display: block,
//   },

//   pinnedRightColsContainer: {
//     display: block,
//   },

//   bodyHorizontalScrollContainer: {
//     height: percent(100),
//   },

//   bodyVerticalScrollContainer: {
//     width: percent(100),
//   },

//   [selectors(
//     'fullWidthContainer',
//     'floatingTopFullWidthContainer',
//     'floatingBottomFullWidthContainer',
//     'stickyTopFullWidthContainer',
//   )]: {
//     position: absolute,
//     top: px(0),
//     leading: zero,
//     // turn off pointer events, because this container overlays the main row containers.
//     // so when user clicks on space between full width rows, we want the mouse clicks to
//     // pass onto the underlying container where the real rows are. eg if using full width
//     // for row grouping, the groups will be in the full width container, but when user
//     // opens a group the children are shown in the other containers - we want to make sure we
//     // don't block mouse clicks to those other containers with the children.
//     pointerEvents: literal('none'),
//   },

//   fullWidthContainer: {
//     width: percent(100),
//   },

//   [selectors('floatingBottomFullWidthContainer', 'floatingTopFullWidthContainer')]: {
//     display: inlineBlock,
//     overflow: hidden,
//     height: percent(100),
//     width: percent(100),
//   },

//   virtualListContainer: {
//     overflow: hidden,
//   },

//   // /**
//   //  ****************************
//   //  * Scrollers
//   //  ****************************
//   // */
//   body: {
//     position: relative,
//     display: flex,
//     flex: [one, one, auto],
//     flexDirection: row.important, // we have to state this for rtl, otherwise row-reverse is inherited
//     minHeight: zero,

//     bodyViewport: {
//       WebkitOverflowScrolling: literal('touch'),
//     },
//   },

//   [selectors('bodyHorizontalScroll', 'bodyVerticalScroll')]: {
//     minHeight: zero,
//     minWidth: zero,
//     display: flex,
//     position: relative,
//     '&scrollbarInvisible': {
//       position: absolute,
//       bottom: zero,
//       '&appleScrollbar': {
//         opacity: zero,
//         transition: literal('opacity 0.4s'),
//         visibility: hidden,
//         [selectors('&scrollbarScrolling', '&scrollbarActive')]: {
//           visibility: visible,
//           opacity: one,
//         },
//       },
//     },
//   },

//   bodyHorizontalScroll: {
//     width: percent(100),
//     '&scrollbarInvisible': {
//       alwaysLeft: zero,
//       alwaysRight: zero,
//     },
//   },

//   bodyVerticalScroll: {
//     height: percent(100),
//     '&scrollbarInvisible': {
//       top: zero,
//       zIndex: unitless(10),
//       trailing: zero,
//     },
//   },

//   forceVerticalScroll: {
//     overflowY: scroll.important,
//   },

//   [selectors('horizontalLeftSpacer', 'horizontalRightSpacer')]: {
//     height: percent(100),
//     minWidth: zero,
//     overflowX: scroll,
//     '&scrollerCorner': {
//       overflowX: hidden,
//     },
//   },

//   // /**
//   //  ****************************
//   //  * Headers
//   //  ****************************
//   // */
//   [selectors('header', 'pinnedLeftHeader', 'pinnedRightHeader')]: {
//     display: inlineBlock,
//     overflow: hidden,
//     position: relative,
//   },

//   headerCellSortable: {
//     headerCellLabel: {
//       cursor: literal('pointer'),
//     },
//   },

//   header: {
//     display: flex,
//     width: percent(100),
//     whiteSpace: nowrap,
//   },

//   pinnedLeftHeader: {
//     height: percent(100),
//   },

//   pinnedRightHeader: {
//     height: percent(100),
//   },

//   headerRow: {
//     position: absolute,

//     '&:not(headerRowColumnGroup)': {
//       // so when floating filters are height 0px, the contents don't spill out
//       overflow: hidden,
//     },
//   },

//   [untypedSelectors('header.headerAllowOverflow .headerRow')]: {
//     overflow: visible,
//   },

//   headerCell: {
//     display: inlineFlex,
//     alignItems: center,
//     position: absolute,
//     height: percent(100),
//     overflow: hidden,
//   },

//   [untypedSelectors('headerCell.headerActive .headerCellMenuButton')]: {
//     opacity: one,
//   },

//   headerCellMenuButton: {
//     '&:not(headerMenuAlwaysShow)': {
//       transition: literal('opacity 0.2s'),
//       opacity: zero,
//     },
//   },

//   [selectors('headerGroupCellLabel', 'headerCellLabel')]: {
//     display: flex,
//     flex: [one, one, auto],
//     overflow: hidden,
//     alignItems: center,
//     textOverflow: literal('ellipsis'),
//     alignSelf: stretch,
//   },

//   [untypedSelectors('headerGroupCellLabel.stickyLabel')]: {
//     position: sticky,
//     flex: none,
//     maxWidth: percent(100),
//   },

//   headerCellText: {
//     overflow: hidden,
//     textOverflow: literal('ellipsis'),
//   },

//   [untypedSelectors('headerCell:not(.headerCellAutoHeight) .headerCellCompWrapper')]: {
//     height: percent(100),
//     display: flex,
//     alignItems: center,
//   },

//   headerCellCompWrapper: {
//     width: percent(100),
//     overflow: hidden,
//   },

//   [untypedSelectors('headerCellWrapText .headerCellCompWrapper')]: {
//     whiteSpace: normal,
//   },

//   [untypedSelectors('rightAlignedHeader .headerCellLabel')]: {
//     flexDirection: rowReverse,
//   },

//   headerGroupText: {
//     overflow: hidden,
//     textOverflow: literal('ellipsis'),
//     whiteSpace: nowrap,
//   },

//   headerCellResize: {
//     position: absolute,
//     zIndex: unitless(2),
//     height: percent(100),
//     width: px(8),
//     top: zero,

//     cursor: literal('ew-resize'),

//     // unpinned headers get their resize handle on the right in normal mode and left in RTL mode
//     trailing: px(-4),
//   },

//   [untypedSelectors('pinnedLeftHeader .headerCellResize')]: {
//     alwaysRight: px(-4), // pinned left headers always have their resize on the right, even in RTL mode
//   },

//   [untypedSelectors('pinnedRightHeader .headerCellResize')]: {
//     alwaysLeft: px(-4), // pinned right headers always have their resize on the left, even in RTL mode
//   },

//   headerSelectAll: {
//     display: flex,
//   },

//   // /**
//   //  ****************************
//   //  * Columns
//   //  ****************************
//   // */
//   columnMoving: {
//     cell: {
//       transition: literal('left 0.2s'),
//     },

//     headerCell: {
//       transition: literal('left 0.2s'),
//     },

//     headerGroupCell: {
//       transition: literal('left 0.2s, width 0.2s'),
//     },
//   },

//   // /**
//   //  ****************************
//   //  * Column Panel
//   //  ****************************
//   // */

//   columnPanel: {
//     display: flex,
//     flexDirection: column,
//     overflow: hidden,
//     flex: [one, one, auto],
//   },

//   columnSelect: {
//     position: relative,
//     display: flex,
//     flexDirection: column,
//     overflow: hidden,
//     flex: [unitless(3), one, px(0)],
//   },

//   columnSelectHeader: {
//     position: relative,
//     display: flex,
//     flex: none,
//   },

//   columnSelectHeaderIcon: {
//     position: relative,
//   },

//   columnSelectHeaderFilterWrapper: {
//     flex: [one, one, auto],
//   },

//   columnSelectList: {
//     flex: [one, one, px(0)],
//     overflow: hidden,
//   },

//   columnDrop: {
//     position: relative,
//     display: inlineFlex,
//     alignItems: center,
//     overflow: auto,
//     width: percent(100),
//   },

//   columnDropList: {
//     display: flex,
//     alignItems: center,
//   },

//   columnDropCell: {
//     position: relative,
//     display: flex,
//     alignItems: center,
//   },

//   columnDropCellText: {
//     overflow: hidden,
//     flex: [one, one, auto],
//     textOverflow: literal('ellipsis'),
//     whiteSpace: nowrap,
//   },

//   columnDropVertical: {
//     display: flex,
//     flexDirection: column,
//     overflow: hidden,
//     alignItems: stretch,
//     flex: [one, one, px(0)],
//   },

//   columnDropVerticalTitleBar: {
//     display: flex,
//     alignItems: center,
//     flex: none,
//   },

//   columnDropVerticalList: {
//     position: relative,
//     alignItems: stretch,
//     flexGrow: one,
//     flexDirection: column,
//     overflowX: auto,

//     '> *': {
//       flex: none,
//     },
//   },

//   [untypedSelectors('columnDropEmpty .columnDropVerticalList')]: {
//     overflow: hidden,
//   },

//   columnDropVerticalEmptyMessage: {
//     display: block,
//   },

//   [untypedSelectors('columnDrop.columnDropHorizontal')]: {
//     whiteSpace: nowrap,
//     overflow: hidden,
//   },

//   columnDropCellButton: {
//     cursor: literal('pointer'),
//   },

//   filterToolpanel: {
//     flex: [one, one, px(0)],
//     minWidth: zero,
//   },

//   filterToolpanelHeader: {
//     position: relative,
//   },

//   [selectors('filterToolpanelHeader', 'filterToolpanelSearch')]: {
//     display: flex,
//     alignItems: center,

//     '> *': {
//       display: flex,
//       alignItems: center,
//     },
//   },

//   filterApplyPanel: {
//     display: flex,
//     justifyContent: flexEnd,
//     overflow: hidden,
//   },

//   // /**
//   //  ****************************
//   //  * Rows
//   //  ****************************
//   // */
//   // for row animations.
//   [untypedSelectors('rowAnimation .row')]: {
//     transition: literal('transform 0.4s, top 0.4s, background-color 0.1s, opacity 0.2s'),
//   },
//   // for rows older than one second, we also animate the height. we don't include the height
//   // initially so we are not animating auto-height rows on initial render.
//   [untypedSelectors('rowAnimation .row.afterCreated')]: {
//     transition: literal(
//       'transform 0.4s, top 0.4s, height 0.4s, background-color 0.1s, opacity 0.2s',
//     ),
//   },

//   [untypedSelectors('rowNoAnimation .row')]: {
//     transition: literal('background-color 0.1s'),
//   },

//   row: {
//     whiteSpace: nowrap,
//     width: percent(100),
//   },

//   rowLoading: {
//     display: flex,
//     alignItems: center,
//   },

//   rowPositionAbsolute: {
//     position: absolute,
//   },

//   rowPositionRelative: {
//     position: relative,
//   },

//   fullWidthRow: {
//     overflow: hidden,
//     // turn events back on, as we removed them in the parent
//     pointerEvents: literal('all'),
//   },

//   rowInlineEditing: {
//     zIndex: one,
//   },

//   rowDragging: {
//     zIndex: unitless(2),
//   },

//   // /**
//   //  ****************************
//   //  * Cells
//   //  ****************************
//   // */
//   cell: {
//     display: inlineBlock,
//     position: absolute,
//     whiteSpace: nowrap,
//     height: percent(100),
//   },

//   // This is used when using a Cell Wrapper (eg row drag, selection, or auto-height).
//   // If not using wrapper, ag-cell-value is on a div, which is 100% width. However when
//   // in a wrapper, it's a span (not a div), so we need 100% width to provide consistent
//   // behaviour regardless of wrapper used or not. If we did not do this, Cell Renderer's
//   // with 100% width wouldn't get the full width when using a wrapper.
//   // Instead of just 100% width we use flex, as it's not the only item on the line, so it
//   // fills the remaining space.
//   cellValue: {
//     flex: [one, one, auto],
//   },

//   [selectors('cellValue', 'groupValue')]: {
//     overflow: hidden,
//     textOverflow: literal('ellipsis'),
//   },

//   cellWrapText: {
//     whiteSpace: normal,
//     wordBreak: literal('break-all'),
//   },

//   cellWrapper: {
//     display: flex,
//     alignItems: center,
//     // adding overflow: hidden breaks the checkbox focus outline
//     // overflow: hidden;
//     // adding width: 100% here breaks text-overflow: ellipsis
//     // width: 100%;
//     '&rowGroup': {
//       alignItems: flexStart,
//     },
//   },

//   sparklineWrapper: {
//     position: absolute,
//     height: percent(100),
//     width: percent(100),
//     alwaysLeft: zero,
//     top: zero,
//   },

//   [untypedSelectors('fullWidthRow .cellWrapper.rowGroup')]: {
//     height: percent(100),
//     alignItems: center,
//   },

//   cellInlineEditing: {
//     zIndex: one,

//     [selectors('cellWrapper', 'cellEditWrapper', 'cellEditor', 'wrapper', 'input')]: {
//       height: percent(100),
//       width: percent(100),
//       lineHeight: normal,
//     },
//   },

//   [untypedSelectors('cell .icon')]: {
//     display: inlineBlock,
//     verticalAlign: literal('middle'),
//   },

//   // /**
//   //  ****************************
//   //  * Filters
//   //  ****************************
//   // */
//   setFilterItem: {
//     display: flex,
//     alignItems: center,
//     height: percent(100),
//   },

//   setFilterItemCheckbox: {
//     display: flex,
//     overflow: hidden,
//   },

//   setFilterGroupIcons: {
//     display: block,
//     '> *': {
//       cursor: literal('pointer'),
//     },
//   },

//   filterBodyWrapper: {
//     display: flex,
//     flexDirection: column,
//   },

//   filterFilter: {
//     flex: [one, one, px(0)],
//   },

//   filterCondition: {
//     display: flex,
//     justifyContent: center,
//   },

//   // /**
//   //  ****************************
//   //  * Floating Filter
//   //  ****************************
//   // */

//   floatingFilterBody: {
//     position: relative,
//     display: flex,
//     flex: [one, one, auto],
//     height: percent(100),
//   },

//   floatingFilterFullBody: {
//     display: flex,
//     flex: [one, one, auto],
//     height: percent(100),
//     width: percent(100),
//     alignItems: center,
//     overflow: hidden,
//   },

//   [untypedSelectors('floatingFilterFullBody > div')]: {
//     flex: [one, one, auto],
//   },

//   floatingFilterInput: {
//     alignItems: center,
//     display: flex,
//     width: percent(100),

//     '> *': {
//       flex: [one, one, auto],
//     },
//   },

//   floatingFilterButton: {
//     display: flex,
//     flex: none,
//   },

//   [untypedSelectors('setFloatingFilterInput input[disabled]')]: {
//     pointerEvents: literal('none'),
//   },

//   // /**
//   //  ****************************
//   //  * Drag & Drop
//   //  ****************************
//   // */

//   dndGhost: {
//     position: absolute,
//     display: inlineFlex,
//     alignItems: center,
//     cursor: literal('move'),
//     whiteSpace: nowrap,
//     zIndex: unitless(9999),
//   },

//   // /**
//   //  ****************************
//   //  * Overlay
//   //  ****************************
//   // */
//   overlay: {
//     height: percent(100),
//     alwaysLeft: zero,
//     pointerEvents: literal('none'),
//     position: absolute,
//     top: zero,
//     width: percent(100),
//     zIndex: unitless(2),
//   },

//   overlayPanel: {
//     display: flex,
//     height: percent(100),
//     width: percent(100),
//   },

//   overlayWrapper: {
//     display: flex,
//     flex: none,
//     width: percent(100),
//     height: percent(100),
//     alignItems: center,
//     justifyContent: center,
//     textAlign: literal('center'),
//   },

//   overlayLoadingWrapper: {
//     // prevent interaction with grid while it's loading
//     pointerEvents: literal('all'),
//   },

//   // /**
//   //  ****************************
//   //  * Popup
//   //  ****************************
//   // */

//   popupChild: {
//     zIndex: unitless(5),
//     top: zero,
//   },

//   popupEditor: {
//     position: absolute,
//     userSelect: none,
//   },

//   largeTextInput: {
//     display: block,
//   },

//   // /**
//   //  ****************************
//   //  * Virtual Lists
//   //  ****************************
//   // */
//   virtualListItem: {
//     position: absolute,
//     width: percent(100),
//   },

//   // /**
//   //  ****************************
//   //  * Floating Top and Bottom
//   //  ****************************
//   // */
//   floatingTop: {
//     overflow: hidden,
//     whiteSpace: nowrap,
//     width: percent(100),
//     position: relative,
//     display: flex,
//   },

//   pinnedLeftFloatingTop: {
//     display: inlineBlock,
//     overflow: hidden,
//     position: relative,
//     minWidth: px(0),
//   },

//   pinnedRightFloatingTop: {
//     display: inlineBlock,
//     overflow: hidden,
//     position: relative,
//     minWidth: px(0),
//   },

//   floatingBottom: {
//     overflow: hidden,
//     whiteSpace: nowrap,
//     width: percent(100),
//     position: relative,
//     display: flex,
//   },

//   pinnedLeftFloatingBottom: {
//     display: inlineBlock,
//     overflow: hidden,
//     position: relative,
//     minWidth: px(0),
//   },

//   pinnedRightFloatingBottom: {
//     display: inlineBlock,
//     overflow: hidden,
//     position: relative,
//     minWidth: px(0),
//   },

//   // /**
//   //  ****************************
//   //  * Sticky Top
//   //  ****************************
//   // */
//   stickyTop: {
//     position: absolute,
//     display: flex,
//     width: percent(100),
//   },

//   [selectors('pinnedLeftStickyTop', 'pinnedRightStickyTop')]: {
//     position: relative,
//     height: percent(100),
//     overflow: hidden,
//   },

//   stickyTopFullWidthContainer: {
//     overflow: hidden,
//     width: percent(100),
//     height: percent(100),
//   },

//   // /**
//   //  ****************************
//   //  * Dialog
//   //  ****************************
//   // */
//   [selectors('dialog', 'panel')]: {
//     display: flex,
//     flexDirection: column,
//     position: relative,
//     overflow: hidden,
//   },

//   panelTitleBar: {
//     display: flex,
//     flex: none,
//     alignItems: center,
//     cursor: literal('default'),
//   },

//   panelTitleBarTitle: {
//     flex: [one, one, auto],
//   },

//   panelTitleBarButtons: {
//     display: flex,
//   },

//   panelTitleBarButton: {
//     cursor: literal('pointer'),
//   },

//   panelContentWrapper: {
//     display: flex,
//     flex: [one, one, auto],
//     position: relative,
//     overflow: hidden,
//   },

//   dialog: {
//     position: absolute,
//   },

//   resizer: {
//     position: absolute,
//     pointerEvents: literal('none'),
//     zIndex: one,
//     userSelect: none,
//     '&resizerTopLeft': {
//       top: zero,
//       alwaysLeft: zero,
//       height: px(5),
//       width: px(5),
//       cursor: literal('nwse-resize'),
//     },
//     '&resizerTop': {
//       top: zero,
//       alwaysLeft: px(5),
//       alwaysRight: px(5),
//       height: px(5),
//       cursor: literal('ns-resize'),
//     },
//     '&resizerTopRight': {
//       top: zero,
//       alwaysRight: zero,
//       height: px(5),
//       width: px(5),
//       cursor: literal('nesw-resize'),
//     },
//     '&resizerRight': {
//       top: px(5),
//       alwaysRight: zero,
//       bottom: px(5),
//       width: px(5),
//       cursor: literal('ew-resize'),
//     },
//     '&resizerBottomRight': {
//       bottom: zero,
//       alwaysRight: zero,
//       height: px(5),
//       width: px(5),
//       cursor: literal('nwse-resize'),
//     },
//     '&resizerBottom': {
//       bottom: zero,
//       alwaysLeft: px(5),
//       alwaysRight: px(5),
//       height: px(5),
//       cursor: literal('ns-resize'),
//     },
//     '&resizerBottomLeft': {
//       bottom: zero,
//       alwaysLeft: zero,
//       height: px(5),
//       width: px(5),
//       cursor: literal('nesw-resize'),
//     },
//     '&resizerLeft': {
//       alwaysLeft: zero,
//       top: px(5),
//       bottom: px(5),
//       width: px(5),
//       cursor: literal('ew-resize'),
//     },
//   },

//   // /**
//   //  ****************************
//   //  * Tooltip
//   //  ****************************
//   // */

//   tooltip: {
//     position: absolute,
//     zIndex: unitless(99999),
//   },

//   tooltipCustom: {
//     position: absolute,
//     zIndex: unitless(99999),
//   },

//   [untypedSelectors('tooltip:not(.tooltipInteractive)', 'tooltipCustom:not(.tooltipInteractive)')]:
//     {
//       pointerEvents: literal('none'),
//     },

//   // /**
//   //  ****************************
//   //  * Animations
//   //  ****************************
//   // */

//   // this is used by the animateShowChangeCellRenderer. it is arguable that this belongs in the themes, // however it is not tied to color, only placement and visibility, which is behaviour and not style, // thus belongs here, besides it doesn't change wih the themes
//   valueSlideOut: {
//     marginAlwaysRight: px(5),
//     opacity: one,
//     transition: literal('opacity 3s, margin-right 3s'), // as value fades, it also moves to the left via the margin setting
//     transitionTimingFunction: literal('linear'),
//   },

//   valueSlideOutEnd: {
//     marginAlwaysRight: px(10),
//     opacity: zero,
//   },

//   opacityZero: {
//     opacity: zero,
//   },

//   // /**
//   //  ****************************
//   //  * Menu
//   //  ****************************
//   // */
//   menu: {
//     maxHeight: percent(100),
//     overflowY: auto,
//     position: absolute,
//     userSelect: none,
//   },

//   menuColumnSelectWrapper: {
//     height: px(265),
//     overflow: auto,

//     columnSelect: {
//       height: percent(100),
//     },
//   },

//   menuList: {
//     display: table,
//     width: percent(100),
//   },

//   [selectors('menuOption', 'menuSeparator')]: {
//     display: tableRow,
//   },

//   [selectors('menuOptionPart', 'menuSeparatorPart')]: {
//     display: tableCell,
//     verticalAlign: literal('middle'),
//   },

//   menuOptionText: {
//     whiteSpace: nowrap,
//   },

//   compactMenuOption: {
//     width: percent(100),
//     display: flex,
//     flexWrap: nowrap,
//   },

//   compactMenuOptionText: {
//     whiteSpace: nowrap,
//     flex: [one, one, auto],
//   },

//   // /**
//   //  ****************************
//   //  * Rich Select
//   //  ****************************
//   // */
//   richSelect: {
//     cursor: literal('default'),
//     outline: none,
//     height: percent(100),
//   },

//   richSelectValue: {
//     display: flex,
//     alignItems: center,
//     height: percent(100),
//     pickerFieldDisplay: {
//       overflow: hidden,
//       textOverflow: literal('ellipsis'),
//       '&displayAsPlaceholder': {
//         opacity: unitless(0.5),
//       },
//     },
//   },

//   richSelectList: {
//     position: relative,
//     loadingText: {
//       minHeight: rem(2),
//     },
//   },

//   richSelectRow: {
//     display: flex,
//     flex: [one, one, auto],
//     alignItems: center,
//     whiteSpace: nowrap,
//     overflow: hidden,
//     height: percent(100),
//   },

//   richSelectFieldInput: {
//     flex: [one, one, auto],
//     inputFieldInput: {
//       padding: zero,
//       border: none.important,
//       boxShadow: none.important,
//       textOverflow: literal('ellipsis'),
//       '&::placeholder': {
//         opacity: unitless(0.8),
//       },
//     },
//   },

//   // /**
//   //  ****************************
//   //  * Autocomplete
//   //  ****************************
//   // */
//   autocomplete: {
//     alignItems: center,
//     display: flex,

//     '> *': {
//       flex: [one, one, auto],
//     },
//   },

//   autocompleteListPopup: {
//     position: absolute,
//     userSelect: none,
//   },

//   autocompleteList: {
//     position: relative,
//   },

//   autocompleteVirtualListItem: {
//     display: flex,
//   },

//   autocompleteRow: {
//     display: flex,
//     flex: [one, one, auto],
//     alignItems: center,
//     overflow: hidden,
//   },

//   autocompleteRowLabel: {
//     whiteSpace: nowrap,
//     overflow: hidden,
//     textOverflow: literal('ellipsis'),
//   },

//   // /**
//   //  ****************************
//   //  * Pagination
//   //  ****************************
//   // */
//   pagingPanel: {
//     alignItems: center,
//     display: flex,
//     justifyContent: flexEnd,
//   },

//   pagingPageSummaryPanel: {
//     display: flex,
//     alignItems: center,
//   },

//   pagingButton: {
//     position: relative,
//   },

//   [untypedSelectors('disabled .pagingPageSummaryPanel')]: {
//     pointerEvents: literal('none'),
//   },

//   // /**
//   //  ****************************
//   //  * Tool Panel
//   //  ****************************
//   // */
//   toolPanelWrapper: {
//     display: flex,
//     overflowY: auto,
//     overflowX: hidden,
//     cursor: literal('default'),
//     userSelect: none,
//   },

//   [selectors('columnSelectColumn', 'columnSelectColumnGroup', 'selectAggFuncItem')]: {
//     position: relative,
//     alignItems: center,
//     display: flex,
//     flexDirection: row,
//     flexWrap: nowrap,
//     height: percent(100),
//     '> *': {
//       flex: none,
//     },
//   },

//   [selectors('selectAggFuncItem', 'columnSelectColumnLabel')]: {
//     flex: [one, one, auto],
//     overflow: hidden,
//     textOverflow: literal('ellipsis'),
//     whiteSpace: nowrap,
//   },

//   columnSelectCheckbox: {
//     display: flex,
//   },

//   toolPanelHorizontalResize: {
//     cursor: literal('ew-resize'),
//     height: percent(100),
//     position: absolute,
//     top: zero,
//     width: px(5),
//     zIndex: one,
//   },

//   [untypedSelectors('sideBarLeft .toolPanelHorizontalResize')]: {
//     trailing: px(-3),
//   },

//   [untypedSelectors('sideBarRight .toolPanelHorizontalResize')]: {
//     leading: px(-3),
//   },

//   detailsRow: {
//     width: percent(100),
//   },

//   detailsRowFixedHeight: {
//     height: percent(100),
//   },

//   detailsGrid: {
//     width: percent(100),
//   },

//   detailsGridFixedHeight: {
//     height: percent(100),
//   },

//   headerGroupCell: {
//     display: flex,
//     alignItems: center,
//     height: percent(100),
//     position: absolute,
//   },

//   [untypedSelectors('headerGroupCellNoGroup.headerSpanHeight .headerCellResize')]: {
//     display: none,
//   },

//   cellLabelContainer: {
//     display: flex,
//     justifyContent: spaceBetween,
//     flexDirection: rowReverse,
//     alignItems: center,
//     height: percent(100),
//     width: percent(100),
//     overflow: hidden,
//     padding: [px(5), px(0)],
//   },

//   rightAlignedHeader: {
//     cellLabelContainer: {
//       flexDirection: row,
//     },

//     headerCellText: {
//       textAlign: literal('end'),
//     },
//   },

//   // /**
//   //  ****************************
//   //  * Side Bar
//   //  ****************************
//   // */
//   sideBar: {
//     display: flex,
//     flexDirection: rowReverse,
//   },

//   sideBarLeft: {
//     order: unitless(-1),
//     flexDirection: row,
//   },

//   sideButtonButton: {
//     position: relative,
//     display: flex,
//     flexDirection: column,
//     alignItems: center,
//     justifyContent: center,
//     flexWrap: nowrap,
//     whiteSpace: nowrap,
//     outline: none,
//     cursor: literal('pointer'),
//   },

//   sideButtonLabel: {
//     writingMode: literal('vertical-lr'),
//   },

//   // /**
//   //  ****************************
//   //  * Status Bar
//   //  ****************************
//   // */
//   statusBar: {
//     display: flex,
//     justifyContent: spaceBetween,
//     overflow: hidden,
//   },

//   statusPanel: {
//     display: inlineFlex,
//   },

//   statusNameValue: {
//     whiteSpace: nowrap,
//   },

//   statusBarLeft: {
//     display: inlineFlex,
//   },

//   statusBarCenter: {
//     display: inlineFlex,
//   },

//   statusBarRight: {
//     display: inlineFlex,
//   },

//   // /**
//   //  ****************************
//   //  * Widgets
//   //  ****************************
//   // */

//   icon: {
//     display: block,
//     speak: none,
//   },

//   group: {
//     position: relative,
//     width: percent(100),
//   },

//   groupTitleBar: {
//     display: flex,
//     alignItems: center,
//   },

//   groupTitle: {
//     display: block,
//     flex: [one, one, auto],
//     minWidth: zero,
//     overflow: hidden,
//     whiteSpace: nowrap,
//     textOverflow: literal('ellipsis'),
//   },

//   [untypedSelectors('groupTitleBar .groupTitle')]: {
//     cursor: literal('default'),
//   },

//   groupToolbar: {
//     display: flex,
//     alignItems: center,
//   },

//   groupContainer: {
//     display: flex,
//   },

//   [untypedSelectors('disabled .groupContainer')]: {
//     pointerEvents: literal('none'),
//   },

//   groupContainerHorizontal: {
//     flexDirection: row,
//     flexWrap: wrap,
//   },

//   groupContainerVertical: {
//     flexDirection: column,
//   },

//   columnGroupIcons: {
//     display: block,
//     '> *': {
//       cursor: literal('pointer'),
//     },
//   },

//   [untypedSelectors('groupItemAlignmentStretch .groupItem')]: {
//     alignItems: stretch,
//   },

//   [untypedSelectors('groupItemAlignmentStart .groupItem')]: {
//     alignItems: flexStart,
//   },

//   [untypedSelectors('groupItemAlignmentEnd .groupItem')]: {
//     alignItems: flexEnd,
//   },

//   [selectors('inputField', 'select')]: {
//     display: flex,
//     flexDirection: row,
//     alignItems: center,
//   },

//   inputFieldInput: {
//     flex: [one, one, auto],
//   },

//   [untypedSelectors("floatingFilterInput .inputFieldInput[type='date']")]: {
//     // Fix a bug in Blink rendering engine where date input will not shrink from its default size in a
//     // flex container, but it will grow. So we give it a very small width and it will grow to the right size
//     width: px(1),
//   },

//   rangeField: {
//     display: flex,
//     alignItems: center,
//   },

//   angleSelect: {
//     display: flex,
//     alignItems: center,
//   },

//   angleSelectWrapper: {
//     display: flex,
//   },

//   angleSelectParentCircle: {
//     display: block,
//     position: relative,
//   },
//   angleSelectChildCircle: {
//     position: absolute,
//   },

//   sliderWrapper: {
//     display: flex,
//     inputField: {
//       flex: [one, one, auto],
//     },
//   },

//   pickerFieldDisplay: {
//     flex: [one, one, auto],
//   },

//   pickerField: {
//     display: flex,
//     alignItems: center,
//   },

//   pickerFieldIcon: {
//     display: flex,
//     border: zero,
//     padding: zero,
//     margin: zero,
//     cursor: literal('pointer'),
//   },

//   pickerFieldWrapper: {
//     overflow: hidden,
//   },

//   labelAlignRight: {
//     label: {
//       order: one,
//     },
//     '> *': {
//       flex: none,
//     },
//   },

//   labelAlignTop: {
//     flexDirection: column,
//     alignItems: flexStart,
//     '> *': {
//       alignSelf: stretch,
//     },
//   },

//   labelEllipsis: {
//     overflow: hidden,
//     textOverflow: literal('ellipsis'),
//     whiteSpace: nowrap,
//     flex: one,
//   },

//   colorPanel: {
//     width: percent(100),
//     display: flex,
//     flexDirection: column,
//     textAlign: literal('center'),
//   },

//   spectrumColor: {
//     flex: [one, one, auto],
//     position: relative,
//     overflow: hidden,
//     cursor: literal('default'),
//   },

//   spectrumFill: {
//     position: absolute,
//     top: zero,
//     alwaysLeft: zero,
//     alwaysRight: zero,
//     bottom: zero,
//   },

//   spectrumVal: {
//     cursor: literal('pointer'),
//   },

//   spectrumDragger: {
//     position: absolute,
//     pointerEvents: literal('none'),
//     cursor: literal('pointer'),
//   },

//   spectrumHue: {
//     cursor: literal('default'),
//     background: literal(
//       'linear-gradient(to left, #ff0000 3%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
//     ),
//   },

//   spectrumAlpha: {
//     cursor: literal('default'),
//   },

//   spectrumHueBackground: {
//     width: percent(100),
//     height: percent(100),
//   },

//   spectrumAlphaBackground: {
//     backgroundImage: literal('linear-gradient(to right, rgba(0, 0, 0, 0), rgb(0, 0, 0))'),
//     width: percent(100),
//     height: percent(100),
//   },

//   spectrumTool: {
//     cursor: literal('pointer'),
//   },

//   spectrumSlider: {
//     position: absolute,
//     pointerEvents: literal('none'),
//   },

//   recentColors: {
//     display: flex,
//   },

//   recentColor: {
//     cursor: literal('pointer'),
//   },

//   // Default values for themes that do not use the mixins
//   // TODO restore this using calc and a variable
//   // @for $i from 1 to 10 {
//   //     .ag-column-select-indent-#{$i} {
//   //         @include ag.unthemed-rtl(( padding-left: $i * 20px ));
//   //     }

//   //     .ag-set-filter-indent-#{$i} {
//   //         @include ag.unthemed-rtl(( padding-left: $i * 20px ));
//   //     }

//   //     .ag-row-group-indent-#{$i} {
//   //         @include ag.unthemed-rtl(( padding-left: $i * 20px ));
//   //     }
//   // }

//   ltr: {
//     direction: literal('ltr'),
//     [selectors(
//       'body',
//       'floatingTop',
//       'floatingBottom',
//       'header',
//       'stickyTop',
//       'bodyViewport',
//       'bodyHorizontalScroll',
//     )]: {
//       flexDirection: row,
//     },
//   },

//   rtl: {
//     direction: literal('rtl'),
//     [selectors(
//       'body',
//       'floatingTop',
//       'floatingBottom',
//       'header',
//       'stickyTop',
//       'bodyViewport',
//       'bodyHorizontalScroll',
//     )]: {
//       flexDirection: rowReverse,
//     },

//     [selectors('iconContracted', 'iconExpanded', 'iconTreeClosed')]: {
//       display: block,
//       transform: literal('rotate(180deg)'),
//     },
//   },
// });
