import React from 'react';
import { AutoImage } from '@/components/shared';
import { PlusIcon } from '@heroicons/react/outline';

export default function StepOneExplanation() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1 flex justify-center">
            <div className="relative">
              <AutoImage
                src="/images/step1-questions.svg"
                alt="Answer simple questions illustration"
                width={400}
                height={400}
                className="w-64 sm:w-80 lg:w-96"
                placeholder="blur"
                priority
              />
              <PlusIcon className="hidden lg:block absolute -top-6 -left-6 opacity-20 w-16 h-16 text-primary" />
            </div>
          </div>
          <div className="flex-1 text-center lg:text-left">
            <h3 className="text-2xl lg:text-3xl font-semibold text-gray-800">
              Answer a Few Simple Questions
            </h3>
            <p className="mt-2 text-lg text-gray-600 max-w-md leading-relaxed">
              Choose the document you’d like to create from our library of
              templates. All of our templates are sourced by attorneys to ensure
              they’re accurate, thorough, and up to date.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
