'use client';

import { motion, useReducedMotion } from 'framer-motion';
import './InteractiveFooter.css';

const email = 'hello@orevastudio.com';
const socialProfiles = ['Instagram', 'LinkedIn', 'Pinterest'];

export default function InteractiveFooter({ embedded = false }: { embedded?: boolean }) {
  const reducedMotion = useReducedMotion();

  return (
    <footer id={embedded ? undefined : 'contact'} className={`orevaFooter${embedded ? ' orevaFooter--embedded' : ''}`} aria-label="Contact ORÉVA Studio">
      <div className="orevaFooter__content">
        <div className="orevaFooter__signature" aria-label="ORÉVA Studio">
          <span>ORÉVA</span>
          <small>STUDIO</small>
        </div>

        <motion.div
          className="orevaFooter__main"
          initial={reducedMotion || embedded ? false : { opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2>Let&apos;s make<br /><em>something lasting.</em></h2>
          <a className="orevaFooter__email" href={`mailto:${email}`}>
            {email}<span aria-hidden="true">↗</span>
          </a>
        </motion.div>

        <div className="orevaFooter__end">
          <div className="orevaFooter__socials" aria-label="ORÉVA social profiles">
            {socialProfiles.map(profile => (
              <div className="orevaFooter__social" key={profile}>
                <span className="orevaFooter__socialName">{profile}</span>
              </div>
            ))}
            <span className="orevaFooter__socialNote">Profiles coming soon</span>
          </div>
          <p className="orevaFooter__copyright">© 2026 ORÉVA STUDIO</p>
        </div>
      </div>
      <div className="orevaFooter__image" aria-hidden="true">
        <img src="/oreva-footer-arch.jpg" alt="" loading={embedded ? 'eager' : 'lazy'} />
      </div>
    </footer>
  );
}
