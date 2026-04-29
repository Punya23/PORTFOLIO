import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * Animates text word-by-word with staggered reveal.
 * Wrap any heading: <TextReveal as="h2" className="...">My heading</TextReveal>
 */
export default function TextReveal({
  children,
  as: Tag = 'span',
  className = '',
  delay = 0,
  stagger = 0.04,
  once = true,
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-60px' });

  const text = typeof children === 'string' ? children : '';
  const words = text.split(' ');

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: {
      y: 40,
      opacity: 0,
      filter: 'blur(8px)',
    },
    visible: {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  // If children contains JSX (not plain string), render normally with a fade
  if (typeof children !== 'string') {
    return (
      <motion.div
        ref={ref}
        className={className}
        initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
        animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
        transition={{ duration: 0.6, delay }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <Tag ref={ref} className={className} style={{ overflow: 'hidden' }}>
      <motion.span
        style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '0 0.3em' }}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {words.map((word, i) => (
          <motion.span
            key={i}
            variants={wordVariants}
            style={{ display: 'inline-block' }}
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}
