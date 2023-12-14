import * as fs from 'fs';
import * as path from 'path';
import { expect, test } from 'vitest';
import { parseScssString } from './scss-ast';

test(`Parses ast`, () => {
  expect(
    parseScssString(`
    @use "ag";

    @mixin output {
      // rule comment
      ag-grid, ag-grid-angular  {
          // property comment
          display: block;

          .nested {
            color: red;
          }
      }

      .ag-hidden {
          display: none !important;
      }
    }
  `).nodes,
  ).toMatchInlineSnapshot(`
    [
      {
        "text": "rule comment",
        "type": "line-comment",
      },
      {
        "children": [
          {
            "text": "property comment",
            "type": "line-comment",
          },
          {
            "name": "display",
            "type": "property",
            "value": "block",
          },
          {
            "children": [
              {
                "name": "color",
                "type": "property",
                "value": "red",
              },
            ],
            "selectors": [
              ".nested",
            ],
            "type": "style-rule",
          },
        ],
        "selectors": [
          "ag-grid",
          "ag-grid-angular",
        ],
        "type": "style-rule",
      },
      {
        "children": [
          {
            "name": "display",
            "type": "property",
            "value": "none !important",
          },
        ],
        "selectors": [
          ".ag-hidden",
        ],
        "type": "style-rule",
      },
    ]
  `);
});

test(`Parses include with no arguments`, () => {
  expect(
    parseScssString(`
      @include ag.foo;
    `).nodes,
  ).toMatchInlineSnapshot(`
    [
      {
        "arguments": [],
        "block": [],
        "mixin": "ag.foo",
        "type": "include",
      },
    ]
  `);
  expect(
    parseScssString(`
      @include ag.foo();
    `).nodes,
  ).toMatchInlineSnapshot(`
    [
      {
        "arguments": [],
        "block": [],
        "mixin": "ag.foo",
        "type": "include",
      },
    ]
  `);
});

test(`Parses include with value arguments`, () => {
  expect(
    parseScssString(`
      @include ag.foo(a, 3px, -4.5px, calc(var(--foo) * 4));
    `).nodes,
  ).toMatchInlineSnapshot(`
    [
      {
        "arguments": [
          {
            "type": "value",
            "value": "a",
          },
          {
            "type": "value",
            "value": "3px",
          },
          {
            "type": "value",
            "value": "-4.5px",
          },
          {
            "type": "value",
            "value": "calc(var(--foo) * 4)",
          },
        ],
        "block": [],
        "mixin": "ag.foo",
        "type": "include",
      },
    ]
  `);
});

test(`Parses include with list arguments`, () => {
  expect(
    parseScssString(`
      @include ag.foo((a, foo(), 3px, -10.6, (embedded, list), bar));
    `).nodes,
  ).toMatchInlineSnapshot(`
    [
      {
        "arguments": [
          {
            "type": "list",
            "value": [
              "a",
              "foo()",
              "3px",
              "-10.6",
              "(embedded, list)",
              "bar",
            ],
          },
        ],
        "block": [],
        "mixin": "ag.foo",
        "type": "include",
      },
    ]
  `);
});

test(`Parses include with map arguments`, () => {
  expect(
    parseScssString(`
      @include ag.foo((a: b, c: 3px, d: foo(bar), e: -10.5pt));
    `).nodes,
  ).toMatchInlineSnapshot(`
    [
      {
        "arguments": [
          {
            "type": "map",
            "value": {
              "a": "b",
              "c": "3px",
              "d": "foo(bar)",
              "e": "-10.5pt",
            },
          },
        ],
        "block": [],
        "mixin": "ag.foo",
        "type": "include",
      },
    ]
  `);
});

test(`Parses include block argument`, () => {
  expect(
    parseScssString(`
      @include ag.foo() {
        color: red;

        &.nested {
          color: green;
        }
      };
    `).nodes,
  ).toMatchInlineSnapshot(`
    [
      {
        "arguments": [],
        "block": [
          {
            "name": "color",
            "type": "property",
            "value": "red",
          },
          {
            "children": [
              {
                "name": "color",
                "type": "property",
                "value": "green",
              },
            ],
            "selectors": [
              "&.nested",
            ],
            "type": "style-rule",
          },
        ],
        "mixin": "ag.foo",
        "type": "include",
      },
    ]
  `);
});

const allFiles = [
  'src/internal/base/parts/_reset.scss',
  'src/internal/base/parts/_date-time.scss',
  'src/internal/base/parts/_advanced-filter.scss',
  'src/internal/base/parts/_widgets.scss',
  'src/internal/base/parts/_charts.scss',
  'src/internal/base/parts/_grid-layout.scss',
  'src/internal/base/parts/_common-structural.scss',
  'src/internal/base/parts/_filter-tool-panel.scss',
  'src/internal/base/parts/_menu.scss',
  'src/internal/base/parts/_column-drop.scss',
  'src/internal/base/parts/_grid-borders.scss',
  'src/internal/base/parts/_print-structural.scss',
  'src/internal/base/parts/_sidebar.scss',
  'src/internal/base/parts/_columns-tool-panel.scss',
  'src/internal/base/parts/_footer.scss',
  'src/internal/base/parts/_root.scss',
  'src/internal/base/parts/_native-inputs.scss',
  'src/internal/base/parts/_icons.scss',
  'src/internal/base/parts/_header.scss',
  'src/internal/base/_base-variables.scss',
];

test(`Parses codebase`, () => {
  for (const file of allFiles) {
    parseScssFile(file);
  }
});

const parseScssFile = (filePath: string) => {
  return parseScssString(
    fs.readFileSync(
      path.resolve(__dirname, '../../../../grid-community-modules/styles', filePath),
      'utf8',
    ),
  );
};
