import { useEffect, useRef } from 'react';

/** モーダル表示中は body のスクロールを止め、閉じたら元に戻す */
export function useBodyScrollLock(lock: boolean) {
  const prevBodyOverflowRef = useRef<string>('');
  useEffect(() => {
    if (!lock) return;
    prevBodyOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevBodyOverflowRef.current;
    };
  }, [lock]);
}
