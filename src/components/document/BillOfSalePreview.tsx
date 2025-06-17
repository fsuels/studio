'use client';
import DocumentPreview from './DocumentPreview';

export default function BillOfSalePreview({
  docId = 'bill-of-sale-vehicle',
  locale = 'en',
  height = 400,
}: {
  docId?: string;
  locale?: 'en' | 'es';
  height?: number;
}) {
  return (
    <div style={{ height }} className="w-full">
      <DocumentPreview docId={docId} locale={locale} />
    </div>
  );
}
