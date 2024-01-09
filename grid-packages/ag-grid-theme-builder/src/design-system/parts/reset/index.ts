import { ThemePart } from 'design-system/design-system-types';
import resetCSS from './reset.css?inline';

/**
 * CSS resets required by other theme parts. There is no need to explicitly
 * include this part, it is automatically included.
 */
export const reset = (): ThemePart => {
  return {
    css: resetCSS,
    variables: {},
  };
};
