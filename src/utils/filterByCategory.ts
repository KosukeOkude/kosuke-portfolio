export function filterByCategory<T> (
    items: T[],
    category: string,
    getCategory: (item: T) => string
): T[]{
    return category === 'All'
    ? items
    : items.filter((item) => getCategory(item) === category)
}