/**
 * Shared motion constants — ONE easing curve + ONE timing scale used by every
 * scroll animation in the app (see ./animations.jsx). Kept in a plain module
 * (no component exports) so the animations file stays fast-refresh friendly.
 */

// Single shared easing curve (an "easeOutExpo"-style curve).
export const EASE = [0.22, 1, 0.36, 1];

// Timing scale — within the requested 300–500ms reveal range.
export const DURATION = 0.5; // seconds
export const VIEWPORT = { once: true, amount: 0.15 };

// Variants reused by stagger containers/items.
export const containerVariants = (stagger = 0.08, delayChildren = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren } },
});

export const itemVariants = (y = 24) => ({
  hidden: { opacity: 0, y },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION, ease: EASE } },
});
