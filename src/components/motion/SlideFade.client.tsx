'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import React from 'react';

interface SlideFadeProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  delay?: number;
}

const SlideFade: React.FC<SlideFadeProps> = ({
  children,
  delay = 0,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default SlideFade;
