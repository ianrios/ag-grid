import { ThemePart } from 'design-system/design-system-types';
import { applyDefaults, colorParamToCss, kebabCase } from 'design-system/design-system-utils';
import colorsCSS from './colors.css?inline';

export type ColorsParams = {
  /**
   * Background colour of the grid. The default is white - if you override
   * this, ensure that there is enough contrast between the foreground and
   * background.
   *
   * @default #FFF
   */
  background?: string;

  /**
   * Foreground colour of the grid, and default text colour. The default is black - if you
   * override this, ensure that there is enough contrast between the foreground
   * and background.
   *
   * @default #000
   */
  foreground?: string;

  /**
   * The "brand colour" for the grid, used wherever a non-neutral colour is
   * required. Selections, focus outlines and checkboxes use the accent colour
   * by default.
   *
   * @default #2196f3 (light blue)
   */
  accent?: string;

  /**
   * Default colour for borders. The default is black - if you override this,
   * ensure that there is enough contrast between the foreground and
   * background.
   *
   * @default 0.15 (15% foreground)
   */
  border?: string | number;

  /**
   * Background colour for non-data areas of the grid. Headers, tool panels and
   * menus use this colour by default.
   *
   * @default 0.02 (2% foreground)
   */
  chromeBackground?: string | number;
};

export const colorsParamsDefaults = (params: ColorsParams = {}): Required<ColorsParams> =>
  applyDefaults(params, {
    background: '#FFF',
    foreground: '#000',
    accent: '#2196f3',
    border: 0.15,
    chromeBackground: 0.02,
  });

/**
 * Default color scheme theme part.
 *
 * Although this theme part is optional, other theme parts rely on the CSS
 * variables set by this part, especially --ag-background-color,
 * --ag-foreground-color and --ag-border-color. If you omit this part, you
 * should ensure that these variables are set.
 */
export const colors = (params: ColorsParams = {}): ThemePart => {
  const withDefaults = colorsParamsDefaults(params);
  const variables: Record<string, string> = {};
  for (const [property, value] of Object.entries(withDefaults)) {
    const variable = `--ag-${kebabCase(property)}-color`;
    variables[variable] = colorParamToCss(value);
  }
  return {
    css: colorsCSS,
    variables,
  };
};
