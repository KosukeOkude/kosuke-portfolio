import { type CategoryOption } from "@/type/category";

interface GallerySliderCategoryProps {
    categories: CategoryOption[];
    selectedCategory: string;
    onSelect:(slug: string) => void;
}
export const GallerySliderCategory = ({ categories, selectedCategory, onSelect }: GallerySliderCategoryProps) => {
  return (

    <div className="mx-auto flex flex-nowrap gap-2 overflow-x-auto">
        {categories.map((category) => (
            <button
                className={[
                'inline-flex items-center rounded-full border px-3 py-1 text-xs md:text-sm transition-colors',
                'border-white/15 text-white/70 hover:border-white/30 hover:text-white whitespace-nowrap',
                selectedCategory === category.slug ? 'bg-white/10 text-white border-white/30' : 'bg-transparent',
                ].join(' ')}
                key={category.slug}
                onClick={() => onSelect(category.slug)}>
                {category.label}
            </button>
        ))}
  </div>
  );
};