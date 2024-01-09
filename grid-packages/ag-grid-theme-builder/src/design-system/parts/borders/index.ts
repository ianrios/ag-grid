export type BordersParams = {
  /**
   * Border around the outside of the grid
   *
   * @default true
   */
  outside?: boolean;

  /**
   * Borders between and below headers, including ordinary header rows and
   * components that render within header rows such as the floating filter and
   * advanced filter
   *
   * @default true
   */
  belowHeaders?: boolean;

  /**
   * Horizontal borders above footer components like the pagination and status bars
   *
   * @default true
   */
  aboveFooters?: boolean;

  /**
   * Horizontal borders separating rows
   *
   * @default true
   */
  betweenRows?: boolean;

  /**
   * Vertical borders separating columns
   *
   * @default false
   */
  betweenColumns?: boolean;

  /**
   * Borders between the grid and rows that are pinned to the top or bottom
   *
   * @default true
   */
  pinnedRows?: boolean;

  /**
   * Borders between the grid and columns that are pinned to the left or right
   *
   * @default true
   */
  pinnedColumns?: boolean;

  /**
   * Borders between the grid and side panels including the column and filter
   * tool bars, and chart settings
   *
   * @default true
   */
  sidePanels?: boolean;
};

export const bordersParamsDefaults = (params: BordersParams = {}): Required<BordersParams> =>
  applyDefaults(params, {
    outside: true,
    belowHeaders: true,
    aboveFooters: true,
    betweenRows: true,
    betweenColumns: false,
    pinnedRows: true,
    pinnedColumns: true,
    sidePanels: true,
  });

import { ThemePart } from 'design-system/design-system-types';
import { applyDefaults } from 'design-system/design-system-utils';
import aboveFootersCSS from './borders-above-footers.css?inline';
import belowHeadersCSS from './borders-below-headers.css?inline';
import betweenColumnsCSS from './borders-between-columns.css?inline';
import betweenRowsCSS from './borders-between-rows.css?inline';
import outsideCSS from './borders-outside.css?inline';
import pinnedColumnsCSS from './borders-pinned-columns.css?inline';
import pinnedRowsCSS from './borders-pinned-rows.css?inline';
import sidePanelsCSS from './borders-side-panels.css?inline';

export const borders = (params: BordersParams = {}): ThemePart => {
  const withDefaults = bordersParamsDefaults(params);
  return {
    css: [
      withDefaults.outside && outsideCSS,
      withDefaults.belowHeaders && belowHeadersCSS,
      withDefaults.aboveFooters && aboveFootersCSS,
      withDefaults.betweenRows && betweenRowsCSS,
      withDefaults.betweenColumns && betweenColumnsCSS,
      withDefaults.pinnedRows && pinnedRowsCSS,
      withDefaults.pinnedColumns && pinnedColumnsCSS,
      withDefaults.sidePanels && sidePanelsCSS,
    ]
      .filter(Boolean)
      .join('\n'),
    variables: {},
  };
};
