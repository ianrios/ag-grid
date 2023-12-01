/**
 * This script parses Sass code and rewrites it as object-based styles
 */

///
/// IMPLEMENTATION
///
import * as fs from 'fs';
import * as path from 'path';
import * as prettier from 'prettier';

const projectDir = path.resolve(__dirname, '..');

const convertFile = async (srcPath: string, dstPath: string) => {
  srcPath = path.resolve(projectDir, '../../grid-community-modules/styles', srcPath);
  dstPath = path.resolve(projectDir, dstPath);

  const context: Context = {
    imports: new Set(),
  };
  context.imports.add('rules');

  let source = fs
    .readFileSync(srcPath, 'utf8')

    .replaceAll(/^@use.*;\s*/gm, '')
    // un-wrap selectors on multiple lines
    .replaceAll(/,\n\s*/gm, ', ')

    .split('\n')
    .map((line) => mapLine(line, context))
    .flatMap((mapped): string[] => {
      if (mapped == null) return [];
      return Array.isArray(mapped) ? mapped : [mapped];
    })

    .join('\n');

  const imports = Array.from(context.imports).sort().join(', ');
  source = `import {${imports}} from 'design-system/css-in-js';\n\n${source}`;

  const options = await prettier.resolveConfig(dstPath);
  source = await prettier.format(source, { ...options, parser: 'typescript' });

  fs.writeFileSync(dstPath, source, 'utf8');
};

type Context = {
  imports: Set<string>;
};

