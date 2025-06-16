"use client";
import Link from 'next/link';
import { useEffect, useState } from "react";

export default function StickyMobileCTA({
  locale,
}: {
  locale: 'en' | 'es';
}) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 bg-white/95 shadow-lg md:hidden">
      <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-3">
        <span className="font-semibold">$19.95 • attorney-drafted</span>
        <Link href={`/${locale}/docs/bill-of-sale-vehicle/start`} className="btn-primary">
          Start My Bill of Sale
        </Link>
      </div>
    </div>
  );
}
