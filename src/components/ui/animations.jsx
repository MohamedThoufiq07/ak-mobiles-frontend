/**
 * Shared scroll-animation primitives — ONE easing curve + ONE timing scale so
 * motion stays consistent across the whole app. All components respect
 * prefers-reduced-motion (via Framer Motion's useReducedMotion): when the user
 * prefers reduced motion they render as plain, fully-visible elements with no
 * transform/opacity animation.
 *
 * Built on framer-motion (already a project dependency). Uses transform +
 * opacity only (GPU-friendly, no layout thrash), and `whileInView` with
 * `viewport={{ once: true }}` so reveals fire once as they enter the viewport.
 */
import { motion, useReducedMotion } from 'framer-motion';
import { EASE, DURATION, containerVariants, itemVariants } from './motionConfig';

/**
 * Reveal — fade-in + slide-up a single element as it scrolls into view.
 * Props: as (tag), delay, y (slide distance), duration, once, amount.
 */
export const Reveal = ({
  as = 'div',
  children,
  className = '',
  delay = 0,
  y = 24,
  duration = DURATION,
  once = true,
  amount = 0.15,
  ...rest
}) => {
  const reduce = useReducedMotion();
  const Tag = as;
  if (reduce) {
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }
  const MotionTag = motion[as] || motion.div;
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
};

/**
 * RevealStagger — container that staggers its RevealItem children into view in
 * sequence (e.g. product grids). Pair with <RevealItem> for each child.
 */
export const RevealStagger = ({
  as = 'div',
  children,
  className = '',
  stagger = 0.07,
  delayChildren = 0,
  once = true,
  amount = 0.1,
  ...rest
}) => {
  const reduce = useReducedMotion();
  const Tag = as;
  if (reduce) {
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }
  const MotionTag = motion[as] || motion.div;
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={containerVariants(stagger, delayChildren)}
      {...rest}
    >
      {children}
    </MotionTag>
  );
};

/** RevealItem — a single staggered child; must live inside a RevealStagger. */
export const RevealItem = ({ as = 'div', children, className = '', y = 24, ...rest }) => {
  const reduce = useReducedMotion();
  const Tag = as;
  if (reduce) {
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }
  const MotionTag = motion[as] || motion.div;
  return (
    <MotionTag className={className} variants={itemVariants(y)} {...rest}>
      {children}
    </MotionTag>
  );
};

/**
 * PageTransition — wraps routed page content and plays a subtle fade/slide-up
 * on each route change. Keyed by pathname so it replays on navigation but NOT
 * on query-string changes (e.g. ?brand=Apple) within the same path.
 */
export const PageTransition = ({ children, routeKey }) => {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <motion.div
      key={routeKey}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      {children}
    </motion.div>
  );
};
