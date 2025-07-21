import fs from 'fs';

const slug = process.argv[2];
if (!slug) throw new Error('Usage: npm run generate:doc <slug>');

const reviewStub = `import { Review } from '@/types';
export const reviews: Review[] = [
  {
    name: 'First Last',
    location: 'City, ST',
    rating: 5,
    quote: 'Describe how the ${slug} template saved time / money here.',
  },
];
`;

fs.mkdirSync('src/data/reviews', { recursive: true });
fs.writeFileSync(`src/data/reviews/${slug}.ts`, reviewStub);
console.log(`✅  Created src/data/reviews/${slug}.ts`);
