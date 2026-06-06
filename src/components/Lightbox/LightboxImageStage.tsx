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
      <div className="pointer-events-auto max-h-[92dvh] max-w-[92dvw]">
        <img
          src={src}
          alt={alt ?? ""}
          className="max-h-[92dvh] max-w-[92dvw] object-contain rounded-md"
          draggable={false}
        />
      </div>
    </div>
  );
}
