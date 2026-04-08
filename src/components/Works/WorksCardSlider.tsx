import { useRef, useEffect, useLayoutEffect } from "react";
import { gsap, ScrollTrigger } from "@/gsap/core/setup";
import type { WorkForClient } from "@/data/works";
import WorksCard from "@/components/Works/WorksCard.tsx";

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
  const stRef = useRef<ScrollTrigger>(null);

  useLayoutEffect(() => {
    const root = document.querySelector<HTMLElement>("[works-archive-root]");
    const cardSlider = document.querySelector<HTMLElement>("[data-card-slider]");
    const scroller = scrollerRef.current;

    if (!root || !scroller) return;

    stRef.current?.kill();
    scroller.scrollLeft = 0;

    const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;
    if (maxScrollLeft <= 0) return;

    const tl = gsap.timeline();

    tl.to(scroller, { scrollLeft: maxScrollLeft, ease: "none", duration: 1 });

    stRef.current = ScrollTrigger.create({
      trigger: cardSlider,
      start: "bottom bottom",
      end: `+=${maxScrollLeft}`,
      pin:  root,
      scrub: true,
      animation: tl,
      invalidateOnRefresh: true,
    });

    return () => {
      stRef.current?.kill();
    };
  }, [resetKey]);

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
