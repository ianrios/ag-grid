import { StyleRule } from './render';
import { CssDeclarations } from './types/CssDeclarations';
import { ElementName } from './types/ElementName';
import { GridClassName } from './types/GridClassName';
import { toKebabCase } from './utils';

export type JoinableStyleRule = StyleRule & {
  tightJoin: boolean;
};

export type HasSelectors = {
  selectors: string[];
};

export type SelectorMethods = {
  is(...selector: ManySelectors): SelectorAPI;
  not(...selector: ManySelectors): SelectorAPI;
};

export type SelectorCall = {
  (
    first: CssDeclarations | JoinableStyleRule[],
    ...rest: JoinableStyleRule[][]
  ): JoinableStyleRule[];
};

export type SelectorAPI = HasSelectors & SelectorMethods & SelectorCall;

const _selector = (tightJoin: boolean, selectors: string[]): SelectorAPI => {
  const call: SelectorCall = (first, ...rest) => {
    let declarations: CssDeclarations;
    let nestedRules: JoinableStyleRule[][];
    if (Array.isArray(first)) {
      declarations = {};
      nestedRules = [first, ...rest];
    } else {
      declarations = first;
      nestedRules = rest;
    }
    const parentRule: JoinableStyleRule = {
      type: 'style',
      selectors,
      tightJoin,
      declarations,
    };
    return flattenStyleRules(parentRule, nestedRules);
  };
  const methods: SelectorMethods = {
    is: (...others) => {
      let suffix = '';
      for (const selector of flatten(others)) {
        if (/^\W/.test(selector)) {
          suffix += selector;
        } else {
          suffix += `:is(${selector})`;
        }
      }
      return append(suffix);
    },
    not: (...others) => {
      const joined = flatten(others).join(', ');
      return append(`:not(${joined})`);
    },
  };

  const append = (suffix: string) =>
    _selector(
      tightJoin,
      selectors.map((s) => s + suffix),
    );

  return Object.assign(call, { selectors }, methods);
};

type ManySelectors = ReadonlyArray<string | string[] | HasSelectors>;

const flatten = (selectors: ManySelectors): string[] =>
  selectors.flatMap((item) =>
    typeof item !== 'string' && 'selectors' in item ? item.selectors : item,
  );

export const is = (...selectors: ManySelectors) => _selector(false, flatten(selectors));
export const $is = (...selectors: ManySelectors) => _selector(true, flatten(selectors));

export const not = (...selectors: ManySelectors) =>
  _selector(false, [`:not(${flatten(selectors).join(', ')})`]);
export const $not = (...selectors: ManySelectors) =>
  _selector(true, [`:not(${flatten(selectors).join(', ')})`]);

const looseAndTightSelector = (name: string) => [_selector(false, [name]), _selector(true, [name])];

export const [active, $active] = looseAndTightSelector(':active');
export const [disabled, $disabled] = looseAndTightSelector(':disabled');
export const [firstChild, $firstChild] = looseAndTightSelector(':first-child');
export const [lastChild, $lastChild] = looseAndTightSelector(':last-child');
export const [firstOfType, $firstOfType] = looseAndTightSelector(':first-of-type');
export const [focus, $focus] = looseAndTightSelector(':focus');
export const [focusVisible, $focusVisible] = looseAndTightSelector(':focusVisible');
export const [focusWithin, $focusWithin] = looseAndTightSelector(':focusWithin');
export const [hover, $hover] = looseAndTightSelector(':hover');
export const [invalid, $invalid] = looseAndTightSelector(':invalid');

export const nthChild = (n: number) => _selector(false, [`:nth-child(${n})`]);
export const $nthChild = (n: number) => _selector(true, [`:nth-child(${n})`]);

const selectorProxy = <T extends string>(
  tightJoin: boolean,
  mapper?: (s: string) => string,
): Record<T, SelectorAPI> => {
  return new Proxy({} as any, {
    get: (_, prop) => {
      prop = String(prop);
      if (mapper) {
        prop = mapper(prop);
      }
      return _selector(tightJoin, [prop]);
    },
  });
};

export const el = selectorProxy<ElementName>(false);
export const $el = selectorProxy<ElementName>(true);

const toAgClassName = (name: string) => '.ag-' + toKebabCase(name);
export const ag = selectorProxy<GridClassName>(false, toAgClassName);
export const $ag = selectorProxy<GridClassName>(true, toAgClassName);

const flattenStyleRules = (
  parent: JoinableStyleRule,
  children: JoinableStyleRule[][],
): JoinableStyleRule[] => [
  parent,
  ...children.flat().map((child): JoinableStyleRule => {
    const separator = child.tightJoin ? '' : ' ';
    return {
      type: 'style',
      declarations: child.declarations,
      tightJoin: parent.tightJoin,
      selectors: parent.selectors.flatMap((parentSelector) =>
        child.selectors.map((childSelector) => parentSelector + separator + childSelector),
      ),
    };
  }),
];
