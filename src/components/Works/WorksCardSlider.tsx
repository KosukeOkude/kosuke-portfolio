import { useRef, useEffect } from "react";
import type { WorkForClient } from "@/data/works";
import WorksCard from "@/components/Works/WorksCard.tsx";
import { WORKS_TOP_CARD_READY } from "@/gsap/animations/worksTop.animation.react";

// 作品一覧とスクロール先頭リセット用のキー（カテゴリ・並び替え変更など）
interface WorksCardSliderProps {
  works: WorkForClient[];
  resetKey: string;
}

// Works を横並びスクロールで表示し、Works トップの GSAP（data 属性・イベント）と連携する
export const WorksCardSlider = ({ works, resetKey }: WorksCardSliderProps) => {
  // 横スクロール領域（reset 時に scrollTo で先頭へ戻す）
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  // resetKey が変わったらスライダーを左端へ戻す
  useEffect(() => {
    scrollerRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  }, [resetKey]);

  // マウント時に一度だけ GSAP へ「カード DOM 準備完了」を通知する
  useEffect(() => {
    window.dispatchEvent(new CustomEvent(WORKS_TOP_CARD_READY));
  }, []);
  return (
    <div
      id="works_slider"
      data-card-slider
    >
      <div
        ref={scrollerRef}
        className="works-card-slider-scroll min-w-0 flex-1 overflow-x-auto "
      >
        <div className="flex gap-5 md:gap-10 ">
          {works.map((work) => (
            <WorksCard
              key={work.slug}
              work={work}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
