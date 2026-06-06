import ArrowLeftIcon from "@/components/Icons/ArrowLeftIcon";
import BackButtonIcon from "@/components/Icons/BackButtonIcon";
import type { MouseEvent } from "react";

type LightboxNavControlsProps = {
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
};

function withStopPropagation(handler: () => void) {
  return (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    handler();
  };
}

export default function LightboxNavControls({
  onPrev,
  onNext,
  onClose,
}: LightboxNavControlsProps) {
  /** ライトボックスの画面端コントロール（ガラス調・共通スタイル） */
  const LIGHTBOX_CONTROL_CLASS =
    "flex items-center justify-center rounded-full border border-white/20 bg-white/[0.07] text-white antialiased shadow-[0_4px_28px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-2xl backdrop-saturate-150 transition-[transform,box-shadow,border-color,background-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-white/40 hover:bg-white/[0.13] hover:shadow-[0_8px_40px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.22)] active:scale-[0.96] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/55 motion-reduce:transition-none motion-reduce:active:scale-100";

  return (
    <>
      <button
        type="button"
        onClick={withStopPropagation(onPrev)}
        className={`hidden cursor-pointer fixed top-1/2 z-20 h-[3.25rem] min-w-[3.25rem] -translate-y-1/2 px-1 text-[1.65rem] font-extralight leading-none tracking-tight ${LIGHTBOX_CONTROL_CLASS}`}
        style={{
          left: "max(1rem, env(safe-area-inset-left), calc((100vw - 2400px) / 2 + 1rem))",
        }}
        aria-label="Previous image"
      >
        <ArrowLeftIcon className="pointer-events-none block h-6 w-6 shrink-0" />
      </button>

      <button
        type="button"
        onClick={withStopPropagation(onNext)}
        className={`hidden cursor-pointer fixed top-1/2 z-20 h-[3.25rem] min-w-[3.25rem] -translate-y-1/2 px-1 text-[1.65rem] font-extralight leading-none tracking-tight ${LIGHTBOX_CONTROL_CLASS}`}
        style={{
          right:
            "max(1rem, env(safe-area-inset-right), calc((100vw - 2400px) / 2 + 1rem))",
        }}
        aria-label="Next image"
      >
        <ArrowLeftIcon className="pointer-events-none block h-6 w-6 shrink-0 scale-x-[-1]" />
      </button>

      <button
        type="button"
        onClick={onClose}
        className={`hidden cursor-pointer fixed z-20 h-[3.25rem] min-w-[3.25rem] text-[1.35rem] font-light leading-none ${LIGHTBOX_CONTROL_CLASS}`}
        style={{
          top: "max(1rem, env(safe-area-inset-top))",
          right:
            "max(1rem, env(safe-area-inset-right), calc((100vw - 2400px) / 2 + 1rem))",
        }}
        aria-label="Close"
      >
        <BackButtonIcon className="pointer-events-none block h-6 w-6 shrink-0" />
      </button>
    </>
  );
}
