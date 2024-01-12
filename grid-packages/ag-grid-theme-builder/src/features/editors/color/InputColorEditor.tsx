import { Divider, Input, Slider, Stack, styled } from '@mui/joy';
import { Cell, TwoColumnTable } from 'components/Table';
import { clamp, singleOrFirst } from 'model/utils';
import { useEffect, useState } from 'react';
import { ColorSwatch } from './ColorSwatch';
import {
  UncontrolledColorEditorProps,
  colorValueToCssExpression,
  parseCssColorAsHSLA,
  parseCssColorAsRGBA,
  rgbaToHex,
} from './color-editor-utils';

export const InputColorEditor = (props: UncontrolledColorEditorProps) => {
  const [value, setValue] = useState(() => colorValueToCssExpression(props.initialValue));
  const [editorValue, setEditorValue] = useState(() => getInitialEditorValue(value));
  const [valid, setValid] = useState(!!editorValue);
  const [colorParts, setColorParts] = useState(() => getColorParts(value));

  console.log(parseCssColorAsRGBA(value));
  console.log(parseCssColorAsHSLA(value));

  debugger;
  const updateColorPart = (newValue: number, part: keyof ColorParts) => {
    debugger;
    const newParts = { ...colorParts, [part]: newValue };
    if ('rgb'.includes(part)) {
      setEditorValue(colorPartsToRGB(colorParts));
    } else if ('hsl'.includes(part)) {
      setEditorValue(colorPartsToHSL(colorParts));
    }
    setColorParts(newParts);
  };

  useEffect(() => {
    let enteredValue = editorValue.trim();
    if (/^[0-9a-e]+$/i.test(enteredValue)) {
      enteredValue = '#' + enteredValue; // allow user to enter hex values without hash
    }
    const color = enteredValue ? parseCssColorAsRGBA(enteredValue) : null;
    if (color) {
      if (editableColorRegex.test(enteredValue)) {
        setValue(enteredValue);
      } else {
        setValue(rgbaToHex(color));
      }
      setValid(true);
    } else {
      setValid(false);
    }
  }, [editorValue]);

  return (
    <Stack gap={2}>
      <ColorSwatch color={value} height={60} />
      <TwoColumnTable>
        <Cell>CSS</Cell>
        <Input
          value={editorValue}
          placeholder="e.g. #ff00aa, rgb(255,0,170))"
          onChange={(e) => setEditorValue(e.target.value)}
          onBlur={() => {
            setEditorValue(getInitialEditorValue(value));
          }}
          error={!valid}
        />
        <SpanningDivider />
        <Cell>R</Cell>
        <ColorPartSlider value={colorParts} onChange={updateColorPart} part="r" />
      </TwoColumnTable>
    </Stack>
  );
};

const editableColorRegex = /(^rgba?\()|(^hsla?\()|(^[a-z]+$)/;

const getInitialEditorValue = (value: string): string => {
  if (editableColorRegex.test(value)) return value;
  const rgba = parseCssColorAsRGBA(value);
  return rgba ? rgbaToHex(rgba) : '';
};

const SpanningDivider = styled(Divider)`
  grid-column-end: span 2;
  margin: 16px 0;
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

const getColorParts = (color: string): ColorParts => ({
  ...(parseCssColorAsRGBA(color) || { r: 0, g: 0, b: 0, a: 1 }),
  ...(parseCssColorAsHSLA(color) || { h: 0, s: 0, l: 0, a: 1 }),
});

const ColorPartSlider = ({
  value,
  part,
  onChange,
}: {
  value: ColorParts;
  onChange: (newValue: number, part: keyof ColorParts) => void;
  part: keyof ColorParts;
}) => (
  <Slider
    value={value[part]}
    min={0}
    max={1}
    step={0.001}
    onChange={(_, newValue) => onChange(singleOrFirst(newValue), part)}
    valueLabelDisplay="auto"
  />
);

const int = (n: number, max: number) => clamp(Math.floor(n * max * 1), 0, max);

const colorPartsToRGB = ({ r, g, b, a }: ColorParts): string =>
  a === 1
    ? `rgb(${int(r, 255)}, ${int(g, 255)}, ${int(b, 255)})`
    : `rgba(${int(r, 255)}, ${int(g, 255)}, ${int(b, 255)}, ${a})`;

const colorPartsToHSL = ({ h, s, l, a }: ColorParts): string =>
  a === 1 ? `hsl(${h}, ${s}%, ${l}%)` : `hsla(${h}, ${s}%, ${l}%, ${a})`;
