// src/components/landing/CustomizeDocBlock.tsx
'use client';
import AutoImage from '@/components/AutoImage';

export default function CustomizeDocBlock() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row-reverse items-center gap-8">
        <AutoImage
          src="/images/laptop-check.svg"
          alt="Laptop with checkmark"
          width={400}
          height={400}
          className="w-full max-w-sm"
        />
        <div className="text-center lg:text-left">
          <h2 className="text-2xl lg:text-3xl font-semibold text-gray-800">Customize Your Document</h2>
          <p className="mt-2 text-lg text-gray-600 max-w-md leading-relaxed">
            Make edits with our built-in editor so every clause fits your exact situation.
          </p>
        </div>
      </div>
    </section>
  );
}
