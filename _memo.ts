
/**
 * 指定したlayer（親要素）の中で、画像要素(el)をスロット制約なしに
 * 画面全体のランダムな位置へ配置します。
 * marginRatio分の余白を除いた範囲内で、X・Y ともに独立してランダム決定します。
 *
 * @param layer 画像を配置する親要素
 * @param el 対象となる画像要素
 * @param marginRatio 親要素に対する余白の割合（デフォルト0.05）
 */
/**
 * 指定したlayer（親要素）の中で、画像要素(el)を
 * 完全にランダムな位置に配置する関数です。
 * スロット分割などは行わず、親要素のサイズに対して
 * marginRatio分の余白(padX, padY)を取り、
 * その内側で要素(el)の左上座標(x, y)をランダムに決定します。
 * 要素サイズ(ew, eh)を考慮して、範囲外にはみ出さないようにしています。
 * 
 * 配置後はgsap.setで絶対配置・透明・y方向オフセット・拡大率など
 * 初期アニメーション用のプロパティも適用します。
 * 
 * @param layer 配置したい親要素(HTML要素)
 * @param el ランダムに配置したい子要素(画像など)
 * @param marginRatio 親要素の四辺で除外する余白割合 (例: 0.05で5%)
 */
function placeImageAtRandomPosition(
  layer: HTMLElement,
  el: HTMLElement,
  marginRatio = 0.05,
) {
  // 親要素と配置対象要素の幅・高さを取得する
  const w = layer.clientWidth;
  const h = layer.clientHeight;
  const ew = el.offsetWidth || 200; // 要素の幅が不明な場合は200px仮定
  const eh = el.offsetHeight || 280; // 要素の高さが不明な場合は280px仮定

  // 余白(px)を計算
  const padX = w * marginRatio;
  const padY = h * marginRatio;

  // 要素の左上(x, y)が padX, padY 以上となり、右下が親要素からはみ出さない最大値までの範囲内でランダム配置する
  // 具体的には、x + ew <= w - padX, y + eh <= h - padY を保証
  // よって [padX, w - ew - padX] の範囲で乱数を取り、必ず要素全体がmargin内に収まる
  const x = padX + Math.random() * Math.max(0, w - ew - padX * 2);
  const y = padY + Math.random() * Math.max(0, h - eh - padY * 2);

  // gsapで初期配置＆アニメーション用スタイルをセット
  gsap.set(el, {
    position: "absolute",
    left: x,
    top: y,
    margin: 0,
    opacity: 0,    // 透明（後でフェード表示などに使う想定）
    y: 12,         // 垂直方向にちょっと下げる
    scale: 0.96,   // やや縮小
  });
}