import { CssDeclarations, PropertyValue } from './types/CssDeclarations';
import { toKebabCase } from './utils';

export type Rule = StyleRule | AtRule;

export type StyleRule = {
  type: 'style';
  selectors: string[];
  declarations: CssDeclarations;
};

export type AtRule = {
  type: 'at';
  rule: string;
  properties?: CssDeclarations;
  styles?: StyleRule[];
  allowRtl: boolean;
};

export const renderRules = (rules: Rule[]): string => {
  const output: string[] = [];
  for (const rule of rules) {
    switch (rule.type) {
      case 'style':
        emitStyleRule(output, rule);
        break;
      case 'at':
        emitAtRule(output, rule);
        break;
    }
  }
  return output.join('');
};

const emitStyleRule = (
  output: string[],
  { selectors, declarations: properties }: StyleRule,
  indent = '',
  forbidRtlBecause?: string,
) => {
  const plainProperties: [string, string][] = [];
  const rtlProperties: [string, string][] = [];
  const ltrProperties: [string, string][] = [];
  for (const [jsName, jsValue] of Object.entries(properties)) {
    if (jsValue == null) continue;
    const cssName = renderPropertyName(jsName);
    const cssValue = renderPropertyValue(jsValue);
    if (cssName.includes('leading') || cssName.includes('trailing')) {
      if (forbidRtlBecause) {
        throw new Error(
          `RTL styles (${jsName}: ${cssValue}) not allowed inside ${forbidRtlBecause}`,
        );
      }
      ltrProperties.push([
        cssName.replace('leading', 'left').replace('trailing', 'right'),
        cssValue,
      ]);
      rtlProperties.push([
        cssName.replace('leading', 'right').replace('trailing', 'left'),
        cssValue,
      ]);
    } else {
      plainProperties.push([cssName, cssValue]);
    }
  }
  emitSelectorsAndProperties(output, '', selectors, plainProperties, indent);
  emitSelectorsAndProperties(output, '.ag-ltr ', selectors, ltrProperties, indent);
  emitSelectorsAndProperties(output, '.ag-rtl ', selectors, rtlProperties, indent);
};

const emitAtRule = (output: string[], { rule, styles, properties, allowRtl }: AtRule) => {
  if (styles) {
    output.push(rule, ' {\n');
    for (const style of styles) {
      emitStyleRule(output, style, '\t', allowRtl ? undefined : rule);
    }
    output.push('}\n');
  }
  if (properties) {
    emitSelectorsAndProperties(
      output,
      '',
      [rule],
      Object.entries(properties).map(([jsName, jsValue]) => [
        renderPropertyName(jsName),
        renderPropertyValue(jsValue),
      ]),
      '',
    );
  }
};

const emitSelectorsAndProperties = (
  output: string[],
  prefix: string,
  selectors: string[],
  properties: [string, string][],
  indent: string,
) => {
  if (selectors.length === 0 || properties.length === 0) return;
  output.push(indent);
  for (let i = 0; i < selectors.length; i++) {
    if (i !== 0) {
      output.push(', ');
    }
    output.push(prefix, selectors[i]);
  }
  output.push(' {\n');
  for (const [property, value] of properties) {
    output.push(indent, '\t', property, ': ', value, ';\n');
  }
  output.push(indent, '}\n');
};

const renderPropertyName = (jsName: string) => toKebabCase(jsName).replace('always-', '');

const renderPropertyValue = (value: unknown): string => {
  if (value == null) return '';
  if (typeof value === 'string') return value || '""';
  if (typeof value === 'number') return String(value);
  if (Array.isArray(value)) {
    return value.map(renderPropertyValue).join(' ');
  }
  const css = (value as PropertyValue).css;
  if (typeof css === 'string') {
    return css;
  }
  throw new Error(`Invalid property value ${value}`);
};
