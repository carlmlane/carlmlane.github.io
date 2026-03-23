'use client';

import { motion } from 'framer-motion';

const BackLink = () => (
  <motion.a
    href="/blog"
    className="group mb-8 inline-flex items-center gap-2 font-mono text-sm text-muted transition-colors hover:text-accent"
    initial={{ opacity: 0, x: -8 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3 }}
  >
    <span className="transition-transform group-hover:-translate-x-1" aria-hidden="true">
      &larr;
    </span>
    Back to blog
  </motion.a>
);

export default BackLink;
