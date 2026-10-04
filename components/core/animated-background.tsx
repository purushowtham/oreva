'use client';
import { motion, Transition } from 'framer-motion';
import React, { Children, cloneElement, useRef, useState } from 'react';

type AnimatedBackgroundProps = {
  children: React.ReactElement[];
  defaultValue?: string;
  className?: string;
  transition?: Transition;
  enableHover?: boolean;
  onValueChange?: (value: string | null) => void;
};

export function AnimatedBackground({
  children,
  defaultValue,
  className,
  transition,
  enableHover,
  onValueChange,
}: AnimatedBackgroundProps) {
  const [active, setActive] = useState<string | null>(defaultValue ?? null);
  const [hovered, setHovered] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const displayed = hovered ?? active;

  function handleMouseEnter(id: string) {
    if (!enableHover) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHovered(id);
  }

  function handleMouseLeave() {
    if (!enableHover) return;
    timeoutRef.current = setTimeout(() => setHovered(null), 80);
  }

  function handleClick(id: string) {
    if (enableHover) return;
    setActive(id);
    onValueChange?.(id);
  }

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'row' }}>
      {Children.map(children, (childElement) => {
        const child = childElement as React.ReactElement<any>;
        if (!child || !child.props) return childElement;
        const id = child.props['data-id'] as string;
        const isActive = displayed === id;

        return cloneElement(child, {
          key: id,
          onMouseEnter: () => handleMouseEnter(id),
          onMouseLeave: handleMouseLeave,
          onClick: () => {
            if (!enableHover) handleClick(id);
            child.props.onClick?.();
          },
          style: { position: 'relative', zIndex: 1, ...child.props.style },
          children: (
            <>
              {isActive && (
                <motion.span
                  layoutId="nav-bg"
                  className={className}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 'inherit',
                    zIndex: -1,
                  }}
                  transition={transition}
                />
              )}
              {child.props.children}
            </>
          ),
        });
      })}
    </div>
  );
}
