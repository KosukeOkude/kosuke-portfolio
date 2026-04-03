import { useEffect, useRef } from 'react';

/** 開いていた → 閉じた、の遷移のときだけ getElementById(id).focus() */
export function useFocusElementWhenLightboxCloses(isOpen: boolean, elementId: string | null | undefined) {
  const prevIsOpenRef = useRef<boolean>(false);
  useEffect(() => {
    const wasOpen = prevIsOpenRef.current;
    prevIsOpenRef.current = isOpen;

    if (!wasOpen) return;
    if (isOpen) return;

    if (!elementId) return;
    const el = document.getElementById(elementId);
    if (!el) return;

    if (typeof el.focus === 'function') {
      el.focus();
    }
  }, [isOpen, elementId]);
}
