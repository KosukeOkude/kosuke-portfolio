import { gsap, prefersReducedMotion } from "@/gsap/core/setup";
import { playRevealEach } from "@/gsap/presets/reveal/eachReveal";
import { playRevealSingle } from "@/gsap/presets/reveal/singleReveal";
import { playRevealOnce } from "@/gsap/presets/reveal/revealOnce";
import { skipInsideAstroIslands } from "@/gsap/utils/skipInsideAstroIslands";
import type { RevealSelector } from "@/type/RevealSelector";
import type { RunGlobalRevealOptions } from "@/type/RunGlobalRevealOptions";
import { playRevealSingleEnterOnly } from "@/gsap/presets/reveal/playRevealSingleEnterOnly";
import { playRevealBottom } from "@/gsap/presets/reveal/revealBottom";

type ApplyRevealOptions = {
  selector: RevealSelector;
  options?: RunGlobalRevealOptions;
  started: WeakSet<Element>;
};

export function applyRevealBySelector({
  selector,
  options,
  started,
}: ApplyRevealOptions): void {
  const targetElements = Array.from(
    document.querySelectorAll<HTMLElement>(selector),
  );

  const visibleTargets = options?.skipInsideAstroIslands
    ? targetElements.filter((el) => !skipInsideAstroIslands(el))
    : targetElements;

  visibleTargets.forEach((target) => {
    if (started.has(target)) return;
    started.add(target);

    if (prefersReducedMotion()) {
      gsap.set(target, { opacity: 1, y: 0 });
      return;
    }

    if (selector === "[data-reveal]") {
      playRevealSingle(target);
    } else if (selector === "[data-reveal-each]") {
      playRevealEach(target);
    } else if (selector === "[data-reveal-once]") {
      playRevealOnce(target);
    } else if (selector === "[data-reveal-enter]") {
      playRevealSingleEnterOnly(target);
    } else if (selector === "[data-reveal-bottom]") {
      playRevealBottom(target);
    }
  });
}
