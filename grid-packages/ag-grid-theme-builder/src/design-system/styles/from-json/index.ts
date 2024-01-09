import { BordersParams, LucideIconsParams, borders, lucideIcons } from '..';

export type FromJsonParams = {
  borders?: BordersParams | boolean | null;
  lucideIcons?: LucideIconsParams | boolean | null;
};

export const fromJson = (params: FromJsonParams = {}): string =>
  [delegate(params.borders, borders), delegate(params.lucideIcons, lucideIcons)]
    .filter(Boolean)
    .join('\n');

const delegate = <T>(
  params: boolean | T | undefined | null,
  scheme: (params?: T) => string,
): string => {
  if (params == null || params === false) return '';
  if (params === true) return scheme();
  return scheme(params);
};
