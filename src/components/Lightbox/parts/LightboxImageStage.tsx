import { buildSrcSet } from "@/utils/buildSrcSet";

type LightboxImageStageProps = {
  src: string;
  alt?: string;
};

export default function LightboxImageStage({ src, alt }: LightboxImageStageProps) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center p-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="pointer-events-auto max-h-[92vh] max-w-[92vw]">
        <img
          src={src}
          srcSet={src ? buildSrcSet(src, [800, 1200, 2000]) : undefined}
          sizes="92vw"
          alt={alt ?? ""}
          className="max-h-[92vh] max-w-[92vw] object-contain rounded-md"
          draggable={false}
        />
      </div>
    </div>
  );
}
