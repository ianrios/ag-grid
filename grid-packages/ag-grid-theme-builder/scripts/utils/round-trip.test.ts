import { expect, test } from 'vitest';
import { renderRules } from '../../src/design-system/css-in-js';
import * as dsl from '../../src/design-system/css-in-js/style-rule';
import { generateFileContent } from './codegen';
import { parseScssString } from './scss-ast';

const roundTrip = async (scss: string) => {
  const rulesLiteral = (await generateFileContent(parseScssString(scss)))
    .trim()
    .replace(/as any/g, '');
  const code = `return renderRules(${rulesLiteral});`;
  const imports = {
    renderRules: renderRules,
    is: dsl.is,
    $is: dsl.$is,
    not: dsl.not,
    $not: dsl.$not,
    el: dsl.el,
    ag: dsl.ag,
    $el: dsl.$el,
    $ag: dsl.$ag,
    firstChild: dsl.firstChild,
    $firstChild: dsl.$firstChild,
  };
  const args = [...Object.keys(imports), code];
  let f: any;
  try {
    f = new Function(...args);
  } catch (e) {
    console.error('Syntax error in code:', code);
    throw e;
  }
  return f(...Object.values(imports));
};

test(`Round trip`, async () => {
  expect(
    await roundTrip(`
      ag-grid, ag-grid-angular {
          display: block;

          .nested {
            color: red;
          }
      }

      .ag-hidden {
          display: none !important;
      }
  `),
  ).toMatchInlineSnapshot(`
    "ag-grid, ag-grid-angular {
    	display: block;
    }
    ag-grid .nested, ag-grid-angular .nested {
    	color: red;
    }
    .ag-hidden {
    	display: none !important;
    }
    "
  `);
});

test(`Mixing tight and loose selectors`, async () => {
  expect(
    await roundTrip(`
      .ag-foo {
          &:first-child {
            color: red;
          }
          :first-child {
            color: green;
          }
      }
  `),
  ).toMatchInlineSnapshot(`
    ".ag-foo:first-child {
    	color: red;
    }
    .ag-foo :first-child {
    	color: green;
    }
    "
  `);
});
