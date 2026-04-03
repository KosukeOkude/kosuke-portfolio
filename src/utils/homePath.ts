export function isHomePath(): boolean{
    const p = window.location.pathname;
    return p === "/" || p ==="";
}
