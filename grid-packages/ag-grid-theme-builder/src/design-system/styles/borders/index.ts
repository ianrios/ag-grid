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

import aboveFootersCSS from './borders-above-footers.css?inline';
import belowHeadersCSS from './borders-below-headers.css?inline';
import betweenColumnsCSS from './borders-between-columns.css?inline';
import betweenRowsCSS from './borders-between-rows.css?inline';
import outsideCSS from './borders-outside.css?inline';
import pinnedColumnsCSS from './borders-pinned-columns.css?inline';
import pinnedRowsCSS from './borders-pinned-rows.css?inline';
import sidePanelsCSS from './borders-side-panels.css?inline';

export const borders = ({
  outside = true,
  belowHeaders = true,
  aboveFooters = true,
  betweenRows = true,
  betweenColumns = false,
  pinnedRows = true,
  pinnedColumns = true,
  sidePanels = true,
}: BordersParams = {}): string =>
  [
    outside && outsideCSS,
    belowHeaders && belowHeadersCSS,
    aboveFooters && aboveFootersCSS,
    betweenRows && betweenRowsCSS,
    betweenColumns && betweenColumnsCSS,
    pinnedRows && pinnedRowsCSS,
    pinnedColumns && pinnedColumnsCSS,
    sidePanels && sidePanelsCSS,
  ]
    .filter(Boolean)
    .join('\n');
