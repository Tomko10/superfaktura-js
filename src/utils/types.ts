export type Nullable<T> = { [P in keyof T]: T[P] | null };
export type PartialNullable<T> = { [P in keyof T]?: T[P] | null };

export const isDict = (value: any) => {
  return typeof value === 'object' && !Array.isArray(value) && value !== null;
};
