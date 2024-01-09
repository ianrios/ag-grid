import { ThemePart } from 'design-system/design-system-types';
import { applyDefaults } from 'design-system/design-system-utils';
import colorsCSS from './colors.css?inline';

export type ColorsParams = {
  /**
   * Background color of the grid. The default is white - if you override
   * this, ensure that there is enough contrast between the foreground and
   * background.
   *
   * @default #FFF
   */
  background?: string;

  /**
   * Text color of the grid. The default is black - if you override this,
   * ensure that there is enough contrast between the foreground and
   * background.
   *
   * @default #000
   */
  foreground?: string;
};

export const colorsParamsDefaults = (params: ColorsParams = {}): Required<ColorsParams> =>
  applyDefaults(params, {
    background: '#FFF',
    foreground: '#000',
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
  return {
    css: colorsCSS,
    variables: {
      '--ag-background-color': withDefaults.background,
      '--ag-foreground-color': withDefaults.foreground,
    },
  };
};
