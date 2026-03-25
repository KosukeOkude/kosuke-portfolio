import type { NewsArchive } from "@/data/news";

interface NewsListProps {
    newsItems: NewsArchive[]
}

export default function NewsList({ newsItems }: NewsListProps){
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6">
      {newsItems.map((item) => (
        <a
            key={item.id}
            href={`/news/${item.slug}`}
            className="
            group
            flex
            flex-row
            rounded-lg
            overflow-hidden
            bg-white
            border
            border-[#e8e8e8]
            shadow-[0_2px_12px_rgba(0,0,0,0.06)]
            transition-all
            duration-300
            hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]
            hover:border-[#d4d4d4]
          "
        >

          <div className="flex-shrink-0 w-[140px] sm:w-[180px] md:w-[200px] aspect-square overflow-hidden bg-[#f5f5f5]">
            <img
              src={item.thumbnailUrl}
              alt={item.thumbnailAlt}
              loading="lazy"
              className="
                w-full
                h-full
                object-cover
                grayscale
                group-hover:grayscale-0
                transition-[filter]
                duration-300
              "
            />
          </div>

          <div className="flex-1 min-w-0 flex flex-col justify-center px-4 py-4 sm:px-6 sm:py-5">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1.5">
              <span className="text-[11px] md:text-xs text-[#737373] tracking-wide">
                {item.date}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="
                      inline-block
                      px-2
                      py-0.5
                      text-[10px]
                      md:text-[11px]
                      font-medium
                      tracking-[0.06em]
                      uppercase
                      text-[#525252]
                      bg-[#f0f0f0]
                      rounded
                    "
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            <h3
              className="
                font-semibold
                text-[#111]
                text-sm
                md:text-base
                leading-snug
                mb-1.5
              "
            >
              {item.title}
            </h3>
            <p
              className="
                text-xs
                md:text-sm
                text-[#525252]
                leading-relaxed
                line-clamp-2
              "
            >
              {item.summary}
            </p>
          </div>
        </a>
      ))}
    </div>
  );
}