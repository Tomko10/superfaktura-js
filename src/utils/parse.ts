import { isDict } from './types';

export const nullable = <T>(value: string, f: (v: string) => T) => {
  if (value === null || value === undefined) {
    return null;
  }

  return f(value);
};

export const nullableString = (value: string) => nullable(value, (v) => v);

export const nullableInt = (value: string) =>
  nullable(value, (x) => parseInt(x, 10));

export const nullableFloat = (value: string) => nullable(value, parseFloat);

export const nullableDate = (value: string) =>
  nullable(value, (x) => new Date(x));

export const bool = (value: string) => value === '1';

export const nullableBool = (value: string) => nullable(value, bool);

export const formatDates = (params: any) => {
  const formattedParams: any = { ...params };
  Object.entries(params).forEach(([key, value]) => {
    if (value instanceof Date) {
      formattedParams[key] = value.toISOString().split('T')[0];
    }
    if (isDict(value)) {
      formattedParams[key] = formatDates(value);
    }
  });

  return formattedParams;
};
