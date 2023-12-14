import { parse, stringify } from 'scss-parser';

type Node = any;

export type FileContent = {
  type: 'file-content';
  nodes: ParsedNode[];
};

export type ParsedNode = StyleRule | PropertyDeclaration | LineComment | Include | TodoBlock;

export type StyleRule = {
  type: 'style-rule';
  selectors: string[];
  children: ParsedNode[];
};

export type PropertyDeclaration = {
  type: 'property';
  name: string;
  value: string;
  comment?: string;
};

export type Include = {
  type: 'include';
  mixin: string;
  arguments: Argument[];
  block: ParsedNode[];
};

export type Argument = ValueArgument | ListArgument | MapArgument;

export type ValueArgument = {
  type: 'value';
  value: string;
};

export type ListArgument = {
  type: 'list';
  value: string[];
};

export type MapArgument = {
  type: 'map';
  value: Record<string, string>;
};

export type LineComment = {
  type: 'line-comment';
  text: string;
};

export type TodoBlock = {
  type: 'todo';
  scssSource: string;
};

export const parseScssString = (scssContent: string): FileContent => {
  const ast = parse(scssContent);
  const result: FileContent = {
    type: 'file-content',
    nodes: [],
  };
  collectChildren(result.nodes, ast);
  return result;
};

const collectChildren = (output: ParsedNode[], node: Node) => {
  const nodes = children(node);
  for (const child of nodes) {
    switch (child.type) {
      case 'space':
        continue;
      case 'comment_singleline':
        collectComment(output, child);
        continue;
      case 'atrule':
        collectAtRule(output, child);
        continue;
      case 'rule':
        collectRule(output, child);
        continue;
      case 'declaration':
        collectDeclaration(output, child);
        continue;
      default:
        console.error('Context:', nodes);
        console.error('Source:', stringify(child));
        throw new Error(`Don't know how to handle ${child.type} node`);
    }
  }
};

const collectAtRule = (output: ParsedNode[], node: Node) => {
  const atRule = toScss(node.value[0] as Node);
  switch (atRule) {
    case '@use':
      return;
    case '@mixin':
      return collectMixin(output, node);
    case '@include':
      return collectInclude(output, node);
    case '@for':
      return collectTodo(output, node);
    case '@keyframes':
      return collectTodo(output, node);
    case '@media':
      return collectTodo(output, node);
    case '@each':
      return collectTodo(output, node);
    default:
      throw new Error(`Don't know how to handle ${atRule}`);
  }
};

const collectRule = (output: ParsedNode[], node: Node) => {
  const [selector, block] = splitNodes(node, 'selector', 'block');
  const result: StyleRule = {
    type: 'style-rule',
    selectors: toScss(selector).split(/\s*,\s*/g),
    children: [],
  };
  collectChildren(result.children, block);
  output.push(result);
};

const collectDeclaration = (output: ParsedNode[], node: Node) => {
  const [property, , value] = splitNodes(node, 'property', ':', 'value');
  output.push({
    type: 'property',
    name: toScss(property),
    value: toScss(value),
  });
};

const splitNodes = (nodes: Node | Node[], ...expected: string[]): Node[] => {
  if (!Array.isArray(nodes)) {
    nodes = children(nodes);
  }
  let [expectedType, ...rest] = expected;
  const result: Node[] = [];
  for (const node of nodes) {
    const optional = expectedType?.endsWith('?');
    if (optional) {
      expectedType = expectedType.slice(0, -1);
    }
    if (node.type === 'space') continue;
    let expectedValue: string | null = null;
    if (/[^\w-]/.test(expectedType)) {
      expectedValue = expectedType;
      expectedType = 'punctuation';
    }
    if (node.type === expectedType && (!expectedValue || expectedValue === node.value)) {
      result.push(node);
      [expectedType, ...rest] = rest;
    } else {
      if (optional) {
        result.push(null!);
      } else {
        if (node.type === 'punctuation' && (node.value === ';' || node.value === ',')) continue;
        console.error('Nodes:', nodes);
        throw new Error(
          `Expected ${expectedValue || expectedType || 'no more nodes'}, got ${node.type}`,
        );
      }
    }
  }
  return result;
};

