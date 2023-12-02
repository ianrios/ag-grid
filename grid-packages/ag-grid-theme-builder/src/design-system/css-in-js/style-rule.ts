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

export type SelectorCall = {
  (
    first: CssDeclarations | JoinableStyleRule[],
    ...rest: JoinableStyleRule[][]
  ): JoinableStyleRule[];
};

export type SelectorAPI = HasSelectors & {
  is(...selector: HasSelectors[]): Selector;
  not(...selector: HasSelectors[]): Selector;
};

export type Selector = SelectorCall & SelectorAPI;

const _selector = (tightJoin: boolean, selectors: string[]): Selector => {
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
  const api: SelectorAPI = {
    selectors,
    is: (...others) => {
      let suffix = '';
      for (const { selectors } of others) {
        for (const selector of selectors) {
          if (/^\W/.test(selector)) {
            suffix += selector;
          } else {
            suffix += `:is(${selector})`;
          }
        }
      }
      return append(suffix);
    },
    not: (...others) => {
      const joined = others.map((o) => o.selectors.join(', ')).join(', ');
      return append(`:not(${joined})`);
    },
  };

  const append = (suffix: string) =>
    _selector(
      tightJoin,
      selectors.map((s) => s + suffix),
    );

  const self: Selector = Object.assign(call, api);
  return self;
};

export const selector = (...selectors: string[]) => _selector(false, selectors);
export const $selector = (...selectors: string[]) => _selector(true, selectors);

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

const selectorWithArg = (tightJoin: boolean, name: string) => (n: number) =>
  _selector(tightJoin, [`${name}(${n})`]);

export const nthChild = selectorWithArg(false, ':nth-child');
export const $nthChild = selectorWithArg(true, ':nth-child');

export const not = ({ selectors }: Selector) => _selector(false, [`:not(${selectors.join(', ')})`]);
export const $not = ({ selectors }: Selector) => _selector(true, [`:not(${selectors.join(', ')})`]);

export const is = (...selectors: Selector[]) =>
  _selector(false, selectors.map((s) => s.selectors).flat());
export const $is = (...selectors: Selector[]) =>
  _selector(true, selectors.map((s) => s.selectors).flat());

const selectorProxy = <T extends string>(
  tightJoin: boolean,
  mapper?: (s: string) => string,
): Record<T, Selector> => {
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
