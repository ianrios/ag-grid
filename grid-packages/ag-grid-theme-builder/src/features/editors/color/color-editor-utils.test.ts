import { expect, test } from 'vitest';
import { parseRgbCssColor, rgbaToHsla } from './color-editor-utils';

test.each([
  ['color(srgb 0 0.1 0.2 / 0.3)', { r: 0, g: 0.1, b: 0.2, a: 0.3 }],
  ['color(srgb 0 0.1 0.2 / 50%)', { r: 0, g: 0.1, b: 0.2, a: 0.5 }],
  ['color(srgb 1 0.9 0.8)', { r: 1, g: 0.9, b: 0.8, a: 1 }],
  ['color(foo 1 0.9 0.8)', null],
  ['rgb(0, 5, 255)', { r: 0, g: 5 / 255, b: 1, a: 1 }],
  ['rgba(0, 5, 255, 0.4)', { r: 0, g: 5 / 255, b: 1, a: 0.4 }],
  ['rgba(0, 5, 255, 40%)', { r: 0, g: 5 / 255, b: 1, a: 0.4 }],
  ['foo(0, 5, 255, 40%)', null],
])('parseRgbCssColor("%s")', (input, expected) => {
  expect(parseRgbCssColor(input)).toEqual(expected);
});

test.each([
  [
    { r: 0, g: 0, b: 0, a: 0.5 },
    { h: 0, s: 0, l: 0, a: 0.5 },
  ],
  [
    { r: 1, g: 0, b: 0, a: 0.5 },
    { h: 0, s: 1, l: 0.5, a: 0.5 },
  ],
  [
    { r: 1, g: 1, b: 1, a: 1 },
    { h: 0, s: 0, l: 1, a: 1 },
  ],
])('rgbToHsl(%s)', (input, expected) => {
  expect(rgbaToHsla(input)).toEqual(expected);
});
