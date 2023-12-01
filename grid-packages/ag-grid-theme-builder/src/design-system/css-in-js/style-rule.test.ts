import { expect, test } from 'vitest';
import { $not, ag, el, firstChild, focus, is, not, nthChild, selector } from './style-rule';

test('selector', () => {
  expectSelector(selector('.foo')).toBe('.foo');
  expectSelector(selector('.foo', 'bar')).toBe('.foo, bar');
});

test('element selectors', () => {
  expectSelector(el.input).toBe('input');
  expectSelector(el.input.is(firstChild)).toBe('input:first-child');
});

test('selector is', () => {
  expectSelector(selector('.foo').is(selector('bar'))).toBe('.foo:is(bar)');
  expectSelector(selector('.foo').is(selector('bar', 'baz'))).toBe('.foo:is(bar, baz)');
  expectSelector(selector('.foo').is(selector('bar')).is(selector('baz'))).toBe(
    '.foo:is(bar):is(baz)',
  );
  // special case,
  expectSelector(selector('.foo').is(selector('.bar'))).toBe('.foo.bar');
  expectSelector(selector('.foo').is(selector(':quux'))).toBe('.foo:quux');
  expectSelector(selector('.foo').is(selector('[la]'))).toBe('.foo[la]');

  expectSelector(selector('.foo').is(selector('[la]', 'la'))).toBe('.foo:is([la], la)');
});

test('top level is', () => {
  expectSelector(is(el.a)).toBe('a');
  expectSelector(is(el.a, el.b)).toBe('a, b');
});

test('not', () => {
  expectSelector(not(selector('.foo'))).toBe(':not(.foo)');
  expectSelector($not(selector('.foo'))).toBe(':not(.foo)');
});

test('top level not', () => {
  expectSelector(not(el.a)).toBe(':not(a)');
});

test('selector not', () => {
  expectSelector(selector('.foo').not(selector('bar'))).toBe('.foo:not(bar)');
  expectSelector(selector('.foo').not(focus)).toBe('.foo:not(:focus)');
});

test('element selectors', () => {
  expectSelector(el.input).toBe('input');
  expectSelector(el.input.is(firstChild)).toBe('input:first-child');
});

test('ag class selectors', () => {
  expectSelector(ag.root).toBe('.ag-root');
  expectSelector(ag.rootWrapper.is(firstChild)).toBe('.ag-root-wrapper:first-child');
});

test('pseudo-class selectors', () => {
  expectSelector(firstChild).toBe(':first-child');
  expectSelector(nthChild(4)).toBe(':nth-child(4)');
  expectSelector(nthChild(4).is(firstChild)).toBe(':nth-child(4):first-child');
});

const expectSelector = ({ selectors }: { selectors: string[] }) => expect(selectors.join(', '));