const mapLine = (line: string, context: Context): string | string[] | null | undefined => {
  // imports
  if (/^@use/.test(line)) return;

  // start main block
  if (/^(@mixin output|\.ag-theme-)/.test(line)) {
    return 'export default rules({';
  }
  // end main block
  if (/^}$/.test(line)) {
    return '});';
  }

  line = line.trim();

  // empty lines
  if (line === '') {
    return line;
  }
  // comments
  if (/^\/\//.test(line)) {
    return '\t' + line.trim();
  }
  // start of selector block ".ag-foo, input {"
  const selector = /^([\[\]'"=>*&.:()\w, -]+)(?=\s*\{$)/;
  if (selector.test(line)) {
    return '\t' + line.replace(selector, (s) => mapSelectors(s, context) + ': ');
  }
  // end of selector block
  if (/^}\s*$/.test(line)) {
    return `\t${line},`;
  }

  const propertyDeclaration = /^[\w-]+\s*:/;
  if (propertyDeclaration.test(line)) {
    return mapPropertyDeclaration(line, context);
  }

  const includeMatch = line.match(/^@include ([\w.-]+)\((.*)\);?/);
  if (includeMatch) {
    return mapAgInclude(includeMatch[1], includeMatch[2], context);
  }

  const blockAtRuleMatch = line.match(/^(@[\w-]+)\s+(.+)\{/);
  if (blockAtRuleMatch) {
    return mapBlockAtRule(blockAtRuleMatch[1], blockAtRuleMatch[2], context);
  }

  return fatalError(`Invalid line ${JSON.stringify(line)}`);
};

const specialTypedSelectors = new Set(['> *']);

const mapSelectors = (rawSelectors: string, context: Context) => {
  let untyped = false;
  const selectors = rawSelectors
    .trim()
    .split(/\s*,\s*/)
    .map((selector) => {
      let classNameCount = 0;
      selector = selector.replaceAll(/\.ag-[a-z-]+/g, (className) => {
        const prefix = ++classNameCount > 1 ? '.' : '';
        return prefix + kebabCaseToCamelCase(className.substring(4));
      });
      untyped ||= /^ag-|[ .]/.test(selector) && !specialTypedSelectors.has(selector);
      return selector;
    })
    .map((selector) => JSON.stringify(selector));
  if (selectors.length === 1 && !untyped) {
    return selectors[0];
  }
  const func = untyped ? 'untypedSelectors' : 'selectors';
  context.imports.add(func);
  return `\t[${func}(${selectors.join(', ')})]`;
};

const mapPropertyDeclaration = (line: string, context: Context) => {
  let [property, valueAndComment] = split(line, ':');

  let value = valueAndComment;
  let comment = '';
  if (valueAndComment.includes('//')) {
    [value, comment] = split(valueAndComment, '//');
    comment = '// ' + comment;
  }
  if (value.endsWith(';')) {
    value = value.substring(0, value.length - 1).trim();
  }

  if (/^-(webkit|ms|moz)-/.test(property)) {
    property = property.substring(1);
  }

  property = property
    .replaceAll(/\bleft\b/g, 'always-left')
    .replaceAll(/\bright\b/g, 'always-right');

  const name = kebabCaseToCamelCase(property);
  return (
    '\t\t' +
    name +
    ': ' +
    mapPropertyValue(name, value, context) +
    ',' +
    (comment ? ' ' + comment : '')
  );
};

const literalProperties = new Set([
  'fontFamily',
  'content',
  'transition',
  'animationName',
  'animationDirection',
  'animationIterationCount',
  'transitionTimingFunction',
  'pointerEvents',
  'wordBreak',
  'cursor',
  'textOverflow',
  'textAlign',
  'verticalAlign',
  'direction',
  'backgroundRepeat',
  'writingMode',
  'WebkitOverflowScrolling',
]);
const literalValuePatterns = [/^[\w-]+\(/, /^default/];
const propertyValueImportMap: Record<string, string> = {
  0: 'zero',
  1: 'one',
};
const unitsMap: Record<string, string> = {
  s: 'seconds',
  px: 'px',
  rem: 'rem',
  '': 'unitless',
};

const mapPropertyValue = (name: string, value: string, context: Context): string => {
  const suffix = value.includes('!important') ? '.important' : '';
  value = value.replace('!important', '').trim();

  if (literalProperties.has(name) || literalValuePatterns.find((p) => p.test(value))) {
    context.imports.add('literal');
    return `literal(${JSON.stringify(value)})`;
  }

  if (propertyValueImportMap[value]) {
    context.imports.add(propertyValueImportMap[value]);
    return propertyValueImportMap[value];
  }

  if (value.includes(' ')) {
    return (
      '[' +
      value
        .split(/\s+/g)
        .map((part) => mapPropertyValue(name, part, context))
        .join(', ') +
      ']' +
      suffix
    );
  }
  if (/^[a-z]\w*$/.test(value)) {
    context.imports.add(value);
  } else if (/^[a-z][\w-]*$/.test(value)) {
    value = kebabCaseToCamelCase(value);
    context.imports.add(value);
  } else if (/^-?[\d.]+[a-z]*$/.test(value)) {
    let units = value.replace(/^-?[\d.]+/, '');
    if (!unitsMap[units]) {
      return fatalError(`Invalid unit ${JSON.stringify(units)}`);
    }
    units = unitsMap[units];
    const number = parseFloat(value);
    if (isNaN(number)) {
      throw new Error(`Can't parse value as number with units: ${value}`);
    }
    context.imports.add(units);
    value = `${units}(${number})`;
  } else if (value.endsWith('%')) {
    value = `percent(${value.replace('%', '')})`;
    context.imports.add('percent');
  } else {
    return fatalError(`Invalid property value for ${name}: ${JSON.stringify(value)}`);
  }

  return value + suffix;
};

const mapAgInclude = (mixin: string, rawArguments: string, context: Context): string => {
  if (mixin === 'ag.selectable') {
    assertValueIn(rawArguments, ['none', 'text']);
    context.imports.add(rawArguments);
    return `\t\tuserSelect: ${rawArguments},`;
  }
  if (mixin === 'ag.unthemed-rtl') {
    // rawArguments = e.g. "( padding-left: 4px )"
    let [name, value] = split(rawArguments.replaceAll(/^\(|\)$/g, ''), ':');
    if (value.includes(':')) {
      return fatalError(`Invalid ag.unthemed-rtl value: ${JSON.stringify(value)}`);
    }

    name = kebabCaseToCamelCase(name.replace('left', 'leading').replace('right', 'trailing'));
    return name + ': ' + mapPropertyValue(name, value, context) + ',';
  }

  return fatalError(`Invalid @include ${mixin}(${rawArguments})`);
};

const mapBlockAtRule = (rule: string, rawArguments: string, _: Context): string => {
  rawArguments = rawArguments.trim();
  if (rule === '@keyframes') {
    return `\t'@keyframes' : {\n\t\tid: '${rawArguments}',\n`;
  }
  return fatalError(`Invalid ${rule}(${rawArguments})`);
};

let fatal = false;

const fatalError = (message: string) => {
  if (!fatal) {
    console.log(message);
  }
  fatal = true;
  throw new Error(message);
  return `/* FATAL: ${message} */`;
};

const assertValueIn = (value: string, options: string[]) => {
  if (!options.includes(value)) {
    throw new Error(`Expected ${value} to be one of ${JSON.stringify(options)}`);
  }
};

const kebabCaseToCamelCase = (variableName: string) => {
  return variableName.replace(/-\w/g, (match) => match.substring(1).toUpperCase());
};

const split = (line: string, ...tokens: string[]): string[] => {
  const parts: string[] = [];
  let rest = line.trim();

  for (const token of tokens) {
    const tokenIndex = rest.indexOf(token);
    if (tokenIndex === -1) {
      throw new Error(`Token "${token}" not found in line ${JSON.stringify(line)}`);
    }
    parts.push(rest.substring(0, tokenIndex).trim());
    rest = rest.substring(tokenIndex + token.length).trim();
  }

  parts.push(rest);
  return parts;
};

void convertFile(
  'src/internal/base/parts/_common-structural.scss',
  'src/design-system/style/structural/common.ts',
);
