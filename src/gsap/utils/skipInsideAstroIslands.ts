export function skipInsideAstroIslands(el: Element): boolean {
    return el.closest("astro-island") !== null;
  }
