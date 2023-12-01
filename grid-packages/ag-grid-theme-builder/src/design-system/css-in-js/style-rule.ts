import { StyleRule } from './render';
import { CssDeclarations } from './types/CssDeclarations';
import { ElementName } from './types/ElementName';
import { PseudoClass } from './types/PseudoClass';

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
    is: (...others) => appendPseudo(others, 'is'),
    not: (...others) => appendPseudo(others, 'not'),
  };

  const appendPseudo = (others: HasSelectors[], pseudoClass: string) => {
    const joined = others.map((o) => o.selectors.join(', ')).join(', ');
    if (pseudoClass === 'is' && /^\W\S*$/.test(joined)) {
      // special case, if it's possible to append the selector directly do so, e.g.
      // element.is(focus) becomes "element:focus" not element:is(:focus)
      return append(joined);
    }
    return append(`:${pseudoClass}(${joined})`);
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

const pseudoClassSelectors = (selector: string) => [
  _selector(false, [selector]),
  _selector(true, [selector]),
  _selector(false, [`:not(${selector})`]),
  _selector(true, [`:not(${selector})`]),
];

export const [active, $active, notActive, $notActive] = pseudoClassSelectors(':active');
export const [disabled, $disabled, notDisabled, $notDisabled] = pseudoClassSelectors(':disabled');
export const [firstChild, $firstChild, notFirstChild, $notFirstChild] =
  pseudoClassSelectors(':first-child');
export const [lastChild, $lastChild, notLastChild, $notLastChild] =
  pseudoClassSelectors(':last-child');
export const [firstOfType, $firstOfType, notFirstOfType, $notFirstOfType] =
  pseudoClassSelectors(':first-of-type');
export const [focus, $focus] = pseudoClassSelectors(':focus');
export const [focusVisible, $focusVisible] = pseudoClassSelectors(':focusVisible');
export const [focusWithin, $focusWithin] = pseudoClassSelectors(':focusWithin');
export const [hover, $hover] = pseudoClassSelectors(':hover');
export const [invalid, $invalid] = pseudoClassSelectors(':invalid');

const _nthChild = (tightJoin: boolean) => (n: number) => _selector(tightJoin, [`:nth-child(${n})`]);
export const nthChild = _nthChild(true);
export const $nthChild = _nthChild(false);

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

// export const ag = selectorDslFactory<GridClassName>(false, false);
export const el = selectorProxy<ElementName | PseudoClass>(false);
export const $el = selectorProxy<ElementName | PseudoClass>(true);
// export const $ag = selectorDslFactory<GridClassName>(true, false);
// export const $el = selectorDslFactory<ElementName | PseudoClass>(true, true);

// export const any = (...selectors: ReadonlyArray<HasSelectors>) =>
//   selectorDsl(false, false, selectors.map((s) => s.selectors).flat());

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
