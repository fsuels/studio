'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Props {
  href: string;
  label: string;
}

export default function StickyGuaranteeBar({ href, label }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () =>
      setShow(window.scrollY > 600 && window.innerWidth >= 1024); // desktop only
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!show) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center pb-4 pointer-events-none">
      <Link
        href={href}
        className="
          pointer-events-auto
          rounded-md bg-primary px-8 py-3 text-primary-foreground
          text-sm font-medium shadow-lg ring-1 ring-primary/30
          hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
          transition
        "
      >
        {label}
      </Link>
    </div>
  );
}
