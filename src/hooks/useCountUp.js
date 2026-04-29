import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

/**
 * Animates a number from 0 to `end` when the element comes into view.
 * @param {string|number} end - Target value (e.g., "500+", "9.59", "85-93%")
 * @param {number} duration - Animation duration in ms
 * @param {number} startDelay - Delay before animation starts (ms), useful to wait for preloader
 */
export function useCountUp(end, duration = 2000, startDelay = 0) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const str = String(end);

    // Extract just the FIRST number (before any dash/non-digit)
    const match = str.match(/^(\d+\.?\d*)/);
    if (!match) {
      setCount(str); // fallback: show as-is
      return;
    }

    const target = parseFloat(match[1]);
    const isDecimal = match[1].includes('.');
    const decimalPlaces = isDecimal ? (match[1].split('.')[1]?.length || 0) : 0;

    const delayTimeout = setTimeout(() => {
      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = eased * target;

        if (isDecimal) {
          setCount(current.toFixed(decimalPlaces));
        } else {
          setCount(Math.floor(current));
        }

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Ensure final value is exact
          setCount(isDecimal ? target.toFixed(decimalPlaces) : target);
        }
      };

      requestAnimationFrame(animate);
    }, startDelay);

    return () => clearTimeout(delayTimeout);
  }, [isInView, end, duration, startDelay]);

  // Build the display string with the original suffix
  const str = String(end);
  const match = str.match(/^(\d+\.?\d*)(.*)/);
  const suffix = match ? match[2] : '';
  const display = `${count}${suffix}`;

  return { display, ref };
}
