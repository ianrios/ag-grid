import { ThemePart } from 'design-system/design-system-types';
import { applyDefaults } from 'design-system/design-system-utils';
import { logErrorMessageOnce } from 'model/utils';
import { agIconNameToSvgFragment } from './lucide-fragments';
import quartzIconsCSS from './quartz-icons.css?inline';

export type QuartzIconsParams = {
  color?: string | number;
  strokeWidth?: number;
  iconSize?: number;
};

export const quartzIconsParamsDefaults = (
  params: QuartzIconsParams = {},
): Required<QuartzIconsParams> =>
  applyDefaults(params, {
    color: '#000',
    iconSize: 16,
    strokeWidth: 1.5,
  });

export const quartzIcons = (params: QuartzIconsParams = {}): ThemePart => {
  let { iconSize, color, strokeWidth } = quartzIconsParamsDefaults(params);
  const cssParts = [iconCss(iconSize)];

  if (typeof color === 'number') {
    // TODO implement colours as numbers
    logErrorMessageOnce(
      'Colours as numbers are not implemented for quartz icons yet, using black instead',
    );
    color = '#000';
  }

  if (/[<>&'"]/.test(color)) {
    // we're just testing for characters that will break the XML, not attempting to validate
    // the CSS color spec which is pretty huge
    throw new Error(`Expected icon color to be a valid CSS color, got ${JSON.stringify(color)}`);
  }

  const scaledStrokeWidth = (strokeWidth * 24) / iconSize;

  const svgPrefix = `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" stroke-width="${scaledStrokeWidth}" stroke-linecap="round" stroke-linejoin="round">`;
  const svgSuffix = '</svg>';
  for (const [agName, svgFragment] of Object.entries(agIconNameToSvgFragment)) {
    const svg = svgPrefix + svgFragment + svgSuffix;
    const dataUri = `url(data:image/svg+xml;utf8,${encodeURIComponent(svg)})`;
    cssParts.push(`:ag-current-theme .ag-icon-${agName} {\n\tbackground-image: ${dataUri}\n}`);
  }

  return {
    css: quartzIconsCSS,
    variables: {
      '--ag-icon-size': `${iconSize}px`,
      '--ag-icon-stroke-width': `${scaledStrokeWidth}px`,
    },
  };
};

// TODO use --ag-icon-size variable
const iconCss = (size: number) => `:ag-current-theme .ag-icon {
  width: ${size}px;
  height: ${size}px;
  background: transparent center/contain no-repeat;
}`;
