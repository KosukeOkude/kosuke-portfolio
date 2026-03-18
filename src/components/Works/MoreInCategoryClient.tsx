import { WorksCategories } from '@/components/Works/WorksCategories';
import type { FC } from 'react';


interface MoreInThisCategoryProps {
    allCategories: string[];
    currentCategory:string;
    allHref: string;
}


export const MoreInCategoryClient: FC<MoreInThisCategoryProps> = ({
    allCategories,
    currentCategory,
    allHref
}) => {
    const handleSelect = (category: string) => {
    const url =
        category === 'All'
        ? allHref
        : `${allHref}?category=${encodeURIComponent(category)}`;
    window.location.href = url
    }
  return (
    <WorksCategories
        categories={allCategories}
        selectedCategory={currentCategory}
        onSelect={handleSelect}
    />
  );
};