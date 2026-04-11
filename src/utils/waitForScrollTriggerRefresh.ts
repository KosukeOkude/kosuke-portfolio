import { ScrollTrigger } from "@/gsap/core/setup";
/**
 * ScrollTrigger の次の refresh 完了後にコールバックを実行する。
 * ST の pin/計算が確定してからスクロール等の処理を行いたいときに使う。
 */
export function waitForScrollTriggerRefresh(callback: () => void): void {
  ScrollTrigger.addEventListener("refresh", function onRefresh() {
    ScrollTrigger.removeEventListener("refresh", onRefresh);
    callback();
  });
}
