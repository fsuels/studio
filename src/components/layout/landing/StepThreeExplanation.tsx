import React from 'react';
import AutoImage from '@/components/AutoImage';

export default function StepThreeExplanation() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1 flex justify-center relative">
            <AutoImage
              src={require('@/public/images/step3-save-print.svg')}
              alt="Save, print, download, share illustration"
              width={400}
              height={400}
              className="w-64 sm:w-80 lg:w-96"
              placeholder="blur"
              priority
            />
            <div className="hidden lg:block absolute -top-6 -left-6 opacity-20">
              <svg width="80" height="80" className="text-primary">
                <circle cx="40" cy="40" r="40" fill="currentColor" />
              </svg>
            </div>
          </div>
          <div className="flex-1 text-center lg:text-left">
            <h3 className="text-2xl lg:text-3xl font-semibold text-gray-800">
              Save, Print, Download, Share
            </h3>
            <p className="mt-2 text-lg text-gray-600 max-w-md leading-relaxed">
              Once your legal document has been created and customized to fit your needs, it’s yours! Save it, print it, and share it with anyone you choose.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
