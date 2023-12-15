
import { $ag, $before, $not, ag, child, is, $is, $placeholder } from 'design-system/css-in-js';
import { Rule } from 'design-system/css-in-js/render';

export const commonRules: Rule[] = [
  // /**
  // ****************************
  // * Generic Styles
  // ****************************
  // */
  // if we don't do this, then the width and height of the grid would be
  // ignored, as there is no default display for the these custom elements
  is(
    'ag-grid',
    'ag-grid-angular',
  )({
    display: 'block',
  }),

  ag.hidden({
    display: 'none !important' as any,
  }),

  ag.invisible({
    visibility: 'hidden !important' as any,
  }),

  ag.noTransition({
    transition: 'none !important' as any,
  }),

  ag.dragHandle({
    cursor: 'grab',
  }),

  ag.columnDropWrapper({
    display: 'flex',
  }),

  ag.columnDropHorizontalHalfWidth({
    display: 'inline-block',
    width: '50% !important' as any,
  }),

  ag.unselectable({
    userSelect: 'none',
  }),

  ag.selectable({
    userSelect: 'text',
  }),

  ag.tab({
    position: 'relative',
  }),

  ag.tabGuard({
    position: 'absolute',
    width: '0',
    height: '0',
    display: 'block',
  }),

  ag.selectAggFuncPopup({
    position: 'absolute',
  }),

  is(
    ag.inputWrapper,
    ag.pickerFieldWrapper,
  )({
    display: 'flex',
    flex: '1 1 auto',
    alignItems: 'center',
    lineHeight: 'normal',
    position: 'relative',
  }),

  // setting shake class to an item will give it a left ot right animation
  // used for the 'left' and 'right' arrows when dragging columns and scrolling
  ag.shakeLeftToRight({
    animationDirection: 'alternate',
    animationDuration: '0.2s',
    animationIterationCount: 'infinite',
    animationName: 'ag-shake-left-to-right',
  }),

  /****************************
   * TODO, port this Sass code:
   * @keyframes ag-shake-left-to-right {
   *         from {
   *             padding-left: 6px;
   *             padding-right: 2px;
   *         }
   *
   *         to {
   *             padding-left: 2px;
   *             padding-right: 6px;
   *         }
   *     }
   ****************************/
  ag.rootWrapper(
    {
      cursor: 'default',
      position: 'relative',
      // set to relative, so absolute popups appear relative to this
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      whiteSpace: 'normal',
    },

    $ag.layoutNormal({
      height: '100%',
    }),
  ),

  ag.watermark(
    {
      position: 'absolute',
      bottom: '20px',
      alwaysRight: '25px',
      opacity: '0.7',
      transition: 'opacity 1s ease-out 3s',
      color: '#9B9B9B',
    },

    $before({
      content: "''",
      backgroundImage:
        'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjA5IiBoZWlnaHQ9IjM2IiB2aWV3Qm94PSIwIDAgMjA5IDM2IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMTkyLjk5MyAyMy42NTgyVjE1LjcxMTdIMTc5LjQ1MkwxNzEuNTA1IDIzLjY1ODJIMTkyLjk5M1oiIGZpbGw9IiM5QjlCOUIiLz4KPHBhdGggZD0iTTIwOC4yNSAzLjk1MDgxSDE5MS4yNzZMMTgzLjI2NiAxMS44OTczSDIwOC4yNVYzLjk1MDgxWiIgZmlsbD0iIzlCOUI5QiIvPgo8cGF0aCBkPSJNMTYzLjYyMiAzMS42MDQ4TDE2Ny42OTEgMjcuNTM2MUgxODEuNDIzVjM1LjQ4MjdIMTYzLjYyMlYzMS42MDQ4WiIgZmlsbD0iIzlCOUI5QiIvPgo8cGF0aCBkPSJNMTY2LjYxIDE5Ljc4MDNIMTc1LjM4M0wxODMuMzkzIDExLjgzMzdIMTY2LjYxVjE5Ljc4MDNaIiBmaWxsPSIjOUI5QjlCIi8+CjxwYXRoIGQ9Ik0xNTcuMDExIDMxLjYwNDdIMTYzLjYyMkwxNzEuNTA1IDIzLjY1ODJIMTU3LjAxMVYzMS42MDQ3WiIgZmlsbD0iIzlCOUI5QiIvPgo8cGF0aCBkPSJNMTkxLjI3NiAzLjk1MDgxTDE4Ny4yMDggOC4wMTk0MUgxNjEuMjdWMC4wNzI4NzZIMTkxLjI3NlYzLjk1MDgxWiIgZmlsbD0iIzlCOUI5QiIvPgo8cGF0aCBkPSJNMjAuODM5MSAzMC4yMDYxSDguMzc4OTJMNi4yMTc0NSAzNS41NDYySDAuNzUwMjQ0TDEyLjI1NjggOC41OTE1NUgxNy4wMjQ3TDI4LjUzMTMgMzUuNTQ2MkgyMy4wMDA1TDIwLjgzOTEgMzAuMjA2MVpNMTkuMTIyNyAyNS45NDY4TDE0LjYwOSAxNC45NDg4TDEwLjA5NTQgMjUuOTQ2OEgxOS4xMjI3WiIgZmlsbD0iIzlCOUI5QiIvPgo8cGF0aCBkPSJNMTA0LjQzNyAxOC41MDg5QzEwNi4wMjYgMTYuMTU2NyAxMTAuMDMxIDE1LjkwMjQgMTExLjY4NCAxNS45MDI0VjIwLjQ3OTZDMTA5LjY1IDIwLjQ3OTYgMTA3LjYxNSAyMC41NDMyIDEwNi40MDcgMjEuNDMzMkMxMDUuMiAyMi4zMjMyIDEwNC41NjQgMjMuNTMxMSAxMDQuNTY0IDI0Ljk5MzJWMzUuNTQ2Mkg5OS42MDUxVjE1LjkwMjRIMTA0LjM3M0wxMDQuNDM3IDE4LjUwODlaIiBmaWxsPSIjOUI5QjlCIi8+CjxwYXRoIGQ9Ik0xMTkuMzc2IDE1LjkwMjRIMTE0LjQxOFYzNS41NDYySDExOS4zNzZWMTUuOTAyNFoiIGZpbGw9IiM5QjlCOUIiLz4KPHBhdGggZD0iTTExOS4zNzYgNy4xMjkzOUgxMTQuNDE4VjEyLjk3OEgxMTkuMzc2VjcuMTI5MzlaIiBmaWxsPSIjOUI5QjlCIi8+CjxwYXRoIGQ9Ik0xNDMuOTc5IDcuMTI5MzlWMzUuNTQ2MkgxMzkuMjExTDEzOS4wODQgMzIuNTU4M0MxMzguMzg0IDMzLjU3NTUgMTM3LjQ5NCAzNC40MDE5IDEzNi40MTQgMzUuMDM3NkMxMzUuMzMzIDM1LjYwOTggMTMzLjk5OCAzNS45Mjc2IDEzMi40NzIgMzUuOTI3NkMxMzEuMTM3IDM1LjkyNzYgMTI5Ljg2NiAzNS42NzMzIDEyOC43ODUgMzUuMjI4M0MxMjcuNjQxIDM0LjcxOTcgMTI2LjYyMyAzNC4wODQgMTI1Ljc5NyAzMy4xOTRDMTI0Ljk3MSAzMi4zMDQgMTI0LjI3MSAzMS4yMjMzIDEyMy44MjYgMzAuMDE1NEMxMjMuMzE4IDI4LjgwNzUgMTIzLjEyNyAyNy40MDkgMTIzLjEyNyAyNS44ODMyQzEyMy4xMjcgMjQuMzU3NSAxMjMuMzgxIDIyLjk1ODkgMTIzLjgyNiAyMS42ODc0QzEyNC4zMzUgMjAuNDE2IDEyNC45NzEgMTkuMzM1MyAxMjUuNzk3IDE4LjQ0NTNDMTI2LjYyMyAxNy41NTUyIDEyNy42NDEgMTYuODU2IDEyOC43ODUgMTYuMzQ3NEMxMjkuOTI5IDE1LjgzODggMTMxLjEzNyAxNS41ODQ1IDEzMi40NzIgMTUuNTg0NUMxMzMuOTk4IDE1LjU4NDUgMTM1LjI2OSAxNS44Mzg4IDEzNi4zNSAxNi40MTA5QzEzNy40MzEgMTYuOTgzMSAxMzguMzIxIDE3Ljc0NTkgMTM5LjAyIDE4LjgyNjdWNy4xOTI5NUgxNDMuOTc5VjcuMTI5MzlaTTEzMy41NTMgMzEuNjY4M0MxMzUuMjA2IDMxLjY2ODMgMTM2LjQ3NyAzMS4wOTYyIDEzNy40OTQgMzAuMDE1NEMxMzguNTExIDI4LjkzNDcgMTM5LjAyIDI3LjQ3MjUgMTM5LjAyIDI1LjY5MjVDMTM5LjAyIDIzLjkxMjUgMTM4LjUxMSAyMi41MTM5IDEzNy40OTQgMjEuMzY5NkMxMzYuNDc3IDIwLjI4ODggMTM1LjIwNiAxOS43MTY3IDEzMy41NTMgMTkuNzE2N0MxMzEuOTYzIDE5LjcxNjcgMTMwLjYyOCAyMC4yODg4IDEyOS42NzUgMjEuMzY5NkMxMjguNjU4IDIyLjQ1MDMgMTI4LjE0OSAyMy45MTI1IDEyOC4xNDkgMjUuNjkyNUMxMjguMTQ5IDI3LjQ3MjUgMTI4LjY1OCAyOC44NzExIDEyOS42NzUgMjkuOTUxOEMxMzAuNjkyIDMxLjA5NjEgMTMxLjk2MyAzMS42NjgzIDEzMy41NTMgMzEuNjY4M1oiIGZpbGw9IiM5QjlCOUIiLz4KPHBhdGggZD0iTTU3LjIwMjQgMjAuMzUyNUg0NC45MzNWMjQuNjExOEg1MS45MjU5QzUxLjczNTIgMjYuNzczMyA1MC45MDg4IDI4LjQyNjEgNDkuNTEwMiAyOS43NjExQzQ4LjExMTYgMzEuMDMyNiA0Ni4zMzE1IDMxLjY2ODMgNDQuMDQyOSAzMS42NjgzQzQyLjc3MTUgMzEuNjY4MyA0MS41NjM2IDMxLjQxNCA0MC41NDY1IDMwLjk2OUMzOS40NjU3IDMwLjUyNCAzOC41NzU3IDI5Ljg4ODMgMzcuODEyOSAyOC45OTgzQzM3LjA1IDI4LjE3MTggMzYuNDc3OCAyNy4xNTQ3IDM2LjAzMjggMjUuOTQ2OEMzNS41ODc4IDI0LjczODkgMzUuMzk3MSAyMy40Njc1IDM1LjM5NzEgMjIuMDA1M0MzNS4zOTcxIDIwLjU0MzIgMzUuNTg3OCAxOS4yNzE3IDM2LjAzMjggMTguMDYzOEMzNi40MTQzIDE2Ljg1NiAzNy4wNSAxNS45MDI0IDM3LjgxMjkgMTUuMDEyNEMzOC41NzU3IDE0LjE4NTkgMzkuNDY1NyAxMy41NTAyIDQwLjU0NjUgMTMuMDQxNkM0MS42MjcyIDEyLjU5NjYgNDIuNzcxNSAxMi4zNDIzIDQ0LjEwNjUgMTIuMzQyM0M0Ni43NzY2IDEyLjM0MjMgNDguODEwOSAxMi45NzggNTAuMjA5NSAxNC4yNDk1TDUzLjUxNTIgMTAuOTQzOEM1MS4wMzU5IDkuMDM2NTkgNDcuODU3MyA4LjAxOTQxIDQ0LjEwNjUgOC4wMTk0MUM0Mi4wMDg2IDguMDE5NDEgNDAuMTAxNSA4LjMzNzI5IDM4LjM4NSA5LjAzNjU5QzM2LjY2ODYgOS43MzU4OCAzNS4yMDY0IDEwLjYyNTkgMzMuOTk4NSAxMS44MzM3QzMyLjc5MDYgMTMuMDQxNiAzMS44MzcxIDE0LjUwMzggMzEuMjAxNCAxNi4yMjAzQzMwLjU2NTYgMTcuOTM2NyAzMC4yNDc4IDE5Ljg0MzggMzAuMjQ3OCAyMS44NzgyQzMwLjI0NzggMjMuOTEyNSAzMC41NjU2IDI1LjgxOTcgMzEuMjY0OSAyNy41MzYxQzMxLjk2NDIgMjkuMjUyNiAzMi44NTQyIDMwLjcxNDcgMzQuMDYyMSAzMS45MjI2QzM1LjI3IDMzLjEzMDUgMzYuNzMyMSAzNC4wODQxIDM4LjQ0ODYgMzQuNzE5OEM0MC4xNjUgMzUuNDE5MSA0Mi4wNzIyIDM1LjczNyA0NC4xMDY1IDM1LjczN0M0Ni4xNDA4IDM1LjczNyA0Ny45ODQ0IDM1LjQxOTEgNDkuNjM3MyAzNC43MTk4QzUxLjI5MDIgMzQuMDIwNSA1Mi42ODg4IDMzLjEzMDUgNTMuODMzMSAzMS45MjI2QzU0Ljk3NzQgMzAuNzE0NyA1NS44Njc0IDI5LjI1MjYgNTYuNTAzMSAyNy41MzYxQzU3LjEzODggMjUuODE5NyA1Ny40NTY3IDIzLjkxMjUgNTcuNDU2NyAyMS44NzgyVjIxLjA1MTdDNTcuMjY2IDIwLjkyNDYgNTcuMjAyNCAyMC42MDY3IDU3LjIwMjQgMjAuMzUyNVoiIGZpbGw9IiM5QjlCOUIiLz4KPHBhdGggZD0iTTk1Ljk4MTUgMjAuMzUyNUg4My43MTIxVjI0LjYxMThIOTAuNzA1QzkwLjUxNDMgMjYuNzczMyA4OS42ODc5IDI4LjQyNjEgODguMjg5MyAyOS43NjExQzg2Ljg5MDcgMzEuMDMyNiA4NS4xMTA2IDMxLjY2ODMgODIuODIyIDMxLjY2ODNDODEuNTUwNiAzMS42NjgzIDgwLjM0MjcgMzEuNDE0IDc5LjMyNTYgMzAuOTY5Qzc4LjI0NDggMzAuNTI0IDc3LjM1NDggMjkuODg4MyA3Ni41OTIgMjguOTk4M0M3NS44MjkxIDI4LjE3MTggNzUuMjU3IDI3LjE1NDcgNzQuODExOSAyNS45NDY4Qzc0LjM2NjkgMjQuNzM4OSA3NC4xNzYyIDIzLjQ2NzUgNzQuMTc2MiAyMi4wMDUzQzc0LjE3NjIgMjAuNTQzMiA3NC4zNjY5IDE5LjI3MTcgNzQuODExOSAxOC4wNjM4Qzc1LjE5MzQgMTYuODU2IDc1LjgyOTEgMTUuOTAyNCA3Ni41OTIgMTUuMDEyNEM3Ny4zNTQ4IDE0LjE4NTkgNzguMjQ0OCAxMy41NTAyIDc5LjMyNTYgMTMuMDQxNkM4MC40MDYzIDEyLjU5NjYgODEuNTUwNiAxMi4zNDIzIDgyLjg4NTYgMTIuMzQyM0M4NS41NTU3IDEyLjM0MjMgODcuNTkgMTIuOTc4IDg4Ljk4ODYgMTQuMjQ5NUw5Mi4yOTQzIDEwLjk0MzhDODkuODE1IDkuMDM2NTkgODYuNjM2NCA4LjAxOTQxIDgyLjg4NTYgOC4wMTk0MUM4MC43ODc4IDguMDE5NDEgNzguODgwNiA4LjMzNzI5IDc3LjE2NDEgOS4wMzY1OUM3NS40NDc3IDkuNzM1ODggNzMuOTg1NSAxMC42MjU5IDcyLjc3NzYgMTEuODMzN0M3MS41Njk4IDEzLjA0MTYgNzAuNjE2MiAxNC41MDM4IDY5Ljk4MDUgMTYuMjIwM0M2OS4zNDQ3IDE3LjkzNjcgNjkuMDI2OSAxOS44NDM4IDY5LjAyNjkgMjEuODc4MkM2OS4wMjY5IDIzLjkxMjUgNjkuMzQ0NyAyNS44MTk3IDcwLjA0NCAyNy41MzYxQzcwLjc0MzMgMjkuMjUyNiA3MS42MzM0IDMwLjcxNDcgNzIuODQxMiAzMS45MjI2Qzc0LjA0OTEgMzMuMTMwNSA3NS41MTEyIDM0LjA4NDEgNzcuMjI3NyAzNC43MTk4Qzc4Ljk0NDEgMzUuNDE5MSA4MC44NTEzIDM1LjczNyA4Mi44ODU2IDM1LjczN0M4NC45MiAzNS43MzcgODYuNzYzNiAzNS40MTkxIDg4LjQxNjQgMzQuNzE5OEM5MC4wNjkzIDM0LjAyMDUgOTEuNDY3OSAzMy4xMzA1IDkyLjYxMjIgMzEuOTIyNkM5My43NTY1IDMwLjcxNDcgOTQuNjQ2NSAyOS4yNTI2IDk1LjI4MjIgMjcuNTM2MUM5NS45MTggMjUuODE5NyA5Ni4yMzU4IDIzLjkxMjUgOTYuMjM1OCAyMS44NzgyVjIxLjA1MTdDOTYuMDQ1MSAyMC45MjQ2IDk1Ljk4MTUgMjAuNjA2NyA5NS45ODE1IDIwLjM1MjVaIiBmaWxsPSIjOUI5QjlCIi8+Cjwvc3ZnPgo=)',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '170px 40px',
      display: 'block',
      height: '40px',
      width: '170px',
    }),
  ),

  ag.watermarkText({
    opacity: '0.5',
    fontWeight: 'bold',
    fontFamily: 'Impact, sans-serif',
    fontSize: '19px',
    padding: '0 11px',
  }),

  ag.rootWrapperBody(
    {
      display: 'flex',
      flexDirection: 'row',
    },

    $ag.layoutNormal({
      flex: '1 1 auto',
      height: '0',
      minHeight: '0',
    }),
  ),

  ag.root(
    {
      position: 'relative',
      // set to relative, so absolute popups appear relative to this
      display: 'flex',
      flexDirection: 'column',
    },

    $is(
      ag.layoutNormal,
      ag.layoutAutoHeight,
    )({
      overflow: 'hidden',
      // was getting some 'shouldn't be there' scrolls, this sorts it out
      flex: '1 1 auto',
      width: '0',
    }),
    $ag.layoutNormal({
      height: '100%',
    }),
  ),

  // /**
  // ****************************
  // * Viewports
  // ****************************
  // */
  is(
    ag.headerViewport,
    ag.floatingTopViewport,
    ag.bodyViewport,
    ag.centerColsViewport,
    ag.floatingBottomViewport,
    ag.bodyHorizontalScrollViewport,
    ag.bodyVerticalScrollViewport,
    ag.virtualListViewport,
    ag.stickyTopViewport,
  )({
    position: 'relative',
    height: '100%',
    minWidth: '0px',
    overflow: 'hidden',
    flex: '1 1 auto',
  }),

  is(ag.bodyViewport, ag.centerColsViewport)(
    {
      MsOverflowStyle: 'none',
      scrollbarWidth: 'none',
    },

    $is('::-webkit-scrollbar')({
      display: 'none',
    }),
  ),

  ag.bodyViewport(
    {
      display: 'flex',
      WebkitOverflowScrolling: 'touch',
    },

    $ag.layoutNormal({
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
    }),
  ),

  ag.centerColsViewport({
    minHeight: '100%',
    width: '100%',
    overflowX: 'auto',
  }),

  ag.bodyHorizontalScrollViewport({
    overflowX: 'scroll',
  }),

  ag.bodyVerticalScrollViewport({
    overflowY: 'scroll',
  }),

  ag.virtualListViewport({
    overflow: 'auto',
    width: '100%',
  }),

  // /**
  // ****************************
  // * Containers
  // ****************************
  // */
  is(
    ag.headerContainer,
    ag.floatingTopContainer,
    ag.pinnedRightColsContainer,
    ag.centerColsContainer,
    ag.pinnedLeftColsContainer,
    ag.floatingBottomContainer,
    ag.bodyHorizontalScrollContainer,
    ag.bodyVerticalScrollContainer,
    ag.fullWidthContainer,
    ag.floatingBottomFullWidthContainer,
    ag.virtualListContainer,
    ag.stickyTopContainer,
  )({
    position: 'relative',
  }),

  // for when auto height is used but there is no row data
  is(
    ag.headerContainer,
    ag.floatingTopContainer,
    ag.floatingBottomContainer,
    ag.stickyTopContainer,
  )({
    height: '100%',
    whiteSpace: 'nowrap',
  }),

  ag.centerColsContainer({
    display: 'block',
  }),

  ag.pinnedRightColsContainer({
    display: 'block',
  }),

  ag.bodyHorizontalScrollContainer({
    height: '100%',
  }),

  ag.bodyVerticalScrollContainer({
    width: '100%',
  }),

  is(
    ag.fullWidthContainer,
    ag.floatingTopFullWidthContainer,
    ag.floatingBottomFullWidthContainer,
    ag.stickyTopFullWidthContainer,
  )({
    position: 'absolute',
    top: '0px',
    leading: '0',
    // turn off pointer events, because this container overlays the main row containers.
    // so when user clicks on space between full width rows, we want the mouse clicks to
    // pass onto the underlying container where the real rows are. eg if using full width
    // for row grouping, the groups will be in the full width container, but when user
    // opens a group the children are shown in the other containers - we want to make sure we
    // don't block mouse clicks to those other containers with the children.
    pointerEvents: 'none',
  }),

  ag.fullWidthContainer({
    width: '100%',
  }),

  is(
    ag.floatingBottomFullWidthContainer,
    ag.floatingTopFullWidthContainer,
  )({
    display: 'inline-block',
    overflow: 'hidden',
    height: '100%',
    width: '100%',
  }),

  ag.virtualListContainer({
    overflow: 'hidden',
  }),

  // /**
  // ****************************
  // * Scrollers
  // ****************************
  // */
  ag.body({
    position: 'relative',
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'row !important' as any,
    // we have to state this for rtl, otherwise row-reverse is inherited
    minHeight: '0',
  }),

  is(ag.bodyHorizontalScroll, ag.bodyVerticalScroll)(
    {
      minHeight: '0',
      minWidth: '0',
      display: 'flex',
      position: 'relative',
    },

    $ag.scrollbarInvisible(
      {
        position: 'absolute',
        bottom: '0',
      },

      $ag.appleScrollbar(
        {
          opacity: '0',
          transition: 'opacity 0.4s',
          visibility: 'hidden',
        },

        $is(
          ag.scrollbarScrolling,
          ag.scrollbarActive,
        )({
          visibility: 'visible',
          opacity: '1',
        }),
      ),
    ),
  ),

  ag.bodyHorizontalScroll(
    {
      width: '100%',
    },

    $ag.scrollbarInvisible({
      alwaysLeft: '0',
      alwaysRight: '0',
    }),
  ),

  ag.bodyVerticalScroll(
    {
      height: '100%',
    },

    $ag.scrollbarInvisible({
      top: '0',
      zIndex: '10',
      trailing: '0',
    }),
  ),

  ag.forceVerticalScroll({
    overflowY: 'scroll !important' as any,
  }),

  is(ag.horizontalLeftSpacer, ag.horizontalRightSpacer)(
    {
      height: '100%',
      minWidth: '0',
      overflowX: 'scroll',
    },

    $ag.scrollerCorner({
      overflowX: 'hidden',
    }),
  ),

  // /**
  // ****************************
  // * Headers
  // ****************************
  // */
  is(
    ag.header,
    ag.pinnedLeftHeader,
    ag.pinnedRightHeader,
  )({
    display: 'inline-block',
    overflow: 'hidden',
    position: 'relative',
  }),

  is('.ag-header-cell-sortable .ag-header-cell-label')({
    cursor: 'pointer',
  }),

  ag.header({
    display: 'flex',
    width: '100%',
    whiteSpace: 'nowrap',
  }),

  ag.pinnedLeftHeader({
    height: '100%',
  }),

  ag.pinnedRightHeader({
    height: '100%',
  }),

  ag.headerRow(
    {
      position: 'absolute',
    },

    $not(ag.headerRowColumnGroup)({
      // so when floating filters are height 0px, the contents don't spill out
      overflow: 'hidden',
    }),
  ),

  is('.ag-header.ag-header-allow-overflow .ag-header-row')({
    overflow: 'visible',
  }),

  ag.headerCell({
    display: 'inline-flex',
    alignItems: 'center',
    position: 'absolute',
    height: '100%',
    overflow: 'hidden',
  }),

  is('.ag-header-cell.ag-header-active .ag-header-cell-menu-button')({
    opacity: '1',
  }),

  is('.ag-header-cell-menu-button:not(.ag-header-menu-always-show)')({
    transition: 'opacity 0.2s',
    opacity: '0',
  }),

  is(
    ag.headerGroupCellLabel,
    ag.headerCellLabel,
  )({
    display: 'flex',
    flex: '1 1 auto',
    alignSelf: 'stretch',
    alignItems: 'center',
  }),

  ag.headerCellLabel({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }),

  ag.headerGroupCellLabel.is(ag.stickyLabel)({
    position: 'sticky',
    flex: 'none',
    maxWidth: '100%',
  }),

  ag.headerGroupText({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }),

  ag.headerCellText({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }),

  is('.ag-header-cell:not(.ag-header-cell-auto-height) .ag-header-cell-comp-wrapper')({
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  }),

  ag.headerCellCompWrapper({
    width: '100%',
  }),

  is('.ag-header-cell-wrap-text .ag-header-cell-comp-wrapper')({
    whiteSpace: 'normal',
  }),

  is('.ag-right-aligned-header .ag-header-cell-label')({
    flexDirection: 'row-reverse',
  }),

  ag.headerCellResize({
    position: 'absolute',
    zIndex: '2',
    height: '100%',
    width: '8px',
    top: '0',
    cursor: 'ew-resize',
    // unpinned headers get their resize handle on the right in normal mode and left in RTL mode
    trailing: '-4px',
  }),

  is('.ag-pinned-left-header .ag-header-cell-resize')(
    {
      alwaysRight: '-4px',
    },

    // pinned left headers always have their resize on the right, even in RTL mode
  ),

  is('.ag-pinned-right-header .ag-header-cell-resize')(
    {
      alwaysLeft: '-4px',
    },

    // pinned right headers always have their resize on the left, even in RTL mode
  ),

  ag.headerSelectAll({
    display: 'flex',
  }),

  // /**
  // ****************************
  // * Columns
  // ****************************
  // */
  ag.columnMoving(
    ag.cell({
      transition: 'left 0.2s',
    }),
    ag.headerCell({
      transition: 'left 0.2s',
    }),
    ag.headerGroupCell({
      transition: 'left 0.2s, width 0.2s',
    }),
  ),

  // /**
  // ****************************
  // * Column Panel
  // ****************************
  // */
  ag.columnPanel({
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    flex: '1 1 auto',
  }),

  ag.columnSelect({
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    flex: '3 1 0px',
  }),

  ag.columnSelectHeader({
    position: 'relative',
    display: 'flex',
    flex: 'none',
  }),

  ag.columnSelectHeaderIcon({
    position: 'relative',
  }),

  ag.columnSelectHeaderFilterWrapper({
    flex: '1 1 auto',
  }),

  ag.columnSelectList({
    flex: '1 1 0px',
    overflow: 'hidden',
  }),

  ag.columnDrop({
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    overflow: 'auto',
    width: '100%',
  }),

  ag.columnDropList({
    display: 'flex',
    alignItems: 'center',
  }),

  ag.columnDropCell({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  }),

  ag.columnDropCellText({
    overflow: 'hidden',
    flex: '1 1 auto',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }),

  ag.columnDropVertical({
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    alignItems: 'stretch',
    flex: '1 1 0px',
  }),

  ag.columnDropVerticalTitleBar({
    display: 'flex',
    alignItems: 'center',
    flex: 'none',
  }),

  ag.columnDropVerticalList(
    {
      position: 'relative',
      alignItems: 'stretch',
      flexGrow: '1',
      flexDirection: 'column',
      overflowX: 'auto',
    },

    child({
      flex: 'none',
    }),
  ),

  is('.ag-column-drop-empty .ag-column-drop-vertical-list')({
    overflow: 'hidden',
  }),

  ag.columnDropVerticalEmptyMessage({
    display: 'block',
  }),

  ag.columnDrop.is(ag.columnDropHorizontal)({
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  }),

  ag.columnDropCellButton({
    cursor: 'pointer',
  }),

  ag.filterToolpanel({
    flex: '1 1 0px',
    minWidth: '0',
  }),

  ag.filterToolpanelHeader({
    position: 'relative',
  }),

  is(ag.filterToolpanelHeader, ag.filterToolpanelSearch)(
    {
      display: 'flex',
      alignItems: 'center',
    },

    child({
      display: 'flex',
      alignItems: 'center',
    }),
  ),

  ag.filterApplyPanel({
    display: 'flex',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  }),

  // /**
  // ****************************
  // * Rows
  // ****************************
  // */
  // for row animations.
  is('.ag-row-animation .ag-row')({
    transition: 'transform 0.4s, top 0.4s',
  }),

  // for rows older than one second, we also animate the height. we don't include the height
  // initially so we are not animating auto-height rows on initial render.
  is('.ag-row-animation .ag-row.ag-after-created')({
    transition: 'transform 0.4s, top 0.4s, height 0.4s',
  }),

  is('.ag-row-no-animation .ag-row')({
    transition: 'none',
  }),

  ag.row({
    whiteSpace: 'nowrap',
    width: '100%',
  }),

  ag.rowLoading({
    display: 'flex',
    alignItems: 'center',
  }),

  ag.rowPositionAbsolute({
    position: 'absolute',
  }),

  ag.rowPositionRelative({
    position: 'relative',
  }),

  ag.fullWidthRow({
    overflow: 'hidden',
    // turn events back on, as we removed them in the parent
    pointerEvents: 'all',
  }),

  ag.rowInlineEditing({
    zIndex: '1',
  }),

  ag.rowDragging({
    zIndex: '2',
  }),

  // /**
  // ****************************
  // * Cells
  // ****************************
  // */
  ag.cell({
    display: 'inline-block',
    position: 'absolute',
    whiteSpace: 'nowrap',
    height: '100%',
  }),

  // This is used when using a Cell Wrapper (eg row drag, selection, or auto-height).
  // If not using wrapper, ag-cell-value is on a div, which is 100% width. However when
  // in a wrapper, it's a span (not a div), so we need 100% width to provide consistent
  // behaviour regardless of wrapper used or not. If we did not do this, Cell Renderer's
  // with 100% width wouldn't get the full width when using a wrapper.
  // Instead of just 100% width we use flex, as it's not the only item on the line, so it
  // fills the remaining space.
  ag.cellValue({
    flex: '1 1 auto',
  }),

  is(
    ag.cellValue,
    ag.groupValue,
  )({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }),

  ag.cellWrapText({
    whiteSpace: 'normal',
    wordBreak: 'break-all',
  }),

  ag.cellWrapper(
    {
      display: 'flex',
      alignItems: 'center',
    },

    // adding overflow: hidden breaks the checkbox focus outline
    // overflow: hidden;
    // adding width: 100% here breaks text-overflow: ellipsis
    // width: 100%;
    $ag.rowGroup({
      alignItems: 'flex-start',
    }),
  ),

  ag.sparklineWrapper({
    position: 'absolute',
    height: '100%',
    width: '100%',
    alwaysLeft: '0',
    top: '0',
  }),

  is('.ag-full-width-row .ag-cell-wrapper.ag-row-group')({
    height: '100%',
    alignItems: 'center',
  }),

  ag.cellInlineEditing(
    {
      zIndex: '1',
    },

    is(
      ag.cellWrapper,
      ag.cellEditWrapper,
      ag.cellEditor,
      '.ag-cell-editor .ag-wrapper',
      '.ag-cell-editor input',
    )({
      height: '100%',
      width: '100%',
      lineHeight: 'normal',
    }),
  ),

  is('.ag-cell .ag-icon')({
    display: 'inline-block',
    verticalAlign: 'middle',
  }),

  // /**
  // ****************************
  // * Filters
  // ****************************
  // */
  ag.setFilterItem({
    display: 'flex',
    alignItems: 'center',
    height: '100%',
  }),

  ag.setFilterItemCheckbox({
    display: 'flex',
    overflow: 'hidden',
    height: '100%',
  }),

  ag.setFilterGroupIcons(
    {
      display: 'block',
    },

    child({
      cursor: 'pointer',
    }),
  ),

  ag.filterBodyWrapper({
    display: 'flex',
    flexDirection: 'column',
  }),

  ag.filterFilter({
    flex: '1 1 0px',
  }),

  ag.filterCondition({
    display: 'flex',
    justifyContent: 'center',
  }),

  // /**
  // ****************************
  // * Floating Filter
  // ****************************
  // */
  ag.floatingFilterBody({
    position: 'relative',
    display: 'flex',
    flex: '1 1 auto',
    height: '100%',
  }),

  ag.floatingFilterFullBody({
    display: 'flex',
    flex: '1 1 auto',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    overflow: 'hidden',
  }),

  is('.ag-floating-filter-full-body > div')({
    flex: '1 1 auto',
  }),

  ag.floatingFilterInput(
    {
      alignItems: 'center',
      display: 'flex',
      width: '100%',
    },

    child({
      flex: '1 1 auto',
    }),
  ),

  ag.floatingFilterButton({
    display: 'flex',
    flex: 'none',
  }),

  is('.ag-set-floating-filter-input input[disabled]')({
    pointerEvents: 'none',
  }),

  // /**
  // ****************************
  // * Drag & Drop
  // ****************************
  // */
  ag.dndGhost({
    position: 'absolute',
    display: 'inline-flex',
    alignItems: 'center',
    cursor: 'move',
    whiteSpace: 'nowrap',
    zIndex: '9999',
  }),

  // /**
  // ****************************
  // * Overlay
  // ****************************
  // */
  ag.overlay({
    height: '100%',
    alwaysLeft: '0',
    pointerEvents: 'none',
    position: 'absolute',
    top: '0',
    width: '100%',
    zIndex: '2',
  }),

  ag.overlayPanel({
    display: 'flex',
    height: '100%',
    width: '100%',
  }),

  ag.overlayWrapper({
    display: 'flex',
    flex: 'none',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  }),

  ag.overlayLoadingWrapper({
    // prevent interaction with grid while it's loading
    pointerEvents: 'all',
  }),

  // /**
  // ****************************
  // * Popup
  // ****************************
  // */
  ag.popupChild({
    zIndex: '5',
    top: '0',
  }),

  ag.popupEditor({
    position: 'absolute',
    userSelect: 'none',
  }),

  ag.largeTextInput({
    display: 'block',
  }),

  // /**
  // ****************************
  // * Virtual Lists
  // ****************************
  // */
  ag.virtualListItem({
    position: 'absolute',
    width: '100%',
  }),

  // /**
  // ****************************
  // * Floating Top and Bottom
  // ****************************
  // */
  ag.floatingTop({
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    width: '100%',
    position: 'relative',
    display: 'flex',
  }),

  ag.pinnedLeftFloatingTop({
    display: 'inline-block',
    overflow: 'hidden',
    position: 'relative',
    minWidth: '0px',
  }),

  ag.pinnedRightFloatingTop({
    display: 'inline-block',
    overflow: 'hidden',
    position: 'relative',
    minWidth: '0px',
  }),

  ag.floatingBottom({
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    width: '100%',
    position: 'relative',
    display: 'flex',
  }),

  ag.pinnedLeftFloatingBottom({
    display: 'inline-block',
    overflow: 'hidden',
    position: 'relative',
    minWidth: '0px',
  }),

  ag.pinnedRightFloatingBottom({
    display: 'inline-block',
    overflow: 'hidden',
    position: 'relative',
    minWidth: '0px',
  }),

  // /**
  // ****************************
  // * Sticky Top
  // ****************************
  // */
  ag.stickyTop({
    position: 'absolute',
    display: 'flex',
    width: '100%',
  }),

  is(
    ag.pinnedLeftStickyTop,
    ag.pinnedRightStickyTop,
  )({
    position: 'relative',
    height: '100%',
    overflow: 'hidden',
  }),

  ag.stickyTopFullWidthContainer({
    overflow: 'hidden',
    width: '100%',
    height: '100%',
  }),

  // /**
  // ****************************
  // * Dialog
  // ****************************
  // */
  is(
    ag.dialog,
    ag.panel,
  )({
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
  }),

  ag.panelTitleBar({
    display: 'flex',
    flex: 'none',
    alignItems: 'center',
    cursor: 'default',
  }),

  ag.panelTitleBarTitle({
    flex: '1 1 auto',
  }),

  ag.panelTitleBarButtons({
    display: 'flex',
  }),

  ag.panelTitleBarButton({
    cursor: 'pointer',
  }),

  ag.panelContentWrapper({
    display: 'flex',
    flex: '1 1 auto',
    position: 'relative',
    overflow: 'hidden',
  }),

  ag.dialog({
    position: 'absolute',
  }),

  ag.resizer(
    {
      position: 'absolute',
      pointerEvents: 'none',
      zIndex: '1',
      userSelect: 'none',
    },

    $ag.resizerTopLeft({
      top: '0',
      alwaysLeft: '0',
      height: '5px',
      width: '5px',
      cursor: 'nwse-resize',
    }),
    $ag.resizerTop({
      top: '0',
      alwaysLeft: '5px',
      alwaysRight: '5px',
      height: '5px',
      cursor: 'ns-resize',
    }),
    $ag.resizerTopRight({
      top: '0',
      alwaysRight: '0',
      height: '5px',
      width: '5px',
      cursor: 'nesw-resize',
    }),
    $ag.resizerRight({
      top: '5px',
      alwaysRight: '0',
      bottom: '5px',
      width: '5px',
      cursor: 'ew-resize',
    }),
    $ag.resizerBottomRight({
      bottom: '0',
      alwaysRight: '0',
      height: '5px',
      width: '5px',
      cursor: 'nwse-resize',
    }),
    $ag.resizerBottom({
      bottom: '0',
      alwaysLeft: '5px',
      alwaysRight: '5px',
      height: '5px',
      cursor: 'ns-resize',
    }),
    $ag.resizerBottomLeft({
      bottom: '0',
      alwaysLeft: '0',
      height: '5px',
      width: '5px',
      cursor: 'nesw-resize',
    }),
    $ag.resizerLeft({
      alwaysLeft: '0',
      top: '5px',
      bottom: '5px',
      width: '5px',
      cursor: 'ew-resize',
    }),
  ),

  // /**
  // ****************************
  // * Tooltip
  // ****************************
  // */
  ag.tooltip({
    position: 'absolute',
    zIndex: '99999',
  }),

  ag.tooltipCustom({
    position: 'absolute',
    zIndex: '99999',
  }),

  is(
    '.ag-tooltip:not(.ag-tooltip-interactive)',
    '.ag-tooltip-custom:not(.ag-tooltip-interactive)',
  )({
    pointerEvents: 'none',
  }),

  // /**
  // ****************************
  // * Animations
  // ****************************
  // */
  // this is used by the animateShowChangeCellRenderer. it is arguable that this belongs in the themes,
  // however it is not tied to color, only placement and visibility, which is behaviour and not style,
  // thus belongs here, besides it doesn't change wih the themes
  ag.valueSlideOut({
    marginAlwaysRight: '5px',
    opacity: '1',
    transition: 'opacity 3s, margin-right 3s',
    // as value fades, it also moves to the left via the margin setting
    transitionTimingFunction: 'linear',
  }),

  ag.valueSlideOutEnd({
    marginAlwaysRight: '10px',
    opacity: '0',
  }),

  ag.opacityZero({
    opacity: '0 !important' as any,
  }),

  // /**
  // ****************************
  // * Menu
  // ****************************
  // */
  ag.menu({
    maxHeight: '100%',
    overflowY: 'auto',
    position: 'absolute',
    userSelect: 'none',
  }),

  ag.menuColumnSelectWrapper(
    {
      height: '265px',
      overflow: 'auto',
    },

    ag.columnSelect({
      height: '100%',
    }),
  ),

  ag.menuList({
    display: 'table',
    width: '100%',
  }),

  is(
    ag.menuOption,
    ag.menuSeparator,
  )({
    display: 'table-row',
  }),

  is(
    ag.menuOptionPart,
    ag.menuSeparatorPart,
  )({
    display: 'table-cell',
    verticalAlign: 'middle',
  }),

  ag.menuOptionText({
    whiteSpace: 'nowrap',
  }),

  ag.compactMenuOption({
    width: '100%',
    display: 'flex',
    flexWrap: 'nowrap',
  }),

  ag.compactMenuOptionText({
    whiteSpace: 'nowrap',
    flex: '1 1 auto',
  }),

  // /**
  // ****************************
  // * Rich Select
  // ****************************
  // */
  ag.richSelect({
    cursor: 'default',
    outline: 'none',
    height: '100%',
  }),

  ag.richSelectValue(
    {
      display: 'flex',
      alignItems: 'center',
      height: '100%',
    },

    ag.pickerFieldDisplay(
      {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },

      $ag.displayAsPlaceholder({
        opacity: '0.5',
      }),
    ),
  ),

  ag.richSelectList(
    {
      position: 'relative',
    },

    ag.loadingText({
      minHeight: '2rem',
    }),
  ),

  ag.richSelectRow({
    display: 'flex',
    flex: '1 1 auto',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    height: '100%',
  }),

  ag.richSelectFieldInput(
    {
      flex: '1 1 auto',
    },

    ag.inputFieldInput(
      {
        padding: '0 !important' as any,
        border: 'none !important' as any,
        boxShadow: 'none !important' as any,
        textOverflow: 'ellipsis',
      },

      $placeholder({
        opacity: '0.8',
      }),
    ),
  ),

  // /**
  // ****************************
  // * Autocomplete
  // ****************************
  // */
  ag.autocomplete(
    {
      alignItems: 'center',
      display: 'flex',
    },

    child({
      flex: '1 1 auto',
    }),
  ),

  ag.autocompleteListPopup({
    position: 'absolute',
    userSelect: 'none',
  }),

  ag.autocompleteList({
    position: 'relative',
  }),

  ag.autocompleteVirtualListItem({
    display: 'flex',
  }),

  ag.autocompleteRow({
    display: 'flex',
    flex: '1 1 auto',
    alignItems: 'center',
    overflow: 'hidden',
  }),

  ag.autocompleteRowLabel({
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }),

  // /**
  // ****************************
  // * Pagination
  // ****************************
  // */
  ag.pagingPanel({
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'flex-end',
  }),

  ag.pagingPageSummaryPanel({
    display: 'flex',
    alignItems: 'center',
  }),

  ag.pagingButton({
    position: 'relative',
  }),

  is('.ag-disabled .ag-paging-page-summary-panel')({
    pointerEvents: 'none',
  }),

  // /**
  // ****************************
  // * Tool Panel
  // ****************************
  // */
  ag.toolPanelWrapper({
    display: 'flex',
    overflowY: 'auto',
    overflowX: 'hidden',
    cursor: 'default',
    userSelect: 'none',
  }),

  is(
    ag.columnSelectColumn,
    ag.columnSelectColumnGroup,
    ag.selectAggFuncItem,
  )(
    {
      position: 'relative',
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      height: '100%',
    },

    child({
      flex: 'none',
    }),
  ),

  is(
    ag.selectAggFuncItem,
    ag.columnSelectColumnLabel,
  )({
    flex: '1 1 auto',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }),

  ag.columnSelectCheckbox({
    display: 'flex',
  }),

  ag.toolPanelHorizontalResize({
    cursor: 'ew-resize',
    height: '100%',
    position: 'absolute',
    top: '0',
    width: '5px',
    zIndex: '1',
  }),

  is('.ag-side-bar-left .ag-tool-panel-horizontal-resize')({
    trailing: '-3px',
  }),

  is('.ag-side-bar-right .ag-tool-panel-horizontal-resize')({
    leading: '-3px',
  }),

  ag.detailsRow({
    width: '100%',
  }),

  ag.detailsRowFixedHeight({
    height: '100%',
  }),

  ag.detailsGrid({
    width: '100%',
  }),

  ag.detailsGridFixedHeight({
    height: '100%',
  }),

  ag.headerGroupCell({
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    position: 'absolute',
  }),

  is('.ag-header-group-cell-no-group.ag-header-span-height .ag-header-cell-resize')({
    display: 'none',
  }),

  ag.cellLabelContainer({
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  }),

  ag.rightAlignedHeader(
    ag.cellLabelContainer({
      flexDirection: 'row',
    }),
    ag.headerCellText({
      textAlign: 'end',
    }),
  ),

  // /**
  // ****************************
  // * Side Bar
  // ****************************
  // */
  ag.sideBar({
    display: 'flex',
    flexDirection: 'row-reverse',
  }),

  ag.sideBarLeft({
    order: '-1',
    flexDirection: 'row',
  }),

  ag.sideButtonButton({
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'nowrap',
    whiteSpace: 'nowrap',
    outline: 'none',
    cursor: 'pointer',
  }),

  ag.sideButtonLabel({
    writingMode: 'vertical-lr',
  }),

  // /**
  // ****************************
  // * Status Bar
  // ****************************
  // */
  ag.statusBar({
    display: 'flex',
    justifyContent: 'space-between',
    overflow: 'hidden',
  }),

  ag.statusPanel({
    display: 'inline-flex',
  }),

  ag.statusNameValue({
    whiteSpace: 'nowrap',
  }),

  ag.statusBarLeft({
    display: 'inline-flex',
  }),

  ag.statusBarCenter({
    display: 'inline-flex',
  }),

  ag.statusBarRight({
    display: 'inline-flex',
  }),

  // /**
  // ****************************
  // * Widgets
  // ****************************
  // */
  ag.icon({
    display: 'block',
  }),

  ag.group({
    position: 'relative',
    width: '100%',
  }),

  ag.groupTitleBar({
    display: 'flex',
    alignItems: 'center',
  }),

  ag.groupTitle({
    display: 'block',
    flex: '1 1 auto',
    minWidth: '0',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  }),

  is('.ag-group-title-bar .ag-group-title')({
    cursor: 'default',
  }),

  ag.groupToolbar({
    display: 'flex',
    alignItems: 'center',
  }),

  ag.groupContainer({
    display: 'flex',
  }),

  is('.ag-disabled .ag-group-container')({
    pointerEvents: 'none',
  }),

  ag.groupContainerHorizontal({
    flexDirection: 'row',
    flexWrap: 'wrap',
  }),

  ag.groupContainerVertical({
    flexDirection: 'column',
  }),

  ag.columnGroupIcons(
    {
      display: 'block',
    },

    child({
      cursor: 'pointer',
    }),
  ),

  is('.ag-group-item-alignment-stretch .ag-group-item')({
    alignItems: 'stretch',
  }),

  is('.ag-group-item-alignment-start .ag-group-item')({
    alignItems: 'flex-start',
  }),

  is('.ag-group-item-alignment-end .ag-group-item')({
    alignItems: 'flex-end',
  }),

  is(
    ag.inputField,
    ag.select,
  )({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  }),

  ag.inputFieldInput({
    flex: '1 1 auto',
  }),

  is(".ag-floating-filter-input .ag-input-field-input[type='date']")({
    // Fix a bug in Blink rendering engine where date input will not shrink from its default size in a
    // flex container, but it will grow. So we give it a very small width and it will grow to the right size
    width: '1px',
  }),

  ag.rangeField({
    display: 'flex',
    alignItems: 'center',
  }),

  ag.angleSelect({
    display: 'flex',
    alignItems: 'center',
  }),

  ag.angleSelectWrapper({
    display: 'flex',
  }),

  ag.angleSelectParentCircle({
    display: 'block',
    position: 'relative',
  }),

  ag.angleSelectChildCircle({
    position: 'absolute',
  }),

  ag.sliderWrapper(
    {
      display: 'flex',
    },

    ag.inputField({
      flex: '1 1 auto',
    }),
  ),

  ag.pickerFieldDisplay({
    flex: '1 1 auto',
  }),

  ag.pickerField({
    display: 'flex',
    alignItems: 'center',
  }),

  ag.pickerFieldIcon({
    display: 'flex',
    border: '0',
    padding: '0',
    margin: '0',
    cursor: 'pointer',
  }),

  ag.pickerFieldWrapper({
    overflow: 'hidden',
  }),

  ag.labelAlignRight(
    ag.label({
      order: '1',
    }),
    child({
      flex: 'none',
    }),
  ),

  ag.labelAlignTop(
    {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },

    child({
      alignSelf: 'stretch',
    }),
  ),

  ag.labelEllipsis({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flex: '1',
  }),

  ag.colorPanel({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
  }),

  ag.spectrumColor({
    flex: '1 1 auto',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'default',
  }),

  ag.spectrumFill({
    position: 'absolute',
    top: '0',
    alwaysLeft: '0',
    alwaysRight: '0',
    bottom: '0',
  }),

  ag.spectrumVal({
    cursor: 'pointer',
  }),

  ag.spectrumDragger({
    position: 'absolute',
    pointerEvents: 'none',
    cursor: 'pointer',
  }),

  ag.spectrumHue({
    cursor: 'default',
    background:
      'linear-gradient(to left, #ff0000 3%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
  }),

  ag.spectrumAlpha({
    cursor: 'default',
  }),

  ag.spectrumHueBackground({
    width: '100%',
    height: '100%',
  }),

  ag.spectrumAlphaBackground({
    backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0), rgb(0, 0, 0))',
    width: '100%',
    height: '100%',
  }),

  ag.spectrumTool({
    cursor: 'pointer',
  }),

  ag.spectrumSlider({
    position: 'absolute',
    pointerEvents: 'none',
  }),

  ag.recentColors({
    display: 'flex',
  }),

  ag.recentColor({
    cursor: 'pointer',
  }),

  // Default values for themes that do not use the mixins

  /****************************
   * TODO, port this Sass code:
   * @for $i from 1 to 10 {
   *         .ag-column-select-indent-#{$i} {
   *             @include ag.unthemed-rtl(( padding-left: $i * 20px ));
   *         }
   *
   *         .ag-set-filter-indent-#{$i} {
   *             @include ag.unthemed-rtl(( padding-left: $i * 20px ));
   *         }
   *
   *         .ag-row-group-indent-#{$i} {
   *             @include ag.unthemed-rtl(( padding-left: $i * 20px ));
   *         }
   *     }
   ****************************/
  ag.ltr(
    {
      direction: 'ltr',
    },

    is(
      ag.body,
      ag.floatingTop,
      ag.floatingBottom,
      ag.header,
      ag.stickyTop,
      ag.bodyViewport,
      ag.bodyHorizontalScroll,
    )({
      flexDirection: 'row',
    }),
  ),

  ag.rtl(
    {
      direction: 'rtl',
    },

    is(
      ag.body,
      ag.floatingTop,
      ag.floatingBottom,
      ag.header,
      ag.stickyTop,
      ag.bodyViewport,
      ag.bodyHorizontalScroll,
    )({
      flexDirection: 'row-reverse',
    }),
    is(
      ag.iconContracted,
      ag.iconExpanded,
      ag.iconTreeClosed,
    )({
      display: 'block',
      transform: 'rotate(180deg)',
    }),
  ),
].flat();
  