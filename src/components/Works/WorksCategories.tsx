interface WorksCategoryProps {
    categories: string[];
    selectedCategory: string;
    onSelect: (category: string) => void;
}

export const WorksCategories = ({
    categories,
    selectedCategory,
    onSelect
}: WorksCategoryProps) => (
    <div className="flex flex-wrap gap-3 mb-4">
        {categories.map((category) => {
            const isActive = category === selectedCategory;
            const displayLabel = category === 'All' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1);
            return (
                <button key={category}
                        type="button"
                        onClick={() => onSelect(category)}
                        className={
                            "px-4 py-1.5 rounded-full border border-white/30 bg-white/10 text-xs md:text-sm hover:bg-white/20 transition-colors" +
                            (isActive
                                ? 'border-white/30 bg-white/10 hover:bg-white/20'
                                : 'border-white/10 bg-white/5 hover:bg-white/15')
                        }>
                        {displayLabel}
                </button>
            )
        })}
    </div>
)