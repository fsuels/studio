import { rank, type RawHit } from '../rankDiscoveryResults';

describe('rankDiscoveryResults', () => {
  it('orders results by descending score', () => {
    const hits: RawHit[] = [
      { id: 'doc1', keywordsHit: new Set(['a', 'b']), source: 'keyword' },
      { id: 'doc1', keywordsHit: new Set(['c']), source: 'synonym' },
      { id: 'doc2', keywordsHit: new Set(['a']), source: 'keyword' },
      { id: 'doc3', keywordsHit: new Set(['d']), source: 'synonym' },
      { id: 'doc4', keywordsHit: new Set(['a']), source: 'keyword' },
      { id: 'doc4', keywordsHit: new Set(['e']), source: 'synonym' },
    ];

    const results = rank(hits);
    expect(results.map(r => r.id)).toEqual(['doc1', 'doc4', 'doc2', 'doc3']);
    const scores = Object.fromEntries(results.map(r => [r.id, r.score]));
    expect(scores['doc1']).toBe(5);
    expect(scores['doc4']).toBe(3);
    expect(scores['doc2']).toBe(2);
    expect(scores['doc3']).toBe(1);
  });

  it('breaks ties alphabetically by id', () => {
    const hits: RawHit[] = [
      { id: 'b', keywordsHit: new Set(['x', 'y']), source: 'synonym' },
      { id: 'a', keywordsHit: new Set(['z']), source: 'keyword' },
    ];

    const results = rank(hits);
    expect(results.map(r => r.id)).toEqual(['a', 'b']);
    expect(results[0].score).toBe(2);
    expect(results[1].score).toBe(2);
  });
});
