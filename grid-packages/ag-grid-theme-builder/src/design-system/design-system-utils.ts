export const applyDefaults = <T extends object>(record: T, defaults: Required<T>): Required<T> => {
  const result = { ...defaults };
  for (const key of Object.keys(record)) {
    if (key in record) {
      result[key as keyof T] = record[key as keyof T];
    }
  }
  return result;
};
