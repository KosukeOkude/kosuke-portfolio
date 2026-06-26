import { useState } from "react";

interface MovieEmbedProps {
  videoId: string;
  title: string;
}

export function MovieEmbed({ videoId, title }: MovieEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (isPlaying) {
    return (
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
        title={title}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsPlaying(true)}
      className="group absolute inset-0 h-full w-full cursor-pointer"
      aria-label={`${title || "動画"}を再生`}
    >
      <img
        src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
        }}
        alt=""
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />
      <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors duration-200 group-hover:bg-black/35">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 transition-transform duration-200 group-hover:scale-110 md:h-20 md:w-20">
          <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 text-black md:h-8 md:w-8" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
    </button>
  );
}
