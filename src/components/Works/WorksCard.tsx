import type { WorkForClient } from "@/data/works";
import { buildSrcSet } from "@/utils";

interface WorksCardProps {
  work: WorkForClient;
}

export default function WorksCard({ work }: WorksCardProps) {
  const {
    title,
    date,
    slug,
    tags = [],
    thumbnailUrl,
    thumbnailAlt = "",
  } = work;

  return (
    <article className="flex max-[400px]:w-[192px] w-[240px] flex-shrink-0 flex-col xl:w-[280px]">
      <a
        href={`/works/${slug}`}
        className="group block"
      >
        {/* 上のメタ部分 */}
        <div className="border-x border-t border-white/20 border-t-2 border-t-white">
          <div
            className="
                relative flex max-[400px]:h-[160px] h-[200px] min-h-0 w-full flex-col justify-end
                border-x border-t border-white/15 border-t-white/70
                bg-black/35 px-3 py-3
                backdrop-blur-md backdrop-saturate-150
                xl:h-[240px]
          "
          >
            {tags.length > 0 && (
              <div className="absolute right-3 top-3 z-10 flex flex-col items-end gap-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-body text-right text-[10px] font-medium leading-tight tracking-wide text-white/75 xl:text-[11px]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            <h3
              className="
                mb-1.5 font-accent text-base font-semibold leading-tight
                text-[var(--color-white)] md:text-[17px] xl:text-lg xl:leading-snug
                "
            >
              {title}
            </h3>
            <p
              className="
                text-body text-[10px] uppercase tracking-[0.14em] text-white/60
                md:text-[11px] xl:text-xs
                "
            >
              Date - {date}
            </p>
          </div>
        </div>
        <div className="aspect-[4/5] w-full flex-shrink-0 overflow-hidden rounded-b-normal bg-gray-800">
          <img
            src={thumbnailUrl}
            srcSet={thumbnailUrl ? buildSrcSet(thumbnailUrl, [192, 300, 350, 560]) : undefined}
            sizes="(max-width: 400px) 192px, (max-width: 1280px) 300px, 350px"
            alt={thumbnailAlt}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </div>
      </a>
    </article>
  );
}
