import type { DateSortOrder } from '@/type/DateSortOrder';

export function sortByDate<T>(
    items: T[],
    sortOrder: DateSortOrder,
    getDateMs: (item: T) => number
): T[]{
    const copy = [...items];
    if (sortOrder === 'date-desc'){
        return copy.sort((a, b) => getDateMs(b) - getDateMs(a));
    } else {
        return copy.sort((a, b) => getDateMs(a) - getDateMs(b));
    }
    return copy;
}