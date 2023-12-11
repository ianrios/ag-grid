// import {
//   absolute,
//   auto,
//   block,
//   center,
//   flex,
//   hidden,
//   inlineBlock,
//   literal,
//   none,
//   normal,
//   one,
//   percent,
//   px,
//   relative,
//   rules,
//   seconds,
//   selectors,
//   untypedSelectors,
//   zero,
// } from 'design-system/css-in-js';

// export const generalStructuralStyles = rules({
//   [untypedSelectors(
//     'ag-grid',
//     'ag-grid-angular',
//     'ag-grid-ng2',
//     'ag-grid-polymer',
//     'ag-grid-aurelia',
//   )]: {
//     display: block,
//   },
//   hidden: {
//     display: none.important,
//   },
//   invisible: {
//     visibility: hidden.important,
//   },
//   noTransition: {
//     transition: none.important,
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
//     userSelect: literal('text'),
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
// });
