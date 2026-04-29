import { useRef, useState } from 'react';

/**
 * Wraps any element with a magnetic pull-toward-cursor effect.
 * On hover, the element subtly moves toward the mouse position.
 */
export default function MagneticButton({ children, strength = 0.3, className = '' }) {
  const ref = useRef(null);
  const [transform, setTransform] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = (e.clientX - centerX) * strength;
    const dy = (e.clientY - centerY) * strength;
    setTransform({ x: dx, y: dy });
  };

  const handleMouseLeave = () => {
    setTransform({ x: 0, y: 0 });
  };

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        display: 'inline-block',
        transform: `translate(${transform.x}px, ${transform.y}px)`,
        transition: transform.x === 0 ? 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'transform 0.15s ease-out',
      }}
    >
      {children}
    </div>
  );
}
