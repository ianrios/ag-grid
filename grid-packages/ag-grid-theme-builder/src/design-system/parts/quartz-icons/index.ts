import { ThemePart } from 'design-system/design-system-types';
import { applyDefaults } from 'design-system/design-system-utils';
import quartzIconsCSS from './quartz-icons.css?inline';

export type QuartzIconsParams = {
  strokeWidth?: number;
  iconSize?: number;
};

export const quartzIconsParamsDefaults = (
  params: QuartzIconsParams = {},
): Required<QuartzIconsParams> =>
  applyDefaults(params, {
    iconSize: 16,
    strokeWidth: 1.5,
  });

export const quartzIcons = (params: QuartzIconsParams = {}): ThemePart => {
  let { iconSize, strokeWidth } = quartzIconsParamsDefaults(params);

  return {
    css: quartzIconsCSS,
    variables: {
      '--ag-icon-size': `${iconSize}px`,
      '--ag-icon-stroke-width': `${strokeWidth}px`,
    },
  };
};
