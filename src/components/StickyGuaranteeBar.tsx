"use client";
import { useEffect, useState } from "react";

export default function StickyGuaranteeBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 bg-teal-50 text-teal-900 text-center py-2 shadow-md">
      <span className="font-medium">Download today • 30-day refund guarantee</span>
    </div>
  );
}
