'use client';
import Image from 'next/image';

export function SkeletonPreview() {
  return (
    <div className="w-full h-[500px] bg-muted animate-pulse rounded-lg" />
  );
}

export default function DocPreview({
  docId,
  locale = 'en',
  alt,
}: {
  docId: string;
  locale?: 'en' | 'es';
  alt?: string;
}) {
  const src = `/images/previews/${locale}/${docId}.png`;
  const altText = alt || `${docId} preview`;
  return (
    <Image
      src={src}
      alt={altText}
      width={850}
      height={1100}
      className="object-contain w-full h-auto border rounded-lg"
      loading="lazy"
      data-ai-hint="document template screenshot"
    />
  );
}
