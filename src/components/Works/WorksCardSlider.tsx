import React from "react";
import type { WorkForClient } from "@/data/works";
import WorksCard from "@/components/Works/WorksCard.tsx";

// 作品一覧とスクロール先頭リセット用のキー（カテゴリ・並び替え変更など）
interface WorksCardSliderProps {
  works: WorkForClient[];
  scrollerRef: React.RefObject<HTMLDivElement | null>;
}

// Works を横並びスクロールで表示し、Works トップの GSAP（data 属性・イベント）と連携する
export const WorksCardSlider = ({ works, scrollerRef }: WorksCardSliderProps) => {
  return (
    <div
      id="works_slider"
      data-card-slider
      data-reveal-once
    >
      <div
        ref={scrollerRef}
        className="works-card-slider-scroll min-w-0 flex-1 overflow-x-auto"
      >
        <div className="flex gap-5 md:gap-10">
          <div className="hidden [@media(pointer:fine)]:block w-10 shrink-0"></div>
          {works.map((work) => (
            <WorksCard
              key={work.slug}
              work={work}
            />
          ))}
          <div
            className="shrink-0 w-5 md:w-10"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
};
