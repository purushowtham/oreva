'use client';
import { motion, AnimatePresence, Transition, Variants } from 'framer-motion';
import { useState, useEffect, Children } from 'react';

type TextLoopProps = {
  children: React.ReactNode[];
  className?: string;
  interval?: number;
  transition?: Transition;
  variants?: Variants;
};

export function TextLoop({
  children,
  className,
  interval = 2000,
  transition,
  variants,
}: TextLoopProps) {
  const [index, setIndex] = useState(0);
  const items = Children.toArray(children);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % items.length);
    }, interval);
    return () => clearInterval(timer);
  }, [items.length, interval]);

  return (
    <div className={`relative inline-block ${className || ''}`}>
      <AnimatePresence mode="popLayout">
        <motion.div
          key={index}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={transition}
          className="inline-block"
        >
          {items[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
