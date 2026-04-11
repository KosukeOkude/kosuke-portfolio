import { useCallback, useMemo, useState } from "react";
import type { GalleryLinearSliderItem } from "@/data/gallery";
import { clampIndex } from "@/components/Lightbox/utils/clampIndex";
import { galleryDomIds } from "@/utils/gallery/galleryDomIds";
import { mapGalleryItemsToLightboxItems } from "@/components/Lightbox/utils/mapItemsToLightboxItems";

/**
 * Lightbox の開閉状態と、閉じた後に GalleryTrack の元の画像位置へ戻るための
 * スクロール情報を一元管理するフック。
 *
 * - `openAt(index)`     : 指定 index の画像で Lightbox を開く
 * - `closeAt(index)`    : Lightbox を閉じ、最後に見ていた画像の DOM ID を
 *                         `scrollToId` にセットして GalleryTrack にスクロールを指示する
 * - `scrollToken`       : 同じ画像を連続で開閉しても `scrollToId` が変わらず
 *                         useEffect が発火しないため、毎回インクリメントして強制再実行させる
 * - `clearScrollTarget` : カテゴリ変更時など対象の DOM が消える場合にスクロールターゲットをリセット
 */
export default function useGalleryLightboxScrollBridge(
  displayItems: GalleryLinearSliderItem[],
) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);
  // フォーカス復帰先（閉じた後にボタンへフォーカスを戻すための ID）
  const [returnTargetId, setReturnTargetId] = useState<string | null>(null);
  // GalleryTrack がスクロール先として参照する DOM ID
  const [scrollToId, setScrollToId] = useState<string | null>(null);
  // 同じ ID への再スクロールを強制トリガーするカウンター
  const [scrollToken, setScrollToken] = useState(0);

  // displayItems が変わるたびに Lightbox 用のアイテム形式へ変換
  const lightboxItems = useMemo(
    () => mapGalleryItemsToLightboxItems(displayItems),
    [displayItems],
  );

  const openAt = useCallback((index: number) => {
    setInitialIndex(index);
    setIsOpen(true);
  }, []);

  // カテゴリ／ソート変更時にスクロール復元ターゲットを破棄する
  const clearScrollTarget = useCallback(() => {
    setScrollToId(null);
  }, []);

  // Lightbox で最後に見ていた index から Track 側の DOM ID へ橋渡しする
  const closeAt = useCallback(
    (lastActiveIndex: number) => {
      // 範囲外の index を安全にクランプ
      const safeIndex = clampIndex(lastActiveIndex, displayItems.length);
      const item = displayItems[safeIndex];
      // 画像の ID から GalleryTrack 上のボタン DOM ID を生成
      const targetId = item ? galleryDomIds(item.id) : null;

      setReturnTargetId(targetId);
      setScrollToId(targetId);
      // 同じ targetId でも再スクロールが走るようにトークンを更新
      setScrollToken((n) => n + 1);
      setIsOpen(false);
    },
    [displayItems],
  );
  return {
    isOpen,
    initialIndex,
    returnTargetId,
    scrollToId,
    scrollToken,
    lightboxItems,
    openAt,
    closeAt,
    clearScrollTarget,
  };
}
