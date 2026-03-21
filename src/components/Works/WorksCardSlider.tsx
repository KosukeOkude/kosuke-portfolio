import  { type FC, useRef, useEffect } from 'react';
import type { WorkForClient } from '@/data/works';
import WorksCard from '@/components/Works/WorksCard.tsx';

interface WorksCardSliderProps {
  works: WorkForClient[];
  resetKey: string;
}




export const WorksCardSlider: FC<WorksCardSliderProps> = ({ works, resetKey }) => {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    scrollerRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
  },[resetKey]);
  return (
    <div id="works_slider">
        {/* カードスライダー用ラッパー（横スクロール） */}
        <div ref={scrollerRef} className="min-w-0 flex-1 overflow-x-auto">
            <div className="flex gap-5 md:gap-10 ">
            {/* カード 1 枚  */}
            {works.map((work) => (
                <WorksCard key={work.slug} work={work}/>
            ))}
            </div>
        </div>
    </div>

  );
}