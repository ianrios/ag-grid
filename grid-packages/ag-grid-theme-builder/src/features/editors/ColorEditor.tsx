import { Card } from '@mui/joy';
import { styled } from '@mui/system';
import { UIDropdownButton } from 'components/UIDropdownButton';
import { clamp, logErrorMessageOnce } from 'model/utils';
import { useEffect, useRef, useState } from 'react';
import { RgbaColor, RgbaColorPicker } from 'react-colorful';

export type ColorEditorProps = {
  value: string | number;
  onChange: (value: string) => void;
};

export const ColorEditor = (props: ColorEditorProps) => {
  const propsRef = useRef(props);
  propsRef.current = props;
  const cssValue = colorValueToCssExpression(props.value);
  const [rgba, setRgba] = useState(() => colorValueToRGBA(cssValue) || { r: 0, g: 0, b: 0, a: 1 });

  useEffect(() => {
    propsRef.current.onChange(rgbaToHex(rgba));
  }, [rgba]);

  const renderUI = () => <RgbaColorPicker color={rgba} onChange={setRgba} />;

  let label: string;
  if (rgba.a === 0) {
    label = 'transparent';
  } else if (typeof props.value === 'number') {
    label = Math.round(props.value * 100) + '% foreground';
  } else if (rgba.a < 1) {
    label = rgbaToHex({ ...rgba, a: 1 }) + ` / ${Math.round(rgba.a * 100)}%`;
  } else {
    label = rgbaToHex(rgba);
  }

  return (
    <UIDropdownButton renderUI={renderUI}>
      <ColorSwatch style={{ backgroundColor: cssValue }} />
      {label}
    </UIDropdownButton>
  );

  // return ;
};

const ColorSwatch = styled(Card)`
  width: 20px;
  height: 20px;
  padding: 0;
  border-radius: 3px;
  border-width: 2px;
  background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill-opacity=".05"><path d="M8 0h8v8H8zM0 8h8v8H0z"/></svg>');
`;

// background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill-opacity=".05"><path d="M8 0h8v8H8zM0 8h8v8H0z"/></svg>')

const colorValueToCssExpression = (value: string | number) =>
  typeof value === 'number'
    ? `color-mix(in srgb, transparent, var(--ag-foreground-color) ${clamp(value, 0, 1)})`
    : value;

let colorEl: HTMLElement | undefined;
const colorValueToRGBA = (value: string | number): RgbaColor | null => {
  if (!colorEl) {
    document.body.appendChild((colorEl = document.createElement('span')));
  }
  // We get the browser to do the heavy lifting by using the provided expression
  // in a color-mix(srgb) and reading back the evaluated srgb colour. This
  // allows users to specify colours in any colour space
  const css = colorValueToCssExpression(value);
  colorEl.style.backgroundColor = `color-mix(in srgb, transparent, ${css} 100%)`;
  if (!colorEl.style.backgroundColor) return null;
  const srgbColor = getComputedStyle(colorEl).backgroundColor;
  const match = srgbColor.match(
    /^color\(srgb ([\d.]+)[,/ ]*([\d.]+)[,/ ]*([\d.]+)(?:[,/ ]*([\d.]+))?\)$/,
  );
  if (match) {
    const r = parseFloat(match[1]);
    const g = parseFloat(match[2]);
    const b = parseFloat(match[3]);
    const a = parseFloat(match[4] || '1');
    if (!isNaN(r) && !isNaN(g) && !isNaN(b) && !isNaN(a)) {
      return { r: r * 255, g: g * 255, b: b * 255, a };
    }
  }
  logErrorMessageOnce(
    `The color ${JSON.stringify(
      value,
    )} looks like a valid value but converts to "${srgbColor}" which isn't a 3-4 part srgb color as expected`,
  );
  return null;
};

const rgbaToHex = ({ r, g, b, a }: RgbaColor) => {
  let hex = '#' + numberToHex2(r) + numberToHex2(g) + numberToHex2(b);
  if (a < 1) {
    hex += proportionToHex2(a);
  }
  return hex;
};

const proportionToHex2 = (f: number) => numberToHex2(Math.floor(f * 256));

const numberToHex2 = (n: number) => {
  n = Math.round(clamp(n, 0, 255));
  return n.toString(16).padStart(2, '0').toUpperCase();
};
