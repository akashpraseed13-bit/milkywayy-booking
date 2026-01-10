/**
 * Utility to detect if the current device is touch-primary.
 * Note: This is a client-side check.
 */
export const isTouchDevice = () => {
  if (typeof window === "undefined") return false;
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
};