const collectComment = (output: ParsedNode[], node: Node) => {
  output.push({
    type: 'line-comment',
    text: stringValue(node).trim(),
  });
};

const collectMixin = (output: ParsedNode[], node: Node) => {
  const [, name, content] = splitNodes(node, 'atkeyword', 'identifier', 'block');
  if (name.value === 'output') {
    collectChildren(output, content);
  } else {
    throw new Error(`Don't know how to handle @mixin ${name}`);
  }
};

const collectTodo = (output: ParsedNode[], node: Node) => {
  output.push({
    type: 'todo',
    scssSource: stringify(node),
  });
};

const collectInclude = (output: ParsedNode[], node: Node) => {
  const [, ag, name, args, block] = splitNodes(
    node,
    'atkeyword',
    'identifier',
    'class',
    'arguments?',
    'block?',
  );
  const result: Include = {
    type: 'include',
    mixin: toScss(ag) + toScss(name),
    arguments: [],
    block: [],
  };
  if (args) {
    collectArguments(result.arguments, args);
  }
  if (block) {
    collectChildren(result.block, block);
  }
  output.push(result);
};

const collectArguments = (output: Argument[], argumentsNode: Node) => {
  const nodes = children(argumentsNode);
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    switch (node.type) {
      case 'space':
        continue;
      case 'punctuation':
        if (node.value === ',') continue;
        break;
      case 'operator':
      case 'number':
        let value = toScss(node);
        while (['identifier', 'number'].includes(nodes[i + 1]?.type)) {
          // number with units
          value += toScss(nodes[i + 1]);
          i++;
        }
        output.push({
          type: 'value',
          value,
        });
        continue;
      case 'identifier':
      case 'function':
        output.push({
          type: 'value',
          value: toScss(node),
        });
        continue;
      case 'parentheses':
        output.push(parseParenthesesArgument(node));
        continue;
    }
    console.error(nodes);
    throw new Error(`Unexpected ${stringify(node)} in argument list`);
  }
};

const parseParenthesesArgument = (node: Node): Argument => {
  const nodes = children(node);
  const listItems: ListArgument = {
    type: 'list',
    value: [],
  };
  const mapItems: MapArgument = {
    type: 'map',
    value: {},
  };
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    switch (node.type) {
      case 'space':
        continue;
      case 'punctuation':
        if (node.value === ',') continue;
        break;
      case 'operator':
      case 'number':
        let value = toScss(node);
        while (['identifier', 'number'].includes(nodes[i + 1]?.type)) {
          // number with units
          value += toScss(nodes[i + 1]);
          i++;
        }
        listItems.value.push(value);
        continue;
      case 'identifier':
      case 'function':
      case 'parentheses':
        listItems.value.push(toScss(node));
        continue;
      case 'declaration':
        const [declName, , declValue] = splitNodes(node, 'property', ':', 'value');
        mapItems.value[toScss(declName)] = toScss(declValue);
        continue;
    }
    console.error(nodes);
    throw new Error(`Unexpected ${stringify(node)} in argument list`);
  }
  const isMap = Object.keys(mapItems.value).length > 0;
  if (listItems.value.length > 0 && isMap) {
    console.error(nodes);
    throw new Error(
      `Arguments has both map and list kinds: ${JSON.stringify({
        list: listItems.value,
        map: mapItems.value,
      })}`,
    );
  }
  return isMap ? mapItems : listItems;
};

const children = (node: Node) => {
  if (typeof node.value === 'string') {
    throw new Error(`${node.type} node has no children (${stringify(node)})`);
  }
  return node.value;
};

const stringValue = (node: Node): string => {
  if (typeof node.value !== 'string') {
    throw new Error(`${node.type} node has array value (${stringify(node)})`);
  }
  return node.value;
};

const toScss = (node: Node): string => stringify(node).trim();

const logAst = (ast: any) =>
  console.log(
    JSON.stringify(
      ast,
      (key, value) => {
        if (key === 'start' || key === 'next') return undefined;
        return value;
      },
      '  ',
    ),
  );
