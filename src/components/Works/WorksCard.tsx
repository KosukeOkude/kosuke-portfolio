import type { WorkForClient } from '@/data/works';

interface Props {
  work: WorkForClient;
}

export default function WorksCard({ work }: Props) {
  const { title, date, slug, tags = [], thumbnailUrl, thumbnailAlt = '' } = work;

  return (
    <>
      {/* <pre style={{ fontSize: '10px', color:'white' }}>{JSON.stringify(work, null, 2)}</pre> */}
      <article className="flex flex-col flex-shrink-0 w-[240px] 2xl:w-[280px]">
        <a href={`/works/${slug}`} className="block">
          {/* 上のメタ部分 */}
          <div className="border border-white/20 border-t-2 border-t-white">
            <div className="h-[200px] 2xl:h-[240px] min-h-0 flex flex-col justify-end p-2 bg-black/10 backdrop-blur-md backdrop-saturate-150 shadow-lg">
              <h3 className="text-[var(--color-white)] font-bold text-lg font-accent mb-4">{title}</h3>
              <p className="text-body text-[var(--color-white)] text-sm opacity-80 mb-2">Date - {date}</p>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    <p className="text-body text-[var(--color-white)] text-xs opacity-80">
                    {tags.map((tag) => '#' + tag).join(' ')}
                  </p>
                </div>
              )}
            </div>
          </div>
          {/* 下の画像部分 */}
          <div className="w-[240px] h-[270px] flex-shrink-0 overflow-hidden rounded-b-normal bg-gray-800 2xl:w-[280px] 2xl:h-[320px]">
            <img src={thumbnailUrl} alt={thumbnailAlt} loading="lazy" className="w-[240px] h-[270px] 2xl:w-[280px] 2xl:h-[340px] object-cover" />
          </div>
        </a>
      </article>
    </>
  );
}
