import { expect, test } from 'vitest';
import { $not, ag, el, firstChild, focus, is, not, nthChild } from './style-rule';

test('selector', () => {
  expectSelector(is('.foo')).toBe('.foo');
  expectSelector(is('.foo', 'bar')).toBe('.foo, bar');
});

test('element selectors', () => {
  expectSelector(el.input).toBe('input');
  expectSelector(el.input.is(firstChild)).toBe('input:first-child');
});

test('selector is', () => {
  expectSelector(is('.foo').is(is('bar'))).toBe('.foo:is(bar)');
  expectSelector(is('.foo').is(is('bar', 'baz'))).toBe('.foo:is(bar):is(baz)');
  expectSelector(is('.foo').is(is('bar')).is(is('baz'))).toBe('.foo:is(bar):is(baz)');
  // special case,
  expectSelector(is('.foo').is(is('.bar'))).toBe('.foo.bar');
  expectSelector(is('.foo').is(is(':quux'))).toBe('.foo:quux');
  expectSelector(is('.foo').is(is('[la]'))).toBe('.foo[la]');

  expectSelector(is('.foo').is(is('[la]', 'la'))).toBe('.foo[la]:is(la)');
  expectSelector(is('.foo').is(is('.a', '.b'), is('.c', '.d'))).toBe('.foo.a.b.c.d');
});

test('selector not', () => {
  expectSelector(is('.foo').not('bar')).toBe('.foo:not(bar)');
  expectSelector(is('.foo').not('bar', 'baz')).toBe('.foo:not(bar, baz)');
  expectSelector(is('.foo').not('.a', '.b', is('.c', '.d'))).toBe('.foo:not(.a, .b, .c, .d)');
  expectSelector(is('.foo').not(focus)).toBe('.foo:not(:focus)');
});

test('top level is', () => {
  expectSelector(is(el.a)).toBe('a');
  expectSelector(is(el.a, el.b)).toBe('a, b');
});

test('top level not', () => {
  expectSelector(not(is('.foo'))).toBe(':not(.foo)');
  expectSelector($not(is('.foo'))).toBe(':not(.foo)');
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

test('appending to multiple selectors', () => {
  expectSelector(is('a', 'b')).toBe('a, b');
  expectSelector(is('a', 'b').is(is('.foo'))).toBe('a.foo, b.foo');
  expectSelector(is('a', 'b').is(is('.foo', '.bar'))).toBe('a.foo.bar, b.foo.bar');
});

const expectSelector = ({ selectors }: { selectors: string[] }) => expect(selectors.join(', '));
