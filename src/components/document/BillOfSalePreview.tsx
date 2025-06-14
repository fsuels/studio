'use client';
import DocumentPreview from './DocumentPreview';

export default function BillOfSalePreview({
  locale = 'en',
  height = 400,
}: {
  locale?: 'en' | 'es';
  height?: number;
}) {
  return (
    <div style={{ height }} className="w-full">
      <DocumentPreview docId="bill-of-sale-vehicle" locale={locale} />
    </div>
  );
}
