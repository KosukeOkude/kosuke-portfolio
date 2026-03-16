import type { WorkForClient } from '@/data/works';

interface Props {
  work: WorkForClient;
}

export default function WorksCard({ work }: Props) {
  const { title, date, slug, tags = [], thumbnailUrl, thumbnailAlt = '' } = work;

  return (
    <>
      {/* <pre style={{ fontSize: '10px', color:'white' }}>{JSON.stringify(work, null, 2)}</pre> */}
      <article className="flex flex-col flex-shrink-0 w-[240px] xl:w-[280px]">
        <a href={`/works/${slug}`} className="block">
          {/* 上のメタ部分 */}
          <div className="border border-white/20 border-t-2 border-t-white">
            <div className="
                  w-full h-[200px] xl:h-[240px] min-h-0
                  flex flex-col justify-end
                  px-3 py-3
                  bg-black/35
                  backdrop-blur-md backdrop-saturate-150
                  border-x border-t
                  border-white/15 border-t-white/70
            ">
              <h3 className="
                    text-[var(--color-white)]
                    font-accent font-semibold
                    text-[15px] md:text-[17px]
                    leading-snug
                    mb-2
              ">{title}</h3>
              <p className="
                  text-body
                  text-[11px] md:text-[12px]
                  tracking-[0.16em] uppercase
                  text-white/70
                  mb-1.5
                ">Date - {date}</p>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    <p className="
                        text-body
                        text-[11px]
                        leading-snug
                        text-white/65
                    ">
                    {tags.map((tag) => '#' + tag).join(' ')}
                  </p>
                </div>
              )}
            </div>
          </div>
          {/* 下の画像部分 */}
          <div className="w-full aspect-[4/5] flex-shrink-0 overflow-hidden rounded-b-normal bg-gray-800">
            <img src={thumbnailUrl} alt={thumbnailAlt} loading="lazy" className="w-full h-full object-cover" />
          </div>
        </a>
      </article>
    </>
  );
}
