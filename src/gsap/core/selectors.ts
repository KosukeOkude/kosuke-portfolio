// src/gsap/selectors.ts
export const SELECTORS = {
  //components
  sectionOverlay: "[data-section-overlay]",
  //hero
  heroRoot: "[data-hero-root]",
  heroHint: "[data-hero-scroll-hint]",
  heroProfileWrap: "[data-hero-profile-wrap]",
  heroName: "[data-hero-name]",
  heroTitle: "[data-hero-title]",

  //worksTop
  worksTopRoot: "[data-works-top-root]",
  worksCardSliderScroll: ".works-card-slider-scroll",
  cardSlider: "[data-card-slider]",
} as const;

export type SelectorValue = (typeof SELECTORS)[keyof typeof SELECTORS];
