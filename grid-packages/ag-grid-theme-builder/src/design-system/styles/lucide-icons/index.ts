import agIconNameToSvgFragment from './lucide-fragments';

export type LucideIconsConfig = {
  color?: string;
  strokeWidth?: number;
  iconSize?: number;
};

export const lucideIcons = ({
  color = '#000',
  iconSize = 16,
  strokeWidth = 1.5,
}: LucideIconsConfig): string => {
  const cssParts = [iconCss(iconSize)];

  if (/[<>&'"]/.test(color)) {
    // we're just testing for characters that will break the HTML, not attempting to validate
    // the CSS color spec which is pretty huge
    throw new Error(`Expected icon color to be a valid CSS color, got ${JSON.stringify(color)}`);
  }

  // prevent the stroke width from changing as a result of scaling the icon image
  const scaledStrokeWidth = (strokeWidth * 24) / iconSize;

  const svgPrefix = `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${scaledStrokeWidth}" stroke-linecap="round" stroke-linejoin="round">`;
  const svgSuffix = '</svg>';
  for (const [agName, svgFragment] of Object.entries(agIconNameToSvgFragment)) {
    const svg = svgPrefix + svgFragment + svgSuffix;
    const dataUri = `url(data:image/svg+xml;utf8,${encodeURIComponent(svg)})`;
    cssParts.push(`_theme_ .ag-icon-${agName} {\n\tbackground-image: ${dataUri}\n}`);
  }

  return cssParts.join('\n\n');
};

const iconCss = (size: number) => `_theme_ .ag-icon {
  width: ${size}px;
  height: ${size}px;
  background: transparent center/contain no-repeat;
}`;
