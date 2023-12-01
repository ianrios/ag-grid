import { AtRule, StyleRule } from './render';
import { CssDeclarations } from './types/CssDeclarations';

export type KeyframesArgs = {
  id: string;
  from: CssDeclarations;
  to: CssDeclarations;
};

export const keyframes = ({ id, from, to }: KeyframesArgs): AtRule => ({
  type: 'at',
  rule: `@keyframes ${id}`,
  styles: [
    {
      type: 'style',
      selectors: ['from'],
      declarations: from,
    },
    {
      type: 'style',
      selectors: ['to'],
      declarations: to,
    },
  ],
  allowRtl: false,
});

export const fontFace = (properties: CssDeclarations): AtRule => ({
  type: 'at',
  rule: `@font-face`,
  properties,
  allowRtl: false,
});

export type MediaArgs = {
  query: string;
  rules: StyleRule[][];
};

export const media = ({ query, rules }: MediaArgs): AtRule => ({
  type: 'at',
  rule: `@media ${query}`,
  styles: rules.flat(),
  allowRtl: true,
});
