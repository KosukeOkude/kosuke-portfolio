import { useEffect } from 'react';

export type UseLightboxKeyboardAndSwipeOptions = {
  isOpen: boolean;
  onRequestClose: () => void;
  goPrev: () => void;
  goNext: () => void;
};

/**
 * 開いているときだけ window に keydown を付ける（副作用のみ）。
 * Escape → onRequestClose、ArrowLeft / ArrowRight → goPrev / goNext。
 */

export function useLightboxWindowKeyboard({ isOpen, onRequestClose, goPrev, goNext }: UseLightboxKeyboardAndSwipeOptions) {
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onRequestClose();
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
        return;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  },[goNext, goPrev, isOpen, onRequestClose]);
}
