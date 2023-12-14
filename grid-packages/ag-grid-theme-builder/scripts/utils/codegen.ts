import * as prettier from 'prettier';
import {
  FileContent,
  Include,
  LineComment,
  ParsedNode,
  PropertyDeclaration,
  StyleRule,
  TodoBlock,
} from './scss-ast';

const options = prettier.resolveConfig(__dirname);

export let stringRulesNotConverted: string[] = [];

export const generateFileContent = async (file: FileContent) => {
  stringRulesNotConverted = [];
  let unformatted = '[';
  for (const node of file.nodes) {
    unformatted += parsedNode(node);
    if (node.type !== 'line-comment' && node.type !== 'todo') {
      unformatted += ',\n\n';
    }
  }
  unformatted += ']';
  try {
    let formatted = await prettier.format(unformatted, {
      ...(await options),
      parser: 'typescript',
      //   semi: false,
    });
    formatted = formatted.trim();
    if (formatted.endsWith(';')) {
      formatted = formatted.substring(0, formatted.length - 1);
    }
    return formatted;
  } catch (e) {
    console.error('Source:', unformatted);
    throw e;
  }
};

const parsedNode = (node: ParsedNode): string => {
  switch (node.type) {
    case 'style-rule':
      return styleRule(node);
    case 'property':
      return propertyDeclaration(node);
    case 'line-comment':
      return lineComment(node);
    case 'include':
      return include(node);
    case 'todo':
      return todoBlock(node);
  }
};

const browserFeatureSelector = /^::?-.*$/;

const styleRule = (node: StyleRule): string => {
  var hasStringSelectors = false;
  const convertSelector = (selector: string, noStrings = false): string => {
    if (browserFeatureSelector.test(selector)) {
      return noStrings ? `is(${JSON.stringify(selector)})` : JSON.stringify(selector);
    }
    if (selector.startsWith('&')) {
      return '$' + convertSelector(selector.substring(1), true);
    }
    if (selector == '> *') {
      return 'child';
    }
    const twoClass = selector.match(/^(\.[\w-]+)(\.[\w-]+)$/);
    if (twoClass) {
      return convertSelector(twoClass[1]) + '.is(' + convertSelector(twoClass[2]) + ')';
    }
    const agMatch = selector.match(/^\.ag-([\w-]+)$/);
    if (agMatch) {
      return `ag.${toCamelCase(agMatch[1])}`;
    }
    const elMatch = selector.match(/^(?!ag-)([\w-]+)$/);
    if (elMatch) {
      return `el.${toCamelCase(elMatch[1])}`;
    }
    const notMatch = selector.match(/^:not\((\.[\w-]+)\)$/);
    if (notMatch) {
      return `not(${convertSelector(notMatch[1])})`;
    }
    const pseudoMatch = selector.match(/^::?([\w-]+)$/);
    if (pseudoMatch) {
      return toCamelCase(pseudoMatch[1]);
    }
    hasStringSelectors = true;
    // TODO reenable and test
    // throw error('Failed to parse selector', selector, 'in node', node);
    stringRulesNotConverted.push(selector);
    return noStrings ? `is(${JSON.stringify(selector)})` : JSON.stringify(selector);
  };
  const selectors = node.selectors.map((s) => convertSelector(s));
  let code =
    selectors.length === 1 && !hasStringSelectors ? selectors[0] : `is(${selectors.join(', ')})`;
  code += '(';
  let comments: string[] = [];
  const properties: string[] = [];
  const others: string[] = [];
  for (const child of node.children) {
    const rendered = parsedNode(child);
    if (child.type === 'line-comment') {
      comments.push(rendered);
    } else if (child.type === 'property' || child.type === 'include') {
      properties.push(comments.join('') + rendered);
      comments = [];
    } else {
      others.push(comments.join('') + rendered);
      comments = [];
    }
  }
  if (properties.length > 0) {
    code += `{\n${properties.join(',\n')}\n},`;
  }
  code += '\n\n' + others.join(',\n\n') + comments.join('');
  return code + ')\n';
};

const error = (...args: any[]): Error => {
  console.error(...args);
  return new Error('See console for details');
};

const propertyDeclaration = (node: PropertyDeclaration): string => {
  if (node.name === 'background-image') {
    console.error(node);
  }
  const name = node.name.replace('right', 'always-right').replace('left', 'always-left');
  const cast = node.value.includes('!important') ? ' as any' : '';
  return toCamelCase(name) + ': ' + JSON.stringify(node.value) + cast;
};

const lineComment = (node: LineComment): string => {
  return `// ${node.text}\n`;
};

const include = (node: Include): string => {
  if (node.mixin === 'ag.selectable') {
    const kind = node.arguments[0]?.value || 'none';
    return `userSelect: ${JSON.stringify(kind)}`;
  }
  if (/^ag\.(un)?themed-rtl$/.test(node.mixin)) {
    const [arg] = node.arguments;
    if (node.arguments.length !== 1 || arg.type !== 'map') {
      throw error('Expected one map argument', node);
    }
    return Object.entries(arg.value)
      .map(([name, value]) =>
        propertyDeclaration({
          type: 'property',
          name: name.replace('left', 'leading').replace('right', 'trailing'),
          value,
        }),
      )
      .join(',');
  }
  throw error("Can't handle @include node", node);
};

const todoBlock = (node: TodoBlock): string => {
  return `
/****************************
 * TODO, port this Sass code:
 * ${node.scssSource.replace(/\n/g, '\n* ')}
 ****************************/
`;
};

const toCamelCase = (className: string) =>
  className.replace(/(-)\w/g, (char) => char.toUpperCase()).replace(/-/g, '');
