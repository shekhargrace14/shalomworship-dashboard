export type SortDirection = 'asc' | 'desc';

export function sortData<T>(data: T[], field: keyof T, direction: SortDirection): T[] {
  return [...data].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];

    let result = 0;

    // String sorting
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      result = aValue.localeCompare(bValue);
    }

    // Date sorting
    else if (aValue instanceof Date && bValue instanceof Date) {
      result = aValue.getTime() - bValue.getTime();
    }

    // Number sorting
    else if (typeof aValue === 'number' && typeof bValue === 'number') {
      result = aValue - bValue;
    }

    return direction === 'asc' ? result : -result;
  });
}
