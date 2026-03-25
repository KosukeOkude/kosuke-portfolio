import { useMemo } from "react";

export function useAllCategories<T>(
  items: T[],
  getCategory: (item: T) => string
): string[] {
  return useMemo(() => {
    const catSet = new Set<string>();
    for(const item of items){
        catSet.add(getCategory(item));
    }
    return ['All', ...catSet];
  }, [items, getCategory]);
}