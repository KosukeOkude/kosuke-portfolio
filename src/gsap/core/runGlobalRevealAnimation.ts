import { applyRevealBySelector } from "@/gsap/presets/reveal/applyRevealBySelector";
import type { RunGlobalRevealOptions } from "@/type/RunGlobalRevealOptions";

/** 要素が Astro のクライアント島の内側（または島要素自身）か */
/**
 * 文書内の [data-reveal] に ScrollTrigger 付きのフェードインを付与する。
 * 同一要素は WeakSet で追跡し、二重に gsap.set / to しない。
 *
 * @param options.skipInsideAstroIslands — true なら astro-island 内を除外（DOMContentLoaded 直後の初回用）。
 */

const started = new WeakSet<Element>();

export function runGlobalRevealAnimation(
  options?: RunGlobalRevealOptions,
): void {
  applyRevealBySelector({
    selector: "[data-reveal]",
    options,
    started,
  });

  applyRevealBySelector({
    selector: "[data-reveal-each]",
    options,
    started,
  });

  applyRevealBySelector({
    selector: "[data-reveal-once]",
    options,
    started,
  });

  applyRevealBySelector({
    selector: "[data-reveal-enter]",
    options,
    started,
  });
}
