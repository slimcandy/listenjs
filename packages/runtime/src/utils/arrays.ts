export function withoutNulls<T>(children: (T | null | undefined)[]): T[] {
  return children.filter((child) => child != null);
}
