import { Divider, Input, Slider, Stack, styled } from '@mui/joy';
import { Cell, TwoColumnTable } from 'components/Table';
import { clamp, logErrorMessage, singleOrFirst } from 'model/utils';
import { useEffect, useRef, useState } from 'react';
import { ColorSwatch } from './ColorSwatch';
import {
  UncontrolledColorEditorProps,
  colorValueToCssExpression,
  reinterpretCssColorExpression,
  rgbaToHex,
  rgbaToHsla,
} from './color-editor-utils';

export const InputColorEditor = ({ initialValue, onChange }: UncontrolledColorEditorProps) => {
  const [value, setValue] = useState(() => colorValueToCssExpression(initialValue));
  const [editorValue, setEditorValue] = useState(() => getInitialEditorValue(value));
  const [valid, setValid] = useState(!!editorValue);
  const [colorParts, setColorParts] = useState(() => getColorParts(value));
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const lastManuallyEnteredValue = useRef('');

  const handleColorPartChange = (newValue: number, part: keyof ColorParts) => {
    const newParts = { ...colorParts, [part]: newValue };
    const editorColorMode = getColorMode(editorValue);
    let newEditorValue: string;
    if ('rgb'.includes(part) || (part === 'a' && editorColorMode === 'rgb')) {
      newEditorValue = colorPartsToRGB(newParts);
      const { h, s, l } = rgbaToHsla(newParts);
      newParts.h = h;
      newParts.s = s;
      newParts.l = l;
    } else if ('hsl'.includes(part) || (part === 'a' && editorColorMode === 'hsl')) {
      newEditorValue = colorPartsToHSL(newParts);
      const { r, g, b } = getColorParts(newEditorValue);
      newParts.r = r;
      newParts.g = g;
      newParts.b = b;
    } else if (part === 'a') {
      newEditorValue = rgbaToHex(newParts);
    } else {
      logErrorMessage(`Unexpected color part "${part}"`);
      return;
    }
    setColorParts(newParts);
    setEditorValue(newEditorValue);
  };

  const handleEditorValueChange = (newValue: string) => {
    lastManuallyEnteredValue.current = newValue;
    setEditorValue(newValue);
  };

  useEffect(() => {
    let enteredValue = editorValue.trim();
    if (/^[0-9a-e]+$/i.test(enteredValue)) {
      enteredValue = '#' + enteredValue; // allow user to enter hex values without hash
    }
    const color = enteredValue ? reinterpretCssColorExpression(enteredValue) : null;
    if (color) {
      if (editableColorRegex.test(enteredValue)) {
        setValue(enteredValue);
      } else {
        setValue(rgbaToHex(color));
      }
      if (enteredValue === lastManuallyEnteredValue.current) {
        const newColorParts = getColorParts(enteredValue);
        setColorParts(newColorParts);
      }
      setValid(true);
    } else {
      setValid(false);
    }
  }, [editorValue]);

  useEffect(() => {
    onChangeRef.current(value);
  }, [value]);

  return (
    <Stack gap={2}>
      <ColorSwatch color={value} height={60} />
      <TwoColumnTable>
        <Cell>CSS</Cell>
        <Input
          value={editorValue}
          placeholder="e.g. #ff00aa, rgb(255,0,170))"
          onChange={(e) => handleEditorValueChange(e.target.value)}
          onBlur={() => {
            handleEditorValueChange(getInitialEditorValue(value));
          }}
          error={!valid}
        />
        <SpanningDivider />
        <Cell>Alpha</Cell>
        <ColorPartSlider
          value={colorParts}
          onChange={handleColorPartChange}
          part="a"
          valueLabelFormat={format3dp}
        />
        <SpanningDivider />
        <Cell>R</Cell>
        <ColorPartSlider
          value={colorParts}
          onChange={handleColorPartChange}
          part="r"
          valueLabelFormat={format3dp}
        />
        <Cell>G</Cell>
        <ColorPartSlider
          value={colorParts}
          onChange={handleColorPartChange}
          part="g"
          valueLabelFormat={format3dp}
        />
        <Cell>B</Cell>
        <ColorPartSlider
          value={colorParts}
          onChange={handleColorPartChange}
          part="b"
          valueLabelFormat={format3dp}
        />
        <SpanningDivider />
        <Cell>H</Cell>
        <ColorPartSlider
          value={colorParts}
          onChange={handleColorPartChange}
          part="h"
          valueLabelFormat={formatProportionAsDegrees}
        />
        <Cell>S</Cell>
        <ColorPartSlider
          value={colorParts}
          onChange={handleColorPartChange}
          part="s"
          valueLabelFormat={formatProportionAsPercent}
        />
        <Cell>L</Cell>
        <ColorPartSlider
          value={colorParts}
          onChange={handleColorPartChange}
          part="l"
          valueLabelFormat={formatProportionAsPercent}
        />
      </TwoColumnTable>
    </Stack>
  );
};

const editableColorRegex = /(^rgba?\()|(^hsla?\()|(^[a-z]+$)/;

const getInitialEditorValue = (value: string): string => {
  if (editableColorRegex.test(value)) return value;
  const rgba = reinterpretCssColorExpression(value);
  return rgba ? rgbaToHex(rgba) : '';
};

const getColorMode = (css: string): 'rgb' | 'hsl' | null => {
  if (/^(rgb|color\(srgb)/i.test(css)) return 'rgb';
  if (/^hsl/i.test(css)) return 'hsl';
  return null;
};

const SpanningDivider = styled(Divider)`
  grid-column-end: span 2;
  margin: 8px 0;
`;

type ColorParts = {
  r: number;
  g: number;
  b: number;
  h: number;
  s: number;
  l: number;
  a: number;
};

const getColorParts = (color: string): ColorParts => {
  const rgba = reinterpretCssColorExpression(color);
  if (!rgba) return { r: 0, g: 0, b: 0, a: 1, h: 0, s: 0, l: 0 };
  return {
    ...rgbaToHsla(rgba),
    ...rgba,
  };
};

const ColorPartSlider = ({
  value,
  part,
  onChange,
  valueLabelFormat,
}: {
  value: ColorParts;
  onChange: (newValue: number, part: keyof ColorParts) => void;
  part: keyof ColorParts;
  valueLabelFormat?: (n: number) => string;
}) => (
  <Slider
    value={value[part]}
    min={0}
    max={1}
    step={0.001}
    size="sm"
    onChange={(_, newValue) => onChange(singleOrFirst(newValue), part)}
    valueLabelDisplay="auto"
    sx={{ '--Slider-size': '15px' }}
    valueLabelFormat={valueLabelFormat}
  />
);

const int = (n: number, max: number) => clamp(Math.floor(n * max * 1), 0, max);

const colorPartsToRGB = ({ r, g, b, a }: ColorParts): string =>
  a === 1
    ? `rgb(${int(r, 255)}, ${int(g, 255)}, ${int(b, 255)})`
    : `rgba(${int(r, 255)}, ${int(g, 255)}, ${int(b, 255)}, ${a})`;

const colorPartsToHSL = ({ h, s, l, a }: ColorParts): string =>
  a === 1
    ? `hsl(${int(h, 360)}, ${int(s, 100)}%, ${int(l, 100)}%)`
    : `hsla(${int(h, 360)}, ${int(s, 100)}%, ${int(l, 100)}%, ${a})`;

const formatProportionAsPercent = (n: number) => `${Math.round(n * 100)}%`;
const formatProportionAsDegrees = (n: number) => `${Math.round(n * 360)}°`;
const format3dp = (n: number) => String(Math.round(n * 1000) / 1000);
