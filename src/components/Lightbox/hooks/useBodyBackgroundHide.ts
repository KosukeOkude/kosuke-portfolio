import { useEffect } from "react";

export function useBodyBackgroundHide(isOpen: boolean) {
  useEffect(() => {
    document.body.classList.toggle("lightbox-open", isOpen);
    return () => document.body.classList.remove("lightbox-open");
  }, [isOpen]);
}
