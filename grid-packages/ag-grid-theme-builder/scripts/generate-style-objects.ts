/**
 * This script parses Sass code and rewrites it as object-based styles
 */

///
/// IMPLEMENTATION
///
import * as fs from 'fs';
import { generateFileContent } from './utils/codegen';
import { parseScssString } from './utils/scss-ast';

const convertFile = async (srcPath: string) => {
  const parsed = parseScssString(fs.readFileSync(srcPath, 'utf8'));
  const source = await generateFileContent(parsed);

  process.stdout.write(`
import { $ag, $before, $not, ag, child, is, $is, $placeholder } from 'design-system/css-in-js';
import { Rule } from 'design-system/css-in-js/render';

export const commonRules: Rule[] = ${source}.flat();
  `);

  // if (stringRulesNotConverted.length > 0) {
  //   const rules = Array.from(new Set(stringRulesNotConverted)).sort().join('\n\t');
  //   process.stderr.write(`${stringRulesNotConverted.length} rules not converted:\n\t${rules}`);
  // }
};

const [, , src] = process.argv;
if (!src) {
  console.error(`Usage: npm run gso -- INPUT_PATH`);
  process.exit(1);
}

void convertFile(src);
