"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Props {
  href: string; // where the click should go
  label: string; // text to display
}

export default function StickyGuaranteeBar({ href, label }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () =>
      setVisible(window.scrollY > 600 && window.innerWidth >= 1024);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <Link
      href={href}
      className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-center bg-teal-50 py-3 text-teal-900 shadow-md hover:bg-teal-100 transition-colors"
    >
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}
