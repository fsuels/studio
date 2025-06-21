import React from 'react';
import { AutoImage } from '@/components/shared';

export default function StepTwoExplanation() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-8">
          <div className="flex-1 flex justify-center relative">
            <AutoImage
              src="/images/step2-customize.svg"
              alt="Customize your document illustration"
              width={400}
              height={400}
              className="w-64 sm:w-80 lg:w-96"
              placeholder="blur"
              priority
            />
            <div className="hidden lg:block absolute -bottom-8 -right-8 opacity-20">
              <svg width="120" height="120" className="text-primary">
                <circle cx="60" cy="60" r="60" fill="currentColor" />
              </svg>
            </div>
          </div>
          <div className="flex-1 text-center lg:text-left">
            <h3 className="text-2xl lg:text-3xl font-semibold text-gray-800">
              Customize Your Document
            </h3>
            <p className="mt-2 text-lg text-gray-600 max-w-md leading-relaxed">
              Your document will automatically update with the information you
              provide. It’s also fully customizable so you can make updates to
              any section.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
