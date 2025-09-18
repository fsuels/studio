'use client';

import React from 'react';
import SearchBar from '@/components/shared/SearchBar';
import AutoImage from '@/components/shared/media/AutoImage';

export default function SearchHeroIsland() {
  return (
    <>
      <div className="max-w-xl mx-auto mb-8">
        <SearchBar />
      </div>
      <div className="flex justify-center mb-10">
        <AutoImage src="/images/hero-homepage.png" alt="Happy customer" width={400} height={240} priority className="rounded-lg" />
      </div>
    </>
  );
}

