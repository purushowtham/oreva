'use client';

import { motion } from 'framer-motion';

type TextEffectProps = {
  children: string;
  per?: 'char';
  preset?: 'fade';
};

export function TextEffect({ children, per = 'char', preset = 'fade' }: TextEffectProps) {
  const words = children.trim().split(/(\s+)/);

  return (
    <motion.span
      className="text-effect"
      aria-label={children.trim()}
      data-per={per}
      data-preset={preset}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.035, delayChildren: 0.08 } } }}
    >
      <span aria-hidden="true">
        {words.map((word, wordIndex) => (
          /^\s+$/.test(word) ? word : (
            <span className="text-effect__word" key={wordIndex}>
              {Array.from(word).map((character, characterIndex) => (
                <motion.span
                  className="text-effect__char"
                  key={characterIndex}
                  variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
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
