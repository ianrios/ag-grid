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
import { applyDefaults, recordEntries } from 'design-system/design-system-utils';
import aboveFooters from './borders-above-footers.css?inline';
import belowHeaders from './borders-below-headers.css?inline';
import betweenColumns from './borders-between-columns.css?inline';
import betweenRows from './borders-between-rows.css?inline';
import outside from './borders-outside.css?inline';
import pinnedColumns from './borders-pinned-columns.css?inline';
import pinnedRows from './borders-pinned-rows.css?inline';
import sidePanels from './borders-side-panels.css?inline';

const parts: Record<keyof BordersParams, string> = {
  aboveFooters,
  belowHeaders,
  betweenColumns,
  betweenRows,
  outside,
  pinnedColumns,
  pinnedRows,
  sidePanels,
};

export const borders = (params: BordersParams = {}): ThemePart => {
  let css = '';
  for (const [name, include] of recordEntries(bordersParamsDefaults(params))) {
    if (include) {
      css += `\n/* SUB PART borders > ${name} */\n${parts[name]}`;
    }
  }
  return {
    css,
    variables: {},
  };
};
