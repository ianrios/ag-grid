import { expect, test } from 'vitest';
import { el, firstChild, focus, nthChild, selector } from './style-rule';

Next up:

el and ag proxies

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

test('selector not', () => {
  expectSelector(selector('.foo').not(selector('bar'))).toBe('.foo:not(bar)');
  expectSelector(selector('.foo').not(focus)).toBe('.foo:not(:focus)');
});

test('element selectors', () => {
  expectSelector(el.input).toBe('input');
  expectSelector(el.input.is(firstChild)).toBe('input:first-child');
});

test('pseudo-class selectors', () => {
  expectSelector(firstChild).toBe(':first-child');
  expectSelector(nthChild(4)).toBe(':nth-child(4)');
  expectSelector(nthChild(4).is(firstChild)).toBe(':nth-child(4):first-child');
});

const expectSelector = ({ selectors }: { selectors: string[] }) => expect(selectors.join(', '));
