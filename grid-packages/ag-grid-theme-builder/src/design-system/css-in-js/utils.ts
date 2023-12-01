export const toKebabCase = (camelCase: string) =>
  camelCase.replaceAll(/(?=[A-Z])/g, '-').toLowerCase();

export const proxy = <K extends string, V>(getValue: (property: K) => V) =>
  new Proxy({} as Record<K, V>, {
    get: (cache, prop) => (cache[prop as K] ||= getValue(prop as K)),
  });
