'use client';
import { motion, useMotionValue, useSpring, Variants, Transition } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

type CursorProps = {
  children: React.ReactNode;
  className?: string;
  springConfig?: any;
  attachToParent?: boolean;
  variants?: Variants;
  transition?: Transition;
};

export function Cursor({
  children,
  className,
  springConfig = { stiffness: 300, damping: 20 },
  attachToParent,
  variants,
  transition,
}: CursorProps) {
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parent = attachToParent && ref.current ? ref.current.parentElement : window;
    
    if (!parent) return;
    
    const handleMouseMove = (e: MouseEvent | Event) => {
      const mouseEvent = e as MouseEvent;
      let x, y;
      if (attachToParent && ref.current?.parentElement) {
        const rect = ref.current.parentElement.getBoundingClientRect();
        x = mouseEvent.clientX - rect.left;
        y = mouseEvent.clientY - rect.top;
      } else {
        x = mouseEvent.clientX;
        y = mouseEvent.clientY;
      }
      cursorX.set(x);
      cursorY.set(y);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    if (attachToParent && ref.current?.parentElement) {
      ref.current.parentElement.style.position = 'relative';
      ref.current.parentElement.style.cursor = 'none'; // Optional: hide default cursor
    }

    parent.addEventListener('mousemove', handleMouseMove);
    parent.addEventListener('mouseenter', handleMouseEnter);
    parent.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      parent.removeEventListener('mousemove', handleMouseMove);
      parent.removeEventListener('mouseenter', handleMouseEnter);
      parent.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [attachToParent, cursorX, cursorY]);

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="initial"
      animate={isVisible ? 'animate' : 'initial'}
      exit="exit"
      transition={transition}
      style={{
        position: attachToParent ? 'absolute' : 'fixed',
        left: 0,
        top: 0,
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
        pointerEvents: 'none',
        zIndex: 50,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
