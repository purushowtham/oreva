'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

export type TextEffectVariants = { container: Variants; item: Variants };

export const wordSpringVariants: TextEffectVariants = {
  container: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  item: {
    hidden: () => ({ opacity: 0, y: Math.random() * 60 - 30, rotate: Math.random() * 36 - 18, scale: .3 }),
    visible: { opacity: 1, y: 0, rotate: 0, scale: 1, transition: { type: 'spring', damping: 15, stiffness: 170 } },
  },
};

type TextEffectProps = {
  children: string;
  per?: 'char' | 'word';
  preset?: 'fade';
  variants?: TextEffectVariants;
  delay?: number;
  stagger?: number;
  viewportAmount?: number;
  once?: boolean;
};

export function TextEffect({ children, per = 'char', preset = 'fade', variants, delay = .08,
  stagger = per === 'word' ? .09 : .035, viewportAmount = .3, once = true }: TextEffectProps) {
  const [mounted, setMounted] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => { setMounted(true); }, []);
  const words = children.trim().split(/(\s+)/);
  // Custom variant functions may use randomness. Never resolve them during SSR
  // or the first hydration render, which must be identical to the server markup.
  if ((variants && !mounted) || (mounted && reduced)) {
    return <span className="text-effect" style={variants && !mounted ? { opacity: 0 } : undefined}>{children}</span>;
  }
  const container: Variants = {
    ...variants?.container,
    hidden: variants?.container.hidden || {},
    visible: (custom: unknown) => {
      const supplied = variants?.container.visible;
      const state = typeof supplied === 'function' ? supplied(custom, {}, {}) : supplied;
      const visible = typeof state === 'object' ? state : {};
      return { ...visible, transition: {
        ...visible.transition, staggerChildren: stagger, delayChildren: delay,
      } };
    },
  };
  const item = variants?.item || { hidden: { opacity: 0 }, visible: { opacity: 1 } };

  return (
    <motion.span
      className="text-effect"
      data-per={per}
      data-preset={preset}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: viewportAmount }}
      variants={container}
    >
      <span className="text-effect__accessible">{children.trim()}</span>
      <span aria-hidden="true">
        {words.map((word, wordIndex) => (
          /^\s+$/.test(word) ? word : (
            per === 'word' ? <motion.span className="text-effect__word" key={wordIndex}
              variants={item} transition={variants ? undefined : { duration: .4, ease: 'easeOut' }}>{word}</motion.span> : <span className="text-effect__word" key={wordIndex}>
              {Array.from(word).map((character, characterIndex) => (
                <motion.span
                  className="text-effect__char"
                  key={characterIndex}
                  variants={item}
                  transition={variants ? undefined : { duration: 0.4, ease: 'easeOut' }}
                >
                  {character}
                </motion.span>
              ))}
            </span>
          )
        ))}
      </span>
    </motion.span>
  );
}
