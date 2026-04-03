import type { TouchEventHandler } from "react";

type LightboxImageStageProps = {
  src: string;
  alt?: string;
  onTouchStart: TouchEventHandler<HTMLElement>;
  onTouchEnd: TouchEventHandler<HTMLElement>;
};

export default function LightboxImageStage({
  src,
  alt,
  onTouchStart,
  onTouchEnd,
}: LightboxImageStageProps) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center p-4"
      onClick={(e) => e.stopPropagation()}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="pointer-events-auto max-h-[92vh] max-w-[92vw]">
        <img
          src={src}
          alt={alt ?? ""}
          className="max-h-[92vh] max-w-[92vw] object-contain rounded-md"
          draggable={false}
        />
      </div>
    </div>
  );
}
