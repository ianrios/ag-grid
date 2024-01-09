import { BordersParams, QuartzIconsParams, borders, quartzIcons } from '..';

export type FromJsonParams = {
  borders?: BordersParams | boolean | null;
  quartzIcons?: QuartzIconsParams | boolean | null;
};

export const fromJson = (params: FromJsonParams = {}): string =>
  [delegate(params.borders, borders), delegate(params.quartzIcons, quartzIcons)]
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
