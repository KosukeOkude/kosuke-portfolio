type ScrollLineVerticalOptions = {
  isHiddenText?: boolean;
};

export default function ScrollLineVertical({ isHiddenText = false }: ScrollLineVerticalOptions) {
  return (
    <div className="absolute z-[9999] bottom-0 left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center gap-2">
      {!isHiddenText && (
        <span className="font-body text-[0.6rem] tracking-[0.3em] uppercase text-white font-bold">
          Scroll
        </span>
      )}
      <div className="scroll-line scroll-line-horizontal"></div>
    </div>
  );
}
