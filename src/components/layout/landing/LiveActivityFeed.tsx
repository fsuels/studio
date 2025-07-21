'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const messages = [
  'Ben from Ohio just generated a Lease Agreement',
  'Someone in California is reviewing their NDA',
  'Lisa in New York downloaded an Employment Contract',
  'A business in Texas completed an LLC Operating Agreement',
];

function getRandomMessage(current: string): string {
  let next = current;
  while (next === current) {
    next = messages[Math.floor(Math.random() * messages.length)];
  }
  return next;
}

function getRandomInterval() {
  return 6000 + Math.random() * 4000; // 6-10 seconds
}

const LiveActivityFeed = React.memo(function LiveActivityFeed() {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Initialize message on client side to avoid hydration mismatch
    setMessage(messages[0]);
    setVisible(true);
  }, []);

  useEffect(() => {
    if (!message) return; // Skip if message not initialized
    let timer: NodeJS.Timeout;
    const scheduleNext = () => {
      timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => {
          setMessage((current) => getRandomMessage(current));
          setVisible(true);
          scheduleNext();
        }, 300); // wait for exit animation
      }, getRandomInterval());
    };
    scheduleNext();
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mt-4 text-sm text-primary font-medium h-5">
      <AnimatePresence>
        {visible && (
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
            className="inline-block"
          >
            {message} <span className="animate-pulse">•</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default LiveActivityFeed;
