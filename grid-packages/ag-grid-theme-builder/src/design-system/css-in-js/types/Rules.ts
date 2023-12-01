import { CssDeclarations, CssPropertiesValue } from './CssDeclarations';
import { GridClassName } from './GridClassName';

export type TopLevelRules = SelectorRules & AtRules;

export type Selector =
  | GridClassName
  | `&${GridClassName}`
  | `&:not(${GridClassName})`
  | PseudoClassSelector
  | PseudoElementSelector
  | Element
  | Special;
export type SelectorValue = (CssDeclarations & SelectorRules) | null | undefined;

export type SelectorRules = {
  readonly [K in Selector]?: SelectorValue;
} & {
  // symbols support {[selectors("foo")]: value} syntax
  readonly [key: symbol]: SelectorValue;
};

export type SelectorRecord = Readonly<Record<string | symbol, SelectorValue | CssPropertiesValue>>;

type Element = 'input' | 'textarea' | 'select' | 'button' | 'div' | 'span';

type Special = '> *';

type PseudoClass =
  | ':active'
  | ':disabled'
  | ':first-child'
  | ':focus'
  | ':focus-visible'
  | ':focus-within'
  | ':hover'
  | ':invalid'
  | ':last-child';

export type PseudoClassSelector = `&${PseudoClass}` | `&:not(${PseudoClass})`;

export type PseudoElementSelector =
  | '&::-moz-ag-range-thumb'
  | '&::-moz-ag-range-track'
  | '&::-moz-range-track'
  | '&::-ms-thumb'
  | '&::-ms-track'
  | '&::-webkit-inner-spin-button'
  | '&::-webkit-outer-spin-button'
  | '&::-webkit-scrollbar'
  | '&::-webkit-slider-runnable-track'
  | '&::-webkit-slider-thumb'
  | '&::after'
  | '&::before'
  | '&::placeholder';

export type AtRules = {
  '@keyframes'?: KeyframesRule;
  '@font-face'?: CssDeclarations;
  '@media'?: MediaRule;
};

export type KeyframesRule = {
  id: string;
  from: CssDeclarations;
  to: CssDeclarations;
};

export type MediaRule = {
  query: string;
  rules: SelectorRules;
};
