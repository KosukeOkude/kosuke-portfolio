type LightboxOverlayProps = {
  onBackdropClose: () => void;
};

export default function LightboxOverlay({ onBackdropClose }: LightboxOverlayProps) {
  return (
    <button
      type="button"
      className="absolute inset-0 z-0"
      onClick={onBackdropClose}
      aria-label="Close lightbox background"
    />
  );
}
