import clsx from "clsx";

type ArchiveCategoryChipItem = {
  label: string;
  slug: string;
};

interface ArchiveCategoryChipsProps {
  categories: ArchiveCategoryChipItem[];
  selectedCategory: string;
  onSelect: (category: string) => void;
}

export const ArchiveCategoryChips = ({
  categories,
  selectedCategory,
  onSelect,
}: ArchiveCategoryChipsProps) => (
  <div className="flex xl:flex-wrap gap-3
  py-5 mb-4 overflow-x-auto">
    {categories.map((category) => {
      const isActive = category.slug === selectedCategory;
      return (
        <button
          key={category.slug}
          type="button"
          onClick={() => onSelect(category.slug)}
          className={clsx(
            "cursor-pointer shrink-0 rounded-full border px-4 py-1.5 text-xs transition-colors md:text-sm",
            isActive
              ? "border-white/60 bg-white/25 text-white hover:bg-white/30"
              : "border-white/15 bg-white/5 text-white/90 hover:border-white/25 hover:bg-white/15",
          )}
        >
          {category.label}
        </button>
      );
    })}
  </div>
);
