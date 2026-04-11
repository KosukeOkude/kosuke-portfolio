import {
  useMemo,
  useState,
  useLayoutEffect,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { type LightboxItem } from "@/type/lightbox";
import { clampIndex } from "@/components/Lightbox/utils/clampIndex";
import { useLightboxKeyboardAndSwipe } from "@/components/Lightbox/hooks/useLightboxKeyboardAndSwipe";
import { useBodyScrollLock } from "@/components/Lightbox/hooks/useBodyScrollLock";
import { useFocusElementWhenLightboxCloses } from "@/components/Lightbox/hooks/useFocusElementWhenLightboxCloses";
import LightboxOverlay from "@/components/Lightbox/parts/LightboxOverlay";
import LightboxImageStage from "@/components/Lightbox/parts/LightboxImageStage";
import LightboxNavControls from "@/components/Lightbox/parts/LightboxNavControls";
import { REVEAL_REFRESH_EVENT } from "@/gsap/core/useRevealDispatch";
import { useLightboxImageIntroAnimation } from "@/components/Lightbox/hooks/useLightboxImageIntroAnimation";
import { createPortal } from "react-dom";
import ScrollLineVertical from "@/components/UI/ScrollLineVertical";
import { useBodyBackgroundHide } from "@/components/Lightbox/hooks/useBodyBackgroundHide";

type ImageLightboxModalProps = {
  items: LightboxItem[];
  initialIndex: number;
  isOpen: boolean;
  onClose: (lastActiveIndex: number) => void;
  returnTargetId?: string | null;
};

export default function ImageLightBoxModal({
  items,
  initialIndex,
  isOpen,
  onClose,
  returnTargetId,
}: ImageLightboxModalProps) {
  // 入力配列の件数。index の安全化やナビ制御で参照する共通値。
  const itemCount = items.length;
  // 現在表示中のスライド index（Prev/Next・キーボード・スワイプで更新）。
  const [activeIndex, setActiveIndex] = useState(clampIndex(initialIndex, itemCount));

  // 「閉じる」要求を親へ返す窓口。最後に見ていた index を渡す。
  const requestClose = useCallback(() => {
    onClose(clampIndex(activeIndex, itemCount));
  }, [activeIndex, itemCount, onClose]);

  // モーダルが開いた瞬間だけ、親から受けた initialIndex を現在値へ同期。
  useLayoutEffect(() => {
    if (!isOpen) return;
    setActiveIndex(clampIndex(initialIndex, itemCount));
  }, [initialIndex, isOpen, itemCount]);

  /** body スクロールのロック制御（開いている間だけ固定）。 */
  useBodyScrollLock(isOpen);

/* body にクラスがついている間、モーダル以外を隠す */
  useBodyBackgroundHide(isOpen);

  /** close 後にフォーカス復帰先（returnTargetId）へ戻す。 */
  useFocusElementWhenLightboxCloses(isOpen, returnTargetId);

  // キーボード左右・スワイプ・ESC を束ねる入力ハンドラ群。
  const { goPrev, goNext } = useLightboxKeyboardAndSwipe({
    isOpen,
    itemCount,
    setActiveIndex,
    onRequestClose: requestClose,
  });

  // ライトボックス表示時に reveal 再計算イベントを発火（必要な要素だけ再スキャン）。
  useEffect(() => {
    if (!isOpen) return;
    window.dispatchEvent(new CustomEvent(REVEAL_REFRESH_EVENT));
  }, [isOpen]);

  // 現在 index から表示対象アイテムを導出。
  const activeItem = useMemo(() => items[activeIndex], [activeIndex, items]);

  // 画像表示レイヤー（アニメ対象）への参照。
  const imageAreaRef = useRef<HTMLDivElement>(null);
  // モーダル内に有効な表示対象があるか（アニメ実行条件）。
  const hasModalContent = Boolean(isOpen && activeItem);
  // 画像の入りアニメ（開いた直後 or contentKey 変更時）を実行。
  useLightboxImageIntroAnimation(imageAreaRef, {
    isOpen,
    hasContent: hasModalContent,
    contentKey: activeIndex,
  });

  // 閉状態または対象なしなら DOM を描画しない。
  if (!isOpen || !activeItem) return null;

  // SSR 中は document が存在しないため、Portal の描画先を解決できない。
  if (typeof document === "undefined") return null;

  // 実際に body 直下へ転送するモーダル本体。
  // これを別変数に切り出すと、Portal 前後の責務（UI定義 / 転送）を分けて読める。


  const modalNode = (
    <div
      className="fixed inset-0 z-[9999999]"
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      {/* オーバーレイ（背面） */}
      <LightboxOverlay onBackdropClose={requestClose} />
      {/* 画像だけ中央（ボタンは載せない） */}
      <div
        ref={imageAreaRef}
        className="pointer-events-none absolute inset-0 z-10"
      >
        <LightboxImageStage
          src={activeItem.src}
          alt={activeItem.alt}
        />
      </div>

      <LightboxNavControls
        onPrev={goPrev}
        onNext={goNext}
        onClose={requestClose}
      />

      <ScrollLineVertical isHiddenText={false} />
    </div>
  );

  // Portal: DOM だけ document.body へ描画し、親の transform / overflow の影響を受けない全画面モーダルにする。
  return createPortal(modalNode, document.body);
}
