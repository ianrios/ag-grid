import * as prettier from 'prettier';
import { renderRules } from '../src/design-system/css-in-js';
import { commonRules } from '../src/design-system/style/structural/common';

const options = prettier.resolveConfig(__dirname);

const main = async () => {
  const start = Date.now();
  const rendered = renderRules(commonRules);
  process.stderr.write(`renderRules completed in ${Date.now() - start}ms\n`);
  const code = await prettier.format(rendered, {
    ...(await options),
    parser: 'css',
  });
  process.stdout.write(code);
};

main();
