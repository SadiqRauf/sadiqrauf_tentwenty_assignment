
export function uniqueById<T extends { id: number | string }>(items: T[]): T[] {
  const seen = new Set<T['id']>();
  return items.filter(item => {
    if (seen.has(item.id)) {
      return false;
    }
    seen.add(item.id);
    return true;
  });
}
