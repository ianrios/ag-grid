import { ThemePart } from 'design-system/design-system-types';
import { combineThemeParts } from 'design-system/design-system-utils';
import { BordersParams, QuartzIconsParams, borders, quartzIcons } from '..';

export type FromJsonParams = {
  borders?: BordersParams | boolean | null;
  quartzIcons?: QuartzIconsParams | boolean | null;
};

/**
 * fromJson is a scheme that accepts a JSON export from the AG Grid theme
 * builder. It takes an object of theme part name to part arguments, so for
 * example `borders({betweenRows: false})` can be expressed as
 * `fromJson({borders: {betweenRows: false}})`.
 *
 * Using the fromJson scheme will include the code for every other scheme in
 * your application bundle, so if you are writing the code yourself it is
 * preferable to import and call just the scheme functions that you use.
 */
export const fromJson = (params: FromJsonParams = {}): ThemePart =>
  combineThemeParts([delegate(params.borders, borders), delegate(params.quartzIcons, quartzIcons)]);

const delegate = <T>(
  params: boolean | T | undefined | null,
  scheme: (params?: T) => ThemePart,
): ThemePart | null => {
  if (params == null || params === false) return null;
  if (params === true) return scheme();
  return scheme(params);
};
