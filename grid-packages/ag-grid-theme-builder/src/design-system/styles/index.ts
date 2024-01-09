import commonStructuralCSS from './common-structural.css?inline';
export const commonStructural = (): string => commonStructuralCSS;

import resetCSS from './reset.css?inline';
export const reset = (): string => resetCSS;

import colorSchemeCSS from './colour-scheme.css?inline';
export const colorScheme = (): string => colorSchemeCSS;

export * from './borders';
export * from './quartz-icons';
