'use client';

import { useRef, useState, type PointerEvent } from 'react';
import { motion } from 'framer-motion';
import './InteractiveFooter.css';

const email = 'hello@orevastudio.com';
const footerLinks = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Method', href: '#method' },
  { label: 'Selected projects', href: '#work' },
];

export default function InteractiveFooter() {
  const footerRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  const moveSpotlight = (event: PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    footerRef.current?.style.setProperty('--footer-x', `${event.clientX - bounds.left}px`);
    footerRef.current?.style.setProperty('--footer-y', `${event.clientY - bounds.top}px`);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <footer id="contact" className="orevaFooter" ref={footerRef} onPointerMove={moveSpotlight}>
      <div className="orevaFooter__glow" aria-hidden="true" />
      <div className="orevaFooter__inner">
        <motion.div
          className="orevaFooter__top"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="orevaFooter__eyebrow"><span className="orevaFooter__star" aria-hidden="true">✳</span> ORÉVA STUDIO / STAY IN TOUCH</span>
          <a className="orevaFooter__topLink" href="#top">BACK TO TOP <span aria-hidden="true">↗</span></a>
        </motion.div>

        <div className="orevaFooter__center">
          <motion.p
            className="orevaFooter__prompt"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.65 }}
          >
            A NEW SPACE. A NEW STORY. <i>LET&apos;S BEGIN.</i>
          </motion.p>
          <a className="orevaFooter__email" href={`mailto:${email}`}>
            <span>{email}</span><span className="orevaFooter__emailArrow" aria-hidden="true">↗</span>
          </a>
          <button className="orevaFooter__copy" type="button" onClick={copyEmail} aria-live="polite">
            {copied ? 'EMAIL COPIED ✓' : 'COPY EMAIL ↗'}
          </button>
        </div>

        <div className="orevaFooter__mark" aria-label="ORÉVA">
          <span aria-hidden="true">{'ORÉVA'.split('').map((letter, index) => <span key={index}>{letter}</span>)}</span>
        </div>

        <div className="orevaFooter__bottom">
          <span>© 2026 ORÉVA STUDIO</span>
          <nav aria-label="Footer navigation">
            {footerLinks.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}
          </nav>
          <span>SPACES. STORIES. DESIRE.</span>
        </div>
      </div>
    </footer>
  );
}
