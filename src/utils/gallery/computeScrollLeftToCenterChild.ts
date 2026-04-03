export function computeScrollLeftToCenterChild(scroller: HTMLElement, child: HTMLElement): number {
    const scrollerRect = scroller.getBoundingClientRect();
    const childRect = child.getBoundingClientRect();

    const rawTargetLeft = scroller.scrollLeft + (childRect.left - scrollerRect.left) - (scroller.clientWidth / 2 - child.clientWidth / 2);

    return Math.max(0, rawTargetLeft);
}