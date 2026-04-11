import { useState, useEffect } from "react";

export default function WorksArchiveHint() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  return (
    <div
      className="group mb-5 flex max-w-lg flex-col gap-2.5 rounded-xl border border-white/[0.14] bg-gradient-to-br from-white/[0.09] via-white/[0.04] to-transparent px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-md transition-[border-color,box-shadow,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-white/25 hover:from-white/[0.11] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_16px_48px_rgba(0,0,0,0.45)] motion-reduce:transition-none md:gap-3 md:px-4 md:py-3"
      role="note"
      data-reveal-once
    >
      <div className="bottom-10 left-1/2 pointer-events-none flex items-center gap-3">
        <div className={isMobile ? "scroll-line-horizontal" : "scroll-line"}></div>
        <p className="min-w-0 font-body text-[0.8125rem] font-medium leading-relaxed tracking-[0.04em] text-white/[0.92] antialiased [text-shadow:0_1px_20px_rgba(0,0,0,0.5)] md:text-sm md:tracking-[0.03em]">
          {isMobile ? "左右スクロールで作品が流れます" : "上下スクロールで作品が流れます"}
        </p>
      </div>
    </div>
  );
}
