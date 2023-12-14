import { expect, test } from 'vitest';
import { generateFileContent } from './codegen';
import { parseScssString } from './scss-ast';

const generate = async (scss: string) => (await generateFileContent(parseScssString(scss))).trim();

test(`Translates class rules`, async () => {
  expect(
    await generate(`
      .ag-foo  {
          // property comment1
          // property comment2
          display: block;
          // block comment
          
          .ag-nested, .ag-lala {
            color: red;
            // post property comment
          }
      }
  `),
  ).toMatchInlineSnapshot(`
    "[
      ag.foo(
        {
          // property comment1
          // property comment2
          display: 'block',
        },

        // block comment
        is(
          ag.nested,
          ag.lala,
        )(
          {
            color: 'red',
          },

          // post property comment
        ),
      ),
    ]"
  `);
});

test(`Translates unknown rules`, async () => {
  expect(
    await generate(`
      @each $icon-name, $font-code in $icon-font-codes {
        .ag-icon-#{$icon-name} {
            // sample unsupported rule
        }
    }
  `),
  ).toMatchInlineSnapshot(`
    "[
      ,/****************************
       * TODO, port this Sass code:
       * @each $icon-name, $font-code in $icon-font-codes {
       *         .ag-icon-#{$icon-name} {
       *             // sample unsupported rule
       *         }
       *     }
       ****************************/
    ]"
  `);
});

test(`Translates mixins`, async () => {
  expect(
    await generate(`
      .ag-foo {
        @include ag.selectable(text);
        @include ag.selectable(none);
        @include ag.selectable();
        @include ag.unthemed-rtl(( left: 20px ));
      }
      .ag-bar {
        @include ag.unthemed-rtl(( padding-right: 1px, margin-left: 2px ));
      }
  `),
  ).toMatchInlineSnapshot(`
    "[
      ag.foo({
        userSelect: 'text',
        userSelect: 'none',
        userSelect: 'none',
        leading: '20px',
      }),

      ag.bar({
        paddingTrailing: '1px',
        marginLeading: '2px',
      }),
    ]"
  `);
});

test(`Generates strings for CSS text properties`, async () => {
  expect(
    await generate(`
      .ag-foo {
        content: "lala";
        font-family: "Plex Sans", cursive;
      }
  `),
  ).toMatchInlineSnapshot(`
    "[
      ag.foo({
        content: 'lala',
        fontFamily: ['Plex Sans', 'cursive'],
      }),
    ]"
  `);
});

test(`Descendent selectors`, async () => {
  expect(
    await generate(`
      .ag-foo .ag-bar {
        content: "lala";
      }
  `),
  ).toMatchInlineSnapshot(`
    "[
      is('.ag-foo .ag-bar')({
        content: 'lala',
      }),
    ]"
  `);
});

test(`Combining selectors`, async () => {
  expect(
    await generate(`
      .ag-foo.ag-bar {
        content: "lala";
      }
  `),
  ).toMatchInlineSnapshot(`
    "[
      ag.foo.is(ag.bar)({
        content: 'lala',
      }),
    ]"
  `);
});
