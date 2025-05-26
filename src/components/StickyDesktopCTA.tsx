'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function StickyDesktopCTA() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () =>
      setShow(window.scrollY > 400 && window.innerWidth >= 1024);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if (!show) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 hidden lg:block">
      <div className="mx-auto flex max-w-4xl items-center justify-between rounded-t-lg bg-white/95 px-6 py-4 shadow-lg">
        <p className="text-sm font-medium">Ready to download?</p>
        <Button>Start My Bill of Sale</Button>
      </div>
    </div>
  );
}
